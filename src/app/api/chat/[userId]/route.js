import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { verifyAuth } from '@/lib/auth';

export async function GET(request, { params }) {
  try {
    const token = request.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const user = await verifyAuth(token);
    if (!user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = (await params).userId;
    const plantId = request.nextUrl.searchParams.get('plant_id');

    if (!plantId) {
      return NextResponse.json(
        { message: 'Plant ID is required' },
        { status: 400 }
      );
    }

    // Get chat messages between users for a specific plant
    const [messages] = await pool.query(
      `SELECT m.*, 
        u_sender.name as sender_name,
        u_recipient.name as recipient_name
       FROM Message m
       JOIN User u_sender ON m.sender_id = u_sender.user_id
       JOIN User u_recipient ON m.recipient_id = u_recipient.user_id
       WHERE ((m.sender_id = ? AND m.recipient_id = ?) 
          OR (m.sender_id = ? AND m.recipient_id = ?))
         AND m.plant_id = ?
       ORDER BY m.created_at ASC`,
      [user.userId, userId, userId, user.userId, plantId]
    );

    return NextResponse.json(messages);
  } catch (error) {
    console.error('Error fetching chat messages:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request, { params }) {
  const connection = await pool.getConnection();
  
  try {
    const token = request.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const user = await verifyAuth(token);
    if (!user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = (await params).userId;
    const { message, plant_id } = await request.json();

    if (!message || !plant_id) {
      return NextResponse.json(
        { message: 'Message and plant_id are required' },
        { status: 400 }
      );
    }

    // Insert the message
    await connection.query(
      `INSERT INTO Message (
        sender_id,
        recipient_id,
        plant_id,
        message,
        created_at
      ) VALUES (?, ?, ?, ?, NOW())`,
      [user.userId, userId, plant_id, message]
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
        'message',
        `${user.name} mengirim pesan tentang tanaman Anda`,
        user.userId,
        userId
      ]
    );

    // Get the updated messages
    const [messages] = await connection.query(
      `SELECT m.*, 
        u_sender.name as sender_name,
        u_recipient.name as recipient_name
       FROM Message m
       JOIN User u_sender ON m.sender_id = u_sender.user_id
       JOIN User u_recipient ON m.recipient_id = u_recipient.user_id
       WHERE ((m.sender_id = ? AND m.recipient_id = ?) 
          OR (m.sender_id = ? AND m.recipient_id = ?))
         AND m.plant_id = ?
       ORDER BY m.created_at ASC`,
      [user.userId, userId, userId, user.userId, plant_id]
    );

    return NextResponse.json(messages);
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    connection.release();
  }
} 