import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { verifyToken } from '@/middleware/auth';

export async function GET(request) {
  const connection = await pool.getConnection();
  
  try {
    const user = verifyToken(request);

    // Get all swaps where user is involved, excluding point-exchanged plants
    const [swaps] = await connection.query(
      `SELECT 
        sm.match_id, sm.status, sm.matched_at, sm.user1_confirmed, sm.user2_confirmed,
        p1.plant_id as plant1_id, p1.name as plant1_name, p1.image_url as plant1_image, 
        p1.price_estimation as plant1_price, p1.user_id as user1_id, p1.status as plant1_status,
        p2.plant_id as plant2_id, p2.name as plant2_name, p2.image_url as plant2_image, 
        p2.price_estimation as plant2_price, p2.user_id as user2_id, p2.status as plant2_status,
        u1.name as user1_name, u2.name as user2_name
       FROM SwapMatch sm
       JOIN Plant p1 ON sm.plant_id_1 = p1.plant_id
       JOIN Plant p2 ON sm.plant_id_2 = p2.plant_id
       JOIN User u1 ON p1.user_id = u1.user_id
       JOIN User u2 ON p2.user_id = u2.user_id
       WHERE (p1.user_id = ? OR p2.user_id = ?)
       AND p1.status != 'point_exchanged' 
       AND p2.status != 'point_exchanged'
       ORDER BY sm.matched_at DESC`,
      [user.userId, user.userId]
    );

    console.log('Found swaps:', swaps);

    // Format the swaps
    const formattedSwaps = swaps.map(swap => {
      const isRequester = swap.user1_id === user.userId;
      return {
        match_id: swap.match_id,
        status: swap.status,
        matched_at: swap.matched_at,
        is_requester: isRequester,
        has_confirmed: isRequester ? swap.user1_confirmed : swap.user2_confirmed,
        other_has_confirmed: isRequester ? swap.user2_confirmed : swap.user1_confirmed,
        can_confirm: isRequester ? !swap.user1_confirmed : !swap.user2_confirmed,
        offered_plant: {
          name: isRequester ? swap.plant1_name : swap.plant2_name,
          image_url: isRequester ? swap.plant1_image : swap.plant2_image,
          price: isRequester ? swap.plant1_price : swap.plant2_price,
          owner_name: isRequester ? swap.user1_name : swap.user2_name
        },
        requested_plant: {
          name: isRequester ? swap.plant2_name : swap.plant1_name,
          image_url: isRequester ? swap.plant2_image : swap.plant1_image,
          price: isRequester ? swap.plant2_price : swap.plant1_price,
          owner_name: isRequester ? swap.user2_name : swap.user1_name
        }
      };
    });

    console.log('Formatted swaps:', formattedSwaps);

    // Split into pending and completed swaps
    const pendingSwaps = formattedSwaps.filter(swap => swap.status === 'pending');
    const completedSwaps = formattedSwaps.filter(swap => swap.status === 'completed');

    console.log('Pending swaps:', pendingSwaps);
    console.log('Completed swaps:', completedSwaps);

    return NextResponse.json({
      pendingSwaps,
      completedSwaps
    });
  } catch (error) {
    console.error('Error fetching swaps:', error);
    return NextResponse.json(
      { message: error.message || 'Terjadi kesalahan server' },
      { status: error.message?.includes('token') ? 401 : 500 }
    );
  } finally {
    connection.release(); // Pastikan koneksi dilepas
  }
} 