# 🍀 Agrocycle - Platform Tukar Tambah Bibit & Tanaman

---

## 🪴 Tentang Platform

Agrocycle adalah platform pertanian berkelanjutan yang memungkinkan pengguna untuk saling bertukar bibit dan tanaman secara mudah. Platform ini mempertemukan para penghobi tanaman dan petani urban untuk berbagi, menukar, atau menjual bibit dan tanaman dengan sistem pencocokan cerdas.

Misi utama kami:

- Mendorong ekosistem pertukaran tanaman yang ramah lingkungan
- Memperkuat komunitas urban farming dan gardening
- Mengurangi limbah tanaman dengan sistem tukar tambah
- Memanfaatkan teknologi untuk memperluas akses bibit/tanaman

---

## 🌟 Fitur Utama

### 🛍️ Marketplace

- Pencarian & filter berdasarkan **jenis tanaman**, **lokasi**, dan **kondisi**
- Katalog tanaman dengan **foto** dan **deskripsi lengkap**
- Sistem **penilaian dan ulasan** dari pengguna
- Fitur **tawar-menawar harga** untuk transaksi jual-beli tanaman

### ♻️ Swap Market (Tukar Tambah)

- Algoritma **pencocokan otomatis** berdasarkan preferensi pengguna
- Sistem **wish list** untuk tanaman yang diinginkan
- Notifikasi real-time saat ada kecocokan tukar
- Fitur **chat in-app** untuk negosiasi tukar tambah
- Sistem **poin** untuk menjaga nilai tukar tetap adil

---

## 🧱 Teknologi yang Digunakan

- **Frontend**: React.js  
- **Framework**: Next.js  
- **Styling**: Tailwind CSS  

---

> Proyek ini masih dalam tahap pengembangan. Saran, ide, dan kontribusi dari komunitas sangat kami harapkan untuk mewujudkan ekosistem tanaman yang lebih berkelanjutan 🌿



This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel




The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## 🚀 Cara Menjalankan Aplikasi

1. Clone repository
```bash
git clone [repository-url]
cd [repository-name]
```

2. Install dependencies
```bash
npm install
```

3. Setup environment variables
- Copy file `.env.example` menjadi `.env.local`:
  ```bash
  cp .env.example .env.local
  ```
  atau salin manual dengan membuat file `.env.local` baru dan copy isi dari `.env.example`

- File `.env.local` sudah berisi nilai default untuk development:
  ```
  # Authentication
  JWT_SECRET=agrocycle-development-secret-key-2024

  # Database
  DB_HOST=localhost
  DB_USER=root
  DB_PASSWORD=
  DB_NAME=agrocycle
  ```

- Sesuaikan nilai di `.env.local` jika diperlukan (misalnya password database berbeda)

4. jalankan migrasi database dengan data dummy dengan perintah berikut:
```bash
node scripts/db-init.js
```
  
5. Jalankan development server
```bash
npm run dev
```

Aplikasi akan berjalan di [http://localhost:3000](http://localhost:3000)

> **Catatan Penting**: 
> - File `.env.local` tidak akan ter-commit ke Git (sudah ditambahkan ke .gitignore)
> - File `.env.example` adalah template dan TIDAK digunakan oleh aplikasi
> - Untuk production, gunakan JWT_SECRET yang berbeda dan lebih aman
> - Pastikan database MySQL sudah berjalan sebelum menjalankan aplikasi

## Features
- Plant swapping marketplace
- Real-time chat between users
- Point system for plant exchanges
- User profiles and plant management
