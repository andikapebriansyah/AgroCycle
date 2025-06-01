'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PlantCard from '@/components/swap/PlantCard';

export default function PointExchangePage() {
  const router = useRouter();
  const [plants, setPlants] = useState([]);
  const [userPoints, setUserPoints] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadPointExchangePlants = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/login');
          return;
        }

        // Fetch point exchange plants
        const response = await fetch('/api/point-exchange/plants', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.status === 401) {
          localStorage.removeItem('token');
          router.push('/login');
          return;
        }

        if (!response.ok) {
          throw new Error('Failed to fetch plants');
        }

        const data = await response.json();
        setPlants(data.plants || []);
        setUserPoints(data.userPoints || 0);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadPointExchangePlants();
  }, [router]);

  const handleExchange = async (plantId, requiredPoints) => {
    if (userPoints < requiredPoints) {
      alert('Poin Anda tidak cukup untuk menukar tanaman ini');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/point-exchange/redeem', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ plantId })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Gagal menukar poin');
      }

      const data = await response.json();
      setUserPoints(data.remainingPoints);
      
      // Remove exchanged plant from list
      setPlants(plants.filter(p => p.plant_id !== plantId));
      
      alert('Berhasil menukar tanaman! Silakan cek profil Anda.');
    } catch (error) {
      alert(error.message);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={() => router.push('/login')}
          className="text-green-600 hover:text-green-700"
        >
          Kembali ke Login
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Tukar Poin</h1>
              <p className="text-gray-600">
                Tukarkan poin Anda dengan tanaman-tanaman menarik di sini.
              </p>
            </div>
            <div className="bg-white shadow rounded-lg p-4">
              <p className="text-sm text-gray-600">Poin Anda</p>
              <p className="text-2xl font-bold text-green-600">{userPoints}</p>
            </div>
          </div>
        </div>

        {plants.length === 0 ? (
          <div className="text-center py-12">
            <div className="inline-block p-4 rounded-full bg-gray-100 mb-4">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900">Tidak ada tanaman</h3>
            <p className="mt-2 text-sm text-gray-500">
              Belum ada tanaman yang tersedia untuk ditukar dengan poin.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {plants.map((plant) => (
              <div key={plant.plant_id} className="bg-white rounded-lg shadow overflow-hidden">
                <div className="relative pb-2/3">
                  <img
                    src={plant.image_url}
                    alt={plant.name}
                    className="absolute h-full w-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900">{plant.name}</h3>
                  <p className="text-sm text-gray-500 mb-2">{plant.description}</p>
                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <span className="mr-2">Kondisi: {plant.plant_condition}</span>
                    <span>Umur: {plant.age} bulan</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-600">Poin yang dibutuhkan</p>
                      <p className="text-lg font-bold text-green-600">{plant.required_points}</p>
                    </div>
                    <button
                      onClick={() => handleExchange(plant.plant_id, plant.required_points)}
                      disabled={userPoints < plant.required_points}
                      className={`px-4 py-2 rounded-lg text-sm font-medium ${
                        userPoints >= plant.required_points
                          ? 'bg-green-600 text-white hover:bg-green-700'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      Tukar Poin
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 