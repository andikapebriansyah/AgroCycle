import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { verifyToken } from '@/middleware/auth';

export async function PUT(request) {
  const connection = await pool.getConnection();
  
  try {
    const user = verifyToken(request);
    const { image } = await request.json();

    if (!image) {
      return NextResponse.json(
        { message: 'Image data is required' },
        { status: 400 }
      );
    }

    // Update user's profile image
    await connection.query(
      'UPDATE User SET profile_image = ? WHERE user_id = ?',
      [image, user.userId]
    );

    // Get updated user data
    const [users] = await connection.query(
      'SELECT user_id, name, email, location, poin, bio, profile_image, join_date FROM User WHERE user_id = ?',
      [user.userId]
    );

    return NextResponse.json({
      message: 'Profile image updated successfully',
      user: users[0]
    });
  } catch (error) {
    console.error('Error updating profile image:', error);
    return NextResponse.json(
      { message: error.message || 'Internal server error' },
      { status: error.message?.includes('token') ? 401 : 500 }
    );
  } finally {
    connection.release();
  }
} 