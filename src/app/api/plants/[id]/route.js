import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { verifyToken } from '@/middleware/auth';

export async function GET(request, { params }) {
  try {
    const user = verifyToken(request);
    const { id } = await params;
    const plantId = id;

    // Get plant details with owner information and saved status
    const [plants] = await pool.query(
      `SELECT p.*, 
        u.name as owner_name,
        u.location as owner_location,
        u.user_id,
        EXISTS(
          SELECT 1 FROM SavedPlant sp 
          WHERE sp.plant_id = p.plant_id 
          AND sp.user_id = ?
        ) as is_saved
       FROM Plant p
       JOIN User u ON p.user_id = u.user_id
       WHERE p.plant_id = ?`,
      [user.userId, plantId]
    );

    if (!plants.length) {
      return NextResponse.json(
        { message: 'Plant not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(plants[0]);
  } catch (error) {
    console.error('Error fetching plant details:', error);
    return NextResponse.json(
      { message: error.message || 'Internal server error' },
      { status: error.message?.includes('token') ? 401 : 500 }
    );
  }
} 