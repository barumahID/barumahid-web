import type { Metadata } from "next";
import ScrollExpandHero from "@/components/sections/ScrollExpandHeroSection";
import { alternates, pageLang } from "@/i18n/server";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await pageLang(params);
  return { alternates: alternates(lang, "/") };
}

// Beranda bersih (arahan user, gaya tikalindustries.com): hero scroll-expand, lalu langsung 2 gambar besar
// Jasa Konstruksi dan Rent-to-Own. Cerita, misi, peta proyek, masalah, event, dan kanal resmi ada di /tentang.
export default function Home() {
  return <ScrollExpandHero />;
}
