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
        `SELECT sm.*, p1.user_id as user1_id, p2.user_id as user2_id
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

      // Verify that the user is the owner of the requested plant
      if (swap.user2_id !== user.userId) {
        await connection.rollback();
        return NextResponse.json(
          { message: 'Anda tidak memiliki hak untuk menolak penukaran ini' },
          { status: 403 }
        );
      }

      // Delete the swap match
      await connection.query(
        'DELETE FROM SwapMatch WHERE match_id = ?',
        [matchId]
      );

      // Reset plant statuses to available
      await connection.query(
        `UPDATE Plant SET status = 'available'
         WHERE plant_id IN (?, ?)`,
        [swap.plant_id_1, swap.plant_id_2]
      );

      await connection.commit();

      return NextResponse.json({
        message: 'Penukaran berhasil ditolak'
      });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error rejecting swap:', error);
    return NextResponse.json(
      { message: error.message || 'Terjadi kesalahan server' },
      { status: error.message?.includes('token') ? 401 : 500 }
    );
  }
} 