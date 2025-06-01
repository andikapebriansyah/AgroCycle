import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(request) {
  try {
    const { name, email, password, location } = await request.json();

    // Validate input
    if (!name || !email || !password || !location) {
      return NextResponse.json(
        { message: 'Semua field harus diisi' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const [existingUsers] = await pool.query(
      'SELECT * FROM User WHERE email = ?',
      [email]
    );

    if (existingUsers.length > 0) {
      return NextResponse.json(
        { message: 'Email sudah terdaftar' },
        { status: 400 }
      );
    }

    // Store password directly without hashing
    const [result] = await pool.query(
      'INSERT INTO User (name, email, password_hash, location, join_date) VALUES (?, ?, ?, ?, CURRENT_DATE)',
      [name, email, password, location]
    );

    return NextResponse.json({
      message: 'Registrasi berhasil',
      userId: result.insertId
    });

  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 