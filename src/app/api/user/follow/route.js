import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { verifyToken } from '@/middleware/auth';

export async function POST(request) {
  const connection = await pool.getConnection();
  
  try {
    const user = verifyToken(request);
    const { userId, action } = await request.json();

    if (!userId || !action || !['follow', 'unfollow'].includes(action)) {
      return NextResponse.json(
        { message: 'Invalid request parameters' },
        { status: 400 }
      );
    }

    if (user.userId === userId) {
      return NextResponse.json(
        { message: 'Cannot follow/unfollow yourself' },
        { status: 400 }
      );
    }

    // Check if user exists
    const [users] = await connection.query(
      'SELECT user_id FROM User WHERE user_id = ?',
      [userId]
    );

    if (!users.length) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    if (action === 'follow') {
      // Check if already following
      const [existing] = await connection.query(
        'SELECT follow_id FROM UserFollows WHERE follower_id = ? AND following_id = ?',
        [user.userId, userId]
      );

      if (existing.length > 0) {
        // Instead of error, return current status
        return NextResponse.json({
          message: 'Already following this user',
          isFollowing: true
        });
      }

      // Create follow relationship
      await connection.query(
        'INSERT INTO UserFollows (follower_id, following_id) VALUES (?, ?)',
        [user.userId, userId]
      );

      // Create notification
      await connection.query(
        `INSERT INTO Notification (
          type,
          message,
          from_user_id,
          to_user_id,
          is_read,
          created_at
        ) VALUES (?, ?, ?, ?, FALSE, NOW())`,
        [
          'follow',
          `${user.name} mulai mengikuti Anda`,
          user.userId,
          userId
        ]
      );

      return NextResponse.json({
        message: 'Successfully followed user',
        isFollowing: true
      });
    } else {
      // Remove follow relationship
      await connection.query(
        'DELETE FROM UserFollows WHERE follower_id = ? AND following_id = ?',
        [user.userId, userId]
      );

      return NextResponse.json({
        message: 'Successfully unfollowed user',
        isFollowing: false
      });
    }
  } catch (error) {
    console.error('Error handling follow/unfollow:', error);
    return NextResponse.json(
      { message: error.message || 'Internal server error' },
      { status: error.message?.includes('token') ? 401 : 500 }
    );
  } finally {
    connection.release();
  }
} 