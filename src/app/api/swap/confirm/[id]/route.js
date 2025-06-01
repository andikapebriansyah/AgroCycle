import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { verifyToken } from '@/middleware/auth';

export async function POST(request, { params }) {
  try {
    const user = verifyToken(request);
    const matchId = params.id;

    // Start a transaction
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      // Get the swap details
      const [swaps] = await connection.query(
        `SELECT sm.*, 
         p1.user_id as user1_id, p1.name as plant1_name,
         p2.user_id as user2_id, p2.name as plant2_name,
         sm.user1_confirmed, sm.user2_confirmed
         FROM SwapMatch sm
         JOIN Plant p1 ON sm.plant_id_1 = p1.plant_id
         JOIN Plant p2 ON sm.plant_id_2 = p2.plant_id
         WHERE sm.match_id = ? AND sm.status = 'pending'`,
        [matchId]
      );

      if (!swaps.length) {
        await connection.rollback();
        return NextResponse.json(
          { message: 'Penukaran tidak ditemukan atau sudah selesai' },
          { status: 404 }
        );
      }

      const swap = swaps[0];
      console.log('Swap details:', {
        matchId,
        userId: user.userId,
        user1_id: swap.user1_id,
        user2_id: swap.user2_id,
        plant1: swap.plant1_name,
        plant2: swap.plant2_name,
        user1_confirmed: swap.user1_confirmed,
        user2_confirmed: swap.user2_confirmed
      });

      // Verify that the user is the owner of either plant
      if (swap.user1_id !== user.userId && swap.user2_id !== user.userId) {
        await connection.rollback();
        return NextResponse.json(
          { message: 'Anda tidak memiliki hak untuk mengkonfirmasi penukaran ini' },
          { status: 403 }
        );
      }

      // Check if user has already confirmed
      const hasConfirmed = (swap.user1_id === user.userId && swap.user1_confirmed) ||
                         (swap.user2_id === user.userId && swap.user2_confirmed);
      
      if (hasConfirmed) {
        await connection.rollback();
        return NextResponse.json(
          { message: 'Anda sudah mengkonfirmasi penukaran ini' },
          { status: 400 }
        );
      }

      // Update the confirmation status based on which user is confirming
      if (swap.user1_id === user.userId) {
        await connection.query(
          `UPDATE SwapMatch SET user1_confirmed = 1 WHERE match_id = ?`,
          [matchId]
        );
      } else {
        await connection.query(
          `UPDATE SwapMatch SET user2_confirmed = 1 WHERE match_id = ?`,
          [matchId]
        );
      }

      // Check if both users have confirmed
      const [updatedSwap] = await connection.query(
        `SELECT user1_confirmed, user2_confirmed FROM SwapMatch WHERE match_id = ?`,
        [matchId]
      );

      if (updatedSwap[0].user1_confirmed && updatedSwap[0].user2_confirmed) {
        // Both users have confirmed, complete the swap
        await connection.query(
          `UPDATE SwapMatch SET status = 'completed', matched_at = NOW()
           WHERE match_id = ?`,
          [matchId]
        );

        // Update plant statuses to swapped
        await connection.query(
          `UPDATE Plant SET status = 'swapped'
           WHERE plant_id IN (?, ?)`,
          [swap.plant_id_1, swap.plant_id_2]
        );

        // Calculate and update points based on price difference
        const [plants] = await connection.query(
          `SELECT p.plant_id, p.price_estimation, p.user_id
           FROM Plant p
           WHERE p.plant_id IN (?, ?)`,
          [swap.plant_id_1, swap.plant_id_2]
        );

        const plant1 = plants.find(p => p.plant_id === swap.plant_id_1);
        const plant2 = plants.find(p => p.plant_id === swap.plant_id_2);

        // Calculate points difference
        const priceDiff = plant1.price_estimation - plant2.price_estimation;
        
        // Only reward points to user with more expensive plant
        if (priceDiff > 0) {
          // Plant1 is more expensive, reward user1
          await connection.query(
            `UPDATE User SET poin = poin + ? WHERE user_id = ?`,
            [Math.floor(priceDiff), plant1.user_id]
          );
        } else if (priceDiff < 0) {
          // Plant2 is more expensive, reward user2
          await connection.query(
            `UPDATE User SET poin = poin + ? WHERE user_id = ?`,
            [Math.floor(Math.abs(priceDiff)), plant2.user_id]
          );
        }

        await connection.commit();
        return NextResponse.json({
          message: 'Penukaran berhasil diselesaikan',
          status: 'completed'
        });
      } else {
        await connection.commit();
        return NextResponse.json({
          message: 'Konfirmasi berhasil. Menunggu konfirmasi dari pengguna lainnya.',
          status: 'waiting'
        });
      }
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error confirming swap:', error);
    return NextResponse.json(
      { message: error.message || 'Terjadi kesalahan server' },
      { status: error.message?.includes('token') ? 401 : 500 }
    );
  }
} 