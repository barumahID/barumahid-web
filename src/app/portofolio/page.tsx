import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/ui/PageHero";
import PortfolioGrid from "@/components/portfolio/PortfolioGrid";
import ClosingCta from "@/components/home/ClosingCta";
import { PORTFOLIO, STATS, verifiedCities } from "@/data/projects";
import { waLink } from "@/data/site";

export const metadata: Metadata = {
  title: "Portofolio Proyek",
  description: "Karya barumahID: desain rumah, analisa struktur, renovasi, dan bangun. 30+ proyek di Sumatera Barat, Jawa Barat, Banten, dan Sulawesi Barat.",
  alternates: { canonical: "/portofolio" },
};

export default function PortofolioPage() {
  return (
    <>
      <PageHero
        label="Portofolio"
        title="Karya nyata dari lapangan."
        subtitle={
          <p>
            {STATS.projects}+ proyek sejak {STATS.since}, di {verifiedCities().length} kota. Yang tampil di sini adalah proyek yang
            dokumentasinya sudah kami publikasikan. Arsip lainnya terus kami rapikan.
          </p>
        }
        image="/images/hero-kolase.webp"
        size="md"
      />
      <section className="bg-brand-cream">
        <div className="mx-auto max-w-[1280px] px-5 py-14 md:px-10 md:py-20 lg:px-14">
          <PortfolioGrid items={PORTFOLIO} />
          <p className="mt-12 text-[14px] text-brand-gray">
            Ingin lihat sebaran proyek per kota?{" "}
            <Link href="/layanan/contech#peta" className="font-bold text-brand-dark underline underline-offset-4 hover:text-brand-red">
              Buka peta proyek
            </Link>
          </p>
        </div>
      </section>
      <ClosingCta
        title="Proyek berikutnya bisa punyamu."
        body="Konsultasi pertama gratis, untuk desain, struktur, renovasi, atau bangun."
        primaryLabel="Konsultasi via WhatsApp"
        primaryHref={waLink("Halo barumahID, saya lihat portofolionya dan mau konsultasi proyek.")}
        secondaryLabel="Lihat harga jasa"
        secondaryHref="/layanan/contech#harga"
      />
    </>
  );
}
