import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { verifyToken } from '@/middleware/auth';

export async function GET(request) {
  const connection = await pool.getConnection();
  
  try {
    const user = verifyToken(request);

    // Get notifications for the user
    const [notifications] = await connection.query(
      `SELECT n.*, 
        CASE 
          WHEN n.type = 'swap_request' THEN CONCAT(u.name, ' ingin menukar tanaman dengan Anda')
          WHEN n.type = 'swap_accepted' THEN CONCAT(u.name, ' menerima permintaan penukaran Anda')
          WHEN n.type = 'swap_rejected' THEN CONCAT(u.name, ' menolak permintaan penukaran Anda')
          WHEN n.type = 'swap_completed' THEN CONCAT('Penukaran dengan ', u.name, ' telah selesai')
          ELSE n.message
        END as formatted_message,
        u.name as sender_name
       FROM Notification n
       LEFT JOIN User u ON n.from_user_id = u.user_id
       WHERE n.to_user_id = ?
       ORDER BY n.created_at DESC
       LIMIT 50`,
      [user.userId]
    );

    // Format notifications to include the message from formatted_message
    const formattedNotifications = notifications.map(notification => ({
      ...notification,
      message: notification.formatted_message
    }));

    return NextResponse.json({
      notifications: formattedNotifications
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json(
      { message: error.message || 'Terjadi kesalahan server' },
      { status: error.message?.includes('token') ? 401 : 500 }
    );
  } finally {
    connection.release();
  }
}

// Endpoint untuk menandai notifikasi sebagai sudah dibaca
export async function PATCH(request) {
  const connection = await pool.getConnection();
  
  try {
    const user = verifyToken(request);
    const data = await request.json();
    const { notification_id } = data;

    // Mark specific notification as read
    if (notification_id) {
      await connection.query(
        'UPDATE Notification SET is_read = TRUE WHERE notification_id = ? AND to_user_id = ?',
        [notification_id, user.userId]
      );
    } else {
      // Mark all notifications as read
      await connection.query(
        'UPDATE Notification SET is_read = TRUE WHERE to_user_id = ? AND is_read = FALSE',
        [user.userId]
      );
    }

    return NextResponse.json({
      message: 'Notifications marked as read successfully'
    });
  } catch (error) {
    console.error('Error marking notifications as read:', error);
    return NextResponse.json(
      { message: error.message || 'Terjadi kesalahan server' },
      { status: error.message?.includes('token') ? 401 : 500 }
    );
  } finally {
    connection.release();
  }
}

export async function POST(request) {
  const connection = await pool.getConnection();
  
  try {
    const user = verifyToken(request);
    const data = await request.json();

    // Validate required fields
    if (!data.type || !data.to_user_id) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Insert notification
    const [result] = await connection.query(
      `INSERT INTO Notification (
        type, 
        to_user_id, 
        from_user_id,
        message,
        is_read,
        created_at
      ) VALUES (?, ?, ?, ?, FALSE, NOW())`,
      [
        data.type,
        data.to_user_id,
        user.userId,
        data.message || null
      ]
    );

    return NextResponse.json({
      notification_id: result.insertId,
      message: 'Notification created successfully'
    });
  } catch (error) {
    console.error('Error creating notification:', error);
    return NextResponse.json(
      { message: error.message || 'Terjadi kesalahan server' },
      { status: error.message?.includes('token') ? 401 : 500 }
    );
  } finally {
    connection.release();
  }
} 