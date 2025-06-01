import { NextResponse } from 'next/server';
import { verifyToken } from '@/middleware/auth';
import pool from '@/lib/db';

export async function POST(request) {
  try {
    // Verify token and get user data
    const user = verifyToken(request);

    const {
      name,
      category,
      age,
      plant_condition,
      description,
      image_url,
      willing_to_exchange_for,
      location,
      price_estimation
    } = await request.json();

    // Validate required fields
    if (!name || !category || !age || !plant_condition || !description || !image_url || !willing_to_exchange_for || !location || !price_estimation) {
      return NextResponse.json(
        { message: 'Semua field harus diisi' },
        { status: 400 }
      );
    }

    // Insert new plant
    const [result] = await pool.query(
      `INSERT INTO Plant (
        user_id,
        name,
        category,
        age,
        plant_condition,
        description,
        image_url,
        willing_to_exchange_for,
        location,
        status,
        price_estimation
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'available', ?)`,
      [
        user.userId,
        name,
        category,
        age,
        plant_condition,
        description,
        image_url,
        willing_to_exchange_for,
        location,
        price_estimation
      ]
    );

    return NextResponse.json({
      message: 'Tanaman berhasil ditambahkan',
      plantId: result.insertId
    });

  } catch (error) {
    console.error('Add plant error:', error);
    
    if (error.message === 'Invalid token' || error.message === 'No token provided') {
      return NextResponse.json(
        { message: error.message },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 