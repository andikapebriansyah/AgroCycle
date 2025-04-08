'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, CreditCard, Truck } from 'lucide-react';

const Checkout = () => {
  const [selectedShipping, setSelectedShipping] = useState('regular');
  const [selectedPayment, setSelectedPayment] = useState('transfer');
  
  const cartItems = [
    {
      id: 1,
      name: 'Kompos Organik Premium',
      price: 45000,
      quantity: 2,
      image: '/img/compost1.jpg',
      seller: 'Tani Makmur'
    },
    {
      id: 3,
      name: 'Pupuk Kandang Fermentasi',
      price: 25000,
      quantity: 1,
      image: '/img/manure1.jpg',
      seller: 'Organik Jaya'
    }
  ];

  const shippingOptions = [
    { id: 'regular', name: 'Pengiriman Reguler', price: 15000, estimatedDays: '3-5' },
    { id: 'express', name: 'Pengiriman Express', price: 30000, estimatedDays: '1-2' }
  ];

  const paymentMethods = [
    { id: 'transfer', name: 'Transfer Bank' },
    { id: 'ewallet', name: 'E-Wallet' },
    { id: 'cod', name: 'Bayar di Tempat (COD)' }
  ];

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getShippingCost = () => {
    const selectedOption = shippingOptions.find(option => option.id === selectedShipping);
    return selectedOption ? selectedOption.price : 0;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + getShippingCost();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Link href="/cart" className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Kembali ke Keranjang
        </Link>
      </div>
      
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Checkout</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
            <div className="p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Informasi Pengiriman</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                    Nama Depan
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    className="w-full border border-gray-300 rounded-md p-2 text-sm"
                  />
                </div>
                
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                    Nama Belakang
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    className="w-full border border-gray-300 rounded-md p-2 text-sm"
                  />
                </div>
              </div>
              
              <div className="mt-4">
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Nomor Telepon
                </label>
                <input
                  type="tel"
                  id="phone"
                  className="w-full border border-gray-300 rounded-md p-2 text-sm"
                />
              </div>
              
              <div className="mt-4">
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                  Alamat Lengkap
                </label>
                <textarea
                  id="address"
                  rows="3"
                  className="w-full border border-gray-300 rounded-md p-2 text-sm"
                ></textarea>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div>
                  <label htmlFor="province" className="block text-sm font-medium text-gray-700 mb-1">
                    Provinsi
                  </label>
                  <select
                    id="province"
                    className="w-full border border-gray-300 rounded-md p-2 text-sm"
                  >
                    <option>Pilih Provinsi</option>
                    <option>Jawa Barat</option>
                    <option>Jawa Tengah</option>
                    <option>Jawa Timur</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                    Kota/Kabupaten
                  </label>
                  <select
                    id="city"
                    className="w-full border border-gray-300 rounded-md p-2 text-sm"
                  >
                    <option>Pilih Kota</option>
                    <option>Bandung</option>
                    <option>Jakarta</option>
                    <option>Surabaya</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-1">
                    Kode Pos
                  </label>
                  <input
                    type="text"
                    id="postalCode"
                    className="w-full border border-gray-300 rounded-md p-2 text-sm"
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
            <div className="p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Metode Pengiriman</h2>
              
              <div className="space-y-3">
                {shippingOptions.map((option) => (
                  <div 
                    key={option.id}
                    className={`border rounded-md p-4 cursor-pointer ${selectedShipping === option.id ? 'border-green-500 bg-green-50' : 'border-gray-300'}`}
                    onClick={() => setSelectedShipping(option.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`h-5 w-5 rounded-full border flex items-center justify-center ${selectedShipping === option.id ? 'border-green-500' : 'border-gray-300'}`}>
                          {selectedShipping === option.id && (
                            <div className="h-3 w-3 rounded-full bg-green-500"></div>
                          )}
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">{option.name}</p>
                          <p className="text-xs text-gray-500">Estimasi {option.estimatedDays} hari kerja</p>
                        </div>
                      </div>
                      <p className="text-sm font-medium text-gray-900">
                        Rp {option.price.toLocaleString('id-ID')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Metode Pembayaran</h2>
              
              <div className="space-y-3">
                {paymentMethods.map((method) => (
                  <div 
                    key={method.id}
                    className={`border rounded-md p-4 cursor-pointer ${selectedPayment === method.id ? 'border-green-500 bg-green-50' : 'border-gray-300'}`}
                    onClick={() => setSelectedPayment(method.id)}
                  >
                    <div className="flex items-center">
                      <div className={`h-5 w-5 rounded-full border flex items-center justify-center ${selectedPayment === method.id ? 'border-green-500' : 'border-gray-300'}`}>
                        {selectedPayment === method.id && (
                          <div className="h-3 w-3 rounded-full bg-green-500"></div>
                        )}
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">{method.name}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Right Column - Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Ringkasan Pesanan</h2>
              
              <div className="space-y-4 mb-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-start">
                    <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md">
                      <div className="relative h-full w-full">
                        <Image 
                          src="/api/placeholder/100/100"
                          alt={item.name}
                          fill
                          className="object-cover object-center"
                        />
                      </div>
                    </div>
                    <div className="ml-4 flex-1">
                      <h3 className="text-sm font-medium text-gray-900">{item.name}</h3>
                      <p className="mt-1 text-xs text-gray-500">Penjual: {item.seller}</p>
                      <div className="flex justify-between mt-1">
                        <p className="text-xs text-gray-500">{item.quantity} x Rp {item.price.toLocaleString('id-ID')}</p>
                        <p className="text-sm font-medium text-gray-900">
                          Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="border-t pt-4">
                <div className="flex justify-between mb-2">
                  <p className="text-sm text-gray-600">Subtotal</p>
                  <p className="text-sm font-medium text-gray-900">
                    Rp {calculateSubtotal().toLocaleString('id-ID')}
                  </p>
                </div>
                
                <div className="flex justify-between mb-2">
                  <p className="text-sm text-gray-600">Pengiriman</p>
                  <p className="text-sm font-medium text-gray-900">
                    Rp {getShippingCost().toLocaleString('id-ID')}
                  </p>
                </div>
                
                <div className="flex justify-between border-t border-dashed pt-4 mt-4">
                  <p className="text-base font-medium text-gray-900">Total</p>
                  <p className="text-base font-bold text-gray-900">
                    Rp {calculateTotal().toLocaleString('id-ID')}
                  </p>
                </div>
              </div>
              
              <button 
                className="mt-6 w-full bg-green-600 text-white py-3 px-4 rounded-md font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                Selesaikan Pemesanan
              </button>
              
              <p className="mt-4 text-xs text-gray-500 text-center">
                Dengan menyelesaikan pemesanan, Anda menyetujui Syarat dan Ketentuan serta Kebijakan Privasi kami.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;