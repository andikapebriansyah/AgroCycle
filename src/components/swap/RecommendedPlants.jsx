import { useState, useEffect } from 'react';
import PlantCard from './PlantCard';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function RecommendedPlants() {
  const [recommendationsByPlant, setRecommendationsByPlant] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [scrollPosition, setScrollPosition] = useState(0);

  const scrollContainer = (direction) => {
    const container = document.getElementById('recommendations-container');
    if (container) {
      const scrollAmount = direction === 'left' ? -400 : 400;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      setScrollPosition(container.scrollLeft + scrollAmount);
    }
  };

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Token not found');
        }

        const response = await fetch('/api/recommendations', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch recommendations');
        }

        const data = await response.json();
        setRecommendationsByPlant(data.recommendations_by_plant || []);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-4">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error || !recommendationsByPlant.length) {
    return null;
  }

  return (
    <div className="mb-8">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-gray-900">Rekomendasi Terbaik</h2>
        <p className="text-sm text-gray-600 mt-1">
          Geser untuk melihat rekomendasi tanaman lainnya
        </p>
      </div>

      {/* Desktop Navigation Buttons */}
      <div className="hidden md:flex justify-end space-x-2 mb-2">
        <button
          onClick={() => scrollContainer('left')}
          className="p-2 rounded-full bg-white shadow-sm hover:bg-gray-50 border"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>
        <button
          onClick={() => scrollContainer('right')}
          className="p-2 rounded-full bg-white shadow-sm hover:bg-gray-50 border"
        >
          <ChevronRight className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Recommendations Container */}
      <div 
        id="recommendations-container"
        className="relative flex overflow-x-auto pb-4 hide-scrollbar"
      >
        {recommendationsByPlant.map(({ user_plant, recommendations }) => (
          <div 
            key={user_plant.id} 
            className="flex-none w-full md:w-[600px] mr-4 bg-white rounded-lg shadow-sm p-4"
          >
            <div className="flex items-center mb-3">
              <div className="relative h-12 w-12 rounded-lg overflow-hidden">
                <Image
                  src={user_plant.image_url? user_plant.image_url : "/placeholder.jpg"}
                  alt={user_plant.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="ml-3">
                <h3 className="font-medium text-gray-900 text-sm">{user_plant.name}</h3>
                <p className="text-xs text-gray-500">{user_plant.category}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {recommendations.map(plant => (
                <div key={plant.plant_id} className="relative">
                  <PlantCard plant={plant} compact={true} />
                  
                  <div className="mt-1 flex flex-wrap gap-1">
                    {plant.match_reasons.map((reason, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700"
                      >
                        {reason}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
} 