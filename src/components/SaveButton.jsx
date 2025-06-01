'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SaveButton({ plantId, initialSaved = false }) {
  const [isSaved, setIsSaved] = useState(initialSaved);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSave = async (e) => {
    e.stopPropagation(); // Prevent event bubbling
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const method = isSaved ? 'DELETE' : 'POST';
      const response = await fetch('/api/plants/save', {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ plant_id: plantId }),
      });

      if (!response.ok) {
        throw new Error('Failed to save plant');
      }

      setIsSaved(!isSaved);
      router.refresh();
    } catch (error) {
      console.error('Error saving plant:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleSave}
      disabled={isLoading}
      className={`p-2 rounded-full hover:bg-gray-100 transition-colors ${
        isLoading ? 'opacity-50' : ''
      }`}
      title={isSaved ? 'Hapus dari simpanan' : 'Simpan tanaman'}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill={isSaved ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={isSaved ? 'text-green-600' : 'text-gray-600'}
      >
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
      </svg>
    </button>
  );
} 