// src/app/landing-page/layout.js
export const metadata = {
    title: 'AgroCycle - Landing Page',
    description: 'Selamat datang di platform pertanian berkelanjutan',
  };
  
  export default function LandingLayout({ children }) {
    return (
      <html lang="id">
        <body>
          {children} {/* Tidak ada Navbar/Footer di sini */}
        </body>
      </html>
    );
  }
  