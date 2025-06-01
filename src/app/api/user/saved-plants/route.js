import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { verifyToken } from '@/middleware/auth';

export async function GET(request) {
  try {
    const user = verifyToken(request);

    const [plants] = await pool.query(
      `SELECT p.*, u.name as owner_name, u.location as owner_location,
        sp.saved_at, TRUE as is_saved
       FROM SavedPlant sp
       JOIN Plant p ON sp.plant_id = p.plant_id
       JOIN User u ON p.user_id = u.user_id
       WHERE sp.user_id = ?
       ORDER BY sp.saved_at DESC`,
      [user.userId]
    );

    return NextResponse.json(plants);
  } catch (error) {
    console.error('Error fetching saved plants:', error);
    return NextResponse.json(
      { message: error.message || 'Terjadi kesalahan server' },
      { status: error.message?.includes('token') ? 401 : 500 }
    );
  }
} 