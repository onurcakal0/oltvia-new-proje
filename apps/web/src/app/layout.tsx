import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'OLTVIA Platform',
  description: 'B2B/B2C Yapay Zeka Destekli Eğitim Platformu',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" className="dark">
      <body className="bg-[#14161A] text-[#E2E8F0] min-h-screen antialiased transition-colors duration-300">
        {children}
      </body>
    </html>
  );
}
