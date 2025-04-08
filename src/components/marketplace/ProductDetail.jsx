'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import {
  Star, ShoppingCart, Heart,
  Truck, ShieldCheck, ArrowLeft, Plus, Minus
} from 'lucide-react';

const ProductDetail = ({ product }) => {
  const [quantity, setQuantity] = useState(1);

  const incrementQuantity = () => {
    if (quantity < product.stock) setQuantity(quantity + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Link href="/marketplace" className="flex items-center text-green-600 mb-6">
        <ArrowLeft size={16} className="mr-1" />
        Kembali ke Marketplace
      </Link>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
          {/* Gambar dan galeri */}
          <div>
            <div className="bg-gray-100 rounded-lg overflow-hidden h-80 relative">
              <Image 
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="grid grid-cols-4 gap-2 mt-2">
              {[1, 2, 3, 4].map(index => (
                <div key={index} className="bg-gray-100 rounded-md overflow-hidden h-20 relative">
                  <Image 
                    src= {product.image}
                    alt={`${product.name} - view ${index}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Detail produk */}
          <div>
            <h1 className="text-2xl font-bold">{product.name}</h1>
            <div className="flex items-center mt-2">
              {Array(5).fill().map((_, i) => (
                <Star 
                  key={i} 
                  size={16} 
                  className={i < Math.floor(product.rating) ? "text-yellow-500 fill-current" : "text-gray-300"}
                />
              ))}
              <span className="ml-1 text-sm text-gray-600">{product.rating} ({product.totalReviews} ulasan)</span>
            </div>

            <p className="text-2xl font-bold mt-4">
              Rp {product.price.toLocaleString('id-ID')}
            </p>
            <p className="text-sm text-gray-600">{product.unit}</p>

            <div className="mt-6">
              <h3 className="text-sm font-medium">Deskripsi:</h3>
              <p className="mt-2 text-sm text-gray-600">{product.description}</p>
            </div>

            <div className="mt-4">
              <h3 className="text-sm font-medium">Komposisi:</h3>
              <p className="mt-2 text-sm text-gray-600">{product.composition}</p>
            </div>

            <div className="mt-4">
              <h3 className="text-sm font-medium">Manfaat:</h3>
              <ul className="mt-2 text-sm text-gray-600 space-y-1">
                {product.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-green-500 mr-2">•</span>
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 flex items-center space-x-2">
              <p className="text-sm">Kuantitas:</p>
              <div className="flex items-center border rounded-md">
                <button onClick={decrementQuantity} className="px-3 py-1 text-gray-600 hover:bg-gray-100">
                  <Minus size={16} />
                </button>
                <span className="px-3 py-1 border-l border-r">{quantity}</span>
                <button onClick={incrementQuantity} className="px-3 py-1 text-gray-600 hover:bg-gray-100">
                  <Plus size={16} />
                </button>
              </div>
              <p className="text-sm text-gray-500">Tersedia {product.stock} unit</p>
            </div>

            <div className="mt-6 grid grid-cols-4 gap-2">
              <button className="col-span-3 flex items-center justify-center bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700">
                <ShoppingCart size={18} className="mr-2" />
                Tambahkan ke Keranjang
              </button>
              <button className="flex items-center justify-center border border-gray-300 py-2 px-4 rounded-md hover:bg-gray-100">
                <Heart size={18} />
              </button>
            </div>

            <div className="mt-6 border-t border-gray-200 pt-4">
              <div className="flex items-center">
                <Truck size={16} className="text-green-600" />
                <span className="ml-2 text-sm text-gray-600">Pengiriman ke seluruh wilayah Indonesia</span>
              </div>
              <div className="flex items-center mt-2">
                <ShieldCheck size={16} className="text-green-600" />
                <span className="ml-2 text-sm text-gray-600">Jaminan kualitas dari produsen terpercaya</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
