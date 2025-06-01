import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { verifyAuth } from '@/lib/auth';

export async function POST(request) {
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

    const { recipient_id, plant_id, message } = await request.json();

    // Insert the message
    const [result] = await pool.query(
      `INSERT INTO Message (sender_id, recipient_id, plant_id, message, created_at)
       VALUES (?, ?, ?, ?, NOW())`,
      [user.user_id, recipient_id, plant_id, message]
    );

    // Get the inserted message with sender and recipient info
    const [messages] = await pool.query(
      `SELECT m.*, 
        u_sender.name as sender_name,
        u_recipient.name as recipient_name
       FROM Message m
       JOIN User u_sender ON m.sender_id = u_sender.user_id
       JOIN User u_recipient ON m.recipient_id = u_recipient.user_id
       WHERE m.message_id = ?`,
      [result.insertId]
    );

    return NextResponse.json(messages[0]);
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}