import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { verifyToken } from '@/middleware/auth';

// Helper function to calculate category similarity
function calculateCategorySimilarity(category1, category2) {
  // Direct category match
  if (category1.toLowerCase() === category2.toLowerCase()) {
    return 1;
  }

  // Related categories (you can expand this based on your needs)
  const relatedCategories = {
    'Tanaman Hias': ['Sukulen'],
    'Sukulen': ['Tanaman Hias'],
    'Tanaman Herbal': ['Tanaman Bumbu'],
    'Tanaman Bumbu': ['Tanaman Herbal']
  };

  if (relatedCategories[category1]?.includes(category2)) {
    return 0.8; // Increased from 0.5 for stricter matching
  }

  return 0;
}

// Helper function to check if plant matches exchange preferences
function matchesExchangePreferences(plant, targetPlant) {
  if (!targetPlant.willing_to_exchange_for) return false; // Changed from true to false
  
  const preferences = targetPlant.willing_to_exchange_for.toLowerCase().split(/[,\s]+/);
  const plantCategory = plant.category.toLowerCase();
  
  return preferences.some(pref => 
    plantCategory.includes(pref) || pref.includes(plantCategory)
  );
}

// Helper function to calculate price compatibility
function calculatePriceCompatibility(price1, price2) {
  const maxPrice = Math.max(price1, price2);
  const minPrice = Math.min(price1, price2);
  
  if (maxPrice === 0) return 1;
  const ratio = minPrice / maxPrice;
  
  // Stricter price matching
  if (ratio > 0.8) {
    return 1;
  } else if (ratio > 0.6) {
    return 0.8;
  }
  return 0;
}

export async function GET(request) {
  const connection = await pool.getConnection();
  
  try {
    const user = verifyToken(request);
    
    // Get user's plants
    const [userPlants] = await connection.query(
      `SELECT p.*
       FROM Plant p
       WHERE p.user_id = ? AND p.status = 'available'`,
      [user.userId]
    );

    // Get all other available plants
    const [availablePlants] = await connection.query(
      `SELECT p.*, u.name as owner_name, u.location,
        EXISTS(
          SELECT 1 FROM SavedPlant sp 
          WHERE sp.plant_id = p.plant_id 
          AND sp.user_id = ?
        ) as is_saved
       FROM Plant p
       JOIN User u ON p.user_id = u.user_id
       WHERE p.status = 'available' 
       AND p.user_id != ?`,
      [user.userId, user.userId]
    );

    // Calculate recommendation scores for each user's plant
    const recommendationsByPlant = userPlants.map(userPlant => {
      const plantRecommendations = availablePlants.map(plant => {
        let currentScore = 0;
        let currentReasons = [];

        // 1. Category Similarity (60%)
        const categorySimilarity = calculateCategorySimilarity(userPlant.category, plant.category);
        currentScore += categorySimilarity * 0.6;
        
        if (categorySimilarity === 1) {
          currentReasons.push('Kategori sama');
        } else if (categorySimilarity === 0.8) {
          currentReasons.push('Kategori serupa');
        }

        // 2. Exchange Preference Match (25%)
        if (matchesExchangePreferences(userPlant, plant)) {
          currentScore += 0.25;
          currentReasons.push('Sesuai preferensi penukaran');
        }

        // 3. Price Compatibility (15%)
        const priceScore = calculatePriceCompatibility(
          userPlant.price_estimation,
          plant.price_estimation
        );
        currentScore += priceScore * 0.15;
        
        if (priceScore > 0.8) {
          currentReasons.push('Harga sesuai');
        }

        // Only include recommendations with high matching score
        if (currentScore > 0.95) {
          return {
            ...plant,
            recommendation_score: currentScore,
            match_reasons: [...new Set(currentReasons)],
            for_plant: {
              id: userPlant.plant_id,
              name: userPlant.name,
              category: userPlant.category
            }
          };
        }
        return null;
      }).filter(Boolean); // Remove null entries

      // Sort and get top 2 recommendations for this plant
      plantRecommendations.sort((a, b) => b.recommendation_score - a.recommendation_score);
      return {
        user_plant: {
          id: userPlant.plant_id,
          name: userPlant.name,
          category: userPlant.category,
          image_url: userPlant.image_url
        },
        recommendations: plantRecommendations.slice(0, 2)
      };
    }).filter(item => item.recommendations.length > 0); // Only include plants that have recommendations

    return NextResponse.json({
      recommendations_by_plant: recommendationsByPlant
    });

  } catch (error) {
    console.error('Error generating recommendations:', error);
    return NextResponse.json(
      { message: error.message || 'Terjadi kesalahan server' },
      { status: error.message?.includes('token') ? 401 : 500 }
    );
  } finally {
    connection.release();
  }
} 