import type { Metadata, Viewport } from "next";
import { Montserrat } from "next/font/google";
import "../globals.css";

// Root layout Portal barumahID (/portal), terpisah dari situs utama di app/[lang]: tanpa navbar situs, tidak
// diindeks mesin pencari, bahasa Indonesia saja.

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: { default: "Portal barumahID", template: "%s | Portal barumahID" },
  description: "Portal mitra dan tim barumahID.",
  robots: { index: false, follow: false },
  icons: { icon: [{ url: "/favicon.ico" }, { url: "/brand/logo-icon-192.png", type: "image/png", sizes: "192x192" }] },
};

export const viewport: Viewport = { themeColor: "#141414" };

// Halaman portal bergantung pada sesi login, jadi selalu dirender per permintaan
export const dynamic = "force-dynamic";

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={montserrat.variable}>
      <body className="min-h-screen bg-brand-cream font-sans text-brand-dark antialiased">{children}</body>
    </html>
  );
}
