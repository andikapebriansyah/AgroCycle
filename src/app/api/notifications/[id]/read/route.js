import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { verifyToken } from '@/middleware/auth';

export async function POST(request, { params }) {
  try {
    const user = verifyToken(request);
    const notificationId = params.id;

    // Mark notification as read
    const [result] = await pool.query(
      `UPDATE Notification 
       SET is_read = true 
       WHERE notification_id = ? AND to_user_id = ?`,
      [notificationId, user.userId]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { message: 'Notification not found or unauthorized' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Notification marked as read' });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return NextResponse.json(
      { message: error.message || 'Internal server error' },
      { status: error.message?.includes('token') ? 401 : 500 }
    );
  }
} 