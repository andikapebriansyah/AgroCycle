import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { verifyToken } from '@/middleware/auth';

export async function GET(request) {
  try {
    const user = verifyToken(request);
    if (!user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get complete user data
    const [users] = await pool.query(
      `SELECT user_id, name, email, location, poin, bio, join_date, profile_image,
        (SELECT COUNT(*) FROM UserFollows WHERE following_id = user_id) as followers,
        (SELECT COUNT(*) FROM UserFollows WHERE follower_id = user_id) as following,
        (SELECT COUNT(*) FROM SwapMatch sm 
         JOIN Plant p ON sm.plant_id_1 = p.plant_id OR sm.plant_id_2 = p.plant_id
         WHERE p.user_id = user_id AND sm.status = 'completed') as trades
       FROM User 
       WHERE user_id = ?`,
      [user.userId]
    );

    if (!users.length) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(users[0]);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json(
      { message: error.message || 'Internal server error' },
      { status: error.message?.includes('token') ? 401 : 500 }
    );
  }
} 