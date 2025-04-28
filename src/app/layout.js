'use client';

import './globals.css';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import { usePathname } from 'next/navigation';

export default function RootLayout({ children }) {
  const pathname = usePathname();
  
  // Hide layout on landing page, login page, and register page
  const hideLayout = pathname === '/landing-page' || 
                    pathname === '/login' || 
                    pathname === '/register';

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