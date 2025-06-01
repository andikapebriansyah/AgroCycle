import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { verifyToken } from '@/middleware/auth';

export async function POST(request) {
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();
    
    const user = verifyToken(request);
    const { plantId } = await request.json();

    // Get plant details and user points
    const [plants] = await connection.query(
      `SELECT p.*, u.role as owner_role, p.price_estimation as required_points
       FROM Plant p
       JOIN User u ON p.user_id = u.user_id
       WHERE p.plant_id = ?`,
      [plantId]
    );

    const plant = plants[0];
    if (!plant) {
      throw new Error('Tanaman tidak ditemukan');
    }

    if (plant.owner_role !== 'admin' || !plant.is_point_exchange) {
      throw new Error('Tanaman ini tidak tersedia untuk ditukar dengan poin');
    }

    if (plant.status !== 'available') {
      throw new Error('Tanaman ini sudah tidak tersedia');
    }

    // Get user's current points
    const [users] = await connection.query(
      'SELECT poin FROM User WHERE user_id = ?',
      [user.userId]
    );

    const userPoints = users[0].poin;
    if (userPoints < plant.required_points) {
      throw new Error('Poin Anda tidak cukup untuk menukar tanaman ini');
    }

    // Update plant ownership and status
    await connection.query(
      `UPDATE Plant 
       SET user_id = ?, 
           status = 'owned',
           is_point_exchange = false
       WHERE plant_id = ?`,
      [user.userId, plantId]
    );

    // Deduct points from user
    await connection.query(
      `UPDATE User 
       SET poin = poin - ? 
       WHERE user_id = ?`,
      [plant.required_points, user.userId]
    );

    // Create notification for the user
    await connection.query(
      `INSERT INTO Notification (type, message, to_user_id)
       VALUES ('point_exchange', ?, ?)`,
      [
        `Anda berhasil menukar ${plant.required_points} poin dengan tanaman ${plant.name}`,
        user.userId
      ]
    );

    await connection.commit();

    return NextResponse.json({
      message: 'Berhasil menukar poin dengan tanaman',
      remainingPoints: userPoints - plant.required_points
    });
  } catch (error) {
    await connection.rollback();
    console.error('Error redeeming points:', error);
    return NextResponse.json(
      { message: error.message || 'Internal server error' },
      { status: error.message?.includes('token') ? 401 : 500 }
    );
  } finally {
    connection.release();
  }
} 