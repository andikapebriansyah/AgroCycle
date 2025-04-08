'use client'

// pages/profile.js
import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function Profile() {
  // Mock user data - in a real app, you would fetch this from your API
  const [user, setUser] = useState({
    name: 'Andika Pebriansyah',
    email: 'budi@example.com',
    location: 'Jakarta, Indonesia',
    bio: 'Urban farmer passionate about sustainable agriculture and community gardening.',
    joinDate: 'Januari 2023',
    plants: 12,
    trades: 8,
    followers: 34
  });

  // Mock activity data
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

  // Mock plants data
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Profil | AgroCycle</title>
        <meta name="description" content="Halaman profil pengguna AgroCycle" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
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
              </div>
              
              <button className="px-4 py-2 bg-green-500 hover:bg-green-700 text-white rounded-md shadow-sm">
                Edit Profil
              </button>
            </div>
            
            <p className="text-gray-700 mb-6">{user.bio}</p>
            
            <div className="flex items-center text-sm text-gray-500 mb-8">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>Bergabung sejak {user.joinDate}</span>
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
                {activities.map(activity => (
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
                ))}
              </div>
            )}
            
            {activeTab === 'plants' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {plants.map(plant => (
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
                ))}
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
          <div className="border-t border-gray-200 mt-6 pt-6 text-center text-gray-500">
            <p>&copy; {new Date().getFullYear()} AgroCycle. Hak Cipta Dilindungi.</p>
          </div>
        </div>
  );
}

            