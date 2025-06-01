'use client'

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import SaveButton from '@/components/SaveButton';
import SwapRequestModal from '@/components/swap/SwapRequestModal';
import ChatModal from '@/components/swap/ChatModal';

export default function PlantDetail({ params }) {
  const [plant, setPlant] = useState(null);
  const [userPlants, setUserPlants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSwapModal, setShowSwapModal] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
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
        const plantData = await response.json();
        setPlant(plantData);

        // Fetch user's plants
        const userPlantsResponse = await fetch('/api/plants/user', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!userPlantsResponse.ok) {
          throw new Error('Failed to fetch user plants');
        }

        const userPlantsData = await userPlantsResponse.json();
        // Filter out the current plant and non-available plants
        const availableUserPlants = userPlantsData.filter(p => 
          p.plant_id !== plantData.plant_id && p.status === 'available'
        );
        setUserPlants(availableUserPlants);

      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [params.id, router]);

  const handleSwapClick = () => {
    if (!userPlants.length) {
      alert('Anda tidak memiliki tanaman yang tersedia untuk ditukar. Silakan tambahkan tanaman terlebih dahulu.');
      return;
    }
    setShowSwapModal(true);
  };

  const handleChatClick = (e) => {
    e.preventDefault();
    if (!plant?.user_id) return;
    setShowChatModal(true);
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="md:flex">
            {/* Image Section */}
            <div className="md:w-1/2">
              <div className="relative h-96 md:h-full">
                <Image
                  src={plant.image_url || "/placeholder.jpg"}
                  alt={plant.name}
                  layout="fill"
                  objectFit="cover"
                />
                <div className="absolute top-4 right-4">
                  <SaveButton plantId={plant.plant_id} initialSaved={plant.is_saved} />
                </div>
              </div>
            </div>

            {/* Details Section */}
            <div className="md:w-1/2 p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{plant.name}</h1>
                  <p className="text-gray-500">{plant.category}</p>
                </div>
                <span className="bg-green-50 text-green-600 px-3 py-1 rounded-full text-sm">
                  {plant.status}
                </span>
              </div>

              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Deskripsi</h2>
                  <p className="mt-2 text-gray-600">{plant.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Umur</h3>
                    <p className="mt-1 text-gray-900">{plant.age} bulan</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Kondisi</h3>
                    <p className="mt-1 text-gray-900">{plant.plant_condition}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Lokasi</h3>
                    <p className="mt-1 text-gray-900">{plant.location}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Estimasi Harga</h3>
                    <p className="mt-1 text-gray-900">
                      Rp {plant.price_estimation?.toLocaleString() ?? '0'}
                    </p>
                  </div>
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Ingin Ditukar Dengan</h2>
                  <p className="mt-2 text-gray-600">{plant.willing_to_exchange_for}</p>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <Link href={`/user/${plant.user_id}`} className="flex items-center hover:text-green-600">
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-lg font-semibold">
                      {plant.owner_name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-900">{plant.owner_name}</p>
                      <p className="text-sm text-gray-500">{plant.owner_location}</p>
                    </div>
                  </Link>
                </div>

                <div className="flex gap-4 pt-6">
                  <button 
                    onClick={handleSwapClick}
                    disabled={plant?.status !== 'available'}
                    className={`flex-1 px-6 py-3 rounded-lg transition-colors ${
                      plant?.status === 'available'
                        ? 'bg-green-600 text-white hover:bg-green-700'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {plant?.status === 'available' ? 'Ajukan Pertukaran' : 'Tidak Tersedia'}
                  </button>
                  <button 
                    onClick={handleChatClick}
                    className="flex-1 border border-green-600 text-green-600 px-6 py-3 rounded-lg hover:bg-green-50 transition-colors flex items-center justify-center gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    Chat Pemilik
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <button
            onClick={() => router.back()}
            className="text-green-600 hover:text-green-700 flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Kembali
          </button>
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