// app/swap/page.jsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
// import SwapHeader from '@/components/swap/SwapHeader';
import PlantCard from '@/components/swap/PlantCard';
import SwapFilters from '@/components/swap/SwapFilters';
import AddPlantButton from '@/components/swap/AddPlantButton';
import SwapRegistrationModal from '@/components/swap/SwapRegistrationModal';
import SwapNotification from '@/components/swap/SwapNotification';
import RecommendedPlants from '@/components/swap/RecommendedPlants';
import SearchBar from '@/components/swap/SearchBar';

export default function SwapMarketPage() {
  const router = useRouter();
  const [plants, setPlants] = useState([]);
  const [filteredPlants, setFilteredPlants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [error, setError] = useState(null);
  const [swapNotification, setSwapNotification] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all', name: 'Semua' },
    { id: 'Tanaman Hias', name: 'Tanaman Hias' },
    { id: 'Tanaman Buah', name: 'Tanaman Buah' },
    { id: 'Tanaman Herbal', name: 'Tanaman Herbal' },
    { id: 'Tanaman Bumbu', name: 'Tanaman Bumbu' },
    { id: 'Sukulen', name: 'Sukulen' }
  ];

  useEffect(() => {
    const loadPlants = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/login');
          return;
        }

        // Check for pending swaps
        const swapResponse = await fetch('/api/swap/pending', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (swapResponse.ok) {
          const swapData = await swapResponse.json();
          console.log('Raw pending swaps data:', swapData);
          
          // Debugging: Log each swap's confirmation status
          if (swapData.pendingSwaps && swapData.pendingSwaps.length > 0) {
            console.log('Found pending swaps:', swapData.pendingSwaps.length);
            swapData.pendingSwaps.forEach((swap, index) => {
              console.log(`Swap ${index + 1} details:`, {
                match_id: swap.match_id,
                is_requester: swap.is_requester,
                has_confirmed: swap.has_confirmed,
                offered_plant: {
                  name: swap.offered_plant.name,
                  owner: swap.offered_plant.owner_name
                },
                requested_plant: {
                  name: swap.requested_plant.name,
                  owner: swap.requested_plant.owner_name
                }
              });
            });

            // Filter swaps that need user's confirmation
            const needsConfirmation = swapData.pendingSwaps.filter(swap => !swap.has_confirmed);
            console.log('Swaps needing confirmation:', needsConfirmation.length);

            if (needsConfirmation.length > 0) {
              console.log('Setting notification for', needsConfirmation.length, 'swaps');
              setSwapNotification({
                count: needsConfirmation.length,
                message: `Anda memiliki ${needsConfirmation.length} penukaran yang menunggu konfirmasi`
              });
            } else {
              console.log('No swaps need confirmation, clearing notification');
              setSwapNotification(null);
            }
          } else {
            console.log('No pending swaps found');
            setSwapNotification(null);
          }
        } else {
          console.error('Failed to fetch pending swaps:', swapResponse.status);
          setSwapNotification(null);
        }

        const response = await fetch('/api/plants', {
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
        // Filter hanya tanaman yang available
        const availablePlants = data.filter(plant => plant.status === 'available');
        setPlants(availablePlants);
        setFilteredPlants(availablePlants);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadPlants();
  }, [router]);

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    applyFilters(filter, searchQuery);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    applyFilters(activeFilter, query);
  };

  const applyFilters = (filter, query) => {
    let filtered = [...plants];

    // Apply category filter
    if (filter !== 'all') {
      filtered = filtered.filter(plant => plant.category === filter);
    }

    // Apply search filter
    if (query) {
      const searchLower = query.toLowerCase();
      filtered = filtered.filter(plant => 
        plant.name.toLowerCase().includes(searchLower) ||
        plant.category.toLowerCase().includes(searchLower) ||
        plant.description?.toLowerCase().includes(searchLower) ||
        plant.willing_to_exchange_for?.toLowerCase().includes(searchLower)
      );
    }

    setFilteredPlants(filtered);
  };

  const handleAddPlant = () => {
    setShowRegistrationModal(true);
  };

  const handleCloseModal = () => {
    setShowRegistrationModal(false);
  };

  const handlePlantSubmit = (newPlant) => {
    // In a real implementation, this would send data to your backend
    // and then refresh the plants list
    setPlants([...plants, { ...newPlant, id: Date.now() }]);
    if (activeFilter === 'all' || activeFilter === newPlant.category) {
      setFilteredPlants([...filteredPlants, { ...newPlant, id: Date.now() }]);
    }
    setShowRegistrationModal(false);
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
        {swapNotification && (
          <SwapNotification
            message={swapNotification.message}
            count={swapNotification.count}
            onClick={() => router.push('/profile')}
          />
        )}

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Pasar Tukar Tanaman</h1>
          <p className="text-gray-600">
            Temukan tanaman yang ingin Anda tukar atau jual di sini. Lihat detail tanaman dan hubungi pemiliknya untuk melakukan pertukaran.
          </p>
        </div>

        {/* Search and Add Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <div className="flex-grow max-w-3xl">
              <SearchBar onSearch={handleSearch} />
            </div>
            <div className="ml-4">
              <AddPlantButton onClick={handleAddPlant} />
            </div>
          </div>
        </div>

        {/* Recommendations Section */}
        <RecommendedPlants />

        {/* Explore Section */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Jelajahi Semua Tanaman</h2>
          </div>

          {/* Category Filter */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => handleFilterChange(category.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
                    ${activeFilter === category.id
                      ? 'bg-green-600 text-white'
                      : 'bg-white text-gray-600 hover:bg-green-50 hover:text-green-600'
                    }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* Plants Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPlants.length > 0 ? (
              filteredPlants.map(plant => (
                <PlantCard key={plant.plant_id} plant={plant} />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <div className="inline-block p-4 bg-gray-100 rounded-full mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">
                  {searchQuery
                    ? 'Tidak ada tanaman yang sesuai dengan pencarian Anda'
                    : activeFilter === 'all'
                      ? 'Belum ada tanaman yang tersedia'
                      : `Belum ada tanaman dalam kategori ${categories.find(c => c.id === activeFilter)?.name}`
                  }
                </h3>
                <p className="text-sm text-gray-500">
                  {searchQuery
                    ? 'Coba kata kunci lain atau ubah filter kategori'
                    : 'Silakan coba kategori lain atau kembali lagi nanti'
                  }
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {showRegistrationModal && (
        <SwapRegistrationModal 
          onClose={handleCloseModal}
          onSubmit={handlePlantSubmit}
        />
      )}
    </div>
  );
}