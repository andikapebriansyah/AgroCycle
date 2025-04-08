// components/swap/PlantCard.jsx
import Image from 'next/image';
import Link from 'next/link';
export default function PlantCard({ plant }) {
  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100">
      <div className="relative h-48">
      <Image 
        src={plant.imageUrl?.startsWith("/") ? plant.imageUrl : "/placeholder.jpg"}
        fill
        alt={plant.name}
      />

        <div className="absolute top-3 right-3 bg-green-50 text-green-600 px-3 py-1 rounded-full text-xs font-medium">
          {plant.age || "Dewasa"}
        </div>
        {plant.distance && (
          <div className="absolute bottom-3 left-3 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-xs">
            {plant.distance} km dari lokasi Anda
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold text-gray-800">{plant.name}</h3>
          <span className="bg-green-50 text-green-600 px-2 py-1 rounded-full text-xs font-medium">
            {plant.category}
          </span>
        </div>
        
        <p className="text-gray-500 text-sm mt-2 line-clamp-2">
          {plant.description}
        </p>
        
        <div className="mt-4 flex items-center">
          <img 
            src={plant.owner?.avatar || "/api/placeholder/40/40"} 
            alt={plant.owner?.name || "Pemilik tanaman"}
            className="w-8 h-8 rounded-full mr-2 border-2 border-green-50"
          />
          <span className="text-sm text-gray-600">{plant.owner?.name || "Anonimus"}</span>
        </div>
        
        <div className="mt-4 flex justify-between gap-2">
        <Link
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full text-sm flex-1 transition-colors font-medium flex items-center justify-center"
          href="/cart">
          Tukar Tanaman
        </Link>

          <button className="border border-green-500 text-green-500 hover:bg-green-50 px-4 py-2 rounded-full text-sm flex-1 transition-colors font-medium">
            Chat Pemilik
          </button>
        </div>
      </div>
    </div>
  );
}