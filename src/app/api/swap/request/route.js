import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { verifyToken } from '@/middleware/auth';

export async function POST(request) {
  try {
    const user = verifyToken(request);
    const { plant_id_1, plant_id_2, price_difference } = await request.json();

    // Start a transaction
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      // Check if both plants exist, are available, and not in any pending swaps
      const [plants] = await connection.query(
        `SELECT p.*, u.user_id as owner_id, u.poin,
         EXISTS(
           SELECT 1 FROM SwapMatch sm 
           WHERE (sm.plant_id_1 = p.plant_id OR sm.plant_id_2 = p.plant_id)
           AND sm.status = 'pending'
         ) as has_pending_swap
         FROM Plant p
         JOIN User u ON p.user_id = u.user_id
         WHERE p.plant_id IN (?, ?) 
         AND p.status = 'available'
         AND p.status != 'point_exchanged'`,
        [plant_id_1, plant_id_2]
      );

      if (plants.length !== 2) {
        await connection.rollback();
        return NextResponse.json(
          { message: 'Satu atau kedua tanaman tidak tersedia atau sudah ditukar dengan poin' },
          { status: 400 }
        );
      }

      const plant1 = plants.find(p => p.plant_id === plant_id_1);
      const plant2 = plants.find(p => p.plant_id === plant_id_2);

      // Check if either plant is already in a pending swap
      if (plant1.has_pending_swap || plant2.has_pending_swap) {
        await connection.rollback();
        return NextResponse.json(
          { message: 'Satu atau kedua tanaman sedang dalam proses penukaran lain' },
          { status: 400 }
        );
      }

      // Verify ownership of plant1
      if (plant1.owner_id !== user.userId) {
        await connection.rollback();
        return NextResponse.json(
          { message: 'Anda hanya dapat menawarkan tanaman yang Anda miliki' },
          { status: 403 }
        );
      }

      // Verify plants are not owned by the same user
      if (plant1.owner_id === plant2.owner_id) {
        await connection.rollback();
        return NextResponse.json(
          { message: 'Anda tidak dapat menukar dengan tanaman Anda sendiri' },
          { status: 400 }
        );
      }

      // Create swap match
      const [result] = await connection.query(
        `INSERT INTO SwapMatch (plant_id_1, plant_id_2, status, matched_at)
         VALUES (?, ?, 'pending', NOW())`,
        [plant_id_1, plant_id_2]
      );

      // Update plant statuses to pending
      await connection.query(
        `UPDATE Plant SET status = 'pending'
         WHERE plant_id IN (?, ?)`,
        [plant_id_1, plant_id_2]
      );

      // Create notification for plant2 owner
      await connection.query(
        `INSERT INTO Notification (type, from_user_id, to_user_id)
         VALUES ('swap_request', ?, ?)`,
        [user.userId, plant2.owner_id]
      );

      await connection.commit();

      return NextResponse.json({
        message: 'Penukaran berhasil diajukan',
        match_id: result.insertId
      });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error creating swap request:', error);
    return NextResponse.json(
      { message: error.message || 'Terjadi kesalahan server' },
      { status: error.message?.includes('token') ? 401 : 500 }
    );
  }
} 