// app/swap/page.jsx
'use client';

import { useState, useEffect } from 'react';
// import SwapHeader from '@/components/swap/SwapHeader';
import PlantCard from '@/components/swap/PlantCard';
import SwapFilters from '@/components/swap/SwapFilters';
import AddPlantButton from '@/components/swap/AddPlantButton';
import SwapRegistrationModal from '@/components/swap/SwapRegistrationModal';
import { fetchPlants } from '@/app/services/plantService';

export default function SwapMarketPage() {
  const [plants, setPlants] = useState([]);
  const [filteredPlants, setFilteredPlants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    const loadPlants = async () => {
      try {
        // In a real implementation, this would fetch from your Adonis backend
        const plantsData = await fetchPlants();
        setPlants(plantsData);
        setFilteredPlants(plantsData);
      } catch (error) {
        console.error('Error loading plants:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPlants();
  }, []);

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    
    if (filter === 'all') {
      setFilteredPlants(plants);
    } else {
      const filtered = plants.filter(plant => plant.category === filter);
      setFilteredPlants(filtered);
    }
  };

  const handleAddPlant = () => {
    setShowRegistrationModal(true);
  };

  const handleCloseModal = () => {
    setShowRegistrationModal(false);
  };

  const handlePlantSubmit = (newPlant) => {
    // In a real implementation, this would send data to your Adonis backend
    // and then refresh the plants list
    setPlants([...plants, { ...newPlant, id: Date.now() }]);
    if (activeFilter === 'all' || activeFilter === newPlant.category) {
      setFilteredPlants([...filteredPlants, { ...newPlant, id: Date.now() }]);
    }
    setShowRegistrationModal(false);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* <SwapHeader /> */}
      
      <main className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-green-800">Swap Market</h1>
          <AddPlantButton onClick={handleAddPlant} />
        </div>
        
        <p className="text-gray-600 mb-8">
          Tukar tanaman dan bibit dengan pengguna lain di sekitar Anda. 
          Bantu tanaman Anda menemukan rumah baru dan dapatkan varietas tanaman yang Anda inginkan.
        </p>
        
        <SwapFilters activeFilter={activeFilter} onFilterChange={handleFilterChange} />
        
        {isLoading ? (
        <div className="w-full flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
        ) : (

          <>
            {filteredPlants.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-xl text-gray-500">Belum ada tanaman dalam kategori ini</p>
                <button 
                  onClick={handleAddPlant}
                  className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                >
                  Tambahkan Tanaman Pertama
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPlants.map(plant => (
                  <PlantCard key={plant.id} plant={plant} />
                ))}
              </div>
            )}
          </>
        )}
      </main>
      
      {showRegistrationModal && (
        <SwapRegistrationModal 
          onClose={handleCloseModal}
          onSubmit={handlePlantSubmit}
        />
      )}
    </div>
  );
}