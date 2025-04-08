'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Trash2, Plus, Minus } from 'lucide-react';

const Cart = () => {
  const cartItems = [
    {
      id: 1,
      name: 'Kompos Organik Premium',
      price: 45000,
      quantity: 2,
      image: '/img/compost1.jpg',
      seller: 'Tani Makmur',
    },
    {
      id: 3,
      name: 'Pupuk Kandang Fermentasi',
      price: 25000,
      quantity: 1,
      image: '/img/manure1.jpg',
      seller: 'Organik Jaya',
    },
  ];

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Keranjang Belanja</h1>
      {cartItems.length > 0 ? (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-6">
            <table className="w-full">
              <thead className="border-b">
                <tr>
                  <th className="text-left py-3 px-2">Produk</th>
                  <th className="text-center py-3 px-2">Harga</th>
                  <th className="text-center py-3 px-2">Jumlah</th>
                  <th className="text-right py-3 px-2">Total</th>
                  <th className="py-3 px-2"></th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => (
                  <tr key={item.id} className="border-b">
                    <td className="py-4 px-2">
                      <div className="flex items-center">
                        <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md relative">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover object-center"
                          />
                        </div>
                        <div className="ml-4">
                          <h3 className="text-sm font-medium text-gray-900">{item.name}</h3>
                          <p className="mt-1 text-xs text-gray-500">Penjual: {item.seller}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-2 text-center">
                      <span className="text-sm">Rp {item.price.toLocaleString('id-ID')}</span>
                    </td>
                    <td className="py-4 px-2">
                      <div className="flex items-center justify-center">
                        <button className="p-1 rounded-md hover:bg-gray-100">
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="mx-2 w-8 text-center">{item.quantity}</span>
                        <button className="p-1 rounded-md hover:bg-gray-100">
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                    <td className="py-4 px-2 text-right">
                      <span className="text-sm font-medium">
                        Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                      </span>
                    </td>
                    <td className="py-4 px-2 text-right">
                      <button className="text-red-500 hover:text-red-700">
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="mt-8 border-t pt-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">
                    Subtotal ({cartItems.reduce((total, item) => total + item.quantity, 0)} produk)
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-gray-900">
                    Rp {calculateSubtotal().toLocaleString('id-ID')}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex justify-between">
                <Link href="/marketplace" className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                  Lanjutkan Belanja
                </Link>
                <Link href="/checkout" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700">
                  Lanjut ke Pembayaran
                </Link>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white p-8 rounded-lg shadow-sm text-center">
          <h2 className="text-xl font-medium text-gray-900 mb-2">Keranjang Belanja Kosong</h2>
          <p className="text-gray-500 mb-6">Anda belum menambahkan produk apapun ke keranjang.</p>
          <Link href="/marketplace" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700">
            Mulai Belanja
          </Link>
        </div>
      )}
    </div>
  );
};

export default Cart;
