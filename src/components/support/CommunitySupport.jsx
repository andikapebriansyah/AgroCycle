// src/app/components/support/CommunitySupport.jsx
'use client';

import { Users, Calendar, MapPin, ExternalLink, MessageCircle } from 'lucide-react';

export default function CommunitySupport() {
  // Mock community forums data
  const communityForums = [
    {
      id: 1,
      title: 'Forum Tanaman Hias',
      description: 'Diskusikan tips perawatan, varietas, dan masalah umum tanaman hias',
      memberCount: 1245,
      lastActive: '5 menit yang lalu'
    },
    {
      id: 2,
      title: 'Komunitas Urban Farming',
      description: 'Berbagi pengalaman bertani di lahan terbatas dan perkotaan',
      memberCount: 873,
      lastActive: '2 jam yang lalu'
    },
    {
      id: 3,
      title: 'Diskusi Kompos & Pupuk Organik',
      description: 'Tanya jawab seputar pembuatan dan penggunaan kompos dan pupuk organik',
      memberCount: 654,
      lastActive: 'Hari ini'
    }
  ];

  // Mock community events data
  const upcomingEvents = [
    {
      id: 1,
      title: 'Workshop Pembuatan Kompos',
      date: '15 April 2025',
      time: '09:00 - 12:00',
      location: 'Taman Menteng, Jakarta Pusat',
      isOnline: false,
      link: null
    },
    {
      id: 2,
      title: 'Webinar Aquaponik untuk Pemula',
      date: '23 April 2025',
      time: '19:30 - 21:00',
      location: null,
      isOnline: true,
      link: 'https://meet.agrocycle.id/aquaponic-webinar'
    },
    {
      id: 3,
      title: 'Swap Meet Tanaman Hias',
      date: '5 Mei 2025',
      time: '10:00 - 15:00',
      location: 'Kebun Raya Bogor',
      isOnline: false,
      link: null
    }
  ];

  // Mock support groups data
  const localSupportGroups = [
    {
      id: 1,
      name: 'Komunitas Petani Urban Jakarta',
      area: 'Jakarta & sekitarnya',
      memberCount: 328,
      contact: 'jakarta@agrocycle.id'
    },
    {
      id: 2,
      name: 'Pecinta Tanaman Hias Bandung',
      area: 'Bandung & sekitarnya',
      memberCount: 215,
      contact: 'plantlovers.bdg@agrocycle.id'
    },
    {
      id: 3,
      name: 'Surabaya Green Community',
      area: 'Surabaya & sekitarnya',
      memberCount: 187,
      contact: 'surabaya.green@agrocycle.id'
    },
    {
      id: 4,
      name: 'Bali Organic Farming',
      area: 'Bali',
      memberCount: 173,
      contact: 'bali.organic@agrocycle.id'
    }
  ];

  return (
    <div>
      <h2 className="text-2xl font-semibold text-green-700 mb-4">Dukungan Komunitas</h2>
      <p className="text-gray-600 mb-8">
        Bergabunglah dengan komunitas AgroCycle untuk mendapatkan bantuan dan berbagi pengetahuan dengan sesama penggemar tanaman dan pertanian berkelanjutan.
      </p>

      {/* Community Forums Section */}
      <div className="mb-10">
        <h3 className="text-xl font-medium text-green-600 mb-4 flex items-center">
          <MessageCircle size={20} className="mr-2" />
          Forum Komunitas
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {communityForums.map(forum => (
            <div key={forum.id} className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
              <h4 className="font-medium text-lg mb-2">{forum.title}</h4>
              <p className="text-gray-600 text-sm mb-4">{forum.description}</p>
              <div className="flex justify-between items-center">
                <div className="flex items-center text-gray-500 text-sm">
                  <Users size={16} className="mr-1" />
                  <span>{forum.memberCount} anggota</span>
                </div>
                <div className="text-green-600 text-sm">
                  <span>Aktif {forum.lastActive}</span>
                </div>
              </div>
              <button className="mt-4 w-full px-4 py-2 bg-green-50 text-green-700 border border-green-200 rounded-lg hover:bg-green-100 transition-colors">
                Gabung Forum
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Events Section */}
      <div className="mb-10">
        <h3 className="text-xl font-medium text-green-600 mb-4 flex items-center">
          <Calendar size={20} className="mr-2" />
          Acara Mendatang
        </h3>
        <div className="space-y-4">
          {upcomingEvents.map(event => (
            <div key={event.id} className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                <div>
                  <h4 className="font-medium text-lg mb-1">{event.title}</h4>
                  <div className="flex items-center text-gray-600 mb-1">
                    <Calendar size={16} className="mr-2" />
                    <span>{event.date}, {event.time}</span>
                  </div>
                  {event.location && (
                    <div className="flex items-center text-gray-600">
                      <MapPin size={16} className="mr-2" />
                      <span>{event.location}</span>
                    </div>
                  )}
                  {event.isOnline && (
                    <div className="flex items-center text-gray-600">
                      <ExternalLink size={16} className="mr-2" />
                      <span>Acara Online</span>
                    </div>
                  )}
                </div>
                <div className="mt-4 md:mt-0">
                  <button className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                    {event.isOnline ? 'Daftar Webinar' : 'Daftar Hadir'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 text-center">
          <button className="inline-flex items-center text-green-600 hover:text-green-700">
            Lihat Semua Acara
            <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </button>
        </div>
      </div>

      {/* Local Support Groups Section */}
      <div>
        <h3 className="text-xl font-medium text-green-600 mb-4 flex items-center">
          <Users size={20} className="mr-2" />
          Komunitas Lokal
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-4 text-left text-gray-700 font-medium">Nama Komunitas</th>
                <th className="py-3 px-4 text-left text-gray-700 font-medium">Area</th>
                <th className="py-3 px-4 text-left text-gray-700 font-medium">Anggota</th>
                <th className="py-3 px-4 text-left text-gray-700 font-medium">Kontak</th>
                <th className="py-3 px-4 text-left text-gray-700 font-medium"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {localSupportGroups.map(group => (
                <tr key={group.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 text-gray-800">{group.name}</td>
                  <td className="py-3 px-4 text-gray-600">{group.area}</td>
                  <td className="py-3 px-4 text-gray-600">{group.memberCount}</td>
                  <td className="py-3 px-4 text-gray-600">{group.contact}</td>
                  <td className="py-3 px-4">
                    <button className="px-3 py-1 text-green-600 border border-green-200 rounded hover:bg-green-50 transition-colors">
                      Hubungi
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>    
          </table>
        </div>
      </div>
    </div>
  );
}