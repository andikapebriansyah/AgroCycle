'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import ChatModal from '@/components/swap/ChatModal';

export default function ChatPage() {
  const router = useRouter();
  const [conversations, setConversations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedChat, setSelectedChat] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const loadConversations = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/login');
          return;
        }

        // Get user ID first
        const userResponse = await fetch('/api/user/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!userResponse.ok) {
          throw new Error('Failed to get user info');
        }

        const userData = await userResponse.json();
        setUserId(userData.userId);

        // Then get conversations
        const response = await fetch('/api/chat/conversations', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to load conversations');
        }

        const data = await response.json();
        setConversations(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadConversations();
  }, [router]);

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
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
    <div className="min-h-screen bg-gray-50 p-4">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Pesan</h1>

      <div className="max-w-4xl mx-auto space-y-4">
        {conversations.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
            Belum ada percakapan
          </div>
        ) : (
          conversations.map((conversation) => (
            <div
              key={`${conversation.plant_id}-${conversation.other_user_id}`}
              className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelectedChat(conversation)}
            >
              <div className="flex items-start gap-4">
                {conversation.plant_image && (
                  <Image
                    src={conversation.plant_image}
                    alt={conversation.plant_name}
                    width={60}
                    height={60}
                    className="rounded-lg object-cover"
                  />
                )}
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">
                    {conversation.other_user_name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Diskusi tentang: {conversation.plant_name}
                  </p>
                  <div className="mt-2">
                    <p className="text-sm text-gray-800">
                      <span className="text-gray-500">
                        {conversation.last_message_sender_id === userId ? 'Anda: ' : `${conversation.other_user_name}: `}
                      </span>
                      {conversation.last_message}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatTimestamp(conversation.last_message_time)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {selectedChat && (
        <ChatModal
          onClose={() => setSelectedChat(null)}
          recipientId={selectedChat.other_user_id}
          recipientName={selectedChat.other_user_name}
          plantId={selectedChat.plant_id}
          plantName={selectedChat.plant_name}
        />
      )}
    </div>
  );
} 