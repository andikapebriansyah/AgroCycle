'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import PlantCard from '@/components/swap/PlantCard';
import ProfileImageUpload from '@/components/profile/ProfileImageUpload';
import EditProfileModal from '@/components/profile/EditProfileModal';

export default function UserProfile({ params }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [plants, setPlants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/login');
          return;
        }

        // Get current user info first
        const meResponse = await fetch('/api/user/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!meResponse.ok) {
          throw new Error('Failed to get current user info');
        }

        const meData = await meResponse.json();
        setCurrentUser(meData);

        // Get user profile
        const response = await fetch(`/api/user/${params.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user profile');
        }

        const data = await response.json();
        setUser(data.user);
        setPlants(data.plants);
        setIsFollowing(Boolean(data.user.isFollowing));
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [params.id, router]);

  const handleFollowToggle = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Optimistic update
      const newIsFollowing = !isFollowing;
      setIsFollowing(newIsFollowing);
      setUser(prev => ({
        ...prev,
        followers: newIsFollowing ? prev.followers + 1 : prev.followers - 1
      }));

      const response = await fetch('/api/user/follow', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: user.user_id,
          action: !newIsFollowing ? 'follow' : 'unfollow'
        })
      });

      const data = await response.json();

      if (!response.ok) {
        // Revert optimistic update if request fails
        setIsFollowing(!newIsFollowing);
        setUser(prev => ({
          ...prev,
          followers: !newIsFollowing ? prev.followers + 1 : prev.followers - 1
        }));
        throw new Error(data.message || 'Failed to update follow status');
      }

      // Update state based on server response
      setIsFollowing(data.isFollowing);
      setUser(prev => ({
        ...prev,
        followers: data.isFollowing ? prev.followers + 1 : prev.followers - 1
      }));

    } catch (error) {
      console.error('Error toggling follow:', error);
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

  if (!user) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p className="text-gray-500">Pengguna tidak ditemukan</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="h-32 bg-white relative">
            <div className="absolute -bottom-16 left-8">
              {currentUser && currentUser.user_id === user.user_id ? (
                <ProfileImageUpload
                  currentImage={user.profile_image}
                  onImageUpdate={(updatedUser) => {
                    setUser(prev => ({
                      ...prev,
                      profile_image: updatedUser.profile_image
                    }));
                  }}
                />
              ) : (
                <div className="h-32 w-32 border-4 border-white rounded-full overflow-hidden">
                  <Image
                    src={user.profile_image || "/placeholder.jpg"}
                    alt={`${user.name}'s Profile Picture`}
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
              )}
            </div>
          </div>
          
          <div className="pt-20 px-8 pb-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
                <p className="text-gray-500">{user.location}</p>
              </div>
              
              {currentUser && currentUser.user_id === user.user_id ? (
                <button
                  onClick={() => setShowEditModal(true)}
                  className="px-6 py-2 rounded-full text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                >
                  Edit Profil
                </button>
              ) : currentUser && (
                <button
                  onClick={handleFollowToggle}
                  className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                    isFollowing
                      ? 'bg-green-50 text-green-600 hover:bg-red-50 hover:text-red-600'
                      : 'bg-green-500 text-white hover:bg-green-600'
                  }`}
                >
                  {isFollowing ? (
                    <span className="flex items-center">
                      <span className="mr-1">✓</span> Mengikuti
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <span className="mr-1">+</span> Ikuti
                    </span>
                  )}
                </button>
              )}
            </div>
            
            <p className="text-gray-700 mb-6">{user.bio || 'Belum ada deskripsi.'}</p>
            
            <div className="flex items-center text-sm text-gray-500 mb-8">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>Bergabung sejak {new Date(user.join_date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long' })}</span>
            </div>
            
            <div className="flex space-x-8 border-b border-gray-200 mb-8">
              <div className="pb-4 px-2">
                <div className="text-2xl font-semibold text-gray-900">{plants.length}</div>
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
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-6">Tanaman {user.name}</h2>
              {plants.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {plants.map(plant => (
                    <PlantCard key={plant.plant_id} plant={plant} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">Belum ada tanaman yang ditambahkan</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {showEditModal && (
        <EditProfileModal
          user={user}
          onClose={() => setShowEditModal(false)}
          onUpdate={(updatedUser) => {
            setUser(prev => ({
              ...prev,
              ...updatedUser
            }));
            setShowEditModal(false);
          }}
        />
      )}
    </div>
  );
} 