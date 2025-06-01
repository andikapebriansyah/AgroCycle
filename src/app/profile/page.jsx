'use client'

import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import AddPlantForm from '@/components/swap/AddPlantForm';
import AddPlantButton from '@/components/swap/AddPlantButton';
import PlantCard from '@/components/swap/PlantCard';
import PointExchangeHistory from './PointExchangeHistory';
import EditProfileModal from '@/components/profile/EditProfileModal';

export default function Profile() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [plants, setPlants] = useState([]);
  const [savedPlants, setSavedPlants] = useState([]);
  const [activities, setActivities] = useState([]);
  const [showAddPlantModal, setShowAddPlantModal] = useState(false);
  const [pendingSwaps, setPendingSwaps] = useState([]);
  const [completedSwaps, setCompletedSwaps] = useState([]);
  const [activeTab, setActiveTab] = useState('activity');
  const [showEditModal, setShowEditModal] = useState(false);

  const tabVariants = {
    active: { borderBottom: '2px solid #10B981', color: '#10B981' },
    inactive: { borderBottom: '2px solid transparent', color: '#6B7280' }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await fetch('/api/user/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch profile');
        }

        const data = await response.json();
        console.log('Profile data:', data);
        setUser({
          ...data.user,
          pointExchanges: data.pointExchanges || []
        });
        setPlants(data.plants);
        setSavedPlants(data.savedPlants || []);
        setActivities(data.activities || []);
        setIsLoading(false);
      } catch (err) {
        console.error('Profile fetch error:', err);
        if (err.message.includes('unauthorized') || err.message.includes('invalid token')) {
          localStorage.removeItem('token');
          router.push('/login');
        }
      }
    };

    const fetchSwaps = async () => {
      try {
        console.log('Fetching swaps...');
        const response = await fetch('/api/swap/list', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch swaps');
        }

        const data = await response.json();
        console.log('Received swaps data:', data);
        setPendingSwaps(data.pendingSwaps || []);
        setCompletedSwaps(data.completedSwaps || []);
      } catch (error) {
        console.error('Error fetching swaps:', error);
      }
    };

    fetchProfile();
    fetchSwaps();
  }, [router]);

  const handleConfirmSwap = async (matchId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/swap/confirm/${matchId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to confirm swap');
      }

      // Refresh swaps list
      const swapsResponse = await fetch('/api/swap/list', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (swapsResponse.ok) {
        const data = await swapsResponse.json();
        setPendingSwaps(data.pendingSwaps || []);
        setCompletedSwaps(data.completedSwaps || []);
      }

      // Refresh plants list
      const profileResponse = await fetch('/api/user/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (profileResponse.ok) {
        const data = await profileResponse.json();
        setPlants(data.plants);
        setSavedPlants(data.savedPlants || []);
      }

      alert('Penukaran berhasil dikonfirmasi');
    } catch (error) {
      console.error('Error confirming swap:', error);
      alert(error.message || 'Gagal mengkonfirmasi penukaran. Silakan coba lagi.');
    }
  };

  const handleRejectSwap = async (matchId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/swap/reject/${matchId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to reject swap');
      }

      // Refresh swaps list
      const swapsResponse = await fetch('/api/swap/list', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (swapsResponse.ok) {
        const data = await swapsResponse.json();
        setPendingSwaps(data.pendingSwaps || []);
        setCompletedSwaps(data.completedSwaps || []);
      }

      // Refresh plants list
      const profileResponse = await fetch('/api/user/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (profileResponse.ok) {
        const data = await profileResponse.json();
        setPlants(data.plants);
        setSavedPlants(data.savedPlants || []);
      }

      alert('Penukaran berhasil ditolak');
    } catch (error) {
      console.error('Error rejecting swap:', error);
      alert(error.message || 'Gagal menolak penukaran. Silakan coba lagi.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  const handleProfileUpdate = (updatedUser) => {
    setUser(prev => ({
      ...prev,
      ...updatedUser
    }));
  };

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <svg className="animate-spin h-10 w-10 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Profil | AgroCycle</title>
        <meta name="description" content="Halaman profil pengguna AgroCycle" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-end items-center">
          <button 
            onClick={handleLogout}
            className="text-gray-500 hover:text-gray-700 font-medium text-sm"
          >
            Keluar
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white shadow rounded-lg overflow-hidden"
        >
          <div className="h-32 bg-white relative">
            <div className="absolute -bottom-16 left-8 h-32 w-32 border-4 border-white rounded-full overflow-hidden">
              <Image
                src={user.profile_image || "/placeholder.jpg"}
                alt={`${user.name}'s Profile Picture`}
                layout="fill"
                objectFit="cover"
                priority
              />
            </div>
          </div>
          
          <div className="pt-20 px-8 pb-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
                <p className="text-gray-500">{user.location}</p>
                <p className="text-gray-500 text-sm mt-1">{user.email}</p>
              </div>
              
              <button 
                onClick={() => setShowEditModal(true)}
                className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md shadow-sm transition-colors"
              >
                Edit Profil
              </button>
            </div>
            
            <p className="text-gray-700 mb-6">{user.bio || 'Belum ada deskripsi.'}</p>
            
            <div className="flex items-center text-sm text-gray-500 mb-8">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>Bergabung sejak {new Date(user.join_date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long' })}</span>
            </div>
            
            <div className="flex space-x-8 border-b border-gray-200 mb-6">
              <div className="pb-4 px-2">
                <div className="text-2xl font-semibold text-gray-900">{user.plants}</div>
                <div className="text-sm text-gray-500">Tanaman</div>
              </div>
              
              <div className="pb-4 px-2">
                <div className="text-2xl font-semibold text-gray-900">{user.trades}</div>
                <div className="text-sm text-gray-500">Pertukaran</div>
              </div>
              
              <div className="pb-4 px-2">
                <div className="text-2xl font-semibold text-gray-900">{user.followers}</div>
                <div className="text-sm text-gray-500">Pengikut</div>
              </div>

              <div className="pb-4 px-2">
                <div className="text-2xl font-semibold text-gray-900">{user.following}</div>
                <div className="text-sm text-gray-500">Mengikuti</div>
              </div>

              <div className="pb-4 px-2">
                <div className="text-2xl font-semibold text-green-600">{user.poin}</div>
                <div className="text-sm text-gray-500">Poin</div>
              </div>
            </div>
            
            <div className="flex border-b border-gray-200 mb-6">
              <motion.button
                variants={tabVariants}
                animate={activeTab === 'activity' ? 'active' : 'inactive'}
                className="pb-4 px-6 font-medium text-sm focus:outline-none"
                onClick={() => setActiveTab('activity')}
              >
                Aktivitas
              </motion.button>
              
              <motion.button
                variants={tabVariants}
                animate={activeTab === 'myPlants' ? 'active' : 'inactive'}
                className="pb-4 px-6 font-medium text-sm focus:outline-none"
                onClick={() => setActiveTab('myPlants')}
              >
                Tanaman Saya
              </motion.button>
              
              <motion.button
                variants={tabVariants}
                animate={activeTab === 'swaps' ? 'active' : 'inactive'}
                className="pb-4 px-6 font-medium text-sm focus:outline-none"
                onClick={() => setActiveTab('swaps')}
              >
                Penukaran
              </motion.button>
              
              <motion.button
                variants={tabVariants}
                animate={activeTab === 'savedPlants' ? 'active' : 'inactive'}
                className="pb-4 px-6 font-medium text-sm focus:outline-none"
                onClick={() => setActiveTab('savedPlants')}
              >
                Disimpan
              </motion.button>
            </div>
            
            {activeTab === 'activity' && (
              <div className="space-y-6">
                {/* Point Exchange Activities */}
                {user.pointExchanges && user.pointExchanges.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Aktivitas Penukaran Poin</h3>
                    <div className="space-y-4">
                      {user.pointExchanges.map((exchange) => (
                        <div key={exchange.exchange_id} className="flex items-start bg-white p-4 rounded-lg shadow-sm">
                      <div className="h-12 w-12 rounded-md overflow-hidden mr-4">
                        <Image
                              src={exchange.image_url?.startsWith("/") ? exchange.image_url : "/placeholder.jpg"}
                              alt={exchange.plant_name}
                          width={48}
                          height={48}
                          objectFit="cover"
                        />
                      </div>
                      <div>
                            <p className="text-gray-900">
                              Menukar <span className="font-medium">{exchange.points_spent} poin</span> dengan 
                              tanaman <span className="font-medium">{exchange.plant_name}</span>
                            </p>
                            <p className="text-sm text-gray-500">
                              {new Date(exchange.exchanged_at).toLocaleDateString('id-ID', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                      </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Regular Swap Activities */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Aktivitas Penukaran Tanaman</h3>
                  {activities.length > 0 ? (
                    activities.map(activity => {
                      const isUserPlant1 = activity.user1_name === user.name;
                      const userPlantName = isUserPlant1 ? activity.plant1_name : activity.plant2_name;
                      const otherPlantName = isUserPlant1 ? activity.plant2_name : activity.plant1_name;
                      const otherUserName = isUserPlant1 ? activity.user2_name : activity.user1_name;
                      const userPlantImage = isUserPlant1 ? activity.plant1_image : activity.plant2_image;
                      
                      return (
                        <div key={activity.match_id} className="flex items-start bg-white p-4 rounded-lg shadow-sm">
                          <div className="h-12 w-12 rounded-md overflow-hidden mr-4">
                            <Image
                              src={userPlantImage?.startsWith("/") ? userPlantImage : "/placeholder.jpg"}
                              alt={userPlantName}
                              width={48}
                              height={48}
                              objectFit="cover"
                            />
                          </div>
                          <div>
                            <p className="text-gray-900">
                              Menukar tanaman <span className="font-medium">{userPlantName}</span> dengan 
                              tanaman <span className="font-medium">{otherPlantName}</span> milik 
                              <span className="font-medium"> {otherUserName}</span>
                            </p>
                            <p className="text-sm text-gray-500">
                              {new Date(activity.matched_at).toLocaleDateString('id-ID', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                        </div>
                      );
                    })
                ) : (
                  <div className="text-center py-8">
                    <div className="inline-block p-4 bg-gray-100 rounded-full mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-1">Belum ada aktivitas penukaran</h3>
                      <p className="text-sm text-gray-500">Aktivitas penukaran tanaman Anda akan muncul di sini</p>
                  </div>
                )}
                </div>
              </div>
            )}
            
            {activeTab === 'myPlants' && (
              <div>
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">Tanaman Tersedia</h2>
                      <AddPlantButton onClick={() => setShowAddPlantModal(true)} />
                    </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {plants.filter(plant => plant.status === 'available').map((plant) => (
                      <PlantCard key={plant.plant_id} plant={plant} />
                    ))}
                  </div>
                </div>

                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Tanaman dari Penukaran Poin</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {plants.filter(plant => plant.status === 'point_exchanged').map((plant) => (
                      <div key={plant.plant_id} className="bg-gray-50 rounded-lg p-4">
                        <div className="relative h-48 w-full mb-4 rounded-lg overflow-hidden">
                          <Image
                            src={plant.image_url?.startsWith("/") ? plant.image_url : "/placeholder.jpg"}
                            alt={plant.name}
                            layout="fill"
                            objectFit="cover"
                          />
                          <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                            Ditukar dengan Poin
                          </div>
                        </div>
                        <h3 className="font-medium text-gray-900">{plant.name}</h3>
                        <p className="text-sm text-gray-500 mt-1">{plant.description}</p>
                        <div className="mt-2 text-sm text-gray-500">
                          Ditukar pada: {new Date(plant.updated_at).toLocaleDateString('id-ID')}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Tanaman yang Sudah Ditukar</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {plants.filter(plant => plant.status === 'swapped').map((plant) => (
                      <div key={plant.plant_id} className="bg-gray-50 rounded-lg p-4">
                        <div className="relative h-48 w-full mb-4 rounded-lg overflow-hidden">
                          <Image
                            src={plant.image_url?.startsWith("/") ? plant.image_url : "/placeholder.jpg"}
                            alt={plant.name}
                            layout="fill"
                            objectFit="cover"
                          />
                          <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                            Ditukar
                          </div>
                        </div>
                        <h3 className="font-medium text-gray-900">{plant.name}</h3>
                        <p className="text-sm text-gray-500 mt-1">{plant.description}</p>
                        <div className="mt-2 text-sm text-gray-500">
                          Ditukar pada: {new Date(plant.updated_at).toLocaleDateString('id-ID')}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'swaps' && (
              <div>
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Penukaran yang Menunggu Konfirmasi</h2>
                  <div className="space-y-4">
                    {pendingSwaps?.map((swap) => (
                      <div key={swap.match_id} className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-8">
                            <div>
                              <div className="relative h-20 w-20 rounded-lg overflow-hidden">
                                <Image
                                  src={swap.offered_plant.image_url?.startsWith("/") ? swap.offered_plant.image_url : "/placeholder.jpg"}
                                  alt={swap.offered_plant.name}
                                  layout="fill"
                                  objectFit="cover"
                                />
                              </div>
                              <p className="text-sm text-gray-500 mt-1 text-center">{swap.offered_plant.name}</p>
                            </div>
                            <div className="flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                              </svg>
                            </div>
                            <div>
                              <div className="relative h-20 w-20 rounded-lg overflow-hidden">
                                <Image
                                  src={swap.requested_plant.image_url?.startsWith("/") ? swap.requested_plant.image_url : "/placeholder.jpg"}
                                  alt={swap.requested_plant.name}
                                  layout="fill"
                                  objectFit="cover"
                                />
                              </div>
                              <p className="text-sm text-gray-500 mt-1 text-center">{swap.requested_plant.name}</p>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => handleConfirmSwap(swap.match_id)}
                              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                            >
                              Konfirmasi
                            </button>
                            <button 
                              onClick={() => handleRejectSwap(swap.match_id)}
                              className="px-4 py-2 border border-red-500 text-red-500 rounded-md hover:bg-red-50 transition-colors"
                            >
                              Tolak
                            </button>
                          </div>
                        </div>
                        <div className="mt-4 text-sm text-gray-500">
                          Diajukan pada: {new Date(swap.matched_at).toLocaleDateString('id-ID', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </div>
                    ))}
                    {(!pendingSwaps || pendingSwaps.length === 0) && (
                      <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <div className="inline-block p-4 bg-gray-100 rounded-full mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                      </svg>
                    </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-1">Tidak ada penukaran yang menunggu</h3>
                        <p className="text-sm text-gray-500">Penukaran yang menunggu konfirmasi akan muncul di sini</p>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Riwayat Penukaran</h2>
                  <div className="space-y-4">
                    {completedSwaps?.map((swap) => (
                      <div key={swap.match_id} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center space-x-8">
                          <div>
                            <div className="relative h-20 w-20 rounded-lg overflow-hidden">
                              <Image
                                src={swap.offered_plant.image_url?.startsWith("/") ? swap.offered_plant.image_url : "/placeholder.jpg"}
                                alt={swap.offered_plant.name}
                                layout="fill"
                                objectFit="cover"
                              />
                            </div>
                            <p className="text-sm text-gray-500 mt-1 text-center">{swap.offered_plant.name}</p>
                          </div>
                          <div className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                            </svg>
                          </div>
                          <div>
                            <div className="relative h-20 w-20 rounded-lg overflow-hidden">
                              <Image
                                src={swap.requested_plant.image_url?.startsWith("/") ? swap.requested_plant.image_url : "/placeholder.jpg"}
                                alt={swap.requested_plant.name}
                                layout="fill"
                                objectFit="cover"
                              />
                            </div>
                            <p className="text-sm text-gray-500 mt-1 text-center">{swap.requested_plant.name}</p>
                          </div>
                        </div>
                        <div className="mt-4 text-sm text-gray-500">
                          Selesai pada: {new Date(swap.matched_at).toLocaleDateString('id-ID', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </div>
                    ))}
                    {(!completedSwaps || completedSwaps.length === 0) && (
                      <div className="text-center py-8 bg-gray-50 rounded-lg">
                        <div className="inline-block p-4 bg-gray-100 rounded-full mb-4">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-1">Belum ada riwayat penukaran</h3>
                        <p className="text-sm text-gray-500">Riwayat penukaran yang telah selesai akan muncul di sini</p>
                  </div>
                )}
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'savedPlants' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedPlants.length > 0 ? (
                  savedPlants.map((plant) => (
                    <PlantCard key={plant.plant_id} plant={plant} isSaved={true} />
                  ))
                ) : (
                  <div className="col-span-3 text-center py-12">
                <div className="inline-block p-4 bg-gray-100 rounded-full mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">Tidak ada tanaman tersimpan</h3>
                    <p className="text-sm text-gray-500">Tanaman yang Anda simpan akan muncul di sini</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </main>

      {showAddPlantModal && (
        <AddPlantForm onClose={() => setShowAddPlantModal(false)} />
      )}

      {showEditModal && (
        <EditProfileModal
          user={user}
          onClose={() => setShowEditModal(false)}
          onUpdate={handleProfileUpdate}
        />
      )}
    </div>
  );
} 