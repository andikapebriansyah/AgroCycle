// services/ProductService.js

const products = [
    {
      id: 1,
      name: 'Kompos Organik Premium',
      price: 45000,
      unit: '5 kg',
      image: '/product/kompos.jpg',
      seller: 'Tani Makmur',
      rating: 4.8,
      totalReviews: 124,
      type: 'kompos',
      productionMethod: 'rumahan',
      description: 'Kompos organik premium yang terbuat dari bahan-bahan organik pilihan. Cocok untuk berbagai jenis tanaman dan membantu menyuburkan tanah secara alami. Diproduksi dengan metode fermentasi yang aman untuk lingkungan.',
      benefits: [
        'Meningkatkan kesuburan tanah',
        'Meningkatkan daya tahan tanaman terhadap penyakit',
        'Ramah lingkungan dan tidak mengandung bahan kimia berbahaya',
        'Memperbaiki struktur tanah dan menahan air dengan baik',
        'Hasil panen lebih berkualitas'
      ],
      stock: 50,
      composition: 'Daun kering (40%), Sisa sayuran (30%), Kotoran ternak (20%), Sekam padi (10%)'
    },
    {
      id: 2,
      name: 'Pupuk Cair Daun',
      price: 35000,
      unit: '1 liter',
      image: '/product/pupukdaun.jpeg',
      seller: 'GreenFarm',
      rating: 4.5,
      totalReviews: 89,
      type: 'pupuk-cair',
      productionMethod: 'industri',
      description: 'Pupuk cair organik yang diolah dari ekstrak daun-daunan segar. Mengandung nutrisi lengkap untuk pertumbuhan tanaman yang optimal. Mudah diserap oleh tanaman dan ramah lingkungan.',
      benefits: [
        'Mempercepat pertumbuhan tanaman',
        'Meningkatkan kualitas buah dan sayuran',
        'Mudah diaplikasikan dengan penyemprotan',
        'Tidak meninggalkan residu berbahaya',
        'Dapat digunakan untuk semua jenis tanaman'
      ],
      stock: 30,
      composition: 'Ekstrak daun segar (60%), Air kelapa (25%), Molase (10%), Bioaktivator (5%)'
    },
    {
      id: 3,
      name: 'Pupuk Kandang Fermentasi',
      price: 25000,
      unit: '3 kg',
      image: '/product/pupukkandang.jpeg',
      seller: 'Organik Jaya',
      rating: 4.2,
      totalReviews: 76,
      type: 'pupuk-padat',
      productionMethod: 'rumahan',
      description: 'Pupuk kandang yang telah difermentasi untuk menghilangkan bau dan meningkatkan kandungan nutrisi. Ideal untuk berbagai jenis tanaman sayuran dan buah-buahan.',
      benefits: [
        'Memperbaiki struktur tanah',
        'Meningkatkan kemampuan tanah menyimpan air',
        'Mengurangi penggunaan pupuk kimia',
        'Mendorong aktivitas mikroorganisme menguntungkan',
        'Tidak berbau menyengat seperti pupuk kandang biasa'
      ],
      stock: 85,
      composition: 'Kotoran sapi (70%), Sekam padi (20%), Dedak (5%), EM4 (5%)'
    },
    {
      id: 4,
      name: 'Bio Pestisida Alami',
      price: 30000,
      unit: '500 ml',
      image: '/product/biopes.jpeg',
      seller: 'NaturalCare',
      rating: 4.7,
      totalReviews: 112,
      type: 'pestisida',
      productionMethod: 'industri',
      description: 'Pestisida organik yang efektif mengendalikan berbagai hama tanaman tanpa merusak lingkungan. Aman untuk tanaman, manusia, dan hewan peliharaan.',
      benefits: [
        'Mengendalikan berbagai jenis hama serangga',
        'Tidak membunuh serangga menguntungkan seperti lebah',
        'Aman untuk lingkungan dan ekosistem',
        'Tidak meninggalkan residu berbahaya pada hasil panen',
        'Dapat digunakan hingga mendekati waktu panen'
      ],
      stock: 45,
      composition: 'Ekstrak bawang putih (30%), Ekstrak cabai (25%), Ekstrak daun nimba (25%), Minyak serai (15%), Emulsifier alami (5%)'
    },
    {
      id: 5,
      name: 'Pupuk NPK Organik',
      price: 50000,
      unit: '2 kg',
      image: '/product/npk.jpg',
      seller: 'Berkah Tani',
      rating: 4.6,
      totalReviews: 98,
      type: 'pupuk-padat',
      productionMethod: 'industri',
      description: 'Pupuk NPK organik yang memberikan nutrisi lengkap dengan kandungan Nitrogen, Fosfor, dan Kalium yang seimbang. Dirancang khusus untuk meningkatkan hasil panen secara signifikan.',
      benefits: [
        'Menyediakan nutrisi lengkap untuk tanaman',
        'Meningkatkan produksi buah dan sayuran',
        'Menjaga kesuburan tanah dalam jangka panjang',
        'Meningkatkan ketahanan tanaman terhadap kekeringan',
        'Aman untuk penggunaan jangka panjang'
      ],
      stock: 25,
      composition: 'Bahan organik kompos (60%), Tepung tulang (15%), Abu kayu (15%), Mineral alami (10%)'
    },
    {
      id: 6,
      name: 'Kompos Daun Premium',
      price: 40000,
      unit: '4 kg',
      image: '/product/komposdaun.jpeg',
      seller: 'LeafCycle',
      rating: 4.4,
      totalReviews: 83,
      type: 'kompos',
      productionMethod: 'rumahan',
      description: 'Kompos premium yang terbuat dari daun-daun pilihan yang telah terdekomposisi sempurna. Mengandung banyak humus dan ideal untuk tanaman hias dan tanaman berbunga.',
      benefits: [
        'Memperbaiki aerasi tanah',
        'Meningkatkan pertumbuhan akar tanaman',
        'Menyeimbangkan pH tanah',
        'Mengurangi stres tanaman saat dipindahkan',
        'Ideal untuk tanaman dalam pot dan kebun'
      ],
      stock: 60,
      composition: 'Daun kering berbagai jenis (80%), Vermikompos (15%), Biofertilizer (5%)'
    }
];
  
