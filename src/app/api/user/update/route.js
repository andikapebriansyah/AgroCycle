import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { verifyToken } from '@/middleware/auth';

export async function PUT(request) {
  const connection = await pool.getConnection();
  
  try {
    const user = verifyToken(request);
    const { name, location, bio } = await request.json();

    // Validate input
    if (!name || !location) {
      return NextResponse.json(
        { message: 'Name and location are required' },
        { status: 400 }
      );
    }

    // Update user data
    await connection.query(
      'UPDATE User SET name = ?, location = ?, bio = ? WHERE user_id = ?',
      [name, location, bio || null, user.userId]
    );

    // Get updated user data
    const [users] = await connection.query(
      'SELECT user_id, name, email, location, poin, bio, join_date FROM User WHERE user_id = ?',
      [user.userId]
    );

    return NextResponse.json({
      message: 'Profile updated successfully',
      user: users[0]
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json(
      { message: error.message || 'Internal server error' },
      { status: error.message?.includes('token') ? 401 : 500 }
    );
  } finally {
    connection.release();
  }
} 