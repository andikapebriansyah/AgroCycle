// src/app/components/support/FAQSection.jsx
'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Search } from 'lucide-react';

export default function FAQSection() {
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaqId, setOpenFaqId] = useState(null);

  // Mock FAQ data
  const faqCategories = [
    {
      id: 1,
      title: 'Umum',
      faqs: [
        {
          id: 101,
          question: 'Apa itu AgroCycle?',
          answer: 'AgroCycle adalah platform yang menggabungkan sistem barter tanaman (PlantSwap) dan marketplace pupuk/kompos organik (GreenCycle) untuk mendukung pertanian berkelanjutan, urban farming, dan ekonomi sirkular di kalangan petani, penghobi, maupun komunitas lingkungan.'
        },
        {
          id: 102,
          question: 'Bagaimana cara mendaftar di AgroCycle?',
          answer: 'Untuk mendaftar di AgroCycle, klik tombol "Daftar" di pojok kanan atas halaman. Isi formulir pendaftaran dengan informasi yang diperlukan seperti nama, email, dan kata sandi, lalu verifikasi akun Anda melalui email yang dikirimkan ke alamat email Anda.'
        }
      ]
    },
    {
      id: 2,
      title: 'Swap Tanaman',
      faqs: [
        {
          id: 201,
          question: 'Bagaimana cara menawarkan tanaman untuk ditukar?',
          answer: 'Untuk menawarkan tanaman, pergi ke halaman "Swap", klik tombol "Tambah Tanaman", isi detail tanaman seperti jenis, kondisi, usia, dan foto, lalu kirimkan. Tanaman Anda akan terdaftar dan tersedia untuk dilihat pengguna lain.'
        },
        {
          id: 202,
          question: 'Apakah ada biaya untuk menukar tanaman?',
          answer: 'Tidak ada biaya yang dikenakan oleh platform untuk menukar tanaman. Namun, Anda mungkin perlu menyepakati biaya pengiriman dengan mitra tukar jika lokasi berjauhan.'
        }
      ]
    },
    {
      id: 3,
      title: 'Marketplace',
      faqs: [
        {
          id: 301,
          question: 'Bagaimana cara menjual produk di marketplace?',
          answer: 'Untuk menjual produk, pergi ke halaman "Jual Produk", klik "Tambah Produk Baru", isi semua detail produk termasuk harga, stok, dan foto, lalu kirimkan. Produk Anda akan ditampilkan di marketplace setelah melewati verifikasi singkat.'
        },
        {
          id: 302,
          question: 'Metode pembayaran apa yang diterima?',
          answer: 'AgroCycle menerima berbagai metode pembayaran termasuk transfer bank lokal, e-wallet seperti OVO, GoPay, dan DANA, serta pembayaran COD untuk transaksi tertentu.'
        }
      ]
    }
  ];

  const toggleFaq = (id) => {
    setOpenFaqId(openFaqId === id ? null : id);
  };

  const filteredFaqs = searchQuery 
    ? faqCategories.map(category => ({
        ...category,
        faqs: category.faqs.filter(faq => 
          faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
        )
      })).filter(category => category.faqs.length > 0)
    : faqCategories;

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-green-700 mb-4">Pertanyaan yang Sering Diajukan</h2>
        <div className="relative">
          <input
            type="text"
            placeholder="Cari pertanyaan..."
            className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-3 top-3.5 text-gray-400" size={18} />
        </div>
      </div>

      {filteredFaqs.map(category => (
        <div key={category.id} className="mb-8">
          <h3 className="text-xl font-medium text-green-600 mb-4">{category.title}</h3>
          <div className="space-y-4">
            {category.faqs.map(faq => (
              <div key={faq.id} className="border border-gray-200 rounded-lg overflow-hidden">
                <button
                  className="flex justify-between items-center w-full p-4 text-left bg-gray-50 hover:bg-gray-100"
                  onClick={() => toggleFaq(faq.id)}
                >
                  <span className="font-medium">{faq.question}</span>
                  {openFaqId === faq.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
                {openFaqId === faq.id && (
                  <div className="p-4 bg-white">
                    <p className="text-gray-700">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}