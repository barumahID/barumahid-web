import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import ServiceCards from "@/components/home/ServiceCards";
import ClosingCta from "@/components/home/ClosingCta";
import { LAYANAN_CARDS } from "@/data/beranda";

export const metadata: Metadata = {
  title: "Layanan",
  description: "Tiga layanan barumahID: Rent-to-Own untuk calon pemilik rumah, ConsTech untuk pemilik proyek, dan Kemitraan.",
  alternates: { canonical: "/layanan" },
};

export default function LayananPage() {
  return (
    <>
      <PageHero
        label="Layanan"
        title="Dari sewa, bangun, sampai punya rumah."
        subtitle={<p>Pilih layanan sesuai kebutuhanmu. Semua bisa dimulai dengan konsultasi gratis.</p>}
        image="/images/hero-kolase.webp"
        size="sm"
      />
      <ServiceCards
        id="layanan"
        eyebrow="Tiga layanan, satu tujuan"
        title="Pilih pintu yang paling pas buat kamu."
        intro="Mau punya rumah, butuh jasa konstruksi, atau ingin jadi bagian dari ekosistemnya. Semua dimulai dari sini."
        items={LAYANAN_CARDS}
      />
      <ClosingCta />
    </>
  );
}
