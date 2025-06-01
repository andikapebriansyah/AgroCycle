export default function PointExchangeHistory({ exchanges }) {
  if (!exchanges || exchanges.length === 0) {
    return null;
  }

  return (
    <div className="bg-white shadow rounded-lg p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">Riwayat Penukaran Poin</h2>
      <div className="space-y-4">
        {exchanges.map((exchange) => (
          <div key={exchange.exchange_id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
            <img
              src={exchange.image_url}
              alt={exchange.plant_name}
              className="w-16 h-16 object-cover rounded-lg"
            />
            <div className="flex-1">
              <h3 className="font-medium">{exchange.plant_name}</h3>
              <p className="text-sm text-gray-600">
                Ditukar dengan {exchange.points_spent} poin
              </p>
              <p className="text-xs text-gray-500">
                {new Date(exchange.exchanged_at).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 