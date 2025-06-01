import { redirect } from 'next/navigation';

export const metadata = {
  title: 'AgroCycle - Ekonomi Sirkular untuk Pertanian Berkelanjutan',
  description: 'Platform untuk mendukung pertanian berkelanjutan, urban farming, dan ekonomi sirkular di Indonesia',
};

export default function Home() {
  redirect('/landing-page');
} 