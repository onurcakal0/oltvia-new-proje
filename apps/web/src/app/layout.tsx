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
      <body className="bg-black text-[#F2F1ED] min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
