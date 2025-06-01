'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import SwapRequestModal from '@/components/swap/SwapRequestModal';
import ChatModal from '@/components/swap/ChatModal';

export default function PlantDetailPage({ params }) {
  const router = useRouter();
  const [plant, setPlant] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSwapModal, setShowSwapModal] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [userPlants, setUserPlants] = useState([]);

  useEffect(() => {
    const loadPlantDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/login');
          return;
        }

        // Fetch plant details
        const response = await fetch(`/api/plants/${params.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch plant details');
        }

        const data = await response.json();
        setPlant(data);

        // Fetch user's plants for swap
        const userPlantsResponse = await fetch('/api/plants/user', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!userPlantsResponse.ok) {
          throw new Error('Failed to fetch user plants');
        }

        const userPlantsData = await userPlantsResponse.json();
        setUserPlants(userPlantsData);

      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadPlantDetails();
  }, [params.id, router]);

  const formatPrice = (price) => {
    if (price === null || price === undefined) return '0';
    return Number(price).toLocaleString();
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
          onClick={() => router.back()}
          className="text-green-600 hover:text-green-700"
        >
          Kembali
        </button>
      </div>
    );
  }

  if (!plant) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center">
        <p className="text-gray-500 mb-4">Tanaman tidak ditemukan</p>
        <button
          onClick={() => router.back()}
          className="text-green-600 hover:text-green-700"
        >
          Kembali
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => router.back()}
          className="mb-6 flex items-center text-green-600 hover:text-green-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Kembali
        </button>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="relative h-96">
            <Image
              src={plant.image_url || "/placeholder.jpg"}
              fill
              alt={plant.name}
              className="object-cover"
            />
          </div>

          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{plant.name}</h1>
                <div className="flex items-center gap-2">
                  <span className="bg-green-50 text-green-600 px-3 py-1 rounded-full text-sm font-medium">
                    {plant.category}
                  </span>
                  <span className="bg-green-50 text-green-600 px-3 py-1 rounded-full text-sm font-medium">
                    {plant.age} bulan
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">Estimasi harga</div>
                <div className="text-xl font-bold text-gray-900">
                  Rp {formatPrice(plant.price_estimation)}
                </div>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-4 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Deskripsi</h2>
              <p className="text-gray-600">{plant.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500 mb-1">Kondisi</h3>
                <p className="text-gray-900">{plant.plant_condition}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500 mb-1">Ingin ditukar dengan</h3>
                <p className="text-gray-900">{plant.willing_to_exchange_for}</p>
              </div>
            </div>

            <div className="flex items-center p-4 bg-gray-50 rounded-lg mb-6">
              <div className="w-12 h-12 rounded-full mr-4 bg-green-100 flex items-center justify-center text-green-600 font-medium text-xl">
                {plant.owner_name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="font-medium text-gray-900">{plant.owner_name}</h3>
                <p className="text-sm text-gray-500">{plant.owner_location}</p>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setShowSwapModal(true)}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-full font-medium transition-colors"
              >
                Ajukan Penukaran
              </button>
              <button
                onClick={() => setShowChatModal(true)}
                className="flex-1 border border-green-500 text-green-500 hover:bg-green-50 px-6 py-3 rounded-full font-medium transition-colors"
              >
                Chat Pemilik
              </button>
            </div>
          </div>
        </div>
      </div>

      {showSwapModal && (
        <SwapRequestModal
          onClose={() => setShowSwapModal(false)}
          targetPlant={plant}
          userPlants={userPlants}
        />
      )}

      {showChatModal && (
        <ChatModal
          onClose={() => setShowChatModal(false)}
          recipientId={plant.user_id}
          recipientName={plant.owner_name}
          plantId={plant.plant_id}
          plantName={plant.name}
        />
      )}
    </div>
  );
} 