'use client'

// src/components/home/InteractiveMap.jsx (updated with map background)
import React, { useState } from 'react';
import { MapPin, Leaf, ShoppingBag, X } from 'lucide-react';

const InteractiveMap = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [selectedActivity, setSelectedActivity] = useState(null);
  
  // Mock data for map activities
  const mapActivities = [
    {
      id: 1,
      type: 'swap',
      title: 'Barter Tanaman Hias',
      description: 'Tukar tambah berbagai jenis tanaman hias indoor',
      location: 'Jakarta Selatan',
      date: '2 April 2025',
      participants: 12,
      x: 30,
      y: 40
    },
    {
      id: 2,
      type: 'marketplace',
      title: 'Kompos Organik Premium',
      description: 'Jual kompos hasil pengolahan sampah rumah tangga',
      location: 'Bandung',
      date: '5 April 2025',
      seller: 'Tani Maju',
      x: 55,
      y: 60
    },
    {
      id: 3,
      type: 'swap',
      title: 'Tukar Bibit Sayuran',
      description: 'Pertukaran bibit sayuran organik',
      location: 'Surabaya',
      date: '7 April 2025',
      participants: 8,
      x: 80,
      y: 30
    },
    {
      id: 4,
      type: 'marketplace',
      title: 'Pupuk Cair Daun',
      description: 'Jual pupuk cair berbahan daun fermentasi',
      location: 'Yogyakarta',
      date: '3 April 2025',
      seller: 'Organik Sehat',
      x: 45,
      y: 70
    },
    {
      id: 5,
      type: 'swap',
      title: 'Barter Buah Eksotis',
      description: 'Tukar tambah bibit buah-buahan eksotis',
      location: 'Bali',
      date: '10 April 2025',
      participants: 15,
      x: 70,
      y: 20
    }
  ];

  const filteredActivities = activeTab === 'all' ? 
    mapActivities : 
    mapActivities.filter(activity => activity.type === activeTab);

  return (
    <div className="bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Aktivitas di Sekitarmu</h2>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
            Temukan aktivitas barter dan penjualan produk organik di dekat lokasimu
          </p>
        </div>

        {/* Tab navigation */}
        <div className="flex justify-center mb-8">
          <nav className="flex space-x-4">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                activeTab === 'all'
                  ? 'bg-green-100 text-green-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Semua Aktivitas
            </button>
            <button
              onClick={() => setActiveTab('swap')}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                activeTab === 'swap'
                  ? 'bg-green-100 text-green-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Barter Tanaman
            </button>
            <button
              onClick={() => setActiveTab('marketplace')}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                activeTab === 'marketplace'
                  ? 'bg-green-100 text-green-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Jual Beli Produk
            </button>
          </nav>
        </div>

        {/* Interactive Map */}
        <div className="relative rounded-lg overflow-hidden shadow-lg" style={{ height: '500px' }}>
          {/* Map background with Indonesia map */}
          <div className="w-full h-full bg-green-50 relative">
            {/* Map SVG background - simplified Indonesia map */}
            <svg
              className="absolute inset-0 w-full h-full"
              viewBox="0 0 1000 500"
              preserveAspectRatio="xMidYMid slice"
            >
              {/* Base map background */}
              <rect x="0" y="0" width="1000" height="500" fill="#e6f2ff" />
              
              {/* Simplified Indonesia map shapes */}
              <path
                d="M150,200 C180,180 220,190 250,200 C280,210 310,220 340,210 C370,200 400,180 430,190 C460,200 490,220 520,210 C550,200 580,180 610,190 C640,200 670,220 700,210 C730,200 760,180 790,190 C820,200 850,220 880,210"
                stroke="#a5d6a7"
                strokeWidth="40"
                fill="none"
                opacity="0.7"
              />
              <path
                d="M250,250 C280,240 310,230 340,240 C370,250 400,270 430,260 C460,250 490,230 520,240 C550,250 580,270 610,260 C640,250 670,230 700,240"
                stroke="#81c784"
                strokeWidth="30"
                fill="none"
                opacity="0.7"
              />
              <path
                d="M550,300 C580,290 610,280 640,290 C670,300 700,320 730,310 C760,300 790,280 820,290"
                stroke="#66bb6a"
                strokeWidth="25"
                fill="none"
                opacity="0.7"
              />
              
              {/* Map details */}
              <circle cx="200" cy="200" r="15" fill="#4caf50" opacity="0.6" />
              <circle cx="300" cy="220" r="10" fill="#4caf50" opacity="0.6" />
              <circle cx="400" cy="200" r="12" fill="#4caf50" opacity="0.6" />
              <circle cx="500" cy="230" r="14" fill="#4caf50" opacity="0.6" />
              <circle cx="600" cy="200" r="11" fill="#4caf50" opacity="0.6" />
              <circle cx="700" cy="220" r="13" fill="#4caf50" opacity="0.6" />
              <circle cx="800" cy="200" r="9" fill="#4caf50" opacity="0.6" />
              
              {/* Water details */}
              <path
                d="M100,350 C150,330 200,340 250,330 C300,320 350,330 400,350 C450,370 500,360 550,340 C600,320 650,330 700,350 C750,370 800,360 850,340 C900,320 950,330 1000,350"
                stroke="#bbdefb"
                strokeWidth="60"
                fill="none"
                opacity="0.5"
              />
              
              {/* City markers */}
              <circle cx="300" cy="200" r="5" fill="#1b5e20" />
              <text x="300" y="185" fontSize="12" fill="#1b5e20" textAnchor="middle">Jakarta</text>
              
              <circle cx="550" cy="240" r="5" fill="#1b5e20" />
              <text x="550" y="225" fontSize="12" fill="#1b5e20" textAnchor="middle">Bandung</text>
              
              <circle cx="800" cy="180" r="5" fill="#1b5e20" />
              <text x="800" y="165" fontSize="12" fill="#1b5e20" textAnchor="middle">Surabaya</text>
              
              <circle cx="450" cy="260" r="5" fill="#1b5e20" />
              <text x="450" y="245" fontSize="12" fill="#1b5e20" textAnchor="middle">Yogyakarta</text>
              
              <circle cx="700" cy="150" r="5" fill="#1b5e20" />
              <text x="700" y="135" fontSize="12" fill="#1b5e20" textAnchor="middle">Bali</text>
              
              {/* Compass */}
              <circle cx="90" cy="90" r="30" fill="white" fillOpacity="0.8" stroke="#ccc" />
              <text x="90" y="75" fontSize="14" fill="#555" textAnchor="middle">N</text>
              <text x="90" y="115" fontSize="14" fill="#555" textAnchor="middle">S</text>
              <text x="65" y="95" fontSize="14" fill="#555" textAnchor="middle">W</text>
              <text x="115" y="95" fontSize="14" fill="#555" textAnchor="middle">E</text>
              <line x1="90" y1="60" x2="90" y2="120" stroke="#555" strokeWidth="1" />
              <line x1="60" y1="90" x2="120" y2="90" stroke="#555" strokeWidth="1" />
            </svg>
            
            {/* Activity pins */}
            {filteredActivities.map((activity) => (
              <div 
                key={activity.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10"
                style={{ 
                  left: `${activity.x}%`, 
                  top: `${activity.y}%` 
                }}
              >
                <div 
                  className={`
                    flex items-center justify-center w-10 h-10 rounded-full 
                    ${activity.type === 'swap' ? 'bg-blue-500' : 'bg-green-500'}
                    cursor-pointer hover:scale-110 transition-transform duration-200 shadow-lg
                  `}
                  onClick={() => setSelectedActivity(activity)}
                >
                  {activity.type === 'swap' ? (
                    <Leaf className="h-5 w-5 text-white" />
                  ) : (
                    <ShoppingBag className="h-5 w-5 text-white" />
                  )}
                </div>
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 text-xs font-medium text-gray-700 bg-white px-2 py-1 rounded-md shadow-sm">
                  {activity.location}
                </div>
              </div>
            ))}
            
            {/* Activity Detail Popup */}
            {selectedActivity && (
              <div 
                className="absolute bg-white rounded-lg shadow-lg p-4 max-w-xs z-20"
                style={{
                  left: `${selectedActivity.x > 70 ? selectedActivity.x - 30 : selectedActivity.x + 10}%`,
                  top: `${selectedActivity.y > 70 ? selectedActivity.y - 30 : selectedActivity.y + 10}%`
                }}
              >
                <button 
                  className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                  onClick={() => setSelectedActivity(null)}
                >
                  <X className="h-4 w-4" />
                </button>
                <h3 className="font-bold text-lg text-gray-900">{selectedActivity.title}</h3>
                <div className="flex items-center mt-1 text-sm text-gray-600">
                  <MapPin className="h-4 w-4 mr-1" />
                  {selectedActivity.location}
                </div>
                <p className="mt-2 text-sm text-gray-600">{selectedActivity.description}</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs font-medium bg-gray-100 text-gray-700 px-2 py-1 rounded-md">
                    {selectedActivity.date}
                  </span>
                  {selectedActivity.type === 'swap' ? (
                    <span className="text-xs font-medium bg-blue-100 text-blue-800 px-2 py-1 rounded-md">
                      {selectedActivity.participants} peserta
                    </span>
                  ) : (
                    <span className="text-xs font-medium bg-green-100 text-green-800 px-2 py-1 rounded-md">
                      {selectedActivity.seller}
                    </span>
                  )}
                </div>
                <button className="mt-4 w-full bg-green-600 text-white text-sm font-medium py-2 px-4 rounded hover:bg-green-700 transition-colors">
                  {selectedActivity.type === 'swap' ? 'Gabung Barter' : 'Lihat Produk'}
                </button>
              </div>
            )}
          </div>
        </div>
        
        {/* Legend */}
        <div className="mt-4 flex justify-center space-x-8">
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-blue-500 mr-2"></div>
            <span className="text-sm text-gray-600">Barter Tanaman</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-green-500 mr-2"></div>
            <span className="text-sm text-gray-600">Jual Beli Produk</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteractiveMap;