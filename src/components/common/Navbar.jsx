'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, User, ShoppingCart, Leaf } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white text-green-600 shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Leaf className="h-6 w-6 text-green-500 mr-2" />
            <Link href="/" className="font-bold text-xl tracking-wide text-green-600">
              AgroCycle
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-1">
            <Link href="/homepage" className="px-3 py-2 rounded-full text-green-600 hover:bg-green-50 font-medium text-sm">
              Beranda
            </Link>
            <Link href="/swap" className="px-3 py-2 rounded-full text-green-600 hover:bg-green-50 font-medium text-sm">
              Swap Market
            </Link>
            <Link href="/marketplace" className="px-3 py-2 rounded-full text-green-600 hover:bg-green-50 font-medium text-sm">
              Marketplace
            </Link>
            <Link href="/support" className="px-3 py-2 rounded-full text-green-600 hover:bg-green-50 font-medium text-sm">
              Bantuan
            </Link>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/cart" className="text-green-600 hover:text-green-700 p-2 rounded-full hover:bg-green-50">
              <ShoppingCart size={20} />
            </Link>
            <Link href="/profile" className="text-green-600 hover:text-green-700 p-2 rounded-full hover:bg-green-50">
              <User size={20} />
            </Link>
            <Link href="/login" className="bg-green-500 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-green-600 transition duration-150 ease-in-out shadow-sm">
              Masuk
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-green-600 hover:text-green-700 focus:outline-none p-2 rounded-full hover:bg-green-50"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white pb-4 px-4 shadow-lg rounded-b-lg">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              href="/"
              className="block px-3 py-2 rounded-lg text-base font-medium hover:bg-green-50 text-green-600"
              onClick={() => setIsOpen(false)}
            >
              Beranda
            </Link>
            <Link
              href="/swap"
              className="block px-3 py-2 rounded-lg text-base font-medium hover:bg-green-50 text-green-600"
              onClick={() => setIsOpen(false)}
            >
              Swap Market
            </Link>
            <Link
              href="/marketplace"
              className="block px-3 py-2 rounded-lg text-base font-medium hover:bg-green-50 text-green-600"
              onClick={() => setIsOpen(false)}
            >
              Marketplace
            </Link>
            <Link
              href="/support"
              className="block px-3 py-2 rounded-lg text-base font-medium hover:bg-green-50 text-green-600"
              onClick={() => setIsOpen(false)}
            >
              Bantuan
            </Link>
          </div>

          <div className="pt-4 flex flex-col gap-3">
            <Link
              href="/login"
              className="bg-green-500 text-white px-4 py-2 rounded-full font-medium text-center hover:bg-green-600 shadow-sm"
              onClick={() => setIsOpen(false)}
            >
              Masuk
            </Link>
            <div className="flex justify-center gap-6 pt-2">
              <Link href="/cart" className="text-green-600 p-2 rounded-full hover:bg-green-50" onClick={() => setIsOpen(false)}>
                <ShoppingCart size={20} />
              </Link>
              <Link href="/profile" className="text-green-600 p-2 rounded-full hover:bg-green-50" onClick={() => setIsOpen(false)}>
                <User size={20} />
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;