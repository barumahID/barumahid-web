import type { Metadata, Viewport } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FloatingWhatsApp from "@/components/layout/FloatingWhatsApp";
import ScrollProgress from "@/components/ScrollProgress";
import { ADDRESSES, EMAIL, SITE, WA_ADMIN_1, activeChannels } from "@/data/site";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "barumahID | Sewa hari ini, miliki hunian nantinya",
    template: "%s | barumahID",
  },
  description: SITE.description,
  applicationName: SITE.name,
  keywords: [
    "rent to own",
    "sewa beli rumah",
    "tabungan DP rumah",
    "jasa gambar rumah",
    "jasa analisa struktur",
    "renovasi rumah Padang",
    "kontraktor Padang",
    "barumahID",
  ],
  openGraph: {
    siteName: SITE.name,
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
  icons: {
    icon: [{ url: "/favicon.ico" }, { url: "/brand/logo-circle-192.png", type: "image/png", sizes: "192x192" }],
    apple: "/brand/logo-circle-192.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#141414",
};

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": `${SITE.url}/#organisasi`,
  name: SITE.name,
  legalName: SITE.company,
  url: SITE.url,
  logo: `${SITE.url}/brand/logo-circle-512.png`,
  image: `${SITE.url}/opengraph-image.jpg`,
  description: SITE.description,
  email: EMAIL,
  telephone: `+${WA_ADMIN_1}`,
  foundingDate: "2018-11-11",
  address: {
    "@type": "PostalAddress",
    streetAddress: ADDRESSES.hq.lines[0],
    addressLocality: "Padang",
    addressRegion: "Sumatera Barat",
    addressCountry: "ID",
  },
  areaServed: "ID",
  sameAs: activeChannels()
    .filter((c) => c.href.startsWith("http") && !c.href.includes("wa.me"))
    .map((c) => c.href),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${montserrat.variable} antialiased`}>
      <body className="flex min-h-screen flex-col bg-brand-cream text-brand-dark">
        <noscript>
          <style>{`.reveal{opacity:1!important;transform:none!important}`}</style>
        </noscript>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <a
          href="#konten"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-brand-red focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-white focus:shadow-lg"
        >
          Langsung ke konten utama
        </a>
        <ScrollProgress />
        <Navbar />
        <main id="konten" className="flex-1">
          {children}
        </main>
        <Footer />
        <FloatingWhatsApp />
      </body>
    </html>
  );
}
