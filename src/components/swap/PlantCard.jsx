// components/swap/PlantCard.jsx
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import SaveButton from '@/components/SaveButton';
import ChatModal from '@/components/swap/ChatModal';
import { useState } from 'react';

export default function PlantCard({ plant, isSaved, compact = false }) {
  const router = useRouter();
  const [showChatModal, setShowChatModal] = useState(false);

  // Format price with thousand separator
  const formatPrice = (price) => {
    if (price === null || price === undefined) return '0';
    return Number(price).toLocaleString();
  };

  const handleCardClick = (e) => {
    // Don't navigate if clicking on buttons or modal
    if (e.target.closest('button') || e.target.closest('.modal-content')) {
      return;
    }
    router.push(`/plants/${plant.plant_id}`);
  };

  if (compact) {
    return (
      <Link href={`/plants/${plant.plant_id}`}>
        <div className="bg-white border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
          <div className="flex">
            <div className="relative h-20 w-20 flex-shrink-0">
              <Image
                src={plant.image_url?.startsWith("/") ? plant.image_url : "/placeholder.jpg"}
                alt={plant.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-2 flex-grow">
              <h3 className="font-medium text-sm text-gray-900 line-clamp-1">{plant.name}</h3>
              <p className="text-xs text-gray-500 mb-1">{plant.category}</p>
              <p className="text-xs font-medium text-gray-900">
                Rp {parseInt(plant.price_estimation).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <div 
      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="relative h-48">
        <Image 
          src={plant.image_url || "/placeholder.jpg"}
          fill
          alt={plant.name}
          className="object-cover rounded-t-xl"
        />

        <div className="absolute top-3 left-3 bg-green-50 text-green-600 px-3 py-1 rounded-full text-xs font-medium">
          {plant.age} bulan
        </div>

        <div className="absolute top-3 right-3 z-10">
          <SaveButton plantId={plant.plant_id} initialSaved={isSaved} />
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">{plant.name}</h3>
          <span className="bg-green-50 text-green-600 px-2 py-1 rounded-full text-xs font-medium">
            {plant.category}
          </span>
        </div>
        
        <p className="text-gray-500 text-sm mb-3 line-clamp-2">
          {plant.description}
        </p>

        <div className="space-y-1.5 text-sm text-gray-500 mb-4">
          <div className="flex items-center justify-between">
            <span>Kondisi:</span>
            <span className="text-gray-700">{plant.plant_condition}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Ingin ditukar dengan:</span>
            <span className="text-gray-700 text-right flex-1 ml-2">{plant.willing_to_exchange_for}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Estimasi harga:</span>
            <span className="text-gray-700">Rp {formatPrice(plant.price_estimation)}</span>
          </div>
        </div>
        
        <div className="flex items-center mb-4 pb-4 border-b border-gray-100">
          <div className="w-8 h-8 rounded-full mr-2 bg-green-100 flex items-center justify-center text-green-600 font-medium">
            {plant.owner_name?.charAt(0).toUpperCase()}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-700">{plant.owner_name}</span>
            <span className="text-xs text-gray-500">{plant.owner_location}</span>
          </div>
        </div>
        
        <div className="flex justify-between gap-2">
          <button
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full text-sm flex-1 transition-colors font-medium flex items-center justify-center"
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/plants/${plant.plant_id}`);
            }}
          >
            Tukar Tanaman
          </button>

          <button 
            className="border border-green-500 text-green-500 hover:bg-green-50 px-4 py-2 rounded-full text-sm flex-1 transition-colors font-medium"
            onClick={(e) => {
              e.stopPropagation();
              setShowChatModal(true);
            }}
          >
            Chat Pemilik
          </button>
        </div>
      </div>

      {showChatModal && (
        <div className="modal-content" onClick={e => e.stopPropagation()}>
          <ChatModal
            onClose={() => setShowChatModal(false)}
            recipientId={plant.user_id}
            recipientName={plant.owner_name}
            plantId={plant.plant_id}
            plantName={plant.name}
          />
        </div>
      )}
    </div>
  );
}