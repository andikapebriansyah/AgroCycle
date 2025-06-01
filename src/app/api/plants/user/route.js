import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { verifyToken } from '@/middleware/auth';

export async function GET(request) {
  try {
    const user = verifyToken(request);

    // Get user's plants
    const [plants] = await pool.query(
      `SELECT p.*, 
        u.name as owner_name,
        u.location as owner_location
       FROM Plant p
       JOIN User u ON p.user_id = u.user_id
       WHERE p.user_id = ? AND p.status = 'available'`,
      [user.userId]
    );

    return NextResponse.json(plants);
  } catch (error) {
    console.error('Error fetching user plants:', error);
    return NextResponse.json(
      { message: error.message || 'Internal server error' },
      { status: error.message.includes('token') ? 401 : 500 }
    );
  }
} 