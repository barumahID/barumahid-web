import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ScrollProgress from "@/components/ScrollProgress";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: {
    default: "barumahID — Platform Pendamping Kepemilikan Rumah",
    template: "%s | barumahID",
  },
  description:
    "barumahID membantu kamu dari penyewa menjadi pemilik rumah. Program Rent-to-Own, layanan konstruksi profesional, dan ekosistem DP acceleration.",
  keywords: [
    "rent to own",
    "rumah sewa beli",
    "KPR",
    "konstruksi",
    "barumahID",
    "properti Indonesia",
    "Padang",
  ],
  openGraph: {
    siteName: "barumahID",
    locale: "id_ID",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${montserrat.variable} antialiased`}>
      <body className="flex min-h-screen flex-col bg-brand-cream text-brand-dark">
        <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-brand-red focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-white focus:shadow-lg">
          Langsung ke konten utama
        </a>
        <ScrollProgress />
        <Navbar />
        <main id="main-content" className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
