'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, User, Leaf, MessageCircle } from 'lucide-react';
import NotificationBell from '../NotificationBell';

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
            <Link href="/point-exchange" className="px-3 py-2 rounded-full text-green-600 hover:bg-green-50 font-medium text-sm">
              Tukar Poin
            </Link>
            <Link href="/support" className="px-3 py-2 rounded-full text-green-600 hover:bg-green-50 font-medium text-sm">
              Bantuan
            </Link>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/chat" className="text-green-600 hover:text-green-700 p-2 rounded-full hover:bg-green-50">
              <MessageCircle size={20} />
            </Link>
            <div className="text-green-600 hover:text-green-700 p-2 rounded-full hover:bg-green-50">
              <NotificationBell />
            </div>
            <Link href="/profile" className="text-green-600 hover:text-green-700 p-2 rounded-full hover:bg-green-50">
              <User size={20} />
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
              href="/homepage"
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
              href="/point-exchange"
              className="block px-3 py-2 rounded-lg text-base font-medium hover:bg-green-50 text-green-600"
              onClick={() => setIsOpen(false)}
            >
              Tukar Poin
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
            <div className="flex justify-center gap-6 pt-2">
              <Link href="/chat" className="text-green-600 p-2 rounded-full hover:bg-green-50" onClick={() => setIsOpen(false)}>
                <MessageCircle size={20} />
              </Link>
              <div className="text-green-600 p-2 rounded-full hover:bg-green-50">
                <NotificationBell />
              </div>
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