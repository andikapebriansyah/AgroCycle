import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { verifyToken } from '@/middleware/auth';

export async function GET(request) {
  try {
    const user = verifyToken(request);

    // Get user's points
    const [userRows] = await pool.query(
      'SELECT poin FROM User WHERE user_id = ?',
      [user.userId]
    );

    // Get plants available for point exchange (uploaded by admin)
    const [plants] = await pool.query(
      `SELECT p.*, u.name as owner_name, u.location as owner_location,
              p.price_estimation as required_points
       FROM Plant p
       JOIN User u ON p.user_id = u.user_id
       WHERE u.role = 'admin' 
       AND p.status = 'available'
       AND p.is_point_exchange = true
       ORDER BY p.created_at DESC`
    );

    return NextResponse.json({
      plants,
      userPoints: userRows[0]?.poin || 0
    });
  } catch (error) {
    console.error('Error fetching point exchange plants:', error);
    return NextResponse.json(
      { message: error.message || 'Internal server error' },
      { status: error.message?.includes('token') ? 401 : 500 }
    );
  }
} 