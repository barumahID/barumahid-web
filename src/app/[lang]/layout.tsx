import type { Metadata, Viewport } from "next";
import { Montserrat } from "next/font/google";
import "../globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FloatingWhatsApp from "@/components/layout/FloatingWhatsApp";
import ScrollProgress from "@/components/ScrollProgress";
import TranslationNotice from "@/components/layout/TranslationNotice";
import { ADDRESSES, EMAIL, SITE, WA_ADMIN_1, activeChannels } from "@/data/site";
import { LANGS, isLang, type Lang } from "@/i18n/config";
import { LangProvider } from "@/i18n/LangProvider";
import { makeT } from "@/i18n/t";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

// Dua bahasa dibangun statis: /id (ditulis ulang dari alamat tanpa awalan oleh src/proxy.ts) dan /en.
export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}
export const dynamicParams = false;

type Props = { children: React.ReactNode; params: Promise<{ lang: string }> };

const langOf = async (params: Props["params"]): Promise<Lang> => {
  const { lang } = await params;
  return isLang(lang) ? lang : "id";
};

export async function generateMetadata({ params }: Omit<Props, "children">): Promise<Metadata> {
  const lang = await langOf(params);
  const t = makeT(lang);
  return {
    metadataBase: new URL(SITE.url),
    title: {
      default: t("barumahID | Sewa hari ini, miliki hunian nantinya"),
      template: "%s | barumahID",
    },
    description: t(SITE.description),
    applicationName: SITE.name,
    keywords:
      lang === "en"
        ? ["rent to own Indonesia", "house down payment savings", "house design services", "structural analysis services", "home renovation Padang", "general contractor Padang", "barumahID"]
        : ["rent to own", "sewa beli rumah", "tabungan DP rumah", "jasa gambar rumah", "jasa analisa struktur", "renovasi rumah Padang", "kontraktor Padang", "barumahID"],
    openGraph: {
      siteName: SITE.name,
      locale: lang === "en" ? "en_US" : "id_ID",
      alternateLocale: lang === "en" ? "id_ID" : "en_US",
      type: "website",
      images: [{ url: "/opengraph-image.jpg", width: 1200, height: 630, alt: t("barumahID: Sewa hari ini, miliki hunian nantinya.") }],
    },
    twitter: {
      card: "summary_large_image",
      images: ["/opengraph-image.jpg"],
    },
    icons: {
      icon: [{ url: "/favicon.ico" }, { url: "/brand/logo-icon-192.png", type: "image/png", sizes: "192x192" }],
      apple: "/brand/logo-icon-192.png",
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#141414",
};

export default async function RootLayout({ children, params }: Props) {
  const lang = await langOf(params);
  const t = makeT(lang);
  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${SITE.url}/#organisasi`,
    name: SITE.name,
    legalName: SITE.company,
    url: SITE.url,
    logo: `${SITE.url}/brand/logo-icon-512.png`,
    image: `${SITE.url}/opengraph-image.jpg`,
    description: t(SITE.description),
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

  return (
    <html lang={lang} className={`${montserrat.variable} antialiased`}>
      <body className="flex min-h-screen flex-col bg-brand-cream text-brand-dark">
        <noscript>
          <style>{`.reveal{opacity:1!important;transform:none!important}`}</style>
        </noscript>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
        <LangProvider lang={lang}>
          <a
            href="#konten"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-brand-red focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-white focus:shadow-lg"
          >
            {t("Langsung ke konten utama")}
          </a>
          <ScrollProgress />
          <Navbar />
          <main id="konten" className="flex-1">
            <TranslationNotice />
            {children}
          </main>
          <Footer lang={lang} />
          <FloatingWhatsApp lang={lang} />
        </LangProvider>
      </body>
    </html>
  );
}
