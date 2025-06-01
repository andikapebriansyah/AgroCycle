import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { verifyToken } from '@/middleware/auth';

export async function POST(request) {
  try {
    const user = verifyToken(request);
    const { plant_id } = await request.json();

    const [result] = await pool.query(
      `INSERT INTO SavedPlant (user_id, plant_id) VALUES (?, ?)
       ON DUPLICATE KEY UPDATE saved_at = CURRENT_TIMESTAMP`,
      [user.userId, plant_id]
    );

    return NextResponse.json({
      message: 'Tanaman berhasil disimpan',
      saved_id: result.insertId
    });
  } catch (error) {
    console.error('Error saving plant:', error);
    return NextResponse.json(
      { message: error.message || 'Terjadi kesalahan server' },
      { status: error.message?.includes('token') ? 401 : 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const user = verifyToken(request);
    const { plant_id } = await request.json();

    await pool.query(
      'DELETE FROM SavedPlant WHERE user_id = ? AND plant_id = ?',
      [user.userId, plant_id]
    );

    return NextResponse.json({
      message: 'Tanaman berhasil dihapus dari simpanan'
    });
  } catch (error) {
    console.error('Error removing saved plant:', error);
    return NextResponse.json(
      { message: error.message || 'Terjadi kesalahan server' },
      { status: error.message?.includes('token') ? 401 : 500 }
    );
  }
} 