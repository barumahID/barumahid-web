import type { Metadata } from "next";
import ScrollExpandHero from "@/components/sections/ScrollExpandHeroSection";
import BerandaTabs from "@/components/home/BerandaTabs";
import PetaProyek from "@/components/home/PetaProyek";
import ProblemSection from "@/components/home/ProblemSection";
import ServiceCards from "@/components/home/ServiceCards";
import LogoMarquee from "@/components/home/LogoMarquee";
import FaqTestimonials from "@/components/home/FaqTestimonials";
import ClosingCta from "@/components/home/ClosingCta";
import { JASA_CARDS } from "@/data/beranda";
import { waLink } from "@/data/site";

export const metadata: Metadata = {
  title: { absolute: "barumahID | Proyekmu, dibikin mudah aja" },
  description:
    "Jasa gambar, analisa struktur, renovasi, dan bangun dari tim insinyur barumahID. Biaya dihitung per item pekerjaan dengan AHSP. Ada juga program Rent-to-Own.",
  alternates: { canonical: "/" },
};

// Beranda punya 2 tab (arahan user): Konstruksi (halaman ini) dan Rent-to-Own (/rent-to-own).
// UI sama dengan beranda revamp, isinya fokus konstruksi. Peta proyek jadi sorotan utama.
export default function Home() {
  return (
    <>
      <BerandaTabs active="konstruksi" />
      <ScrollExpandHero variant="konstruksi" />
      <PetaProyek />
      <ProblemSection variant="konstruksi" />
      <ServiceCards
        id="jasa"
        eyebrow="Tiga jasa, satu tim"
        title="Dari gambar sampai jadi bangunan."
        intro="Pilih jasa yang kamu butuhkan. Pengertian, isi paket, harga, dan contoh proyeknya ada di halaman layanan."
        items={JASA_CARDS}
      />
      <LogoMarquee />
      <FaqTestimonials />
      <ClosingCta
        title="Ceritakan proyekmu."
        body="Kirim gambar atau rencanamu, kami bantu hitung kebutuhannya. Konsultasi pertama gratis."
        primaryLabel="Konsultasi gratis via WhatsApp"
        primaryHref={waLink("Halo barumahID, saya mau konsultasi proyek konstruksi.")}
        secondaryLabel="Lihat jasa dan harga"
        secondaryHref="/layanan/constech"
      />
    </>
  );
}
