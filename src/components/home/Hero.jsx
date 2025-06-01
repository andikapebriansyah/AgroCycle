'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Leaf, Recycle, ShoppingBag } from 'lucide-react';

const Hero = () => {
  return (
    <div className="bg-white overflow-hidden">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto pt-6 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col-reverse lg:flex-row items-center gap-8 lg:gap-12">
          {/* Text Content */}
          <div className="w-full lg:w-1/2 z-10">
            <div className="sm:text-center lg:text-left">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800">
                <span className="block">Ekosistem Hijau</span>
                <span className="block text-green-500 mt-2">untuk Masa Depan</span>
              </h1>
              <p className="mt-4 text-gray-600 sm:text-lg max-w-xl">
                Platform tukar tambah tanaman dan marketplace kompos untuk mendukung pertanian berkelanjutan, urban farming, dan ekonomi sirkular di Indonesia.
              </p>
              <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:gap-4 sm:justify-center lg:justify-start">
                <Link
                  href="/swap"
                  className="flex items-center justify-center px-6 py-3 rounded-full text-base font-medium text-white bg-green-500 hover:bg-green-600 transition duration-150 shadow-sm"
                >
                  Mulai Tukar Tanaman
                </Link>
              </div>
            </div>
          </div>

          {/* Image Section */}
          <div className="w-full lg:w-1/2 flex justify-center">
            <div className="w-full h-64 sm:h-80 md:h-96 relative rounded-2xl overflow-hidden shadow-lg">
              <Image
                src="/bgmain.jpeg"
                alt="Tanaman dalam pot dengan latar belakang taman"
                fill
                className="object-cover object-center"
                priority
              />
            </div>
          </div>
        </div>
      </div>

      {/* Feature Highlights */}
      <div className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {/* Feature 1 */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition duration-200">
              <div className="flex items-center">
                <div className="bg-green-100 rounded-full p-3">
                  <Leaf className="h-5 w-5 text-green-500" />
                </div>
                <h3 className="ml-3 text-lg font-medium text-gray-800">PlantSwap</h3>
              </div>
              <p className="mt-4 text-gray-600 text-sm">
                Tukar tanaman dan bibit tanpa perlu membeli. Temukan varietas baru untuk kebunmu.
              </p>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-50 text-green-600">
                  120 poin
                </span>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition duration-200">
              <div className="flex items-center">
                <div className="bg-green-100 rounded-full p-3">
                  <Recycle className="h-5 w-5 text-green-500" />
                </div>
                <h3 className="ml-3 text-lg font-medium text-gray-800">GreenCycle</h3>
              </div>
              <p className="mt-4 text-gray-600 text-sm">
                Marketplace kompos dan pupuk organik dari produsen lokal untuk pertanian berkelanjutan.
              </p>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-50 text-green-600">
                  150 poin
                </span>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition duration-200">
              <div className="flex items-center">
                <div className="bg-green-100 rounded-full p-3">
                  <ShoppingBag className="h-5 w-5 text-green-500" />
                </div>
                <h3 className="ml-3 text-lg font-medium text-gray-800">Jual Produk</h3>
              </div>
              <p className="mt-4 text-gray-600 text-sm">
                Jual hasil pertanian organikmu dan produk daur ulang untuk mendukung ekonomi sirkular.
              </p>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-50 text-green-600">
                  100 poin
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;