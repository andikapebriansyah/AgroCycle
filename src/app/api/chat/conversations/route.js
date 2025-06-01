import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { verifyAuth } from '@/lib/auth';

export async function GET(request) {
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

    // Get all conversations for the user
    const [conversations] = await pool.query(
      `SELECT DISTINCT
        p.plant_id,
        p.name as plant_name,
        p.image_url as plant_image,
        CASE 
          WHEN m.sender_id = ? THEN m.recipient_id
          ELSE m.sender_id
        END as other_user_id,
        CASE 
          WHEN m.sender_id = ? THEN recipient.name
          ELSE sender.name
        END as other_user_name,
        m2.message as last_message,
        m2.created_at as last_message_time,
        m2.sender_id as last_message_sender_id
      FROM Message m
      JOIN Plant p ON m.plant_id = p.plant_id
      JOIN User sender ON m.sender_id = sender.user_id
      JOIN User recipient ON m.recipient_id = recipient.user_id
      JOIN (
        SELECT 
          plant_id,
          sender_id,
          recipient_id,
          message,
          created_at
        FROM Message m3
        WHERE m3.created_at = (
          SELECT MAX(created_at)
          FROM Message m4
          WHERE m4.plant_id = m3.plant_id
          AND (m4.sender_id = ? OR m4.recipient_id = ?)
        )
      ) m2 ON m2.plant_id = m.plant_id
      WHERE m.sender_id = ? OR m.recipient_id = ?
      GROUP BY p.plant_id
      ORDER BY m2.created_at DESC`,
      [
        user.userId, user.userId, // For CASE statements
        user.userId, user.userId, // For subquery
        user.userId, user.userId  // For WHERE clause
      ]
    );

    return NextResponse.json(conversations);
  } catch (error) {
    console.error('Error fetching conversations:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 