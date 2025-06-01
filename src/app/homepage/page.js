// src/pages/HomePage.jsx
import React from 'react';
import Hero from '@/components/home/Hero';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import InfoGraphics from '@/components/home/InfoGraphics';
import InteractiveMap from '@/components/home/InteractiveMap';
import Testimonials from '@/components/home/Testimonials';

const HomePage = () => {
  return (
    <div>
      <Hero />
      <InfoGraphics />
      <InteractiveMap />
      <Testimonials />
    </div>
  );
};

export default HomePage;