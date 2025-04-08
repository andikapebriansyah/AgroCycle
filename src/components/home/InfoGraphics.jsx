// src/components/home/InfoGraphics.jsx
import React from 'react';
import { ArrowRight } from 'lucide-react';

const InfoGraphics = () => {
  const infoSteps = [
    {
      id: 1,
      title: "Kumpulkan Sampah Organik",
      description: "Kumpulkan sisa makanan, dedaunan, dan limbah organik lainnya sebagai bahan baku kompos.",
      icon: "🍃"
    },
    {
      id: 2,
      title: "Olah Menjadi Kompos",
      description: "Fermentasikan bahan organik dengan bantuan mikroorganisme menjadi kompos yang berkualitas.",
      icon: "🔄"
    },
    {
      id: 3,
      title: "Aplikasikan pada Tanaman",
      description: "Gunakan kompos untuk menyuburkan tanah dan memberikan nutrisi pada tanaman.",
      icon: "🌱"
    },
    {
      id: 4,
      title: "Tanaman Jadi Lebih Subur",
      description: "Nikmati hasil panen yang lebih baik dan tanaman yang lebih sehat berkat nutrisi organik.",
      icon: "🌿"
    }
  ];

  const stats = [
    { id: 1, value: "60%", label: "Sampah organik dapat dikomposkan" },
    { id: 2, value: "30%", label: "Pengurangan penggunaan pupuk kimia" },
    { id: 3, value: "40%", label: "Peningkatan kesuburan tanah" },
    { id: 4, value: "25%", label: "Penghematan biaya perawatan tanaman" }
  ];

  return (
    <div className="bg-green-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Daur Ulang Organik</h2>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
            Ikuti langkah mudah untuk mengubah limbah organik menjadi sumber nutrisi bagi tanaman
          </p>
        </div>

        {/* Process Steps */}
        <div className="relative">
          <div className="hidden md:block absolute top-16 left-0 w-full h-0.5 bg-green-200"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {infoSteps.map((step, index) => (
              <div key={step.id} className="relative flex flex-col items-center">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-2xl z-10">
                  {step.icon}
                </div>
                <div className="hidden md:flex absolute top-8 right-0 transform translate-x-1/2">
                  {index < infoSteps.length - 1 && <ArrowRight className="h-8 w-8 text-green-300" />}
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900 text-center">{step.title}</h3>
                <p className="mt-2 text-base text-gray-500 text-center">{step.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="mt-16">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.id} className="bg-white p-6 rounded-lg shadow-sm">
                <p className="text-3xl font-bold text-green-600">{stat.value}</p>
                <p className="mt-2 text-base text-gray-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          {/* <Link 
            to="/education"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
          >
            Pelajari Cara Membuat Kompos
          </Link> */}
        </div>
      </div>
    </div>
  );
};

export default InfoGraphics;