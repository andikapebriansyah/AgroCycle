// src/app/components/support/ContactForm.jsx
'use client';

import { useState } from 'react';
import { Send, CheckCircle } from 'lucide-react';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: '',
    subject: '',
    message: '',
    attachments: []
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const supportCategories = [
    { id: 'account', name: 'Akun & Profil' },
    { id: 'swap', name: 'Tukar Tambah Tanaman' },
    { id: 'marketplace', name: 'Marketplace & Transaksi' },
    { id: 'technical', name: 'Masalah Teknis' },
    { id: 'suggestion', name: 'Saran & Masukan' },
    { id: 'other', name: 'Lainnya' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData({
      ...formData,
      attachments: [...formData.attachments, ...files].slice(0, 3) // Max 3 files
    });
  };

  const removeAttachment = (index) => {
    const newAttachments = [...formData.attachments];
    newAttachments.splice(index, 1);
    setFormData({
      ...formData,
      attachments: newAttachments
    });
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Nama tidak boleh kosong';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email tidak boleh kosong';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Format email tidak valid';
    }
    
    if (!formData.category) {
      newErrors.category = 'Pilih kategori bantuan';
    }
    
    if (!formData.subject.trim()) {
      newErrors.subject = 'Subjek tidak boleh kosong';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Pesan tidak boleh kosong';
    } else if (formData.message.length < 10) {
      newErrors.message = 'Pesan terlalu singkat (min. 10 karakter)';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log('Form submitted:', formData);
      setIsSubmitting(false);
      setIsSubmitted(true);
      // Reset form
      setFormData({
        name: '',
        email: '',
        category: '',
        subject: '',
        message: '',
        attachments: []
      });
    }, 1500);
  };

  if (isSubmitted) {
    return (
      <div className="text-center py-10">
        <CheckCircle className="mx-auto text-green-500 mb-4" size={64} />
        <h3 className="text-2xl font-medium text-gray-800 mb-2">Terima Kasih!</h3>
        <p className="text-gray-600 mb-6">
          Pesan Anda telah dikirim. Tim dukungan kami akan menghubungi Anda dalam 1-2 hari kerja.
        </p>
        <button 
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          onClick={() => setIsSubmitted(false)}
        >
          Kirim Pesan Lain
        </button>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold text-green-700 mb-4">Hubungi Tim Dukungan</h2>
      <p className="text-gray-600 mb-6">
        Kami siap membantu dengan pertanyaan, masalah, atau umpan balik yang Anda miliki.
        Isi formulir di bawah ini dan tim kami akan merespons secepat mungkin.
      </p>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2">Nama</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full p-3 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500`}
              placeholder="Nama lengkap"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>
          
          <div>
            <label className="block text-gray-700 font-medium mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full p-3 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500`}
              placeholder="email@example.com"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">Kategori</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className={`w-full p-3 border ${errors.category ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white`}
          >
            <option value="">Pilih kategori</option>
            {supportCategories.map(category => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
          {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">Subjek</label>
          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            className={`w-full p-3 border ${errors.subject ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500`}
            placeholder="Ringkasan masalah/pertanyaan Anda"
          />
          {errors.subject && <p className="text-red-500 text-sm mt-1">{errors.subject}</p>}
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">Pesan</label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows="5"
            className={`w-full p-3 border ${errors.message ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500`}
            placeholder="Jelaskan masalah atau pertanyaan Anda secara detail..."
          ></textarea>
          {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
        </div>

        <div className="mb-8">
          <label className="block text-gray-700 font-medium mb-2">Lampiran (opsional)</label>
          <div className="flex items-center">
            <input
              type="file"
              id="attachments"
              className="hidden"
              onChange={handleFileChange}
              multiple
              accept="image/*,.pdf,.doc,.docx"
              disabled={formData.attachments.length >= 3}
            />
            <label 
              htmlFor="attachments"
              className={`px-4 py-2 rounded-lg border border-gray-300 text-gray-700 cursor-pointer hover:bg-gray-50 ${formData.attachments.length >= 3 ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Pilih File
            </label>
            <span className="ml-3 text-sm text-gray-500">
              Maks. 3 file (Gambar, PDF, DOC)
            </span>
          </div>
          
          {formData.attachments.length > 0 && (
            <div className="mt-3">
              <p className="text-sm font-medium text-gray-700 mb-2">File terpilih:</p>
              <ul className="space-y-2">
                {formData.attachments.map((file, index) => (
                  <li key={index} className="flex items-center bg-gray-50 px-3 py-2 rounded">
                    <span className="flex-grow truncate text-sm">{file.name}</span>
                    <button 
                      type="button"
                      className="ml-2 text-red-500 hover:text-red-700"
                      onClick={() => removeAttachment(index)}
                    >
                      Hapus
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <button
          type="submit"
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Mengirim...
            </>
          ) : (
            <>
              <Send size={18} className="mr-2" />
              Kirim Pesan
            </>
          )}
        </button>
      </form>
    </div>
  );
}