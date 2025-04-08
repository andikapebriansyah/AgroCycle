'use client';

import { useState, useEffect } from 'react';
import { Search, ChevronDown, ChevronUp } from 'lucide-react';
import { filterProducts } from '@/App/services/ProductService';

const ProductFilters = ({ onFilterChange }) => {
  const [categoryOpen, setCategoryOpen] = useState(true);
  const [priceOpen, setPriceOpen] = useState(true);
  const [methodOpen, setMethodOpen] = useState(true);
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState(['all']);
  const [selectedMethods, setSelectedMethods] = useState(['all']);
  const [selectedRating, setSelectedRating] = useState(0);

  // Apply filters when any filter state changes
  useEffect(() => {
    applyFilters();
  }, [searchTerm, selectedCategories, priceRange, selectedMethods, selectedRating]);

  const applyFilters = () => {
    const filters = {
      searchTerm,
      categories: selectedCategories,
      priceRange,
      productionMethods: selectedMethods,
      minRating: selectedRating
    };
    
    const filteredProducts = filterProducts(filters);
    
    // Pass filtered products to parent component
    if (onFilterChange) {
      onFilterChange(filteredProducts);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryChange = (category, checked) => {
    if (category === 'all') {
      setSelectedCategories(checked ? ['all'] : []);
    } else {
      const newCategories = [...selectedCategories.filter(c => c !== 'all')];
      
      if (checked) {
        newCategories.push(category);
      } else {
        const index = newCategories.indexOf(category);
        if (index !== -1) {
          newCategories.splice(index, 1);
        }
      }
      
      setSelectedCategories(newCategories.length === 0 ? ['all'] : newCategories);
    }
  };

  const handleMethodChange = (method, checked) => {
    if (method === 'all') {
      setSelectedMethods(checked ? ['all'] : []);
    } else {
      const newMethods = [...selectedMethods.filter(m => m !== 'all')];
      
      if (checked) {
        newMethods.push(method);
      } else {
        const index = newMethods.indexOf(method);
        if (index !== -1) {
          newMethods.splice(index, 1);
        }
      }
      
      setSelectedMethods(newMethods.length === 0 ? ['all'] : newMethods);
    }
  };

  const handleRatingChange = (rating, checked) => {
    if (checked) {
      setSelectedRating(rating);
    } else if (selectedRating === rating) {
      setSelectedRating(0);
    }
  };

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategories(['all']);
    setPriceRange([0, 100000]);
    setSelectedMethods(['all']);
    setSelectedRating(0);
  };

  return (
    <div className="bg-white p-5 rounded-lg shadow-sm">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Filter</h2>
      
      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Cari produk..."
            className="w-full border border-gray-300 rounded-md p-2 pl-9"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>
      
      {/* Categories */}
      <div className="border-b pb-4 mb-4">
        <button 
          className="flex justify-between items-center w-full font-medium text-left"
          onClick={() => setCategoryOpen(!categoryOpen)}
        >
          <span>Kategori Produk</span>
          {categoryOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
        
        {categoryOpen && (
          <div className="mt-2 space-y-1">
            <div className="flex items-center">
              <input 
                id="category-all" 
                type="checkbox" 
                className="h-4 w-4 text-green-600" 
                checked={selectedCategories.includes('all')}
                onChange={(e) => handleCategoryChange('all', e.target.checked)}
              />
              <label htmlFor="category-all" className="ml-2 text-sm text-gray-700">Semua</label>
            </div>
            <div className="flex items-center">
              <input 
                id="category-compost" 
                type="checkbox" 
                className="h-4 w-4 text-green-600"
                checked={selectedCategories.includes('kompos')}
                onChange={(e) => handleCategoryChange('kompos', e.target.checked)}
              />
              <label htmlFor="category-compost" className="ml-2 text-sm text-gray-700">Kompos</label>
            </div>
            <div className="flex items-center">
              <input 
                id="category-liquid" 
                type="checkbox" 
                className="h-4 w-4 text-green-600"
                checked={selectedCategories.includes('pupuk-cair')}
                onChange={(e) => handleCategoryChange('pupuk-cair', e.target.checked)}
              />
              <label htmlFor="category-liquid" className="ml-2 text-sm text-gray-700">Pupuk Cair</label>
            </div>
            <div className="flex items-center">
              <input 
                id="category-solid" 
                type="checkbox" 
                className="h-4 w-4 text-green-600"
                checked={selectedCategories.includes('pupuk-padat')}
                onChange={(e) => handleCategoryChange('pupuk-padat', e.target.checked)}
              />
              <label htmlFor="category-solid" className="ml-2 text-sm text-gray-700">Pupuk Padat</label>
            </div>
            <div className="flex items-center">
              <input 
                id="category-pesticide" 
                type="checkbox" 
                className="h-4 w-4 text-green-600"
                checked={selectedCategories.includes('pestisida')}
                onChange={(e) => handleCategoryChange('pestisida', e.target.checked)}
              />
              <label htmlFor="category-pesticide" className="ml-2 text-sm text-gray-700">Pestisida Alami</label>
            </div>
          </div>
        )}
      </div>
      
      {/* Price Range */}
      <div className="border-b pb-4 mb-4">
        <button 
          className="flex justify-between items-center w-full font-medium text-left"
          onClick={() => setPriceOpen(!priceOpen)}
        >
          <span>Rentang Harga</span>
          {priceOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
        
        {priceOpen && (
          <div className="mt-2">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Rp {priceRange[0].toLocaleString('id-ID')}</span>
              <span>Rp {priceRange[1].toLocaleString('id-ID')}</span>
            </div>
            <input
              type="range"
              min="0"
              max="100000"
              step="5000"
              className="w-full"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
            />
            <div className="flex space-x-2 mt-2">
              <input
                type="number"
                placeholder="Min"
                className="w-full border border-gray-300 rounded-md p-2 text-sm"
                value={priceRange[0]}
                onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
              />
              <input
                type="number"
                placeholder="Max"
                className="w-full border border-gray-300 rounded-md p-2 text-sm"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 100000])}
              />
            </div>
          </div>
        )}
      </div>
      
      {/* Production Method */}
      <div className="border-b pb-4 mb-4">
        <button 
          className="flex justify-between items-center w-full font-medium text-left"
          onClick={() => setMethodOpen(!methodOpen)}
        >
          <span>Metode Produksi</span>
          {methodOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
        
        {methodOpen && (
          <div className="mt-2 space-y-1">
            <div className="flex items-center">
              <input 
                id="method-all" 
                type="checkbox" 
                className="h-4 w-4 text-green-600" 
                checked={selectedMethods.includes('all')}
                onChange={(e) => handleMethodChange('all', e.target.checked)}
              />
              <label htmlFor="method-all" className="ml-2 text-sm text-gray-700">Semua</label>
            </div>
            <div className="flex items-center">
              <input 
                id="method-home" 
                type="checkbox" 
                className="h-4 w-4 text-green-600"
                checked={selectedMethods.includes('rumahan')}
                onChange={(e) => handleMethodChange('rumahan', e.target.checked)}
              />
              <label htmlFor="method-home" className="ml-2 text-sm text-gray-700">Produksi Rumahan</label>
            </div>
            <div className="flex items-center">
              <input 
                id="method-industry" 
                type="checkbox" 
                className="h-4 w-4 text-green-600"
                checked={selectedMethods.includes('industri')}
                onChange={(e) => handleMethodChange('industri', e.target.checked)}
              />
              <label htmlFor="method-industry" className="ml-2 text-sm text-gray-700">Produksi Industri</label>
            </div>
          </div>
        )}
      </div>
      
      {/* Rating */}
      <div className="mb-4">
        <h3 className="font-medium mb-2">Rating</h3>
        <div className="space-y-1">
          {[5, 4, 3, 2, 1].map((rating) => (
            <div key={rating} className="flex items-center">
              <input
                id={`rating-${rating}`}
                type="checkbox"
                className="h-4 w-4 text-green-600"
                checked={selectedRating === rating}
                onChange={(e) => handleRatingChange(rating, e.target.checked)}
              />
              <label htmlFor={`rating-${rating}`} className="ml-2 flex items-center text-sm text-gray-700">
                {Array(rating).fill().map((_, i) => (
                  <span key={i} className="text-yellow-500">★</span>
                ))}
                {Array(5 - rating).fill().map((_, i) => (
                  <span key={i} className="text-gray-300">★</span>
                ))}
                <span className="ml-1">& Ke Atas</span>
              </label>
            </div>
          ))}
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="flex space-x-2 mt-6">
        <button 
          className="bg-green-600 text-white py-2 px-4 rounded-md w-full hover:bg-green-700"
          onClick={applyFilters}
        >
          Terapkan
        </button>
        <button 
          className="bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-md w-1/3 hover:bg-gray-50"
          onClick={resetFilters}
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default ProductFilters;