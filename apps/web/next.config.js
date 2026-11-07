/** @type {import('next').NextConfig} */

// Temel güvenlik header'ları. Sıkı bir Content-Security-Policy henüz eklenmedi: sayfalarda yoğun
// inline style ve Google Fonts @import kullanılıyor; CSP önce report-only modda denenmelidir.
const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=()' },
];

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }];
  },
};

module.exports = nextConfig;
