'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

export default function ChatPage({ params }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [otherUser, setOtherUser] = useState(null);
  const [plant, setPlant] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const plantId = searchParams.get('plant_id');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/login');
          return;
        }

        if (!plantId) {
          throw new Error('Plant ID is required');
        }

        // Fetch user info
        const userResponse = await fetch(`/api/user/${params.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!userResponse.ok) {
          throw new Error('Failed to fetch user info');
        }

        const userData = await userResponse.json();
        setOtherUser(userData.user);

        // Fetch plant info
        const plantResponse = await fetch(`/api/plants/${plantId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!plantResponse.ok) {
          throw new Error('Failed to fetch plant info');
        }

        const plantData = await plantResponse.json();
        setPlant(plantData);

        // Fetch chat messages
        const chatResponse = await fetch(`/api/chat/${params.id}?plant_id=${plantId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!chatResponse.ok) {
          throw new Error('Failed to fetch messages');
        }

        const chatData = await chatResponse.json();
        setMessages(chatData);

      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    // Set up polling for new messages
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, [params.id, plantId, router]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !plantId) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/chat/${params.id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          message: newMessage,
          plant_id: plantId
        })
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      // Clear input and refresh messages
      setNewMessage('');
      const chatResponse = await fetch(`/api/chat/${params.id}?plant_id=${plantId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (chatResponse.ok) {
        const chatData = await chatResponse.json();
        setMessages(chatData);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Gagal mengirim pesan. Silakan coba lagi.');
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
          onClick={() => router.back()}
          className="text-green-600 hover:text-green-700"
        >
          Kembali
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Chat Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => router.back()}
                className="mr-4 text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
              {otherUser && (
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-lg font-semibold">
                    {otherUser.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">{otherUser.name}</p>
                    <p className="text-xs text-gray-500">{otherUser.location}</p>
                  </div>
                </div>
              )}
            </div>
            {plant && (
              <div className="flex items-center">
                <div className="text-sm text-gray-500">
                  Diskusi tentang:
                </div>
                <Link
                  href={`/plants/${plant.plant_id}`}
                  className="ml-2 text-sm text-green-600 hover:text-green-700 font-medium"
                >
                  {plant.name}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm min-h-[60vh] flex flex-col">
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.sender_id === params.id ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg px-4 py-2 ${
                      message.sender_id === params.id
                        ? 'bg-gray-100 text-gray-900'
                        : 'bg-green-600 text-white'
                    }`}
                  >
                    <p>{message.message}</p>
                    <p className={`text-xs mt-1 ${message.sender_id === params.id ? 'text-gray-500' : 'text-green-100'}`}>
                      {new Date(message.created_at).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Message Input */}
          <div className="border-t p-4">
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Ketik pesan..."
                className="flex-1 rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              />
              <button
                type="submit"
                disabled={!newMessage.trim()}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                Kirim
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
} 