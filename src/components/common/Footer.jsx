'use client';

import React from 'react';
import Link from 'next/link';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin, Leaf } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand and Description */}
          <div>
            <div className="flex items-center">
              <Leaf className="h-6 w-6 text-green-500 mr-2" />
              <h2 className="text-xl font-bold text-gray-800">AgroCycle</h2>
            </div>
            <p className="mt-4 text-gray-600 text-sm">
              Platform tukar tambah tanaman dan marketplace kompos untuk mendukung pertanian berkelanjutan.
            </p>
            <div className="mt-6 flex space-x-4">
              <a href="#" aria-label="Facebook" className="text-gray-400 hover:text-green-500 transition duration-150">
                <Facebook size={18} />
              </a>
              <a href="#" aria-label="Twitter" className="text-gray-400 hover:text-green-500 transition duration-150">
                <Twitter size={18} />
              </a>
              <a href="#" aria-label="Instagram" className="text-gray-400 hover:text-green-500 transition duration-150">
                <Instagram size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <nav aria-label="Tautan Cepat">
            <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wider">Tautan Cepat</h3>
            <ul className="mt-4 space-y-2">
              {[
                { href: '/', label: 'Beranda' },
                { href: '/swap', label: 'Swap Market' },
                { href: '/marketplace', label: 'Marketplace' },
                { href: '/sell', label: 'Jual Produk' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-gray-500 hover:text-green-500 text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Layanan */}
          <nav aria-label="Layanan">
            <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wider">Layanan</h3>
            <ul className="mt-4 space-y-2">
              {[
                { href: '/support', label: 'Bantuan & FAQ' },
                { href: '/about', label: 'Tentang Kami' },
                { href: '/terms', label: 'Syarat & Ketentuan' },
                { href: '/privacy', label: 'Kebijakan Privasi' },
                { href: '/partnership', label: 'Program Kemitraan' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-gray-500 hover:text-green-500 text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact Info */}
          <div>
            <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wider">Kontak</h3>
            <ul className="mt-4 space-y-3">
              <li className="flex items-start">
                <MapPin size={18} className="mr-2 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-500 text-sm">
                  Jl. Hijau Asri No. 25, Jakarta Selatan, Indonesia
                </span>
              </li>
              <li className="flex items-center">
                <Phone size={18} className="mr-2 text-green-500" />
                <span className="text-gray-500 text-sm">+62 21 1234 5678</span>
              </li>
              <li className="flex items-center">
                <Mail size={18} className="mr-2 text-green-500" />
                <span className="text-gray-500 text-sm">info@agrocycle.id</span>
              </li>
            </ul>
            <div className="mt-6">
              <h4 className="text-xs font-semibold text-gray-800 mb-2">Berlangganan Newsletter</h4>
              <form className="flex">
                <input
                  type="email"
                  placeholder="Email Anda"
                  className="p-2 text-sm border border-gray-300 rounded-l-md w-full focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                  aria-label="Email Anda"
                />
                <button type="submit" className="bg-green-500 px-4 py-2 rounded-r-md text-white text-sm hover:bg-green-600 transition duration-150">
                  Daftar
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200 text-center">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} AgroCycle. Semua hak dilindungi.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;