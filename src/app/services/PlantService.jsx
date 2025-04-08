// app/services/plantService.js

// This would eventually connect to your Adonis backend
// For now, it returns mock data

export async function fetchPlants() {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return [
      {
        id: 1,
        name: "Monstera Deliciosa",
        category: "indoor",
        age: "mature",
        description: "Monstera deliciosa dalam kondisi sangat baik, tinggi sekitar 80cm dengan 7 daun besar. Cocok untuk ruang tamu atau kamar tidur yang terang.",
        condition: "healthy",
        willingToExchangeFor: "Philodendron atau Calathea",
        location: "Jakarta Selatan",
        imageUrl: "/swap_product/monstera.jpg",
        distance: "2.5",
        owner: {
          name: "Andi Wijaya",
          avatar: "/profile.png"
        },
        createdAt: "2025-02-15T08:30:00Z"
      },
      {
        id: 2,
        name: "Serai (Lemongrass)",
        category: "herbs",
        age: "young",
        description: "Tanaman serai segar siap dipindahkan. Sudah berakar kuat dan mulai tumbuh dengan baik. Cocok untuk bumbu masakan atau dijadikan minuman.",
        condition: "healthy",
        willingToExchangeFor: "Daun Kari, Jahe, atau bumbu dapur lainnya",
        location: "Jakarta Barat",
        imageUrl: "/swap_product/serai.jpg",
        distance: "5.8",
        owner: {
          name: "Siti Nurhaliza",
          avatar: "/profile.png"
        },
        createdAt: "2025-03-01T14:22:00Z"
      },
      {
        id: 3,
        name: "Anggrek Bulan",
        category: "ornamental",
        age: "mature",
        description: "Anggrek bulan putih yang sudah berbunga. Terawat dengan baik dan dalam pot gantung. Sangat cocok untuk memperindah teras atau balkon.",
        condition: "healthy",
        willingToExchangeFor: "Jenis anggrek lainnya atau tanaman hias berbunga",
        location: "Depok",
        imageUrl: "/swap_product/anggrek-bulan.jpg",
        distance: "12.3",
        owner: {
          name: "Budi Santoso",
          avatar: "/profile.png"
        },
        createdAt: "2025-03-05T11:45:00Z"
      },
      {
        id: 4,
        name: "Jeruk Nipis",
        category: "fruits",
        age: "young",
        description: "Bibit jeruk nipis usia 6 bulan yang sudah mulai tumbuh daun baru. Ditanam dalam pot berukuran sedang dengan media tanam premium.",
        condition: "minor_issues",
        willingToExchangeFor: "Bibit buah lainnya, terutama jambu atau mangga",
        location: "Tangerang",
        imageUrl: "/swap_product/jeruknipis.jpg",
        distance: "15.2",
        owner: {
          name: "Maya Indah",
          avatar: "/profile.png"
        },
        createdAt: "2025-03-10T09:10:00Z"
      },
      {
        id: 5,
        name: "Lidah Buaya (Aloe Vera)",
        category: "indoor",
        age: "mature",
        description: "Tanaman lidah buaya besar dengan banyak anakan di sekelilingnya. Sangat sehat dan berukuran besar. Bisa digunakan untuk perawatan kulit atau dijadikan minuman.",
        condition: "healthy",
        willingToExchangeFor: "Tanaman hias indoor atau herbal lainnya",
        location: "Jakarta Timur",
        imageUrl: "/swap_product/lidahbuaya.jpg",
        distance: "8.1",
        owner: {
          name: "Rizki Pratama",
          avatar: "/profile.png"
        },
        createdAt: "2025-03-12T16:05:00Z"
      },
      {
        id: 6,
        name: "Basil (Kemangi)",
        category: "herbs",
        age: "seedling",
        description: "Bibit kemangi segar yang baru tumbuh. Berasal dari biji berkualitas dan ditanam dalam media yang kaya nutrisi. Siap untuk dipindahkan.",
        condition: "healthy",
        willingToExchangeFor: "Benih herbal lainnya atau bibit sayuran",
        location: "Bekasi",
        imageUrl: "/swap_product/kemangi.jpeg",
        distance: "18.7",
        owner: {
          name: "Diana Putri",
          avatar: "/profile.png"
        },
        createdAt: "2025-03-18T10:30:00Z"
      }
    ];
  }
  
  export async function getPlantById(id) {
    const plants = await fetchPlants();
    return plants.find(plant => plant.id === parseInt(id));
  }
  
  export async function addPlant(plantData) {
    // This would send data to your Adonis backend
    // For now, just return the data with a mock ID
    return {
      ...plantData,
      id: Date.now(),
      createdAt: new Date().toISOString()
    };
  }