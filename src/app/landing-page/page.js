'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Leaf } from 'lucide-react';

export default function LandingPage() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div id="no-global-layout" className="min-h-screen bg-gradient-to-b from-green-50 to-white overflow-hidden">
      <header className="py-4 px-6 md:px-10 flex justify-between items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center"
        >
          <div className="flex-shrink-0 flex items-center">
            <Leaf className="h-6 w-6 text-green-500 mr-2" />
            <Link href="/" className="font-bold text-xl tracking-wide text-green-600">
              AgroCycle
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link href="/login" className="px-5 py-2 rounded-full bg-white text-green-600 border border-green-600 font-medium hover:bg-green-50 transition-colors duration-300">
              Masuk
          </Link>
        </motion.div>
      </header>

      <main className="container mx-auto px-6 md:px-10 pt-10 md:pt-20">
        <motion.div
          className="flex flex-col md:flex-row items-center justify-between"
          variants={containerVariants}
          initial="hidden"
          animate={isLoaded ? "visible" : "hidden"}
        >
          <div className="w-full md:w-1/2 mb-10 md:mb-0">
            <motion.h1
              variants={itemVariants}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-4"
            >
              Solusi <span className="text-green-500">Hijau</span> untuk Masa Depan Indonesia
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-lg md:text-xl text-gray-600 mb-8"
            >
              Platform tukar tambah tanaman, marketplace kompos, dan jual beli produk organik untuk mendukung pertanian berkelanjutan dan ekonomi sirkular.
            </motion.p>

            <motion.div variants={itemVariants}>
              <Link href="/login" className="px-8 py-3 bg-green-500 hover:bg-green-600 text-white rounded-full font-semibold text-lg transition-colors duration-300 inline-block shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                  Mulai Sekarang
              </Link>
            </motion.div>
          </div>

          <motion.div
            variants={itemVariants}
            className="w-full md:w-1/2 relative h-64 md:h-96"
          >
            <Image
              src="/placeholder.jpg"
              alt="Urban Farming Illustration"
              layout="fill"
              objectFit="cover"
              className="rounded-xl shadow-xl"
            />
          </motion.div>
        </motion.div>

        <motion.div
          className="mt-24 mb-16"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-16">Fitur Utama Kami</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Fitur 1 */}
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Tukar Tanaman</h3>
              <p className="text-gray-600">Tukar tanaman dan bibit tanpa perlu membeli. Temukan varietas baru untuk kebunmu.</p>
            </div>

            {/* Fitur 2 */}
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Marketplace Kompos</h3>
              <p className="text-gray-600">Marketplace kompos dan pupuk organik dari produsen lokal untuk pertanian berkelanjutan.</p>
            </div>

            {/* Fitur 3 */}
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Jual Produk</h3>
              <p className="text-gray-600">Jual hasil pertanian organikmu dan produk daur ulang untuk mendukung ekonomi sirkular.</p>
            </div>
          </div>
        </motion.div>
      </main>

      <footer className="bg-gray-50 py-10 mt-20">
        <div className="container mx-auto px-6 md:px-10">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
            <Leaf className="h-6 w-6 text-green-500 mr-2" />
            <Link href="/" className="font-bold text-xl tracking-wide text-green-600">
              AgroCycle
            </Link>
          </div>
              </div>
              <p className="text-gray-500 mt-2">Ekosistem Hijau untuk Masa Depan</p>
            </div>

            <div className="flex space-x-6">
              <a href="#" className="text-gray-600 hover:text-green-600 transition-colors duration-300">
                Tentang Kami
              </a>
              <a href="#" className="text-gray-600 hover:text-green-600 transition-colors duration-300">
                Bantuan
              </a>
              <a href="#" className="text-gray-600 hover:text-green-600 transition-colors duration-300">
                Kontak
              </a>
            </div>
          </div>

          <div className="border-t border-gray-200 mt-8 pt-8 text-center text-gray-500">
            <p>&copy; {new Date().getFullYear()} AgroCycle. Hak Cipta Dilindungi.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
