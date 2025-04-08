import ProductDetail from '@/components/marketplace/ProductDetail';
import { getProductById } from '@/App/services/ProductService';

export async function generateMetadata({ params }) {
  const product = await getProductById(params.id);

  if (!product) {
    return {
      title: 'Produk Tidak Ditemukan',
      description: 'Produk yang Anda cari tidak tersedia atau telah dihapus.',
    };
  }

  return {
    title: `${product.name} - Marketplace Produk Organik`,
    description: product.description.substring(0, 160),
  };
}

export default async function ProductDetailPage({ params }) {
  const product = await getProductById(params.id);

  if (!product) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-bold">404 - Produk Tidak Ditemukan</h1>
        <p className="text-gray-500 mt-2">Coba periksa kembali URL atau kembali ke halaman utama.</p>
      </div>
    );
  }

  return <ProductDetail product={product} />;
}
