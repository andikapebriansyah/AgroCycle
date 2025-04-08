'use client'

// src/components/home/Testimonials.jsx
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Mock testimonial data
  const testimonials = [
    {
      id: 1,
      name: "Budi Santoso",
      role: "Urban Farmer",
      image: "/api/placeholder/100/100",
      comment: "AgroCycle membantu saya menemukan berbagai jenis tanaman yang sulit didapat di pasaran. Komunitas di sini sangat aktif dan saling membantu!",
      rating: 5,
      location: "Jakarta"
    },
    {
      id: 2,
      name: "Ratna Wijaya",
      role: "Produsen Kompos",
      image: "/api/placeholder/100/100",
      comment: "Berkat marketplace di AgroCycle, saya bisa menjual kompos organik saya ke lebih banyak pelanggan. Pemrosesan pembayaran cepat dan sistem logistiknya memudahkan.",
      rating: 4,
      location: "Bandung"
    },
    {
      id: 3,
      name: "Ahmad Faisal",
      role: "Petani Sayur",
      image: "/api/placeholder/100/100",
      comment: "Platform ini sangat membantu dalam memasarkan hasil panen organik dan mendapatkan pupuk berkualitas. Fitur edukasi juga sangat bermanfaat!",
      rating: 5,
      location: "Yogyakarta"
    },
    {
      id: 4,
      name: "Dewi Lestari",
      role: "Penggemar Tanaman Hias",
      image: "/api/placeholder/100/100",
      comment: "PlantSwap adalah cara terbaik untuk memperkaya koleksi tanaman hias saya tanpa biaya tinggi. Saya sudah menemukan banyak tanaman unik di sini!",
      rating: 5,
      location: "Surabaya"
    }
  ];

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="bg-green-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Kata Mereka</h2>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
            Lihat bagaimana AgroCycle membantu komunitas pertanian dan pecinta tanaman
          </p>
        </div>
        
        <div className="relative max-w-3xl mx-auto">
          {/* Testimonial Card */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden p-8">
            <div className="flex items-center">
              <img
                className="h-16 w-16 rounded-full object-cover"
                src={testimonials[currentIndex].image}
                alt={testimonials[currentIndex].name}
              />
              <div className="ml-4">
                <h4 className="text-lg font-bold text-gray-900">{testimonials[currentIndex].name}</h4>
                <div className="flex items-center">
                  <p className="text-sm text-gray-600 mr-2">{testimonials[currentIndex].role}</p>
                  <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
                    {testimonials[currentIndex].location}
                  </span>
                </div>
                <div className="flex mt-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < testimonials[currentIndex].rating
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
            
            <blockquote className="mt-6">
              <p className="text-lg italic text-gray-600">"{testimonials[currentIndex].comment}"</p>
            </blockquote>
          </div>
          
          {/* Navigation Buttons */}
          <div className="absolute inset-y-0 left-0 flex items-center">
            <button
              onClick={prevTestimonial}
              className="bg-white rounded-full shadow p-2 -ml-4 focus:outline-none hover:bg-gray-50"
            >
              <ChevronLeft className="h-6 w-6 text-gray-500" />
            </button>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center">
            <button
              onClick={nextTestimonial}
              className="bg-white rounded-full shadow p-2 -mr-4 focus:outline-none hover:bg-gray-50"
            >
              <ChevronRight className="h-6 w-6 text-gray-500" />
            </button>
          </div>
          
          {/* Pagination Dots */}
          <div className="flex justify-center mt-6 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full ${
                  currentIndex === index ? 'bg-green-600' : 'bg-gray-300'
                }`}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;