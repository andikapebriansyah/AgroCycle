'use client'

// pages/profile.js
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function Profile() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Mock activities and plants data (would typically be fetched from API)
  const [activities] = useState([
    { 
      id: 1, 
      type: 'trade', 
      description: 'Menukar bibit tomat dengan bibit cabai', 
      date: '2 hari yang lalu',
      image: '/placeholder.jpg'
    },
    { 
      id: 2, 
      type: 'purchase', 
      description: 'Membeli pupuk kompos organik', 
      date: '1 minggu yang lalu',
      image: '/placeholder.jpg'
    },
    { 
      id: 3, 
      type: 'sell', 
      description: 'Menjual hasil panen selada hidroponik', 
      date: '2 minggu yang lalu',
      image: '/placeholder.jpg'
    }
  ]);

  const [plants] = useState([
    { id: 1, name: 'Tomat Cherry', status: 'Tersedia untuk ditukar', image: '/placeholder.jpg' },
    { id: 2, name: 'Mint', status: 'Tersedia untuk ditukar', image: '/placeholder.jpg' },
    { id: 3, name: 'Basil', status: 'Sedang bertumbuh', image: '/placeholder.jpg' },
    { id: 4, name: 'Selada Hidroponik', status: 'Siap panen', image: '/placeholder.jpg' }
  ]);

  const tabVariants = {
    active: { borderBottom: '2px solid #10B981', color: '#10B981' },
    inactive: { borderBottom: '2px solid transparent', color: '#6B7280' }
  };

  const [activeTab, setActiveTab] = useState('activity');

  // Check authentication and fetch user data on component mount
  useEffect(() => {
    const checkAuth = () => {
      const isLoggedIn = localStorage.getItem('isLoggedIn');
      
      if (isLoggedIn !== 'true') {
        // Redirect to login if not authenticated
        router.push('/login');
        return;
      }
      
      // Get user data from localStorage
      const storedUser = localStorage.getItem('user');
      
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          setUser(userData);
        } catch (error) {
          console.error('Error parsing user data:', error);
          // Handle parsing error - could redirect to login
          router.push('/login');
        }
      } else {
        // No user data found, redirect to login
        router.push('/login');
      }
      
      setIsLoading(false);
    };
    
    checkAuth();
  }, [router]);

  const handleLogout = () => {
    // Clear authentication state
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('user');
    
    // Redirect to login page
    router.push('/login');
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
                src="/placeholder.jpg"
                alt="Profile Picture"
                layout="fill"
                objectFit="cover"
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
              
              <button className="px-4 py-2 bg-green-500 hover:bg-green-700 text-white rounded-md shadow-sm">
                Edit Profil
              </button>
            </div>
            
            <p className="text-gray-700 mb-6">{user.bio || 'Belum ada deskripsi.'}</p>
            
            <div className="flex items-center text-sm text-gray-500 mb-8">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>Bergabung sejak {user.joinDate}</span>
            </div>
            
            <div className="flex space-x-8 border-b border-gray-200 mb-6">
              <div className="pb-4 px-2">
                <div className="text-2xl font-semibold text-gray-900">{user.plants || 0}</div>
                <div className="text-sm text-gray-500">Tanaman</div>
              </div>
              
              <div className="pb-4 px-2">
                <div className="text-2xl font-semibold text-gray-900">{user.trades || 0}</div>
                <div className="text-sm text-gray-500">Pertukaran</div>
              </div>
              
              <div className="pb-4 px-2">
                <div className="text-2xl font-semibold text-gray-900">{user.followers || 0}</div>
                <div className="text-sm text-gray-500">Pengikut</div>
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
                animate={activeTab === 'plants' ? 'active' : 'inactive'}
                className="pb-4 px-6 font-medium text-sm focus:outline-none"
                onClick={() => setActiveTab('plants')}
              >
                Tanaman Saya
              </motion.button>
              
              <motion.button
                variants={tabVariants}
                animate={activeTab === 'saved' ? 'active' : 'inactive'}
                className="pb-4 px-6 font-medium text-sm focus:outline-none"
                onClick={() => setActiveTab('saved')}
              >
                Disimpan
              </motion.button>
            </div>
            
            {activeTab === 'activity' && (
              <div className="space-y-6">
                {activities.length > 0 ? (
                  activities.map(activity => (
                    <div key={activity.id} className="flex items-start">
                      <div className="h-12 w-12 rounded-md overflow-hidden mr-4">
                        <Image
                          src={activity.image}
                          alt={activity.description}
                          width={48}
                          height={48}
                          objectFit="cover"
                        />
                      </div>
                      <div>
                        <p className="text-gray-900">{activity.description}</p>
                        <p className="text-sm text-gray-500">{activity.date}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <div className="inline-block p-4 bg-gray-100 rounded-full mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">Belum ada aktivitas</h3>
                    <p className="text-sm text-gray-500">Aktivitas Anda akan muncul di sini</p>
                  </div>
                )}
              </div>
            )}
            
            {activeTab === 'plants' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {plants.length > 0 ? (
                  plants.map(plant => (
                    <div key={plant.id} className="bg-gray-50 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
                      <div className="h-40 relative">
                        <Image
                          src={plant.image}
                          alt={plant.name}
                          layout="fill"
                          objectFit="cover"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="text-lg font-medium text-gray-900">{plant.name}</h3>
                        <p className="text-sm text-gray-500">{plant.status}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <div className="inline-block p-4 bg-gray-100 rounded-full mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">Belum ada tanaman</h3>
                    <p className="text-sm text-gray-500">Tambahkan tanaman Anda untuk mulai bertanam dan bertukar</p>
                    <button className="mt-4 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md shadow-sm">
                      Tambah Tanaman
                    </button>
                  </div>
                )}
              </div>
            )}
            
            {activeTab === 'saved' && (
              <div className="text-center py-12">
                <div className="inline-block p-4 bg-gray-100 rounded-full mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">Tidak ada item tersimpan</h3>
                <p className="text-sm text-gray-500">Item yang Anda simpan akan muncul di sini</p>
              </div>
            )}
          </div>
        </motion.div>
      </main>
    
    </div>
  );
}