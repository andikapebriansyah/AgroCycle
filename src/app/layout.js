'use client';

import './globals.css';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import { usePathname } from 'next/navigation';

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const hideLayout = pathname === '/landing-page'; // hanya sembunyi di landing page

  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        {!hideLayout && <Navbar />}
        <main className="flex-grow">{children}</main>
        {!hideLayout && <Footer />}
      </body>
    </html>
  );
}
