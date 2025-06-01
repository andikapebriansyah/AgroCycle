import { Search } from 'lucide-react';

export default function SearchBar({ onSearch }) {
  return (
    <div className="relative mb-6">
      <div className="relative">
        <input
          type="text"
          placeholder="Cari tanaman berdasarkan nama, kategori, atau deskripsi..."
          className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          onChange={(e) => onSearch(e.target.value)}
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
      </div>
    </div>
  );
} 