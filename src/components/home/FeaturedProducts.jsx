'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Star } from 'lucide-react';
import { getAllProducts } from '@/App/services/ProductService';

const FeaturedProducts = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);

  useEffect(() => {
    const products = getAllProducts();
    // Ambil hanya 4 produk teratas berdasarkan rating (opsional)
    const topProducts = products
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 4);

    setFeaturedProducts(topProducts);
  }, []);

  return (
    <div className="bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Produk Unggulan</h2>
          <Link
            href="/marketplace"
            className="text-green-600 hover:text-green-700 font-medium"
          >
            Lihat Semua
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4">
          {featuredProducts.map((product) => (
            <div key={product.id} className="group relative">
              <div className="w-full min-h-80 bg-gray-200 rounded-md overflow-hidden relative">
                <Image
                  src={product.image}
                  alt={product.name}
                  layout="fill"
                  objectFit="cover"
                  objectPosition="center"
                  className="group-hover:opacity-75 transition duration-200 ease-in-out"
                />
                <div className="absolute top-0 right-0 bg-white px-2 py-1 m-2 rounded shadow-sm">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400" />
                    <span className="ml-1 text-sm font-medium text-gray-900">
                      {product.rating}
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex justify-between">
                <div>
                  <h3 className="text-sm text-gray-700">
                    <Link
                      href={`/product/${product.id}`}
                      className="font-medium text-gray-900 hover:underline"
                    >
                      {product.name}
                    </Link>
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">{product.seller}</p>
                  <div className="mt-1 flex flex-wrap gap-1">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                      {product.unit}
                    </span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                      {product.type}
                    </span>
                  </div>
                </div>
                <p className="text-sm font-medium text-gray-900">
                  Rp {product.price.toLocaleString()}
                </p>
              </div>
              <div className="mt-4">
                <Link
                  href={`/marketplace/product/${product.id}`}
                  className="relative flex bg-green-600 border border-transparent rounded-md py-2 px-8 items-center justify-center text-sm font-medium text-white hover:bg-green-700"
                >
                  Lihat Detail
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturedProducts;
