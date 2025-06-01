import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { verifyToken } from '@/middleware/auth';

export async function GET(request, context) {
  const connection = await pool.getConnection();
  
  try {
    const user = verifyToken(request);
    const userId = context.params.id;

    // Get user data
    const [users] = await connection.query(
      `SELECT u.user_id, u.name, u.email, u.location, u.poin, u.bio, u.join_date, u.profile_image,
        (SELECT COUNT(*) FROM UserFollows WHERE following_id = u.user_id) as followers,
        (SELECT COUNT(*) FROM UserFollows WHERE follower_id = u.user_id) as following,
        (SELECT COUNT(*) FROM SwapMatch sm 
         JOIN Plant p ON sm.plant_id_1 = p.plant_id OR sm.plant_id_2 = p.plant_id
         WHERE p.user_id = u.user_id AND sm.status = 'completed') as trades,
        EXISTS(
          SELECT 1 FROM UserFollows 
          WHERE follower_id = ? AND following_id = u.user_id
        ) as is_following
       FROM User u
       WHERE u.user_id = ?`,
      [user.userId, userId]
    );

    if (!users.length) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    // Get user's plants
    const [plants] = await connection.query(
      `SELECT p.*, 
        u.name as owner_name,
        u.location as owner_location,
        EXISTS(
          SELECT 1 FROM SavedPlant sp 
          WHERE sp.plant_id = p.plant_id 
          AND sp.user_id = ?
        ) as is_saved
       FROM Plant p
       JOIN User u ON p.user_id = u.user_id
       WHERE p.user_id = ? AND p.status = 'available'`,
      [user.userId, userId]
    );

    return NextResponse.json({
      user: {
        ...users[0],
        isFollowing: users[0].is_following === 1
      },
      plants
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json(
      { message: error.message || 'Internal server error' },
      { status: error.message?.includes('token') ? 401 : 500 }
    );
  } finally {
    connection.release();
  }
} 