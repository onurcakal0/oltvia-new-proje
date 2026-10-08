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
    <html lang="tr">
      <body className="bg-gray-50 text-slate-900 min-h-screen">
        {children}
      </body>
    </html>
  );
}
