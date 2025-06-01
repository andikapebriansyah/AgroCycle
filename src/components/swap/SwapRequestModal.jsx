import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function SwapRequestModal({ onClose, targetPlant, userPlants }) {
  const router = useRouter();
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const calculatePointDifference = () => {
    if (!selectedPlant) return 0;
    const selectedPrice = parseFloat(selectedPlant.price_estimation) || 0;
    const targetPrice = parseFloat(targetPlant.price_estimation) || 0;
    return selectedPrice - targetPrice;
  };

  const handleSubmit = async () => {
    if (!selectedPlant) {
      setError('Silakan pilih tanaman untuk ditukar');
      return;
    }

    // Validasi status tanaman sebelum submit
    if (selectedPlant.status !== 'available') {
      setError('Tanaman yang Anda pilih tidak tersedia untuk ditukar');
      return;
    }

    if (targetPlant.status !== 'available') {
      setError('Tanaman yang ingin Anda tukar sudah tidak tersedia');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/swap/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          plant_id_1: selectedPlant.plant_id,
          plant_id_2: targetPlant.plant_id,
          price_difference: calculatePointDifference()
        })
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 400) {
          throw new Error(data.message || 'Satu atau kedua tanaman tidak tersedia');
        } else if (response.status === 403) {
          throw new Error(data.message || 'Anda tidak memiliki izin untuk melakukan penukaran ini');
        } else if (response.status === 401) {
          localStorage.removeItem('token');
          router.push('/login');
          return;
        } else {
          throw new Error(data.message || 'Gagal mengajukan penukaran');
        }
      }

      // Tunggu sebentar sebelum menutup modal dan refresh
      setTimeout(() => {
        onClose();
        router.refresh(); // Gunakan router.refresh() daripada window.location.reload()
      }, 1000);
      
    } catch (error) {
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatPrice = (price) => {
    if (price === null || price === undefined) return '0';
    return Number(price).toLocaleString();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900">Ajukan Penukaran</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Tanaman yang Ingin Ditukar</h3>
            <div className="bg-gray-50 p-4 rounded-lg flex items-center">
              <div className="relative h-16 w-16 rounded-lg overflow-hidden">
                <Image
                  src={targetPlant.image_url?.startsWith("/") ? targetPlant.image_url : "/placeholder.jpg"}
                  fill
                  alt={targetPlant.name}
                  className="object-cover"
                />
              </div>
              <div className="ml-4">
                <h4 className="font-medium text-gray-900">{targetPlant.name}</h4>
                <p className="text-sm text-gray-500">Rp {formatPrice(targetPlant.price_estimation)}</p>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Pilih Tanaman Anda</h3>
            <div className="space-y-4">
              {userPlants.map((plant) => (
                <div
                  key={plant.plant_id}
                  className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                    selectedPlant?.plant_id === plant.plant_id
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-green-500'
                  }`}
                  onClick={() => setSelectedPlant(plant)}
                >
                  <div className="flex items-center">
                    <div className="relative h-16 w-16 rounded-lg overflow-hidden">
                      <Image
                        src={plant.image_url?.startsWith("/") ? plant.image_url : "/placeholder.jpg"}
                        fill
                        alt={plant.name}
                        className="object-cover"
                      />
                    </div>
                    <div className="ml-4 flex-1">
                      <h4 className="font-medium text-gray-900">{plant.name}</h4>
                      <p className="text-sm text-gray-500">Rp {formatPrice(plant.price_estimation)}</p>
                    </div>
                    <div className="ml-4">
                      {selectedPlant?.plant_id === plant.plant_id && (
                        <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {selectedPlant && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Selisih Harga</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Poin yang {calculatePointDifference() > 0 ? 'didapat' : 'diperlukan'}</span>
                  <span className={`font-medium ${
                    calculatePointDifference() > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {Math.abs(calculatePointDifference())} poin
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  {calculatePointDifference() > 0
                    ? 'Anda akan mendapatkan poin karena nilai tanaman yang Anda tukarkan lebih tinggi'
                    : 'Anda memerlukan poin tambahan karena nilai tanaman yang Anda tukarkan lebih rendah'}
                </p>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-6">
              <p className="text-red-500 text-sm">{error}</p>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-100">
          <div className="flex gap-4">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-full hover:bg-gray-50 transition-colors"
            >
              Batal
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !selectedPlant}
              className={`flex-1 px-4 py-2 rounded-full text-white transition-colors ${
                isSubmitting || !selectedPlant
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-green-500 hover:bg-green-600'
              }`}
            >
              {isSubmitting ? 'Memproses...' : 'Ajukan Penukaran'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 