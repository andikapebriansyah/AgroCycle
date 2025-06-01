import { NextResponse } from 'next/server';
import { verifyToken } from '@/middleware/auth';
import pool from '@/lib/db';

export async function GET(request) {
  const connection = await pool.getConnection();
  
  try {
    console.log('Received profile request');
    
    // Verify token and get user data
    const user = verifyToken(request);
    console.log('Token verified, user:', user);

    // Get user data
    const [users] = await connection.query(
      'SELECT user_id, name, email, location, poin, bio, profile_image, join_date FROM User WHERE user_id = ?',
      [user.userId]
    );
    console.log('Found users:', users);

    if (!users.length) {
      console.log('No user found with ID:', user.userId);
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    // Get user's plants with swap information
    const [plants] = await connection.query(
      `SELECT p.*, 
        u.name as owner_name,
        u.location as owner_location,
        CASE 
          WHEN p.status = 'point_exchanged' THEN 'point_exchanged'
          ELSE COALESCE(sm.status, p.status)
        END as current_status,
        sm.matched_at as swap_date
       FROM Plant p
       JOIN User u ON p.user_id = u.user_id
       LEFT JOIN (
         SELECT * FROM SwapMatch 
         WHERE status IN ('completed', 'pending')
       ) sm ON (sm.plant_id_1 = p.plant_id OR sm.plant_id_2 = p.plant_id)
       WHERE p.user_id = ?`,
      [user.userId]
    );

    // Get saved plants
    const [savedPlants] = await connection.query(
      `SELECT p.*, 
        u.name as owner_name,
        u.location as owner_location,
        TRUE as is_saved
       FROM SavedPlant sp
       JOIN Plant p ON sp.plant_id = p.plant_id
       JOIN User u ON p.user_id = u.user_id
       WHERE sp.user_id = ?`,
      [user.userId]
    );

    // Format plants with proper status and dates
    const formattedPlants = plants.map(plant => ({
      ...plant,
      status: plant.current_status || plant.status,
      updated_at: plant.swap_date || plant.updated_at
    }));

    console.log('Plant statuses:', formattedPlants.map(p => ({ id: p.plant_id, status: p.status })));

    // Get followers count
    const [followers] = await connection.query(
      'SELECT COUNT(*) as count FROM UserFollows WHERE following_id = ?',
      [user.userId]
    );

    // Get following count
    const [following] = await connection.query(
      'SELECT COUNT(*) as count FROM UserFollows WHERE follower_id = ?',
      [user.userId]
    );

    // Get completed trades count
    const [trades] = await connection.query(
      `SELECT COUNT(*) as count FROM SwapMatch 
       WHERE (plant_id_1 IN (SELECT plant_id FROM Plant WHERE user_id = ?) 
       OR plant_id_2 IN (SELECT plant_id FROM Plant WHERE user_id = ?))
       AND status IN ('completed', 'pending')`,
      [user.userId, user.userId]
    );

    // Get swap activities
    const [activities] = await connection.query(
      `SELECT 
        sm.match_id,
        sm.status,
        sm.matched_at,
        p1.name as plant1_name,
        p1.image_url as plant1_image,
        p2.name as plant2_name,
        p2.image_url as plant2_image,
        u1.name as user1_name,
        u2.name as user2_name
       FROM SwapMatch sm
       JOIN Plant p1 ON sm.plant_id_1 = p1.plant_id
       JOIN Plant p2 ON sm.plant_id_2 = p2.plant_id
       JOIN User u1 ON p1.user_id = u1.user_id
       JOIN User u2 ON p2.user_id = u2.user_id
       WHERE (p1.user_id = ? OR p2.user_id = ?)
       AND sm.status = 'completed'
       ORDER BY sm.matched_at DESC`,
      [user.userId, user.userId]
    );

    // Get point exchange history
    const [pointExchanges] = await connection.query(
      `SELECT peh.*, p.name as plant_name, p.image_url
       FROM PointExchangeHistory peh
       JOIN Plant p ON peh.plant_id = p.plant_id
       WHERE peh.user_id = ?
       ORDER BY peh.exchanged_at DESC`,
      [user.userId]
    );

    const userData = {
      ...users[0],
      followers: followers[0].count,
      following: following[0].count,
      trades: trades[0].count,
      plants: formattedPlants.length
    };

    return NextResponse.json({
      user: userData,
      plants: formattedPlants,
      savedPlants: savedPlants,
      activities: activities,
      pointExchanges: pointExchanges
    });
  } catch (error) {
    console.error('Profile error details:', {
      message: error.message,
      stack: error.stack
    });
    
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
  } finally {
    connection.release(); // Pastikan koneksi dilepas
  }
} 