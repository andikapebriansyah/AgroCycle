// src/app/components/support/ResourcesSection.jsx
'use client';

import { useState } from 'react';
import { BookOpen, Video, FileText, Download, ExternalLink } from 'lucide-react';

export default function ResourcesSection() {
  const [activeCategory, setActiveCategory] = useState('all');

  // Mock resources data
  const resources = [
    {
      id: 1,
      title: 'Panduan Lengkap AgroCycle',
      description: 'Pelajari cara menggunakan platform AgroCycle secara menyeluruh',
      type: 'guide',
      format: 'pdf',
      fileSize: '2.4 MB',
      downloadUrl: '/resources/agrocycle-guide.pdf',
      category: 'platform'
    },
    {
      id: 2,
      title: 'Tutorial Swap Tanaman',
      description: 'Video tutorial cara melakukan tukar tambah tanaman',
      type: 'video',
      duration: '5:23',
      watchUrl: 'https://www.youtube.com/watch?v=example',
      thumbnail: '/resources/swap-tutorial-thumb.jpg',
      category: 'swap'
    },
    {
      id: 3,
      title: 'Panduan Menjual di Marketplace',
      description: 'Langkah-langkah menjual produk dan mengatur toko',
      type: 'guide',
      format: 'pdf',
      fileSize: '1.8 MB',
      downloadUrl: '/resources/marketplace-guide.pdf',
      category: 'marketplace'
    },
    {
      id: 4,
      title: 'Cara Membuat Kompos di Rumah',
      description: 'Panduan lengkap membuat kompos dari sampah organik rumah tangga',
      type: 'article',
      readTime: '8 menit',
      readUrl: '/resources/composting-guide',
      category: 'education'
    },
    {
      id: 5,
      title: 'Mengenal Jenis-jenis Tanaman Hias Indoor',
      description: 'Artikel lengkap mengenai berbagai jenis tanaman hias indoor populer',
      type: 'article',
      readTime: '12 menit',
      readUrl: '/resources/indoor-plants-guide',
      category: 'education'
    },
    {
      id: 6,
      title: 'Syarat dan Ketentuan AgroCycle',
      description: 'Informasi lengkap mengenai syarat dan ketentuan layanan',
      type: 'document',
      format: 'pdf',
      fileSize: '420 KB',
      downloadUrl: '/resources/terms-and-conditions.pdf',
      category: 'legal'
    },
    {
      id: 7,
      title: 'Mengenal Fitur Marketplace',
      description: 'Video pengenalan fitur-fitur marketplace AgroCycle',
      type: 'video',
      duration: '7:45',
      watchUrl: 'https://www.youtube.com/watch?v=example2',
      thumbnail: '/resources/marketplace-video-thumb.jpg',
      category: 'marketplace'
    },
    {
      id: 8,
      title: 'Template Kartu Deskripsi Tanaman',
      description: 'Template untuk membuat deskripsi tanaman yang menarik',
      type: 'template',
      format: 'docx',
      fileSize: '350 KB',
      downloadUrl: '/resources/plant-description-template.docx',
      category: 'swap'
    }
  ];

  const categories = [
    { id: 'all', name: 'Semua' },
    { id: 'platform', name: 'Platform' },
    { id: 'swap', name: 'Tukar Tambah' },
    { id: 'marketplace', name: 'Marketplace' },
    { id: 'education', name: 'Edukasi' },
    { id: 'legal', name: 'Legal' }
  ];

  const filteredResources = activeCategory === 'all' 
    ? resources 
    : resources.filter(resource => resource.category === activeCategory);

  const getResourceIcon = (type) => {
    switch (type) {
      case 'guide':
      case 'article':
        return <BookOpen size={20} className="text-blue-500" />;
      case 'video':
        return <Video size={20} className="text-red-500" />;
      case 'document':
      case 'template':
        return <FileText size={20} className="text-green-500" />;
      default:
        return <FileText size={20} className="text-gray-500" />;
    }
  };

  const getActionButton = (resource) => {
    switch (resource.type) {
      case 'guide':
      case 'document':
      case 'template':
        return (
          <a 
            href={resource.downloadUrl} 
            className="inline-flex items-center px-3 py-1.5 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Download size={16} className="mr-1" />
            Unduh
          </a>
        );
      case 'video':
        return (
          <a 
            href={resource.watchUrl} 
            className="inline-flex items-center px-3 py-1.5 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            <ExternalLink size={16} className="mr-1" />
            Tonton
          </a>
        );
      case 'article':
        return (
          <a 
            href={resource.readUrl} 
            className="inline-flex items-center px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            <ExternalLink size={16} className="mr-1" />
            Baca
          </a>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-green-700 mb-4">Sumber Daya</h2>
      <p className="text-gray-600 mb-6">
        Temukan panduan, tutorial, dan informasi untuk membantu Anda menggunakan AgroCycle secara maksimal.
      </p>

      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map(category => (
          <button
            key={category.id}
            className={`px-4 py-2 rounded-full text-sm ${
              activeCategory === category.id 
                ? 'bg-green-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            } transition-colors`}
            onClick={() => setActiveCategory(category.id)}
          >
            {category.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResources.map(resource => (
          <div key={resource.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
            {resource.type === 'video' && resource.thumbnail && (
              <div className="relative h-40 bg-gray-100">
                <img 
                  src="/api/placeholder/400/320" 
                  alt={resource.title} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-red-500 bg-opacity-80 rounded-full p-3">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              </div>
            )}
            <div className="p-4">
              <div className="flex items-center mb-2">
                {getResourceIcon(resource.type)}
                <span className="ml-2 text-sm text-gray-500 capitalize">{resource.type}</span>
                {resource.format && (
                  <span className="ml-2 px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full uppercase">
                    {resource.format}
                  </span>
                )}
              </div>
              <h3 className="font-medium text-lg mb-1">{resource.title}</h3>
              <p className="text-gray-600 text-sm mb-3">{resource.description}</p>
              <div className="flex justify-between items-center">
                <div className="text-gray-500 text-sm">
                  {resource.fileSize && `${resource.fileSize}`}
                  {resource.duration && `${resource.duration}`}
                  {resource.readTime && `${resource.readTime}`}
                </div>
                {getActionButton(resource)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}