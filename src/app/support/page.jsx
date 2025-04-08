// src/app/support/page.jsx
'use client';

import { useState } from 'react';
import FAQSection from '@/components/support/FAQSection';
import ContactForm from '@/components/support/ContactForm';
import CommunitySupport from '@/components/support/CommunitySupport';
import ResourcesSection from '@/components/support/ResourcesSection';

export default function SupportPage() {
  const [activeTab, setActiveTab] = useState('faq');

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-green-800 mb-6">Pusat Bantuan AgroCycle</h1>
      
      <div className="flex mb-6 border-b">
        <button 
          className={`py-3 px-5 font-medium ${activeTab === 'faq' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-600'}`}
          onClick={() => setActiveTab('faq')}
        >
          FAQ
        </button>
        <button 
          className={`py-3 px-5 font-medium ${activeTab === 'contact' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-600'}`}
          onClick={() => setActiveTab('contact')}
        >
          Hubungi Kami
        </button>
        <button 
          className={`py-3 px-5 font-medium ${activeTab === 'community' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-600'}`}
          onClick={() => setActiveTab('community')}
        >
          Dukungan Komunitas
        </button>
        <button 
          className={`py-3 px-5 font-medium ${activeTab === 'resources' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-600'}`}
          onClick={() => setActiveTab('resources')}
        >
          Sumber Daya
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        {activeTab === 'faq' && <FAQSection />}
        {activeTab === 'contact' && <ContactForm />}
        {activeTab === 'community' && <CommunitySupport />}
        {activeTab === 'resources' && <ResourcesSection />}
      </div>
    </div>
  );
}