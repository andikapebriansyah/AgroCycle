import { useState } from 'react';
import Image from 'next/image';

export default function ProfileImageUpload({ currentImage, onImageUpdate }) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.includes('image/')) {
      setError('Please select an image file');
      return;
    }

    try {
      setIsUploading(true);
      setError(null);

      // Convert image to base64
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        try {
          const token = localStorage.getItem('token');
          const response = await fetch('/api/user/profile-image', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              image: reader.result
            })
          });

          if (!response.ok) {
            throw new Error('Failed to update profile image');
          }

          const data = await response.json();
          onImageUpdate(data.user);
        } catch (error) {
          setError(error.message);
        } finally {
          setIsUploading(false);
        }
      };
    } catch (error) {
      setError('Error processing image');
      setIsUploading(false);
    }
  };

  return (
    <div className="relative group">
      <div className="relative h-32 w-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
        <Image
          src={currentImage || '/placeholder.jpg'}
          alt="Profile picture"
          layout="fill"
          objectFit="cover"
          className="transition-opacity group-hover:opacity-75"
        />
        <label
          htmlFor="profile-image"
          className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
        >
          <span className="text-white text-sm font-medium">
            {isUploading ? 'Uploading...' : 'Change Photo'}
          </span>
        </label>
      </div>
      <input
        type="file"
        id="profile-image"
        accept="image/*"
        onChange={handleImageChange}
        className="hidden"
        disabled={isUploading}
      />
      {error && (
        <p className="text-red-500 text-sm mt-2">{error}</p>
      )}
    </div>
  );
} 