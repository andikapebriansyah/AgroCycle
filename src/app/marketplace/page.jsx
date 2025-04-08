import React from 'react';
import ProductList from '@/components/marketplace/ProductList';
import { getAllProducts } from '@/App/services/ProductService';

export const metadata = {
  title: 'Marketplace - Produk Organik',
  description: 'Temukan produk organik berkualitas untuk kebutuhan pertanian Anda',
};

const MarketplacePage = async () => {
  const products = await getAllProducts();

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-green-800">Marketplace</h1>
            <p className="mt-2 text-lg text-gray-600">
              Temukan produk organik berkualitas untuk kebutuhan pertanian Anda
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Product listing */}
            <div className="lg:col-span-4">
              <ProductList products={products} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MarketplacePage;