export const getAllProducts = () => {
  return products;
};

export const getProductById = (id) => {
  return products.find(product => product.id === parseInt(id)) || null;
};

export const filterProducts = (filters) => {
  let filteredProducts = [...products];
  
  // Filter by search term
  if (filters.searchTerm) {
    const searchTerm = filters.searchTerm.toLowerCase();
    filteredProducts = filteredProducts.filter(product => 
      product.name.toLowerCase().includes(searchTerm) || 
      product.description.toLowerCase().includes(searchTerm)
    );
  }
  
  // Filter by categories
  if (filters.categories && filters.categories.length > 0 && !filters.categories.includes('all')) {
    filteredProducts = filteredProducts.filter(product => {
      // Map category name to product type
      const categoryTypeMap = {
        'kompos': 'kompos',
        'pupuk-cair': 'pupuk-cair',
        'pupuk-padat': 'pupuk-padat',
        'pestisida': 'pestisida'
      };
      
      return filters.categories.some(category => 
        product.type === categoryTypeMap[category]
      );
    });
  }
  
  // Filter by price range
  if (filters.priceRange && (filters.priceRange[0] > 0 || filters.priceRange[1] < 100000)) {
    filteredProducts = filteredProducts.filter(product => 
      product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1]
    );
  }
  
  // Filter by production method
  if (filters.productionMethods && filters.productionMethods.length > 0 && !filters.productionMethods.includes('all')) {
    filteredProducts = filteredProducts.filter(product => 
      filters.productionMethods.includes(product.productionMethod)
    );
  }
  
  // Filter by rating
  if (filters.minRating) {
    filteredProducts = filteredProducts.filter(product => 
      product.rating >= filters.minRating
    );
  }
  
  return filteredProducts;
};