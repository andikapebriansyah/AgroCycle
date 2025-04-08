'use client'

// components/marketplace/ProductList.jsx
import React, { useState, useEffect } from 'react';
import { Heart, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { getAllProducts, filterProducts } from '@/App/services/ProductService';
import ProductFilters from '@/components/marketplace/ProductFilter';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOption, setSortOption] = useState('relevant');

  useEffect(() => {
    // Simulate loading from API
    setTimeout(() => {
      const fetchedProducts = getAllProducts();
      setAllProducts(fetchedProducts);
      setProducts(fetchedProducts);
      setLoading(false);
    }, 800);
  }, []);

  useEffect(() => {
    if (allProducts.length > 0) {
      sortProducts(products);
    }
  }, [sortOption]);

  const handleFilterChange = (filteredProducts) => {
    setProducts(sortProducts(filteredProducts));
  };

  const sortProducts = (productsToSort) => {
    let sortedProducts = [...productsToSort];
    
    if (sortOption === 'price-low') {
      sortedProducts.sort((a, b) => a.price - b.price);
    } else if (sortOption === 'price-high') {
      sortedProducts.sort((a, b) => b.price - a.price);
    } else if (sortOption === 'rating') {
      sortedProducts.sort((a, b) => b.rating - a.rating);
    }
    
    return sortedProducts;
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  if (loading) {
    return (
      <div className="w-full flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar with filters */}
        <div className="w-full md:w-1/4">
          <ProductFilters onFilterChange={handleFilterChange} />
        </div>
        
        {/* Product listing */}
        <div className="w-full md:w-3/4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Produk ({products.length})</h2>
            <div>
              <select 
                className="form-input py-2 px-3 border rounded-md"
                value={sortOption}
                onChange={handleSortChange}
              >
                <option value="relevant">Paling Relevan</option>
                <option value="price-low">Harga Terendah</option>
                <option value="price-high">Harga Tertinggi</option>
                <option value="rating">Rating Tertinggi</option>
              </select>
            </div>
          </div>

          {products.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <p className="text-gray-500 text-lg">Tidak ada produk yang sesuai dengan filter yang dipilih</p>
              <button 
                onClick={() => handleFilterChange(getAllProducts())}
                className="mt-4 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
              >
                Tampilkan Semua Produk
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <div key={product.id} className="plant-card overflow-hidden bg-white rounded-lg shadow-sm">
                  <Link href={`/marketplace/product/${product.id}`}>
                    <div className="relative h-48 bg-gray-200">
                      <Image 
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                      <button className="absolute top-2 right-2 bg-white rounded-full p-1.5 shadow hover:bg-gray-100">
                        <Heart size={18} className="text-gray-600" />
                      </button>
                    </div>
                  </Link>
                  <div className="p-4">
                    <div className="flex justify-between">
                      <p className="text-sm text-green-600 font-medium">{product.seller}</p>
                      <div className="flex items-center">
                        <span className="text-yellow-500">★</span>
                        <span className="text-sm ml-1">{product.rating}</span>
                      </div>
                    </div>
                    <Link href={`/marketplace/product/${product.id}`}>
                      <h3 className="font-medium text-gray-900 mt-1 hover:text-green-600">{product.name}</h3>
                    </Link>
                    <p className="text-gray-500 text-sm">{product.unit}</p>
                    <div className="mt-3 flex justify-between items-center">
                      <p className="font-bold text-gray-900">Rp {product.price.toLocaleString('id-ID')}</p>
                      <button className="bg-green-600 text-white p-2 rounded-full hover:bg-green-700">
                        <ShoppingCart size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {products.length > 0 && (
            <div className="mt-8 flex justify-center">
              <nav className="relative z-0 inline-flex shadow-sm -space-x-px" aria-label="Pagination">
                <a href="#" className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  &laquo;
                </a>
                <a href="#" className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-green-50 text-sm font-medium text-green-600">1</a>
                <a href="#" className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">2</a>
                <a href="#" className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">3</a>
                <a href="#" className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  &raquo;
                </a>
              </nav>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductList;