import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { verifyToken } from '@/middleware/auth';

export async function GET(request) {
  try {
    const user = verifyToken(request);
    console.log('Checking pending swaps for user:', user.userId);

    // Get pending swaps where user owns one of the plants and hasn't confirmed yet
    const [pendingSwaps] = await pool.query(
      `SELECT sm.*, 
        p1.name as plant1_name, p1.image_url as plant1_image, p1.price_estimation as plant1_price,
        p2.name as plant2_name, p2.image_url as plant2_image, p2.price_estimation as plant2_price,
        u1.name as user1_name, u2.name as user2_name,
        p1.user_id as plant1_owner_id, p2.user_id as plant2_owner_id,
        sm.user1_confirmed, sm.user2_confirmed,
        CASE 
          WHEN p1.user_id = ? THEN sm.user1_confirmed
          WHEN p2.user_id = ? THEN sm.user2_confirmed
          ELSE NULL
        END as user_confirmed
       FROM SwapMatch sm
       JOIN Plant p1 ON sm.plant_id_1 = p1.plant_id
       JOIN Plant p2 ON sm.plant_id_2 = p2.plant_id
       JOIN User u1 ON p1.user_id = u1.user_id
       JOIN User u2 ON p2.user_id = u2.user_id
       WHERE sm.status = 'pending'
       AND (
         -- User owns plant1 and hasn't confirmed
         (p1.user_id = ? AND sm.user1_confirmed = FALSE)
         OR
         -- User owns plant2 and hasn't confirmed
         (p2.user_id = ? AND sm.user2_confirmed = FALSE)
       )`,
      [user.userId, user.userId, user.userId, user.userId]
    );

    console.log('Raw pending swaps from DB:', pendingSwaps);

    // Format the response
    const formattedSwaps = pendingSwaps.map(swap => {
      const isRequester = swap.plant1_owner_id === user.userId;
      const hasConfirmed = swap.user_confirmed === 1;

      console.log('Processing swap:', {
        match_id: swap.match_id,
        isRequester,
        user_id: user.userId,
        plant1_owner: swap.plant1_owner_id,
        plant2_owner: swap.plant2_owner_id,
        user1_confirmed: swap.user1_confirmed,
        user2_confirmed: swap.user2_confirmed,
        user_confirmed: swap.user_confirmed,
        hasConfirmed
      });

      return {
        match_id: swap.match_id,
        status: swap.status,
        matched_at: swap.matched_at,
        is_requester: isRequester,
        has_confirmed: hasConfirmed,
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

    console.log('Formatted swaps to send:', formattedSwaps);

    return NextResponse.json({
      pendingSwaps: formattedSwaps
    });
  } catch (error) {
    console.error('Error fetching pending swaps:', error);
    return NextResponse.json(
      { message: error.message || 'Terjadi kesalahan server' },
      { status: error.message?.includes('token') ? 401 : 500 }
    );
  }
} 