// components/swap/SwapFilters.jsx
export default function SwapFilters({ activeFilter, onFilterChange }) {
    const filters = [
      { id: 'all', name: 'Semua' },
      { id: 'Orchid', name: 'Anggrek' },
      { id: 'Citrus', name: 'Jeruk' },
      { id: 'Herb', name: 'Herbal' },
      { id: 'Succulent', name: 'Sukulen' },
      { id: 'Indoor', name: 'Tanaman Dalam Ruangan' },
    ];
  
    return (
      <div className="mb-8">
        <div className="scrollbar-hide overflow-x-auto">
          <div className="flex space-x-2 pb-2">
            {filters.map(filter => (
              <button
                key={filter.id}
                onClick={() => onFilterChange(filter.id)}
                className={`px-4 py-2 rounded-full whitespace-nowrap ${
                  activeFilter === filter.id
                    ? 'bg-green-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
                }`}
              >
                {filter.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }