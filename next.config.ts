import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Jangan umumkan framework di header respons
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  // Rute lama tetap hidup supaya link yang sudah tersebar di Instagram dan WhatsApp tidak mati.
  // permanent: true = status 308 (setara 301 untuk mesin pencari).
  async redirects() {
    const list = [
      { source: "/rto", destination: "/layanan/rto", permanent: true },
      { source: "/program-rto", destination: "/layanan/rto", permanent: true },
      { source: "/ekosistem", destination: "/layanan/rto", permanent: true },
      { source: "/services", destination: "/layanan/contech", permanent: true },
      { source: "/services/:path*", destination: "/layanan/contech", permanent: true },
      // Nama lini diganti ConsTech -> ConTech (Okt 2026); link lama tetap jalan.
      { source: "/layanan/constech", destination: "/layanan/contech", permanent: true },
      // Halaman portofolio dihapus (arahan user Okt 2026); karya tiap jasa ada di halaman ConTech.
      { source: "/portofolio", destination: "/layanan/contech", permanent: true },
      { source: "/mitra", destination: "/kemitraan", permanent: true },
      { source: "/daftar", destination: "/masuk", permanent: true },
      // Form per peran di situs diganti Google Form resmi di halaman Kemitraan (arahan user Okt 2026)
      { source: "/kemitraan/daftar/:peran", destination: "/kemitraan#formulir", permanent: true },
    ];
    // Versi bahasa Inggris (/en/...) dari alamat lama yang sama
    return [...list, ...list.map((r) => ({ ...r, source: `/en${r.source}`, destination: `/en${r.destination}` }))];
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
