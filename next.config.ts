import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
  },
  // Rute lama tetap hidup supaya link yang sudah tersebar di Instagram dan WhatsApp tidak mati.
  // permanent: true = status 308 (setara 301 untuk mesin pencari).
  async redirects() {
    return [
      { source: "/rto", destination: "/layanan/rto", permanent: true },
      { source: "/program-rto", destination: "/layanan/rto", permanent: true },
      { source: "/ekosistem", destination: "/layanan/rto", permanent: true },
      { source: "/services", destination: "/layanan/contech", permanent: true },
      { source: "/services/:path*", destination: "/layanan/contech", permanent: true },
      // Nama lini diganti ConsTech -> ConTech (Okt 2026); link lama tetap jalan.
      { source: "/layanan/constech", destination: "/layanan/contech", permanent: true },
      // Halaman portofolio dihapus (arahan user Okt 2026); portofolio pilihan ada di halaman ConTech.
      { source: "/portofolio", destination: "/layanan/contech#portofolio", permanent: true },
      { source: "/mitra", destination: "/kemitraan", permanent: true },
      { source: "/daftar", destination: "/masuk", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
