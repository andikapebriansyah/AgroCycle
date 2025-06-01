import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { verifyToken } from '@/middleware/auth';

export async function GET(request) {
  try {
    // Get current user from token
    const user = verifyToken(request);

    // Get all plants with owner information, excluding the current user's plants
    const [plants] = await pool.query(
      `SELECT p.*, 
        u.name as owner_name,
        u.location as owner_location
       FROM Plant p
       JOIN User u ON p.user_id = u.user_id
       WHERE p.user_id != ?
       ORDER BY p.plant_id DESC`,
      [user.userId]
    );

    return NextResponse.json(plants);
  } catch (error) {
    console.error('Error fetching plants:', error);
    // If error is due to invalid/missing token, return unauthorized
    if (error.message === 'Invalid token' || error.message === 'No token provided') {
      return NextResponse.json(
        { message: error.message },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 