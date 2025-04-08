// components/swap/SwapRegistrationModal.jsx
import { useState } from 'react';

export default function SwapRegistrationModal({ onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    name: '',
    category: 'indoor',
    age: 'young',
    description: '',
    condition: 'healthy',
    willingToExchangeFor: '',
    location: '',
    imageFile: null,
    imagePreview: null
  });

  const categories = [
    { id: 'indoor', name: 'Tanaman Indoor' },
    { id: 'outdoor', name: 'Tanaman Outdoor' },
    { id: 'herbs', name: 'Herbal & Bumbu' },
    { id: 'fruits', name: 'Buah & Sayur' },
    { id: 'ornamental', name: 'Hias & Dekoratif' },
  ];

  const ageOptions = [
    { id: 'seedling', name: 'Bibit/Benih' },
    { id: 'young', name: 'Tanaman Muda' },
    { id: 'mature', name: 'Tanaman Dewasa' },
  ];

  const conditionOptions = [
    { id: 'healthy', name: 'Sehat' },
    { id: 'minor_issues', name: 'Ada Masalah Kecil' },
    { id: 'needs_care', name: 'Butuh Perawatan Khusus' },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        imageFile: file,
        imagePreview: URL.createObjectURL(file)
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Construct plant object to submit
    const plantData = {
      ...formData,
      id: Date.now(),
      owner: {
        name: 'Anda',
        avatar: '/api/placeholder/40/40',
      },
      createdAt: new Date().toISOString(),
      imageUrl: formData.imagePreview || '/api/placeholder/400/200',
      distance: '0',
    };
    
    onSubmit(plantData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-screen overflow-y-auto">
        <div className="sticky top-0 bg-white p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-bold text-green-800">Registrasi Tanaman untuk Ditukar</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Foto Tanaman*
              </label>
              <div 
                className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50"
                onClick={() => document.getElementById('plant-image').click()}
              >
                {formData.imagePreview ? (
                  <div className="relative h-48">
                    <img 
                      src={formData.imagePreview} 
                      alt="Preview" 
                      className="max-h-full mx-auto rounded-lg"
                    />
                    <button 
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFormData(prev => ({ ...prev, imageFile: null, imagePreview: null }));
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mx-auto text-gray-400">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                    </svg>
                    <p className="mt-2 text-sm text-gray-500">Klik untuk upload foto tanaman</p>
                    <p className="text-xs text-gray-400">Format: JPG, PNG (Maks. 5MB)</p>
                  </>
                )}
                <input 
                  id="plant-image" 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleImageChange}
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nama Tanaman*
              </label>
              <input 
                type="text" 
                name="name" 
                value={formData.name} 
                onChange={handleChange}
                required
                placeholder="mis. Monstera Deliciosa"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kategori*
              </label>
              <select 
                name="category" 
                value={formData.category} 
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Usia Tanaman*
              </label>
              <select 
                name="age" 
                value={formData.age} 
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                {ageOptions.map(option => (
                  <option key={option.id} value={option.id}>
                    {option.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kondisi Tanaman*
              </label>
              <select 
                name="condition" 
                value={formData.condition} 
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                {conditionOptions.map(option => (
                  <option key={option.id} value={option.id}>
                    {option.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Deskripsi Tanaman*
              </label>
              <textarea 
                name="description" 
                value={formData.description} 
                onChange={handleChange}
                required
                rows={3}
                placeholder="Ceritakan detail tentang tanaman Anda seperti ukuran, warna, keunikan, dll."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              ></textarea>
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ingin Ditukar Dengan
              </label>
              <textarea 
                name="willingToExchangeFor" 
                value={formData.willingToExchangeFor} 
                onChange={handleChange}
                rows={2}
                placeholder="Sebutkan jenis tanaman yang Anda inginkan sebagai penukaran, atau tulis 'terbuka untuk berbagai tawaran'"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              ></textarea>
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Lokasi Anda*
              </label>
              <input 
                type="text" 
                name="location" 
                value={formData.location} 
                onChange={handleChange}
                required
                placeholder="mis. Jakarta Selatan"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-4 mt-4">
            <div className="flex justify-end space-x-3">
              <button 
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Batal
              </button>
              <button 
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Publikasikan Tanaman
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}