import type { Metadata } from "next";
import ScrollExpandHero from "@/components/sections/ScrollExpandHeroSection";
import BerandaTabs from "@/components/home/BerandaTabs";
import ProblemSection from "@/components/home/ProblemSection";
import ServiceCards from "@/components/home/ServiceCards";
import LogoMarquee from "@/components/home/LogoMarquee";
import FaqTestimonials from "@/components/home/FaqTestimonials";
import ClosingCta from "@/components/home/ClosingCta";
import { RTO_CARDS } from "@/data/beranda";
import { RTO_FAQ } from "@/data/rto";
import { waLink } from "@/data/site";

export const metadata: Metadata = {
  title: "Rent-to-Own: Sewa Hari Ini, Miliki Hunian Nantinya",
  description:
    "Beranda Rent-to-Own barumahID. Sewa sambil menabung DP, 25% dari sewa dicatat jadi saldo DP. Pilih jalur Siap Berdaya, Siap Bangun, atau Siap Beli.",
  alternates: { canonical: "/rent-to-own" },
};

// Tab kedua beranda (arahan user). UI sama dengan beranda Konstruksi, isinya fokus Rent-to-Own.
// Kartu jalur mengarah ke penjelasan lengkap di /layanan/rto.
export default function BerandaRentToOwn() {
  return (
    <>
      <BerandaTabs active="rto" />
      <ScrollExpandHero variant="rto" />
      <ProblemSection variant="rto" />
      <ServiceCards
        id="jalur-rto"
        eyebrow="Tiga jalur menuju rumah"
        title="Pilih jalur yang paling pas buat kamu."
        intro="Program masih tahap persiapan. Pelajari tiap jalur, coba simulasi DP, lalu daftar minat supaya dapat kabar pertama."
        items={RTO_CARDS}
      />
      <LogoMarquee />
      <FaqTestimonials faq={RTO_FAQ} />
      <ClosingCta
        title="Mulai dari satu obrolan."
        body="Ceritakan rencanamu punya rumah. Konsultasi pertama gratis."
        primaryLabel="Konsultasi gratis via WhatsApp"
        primaryHref={waLink("Halo barumahID, saya tertarik program Rent-to-Own.")}
        secondaryLabel="Daftar minat RTO"
        secondaryHref="/layanan/rto#daftar"
      />
    </>
  );
}
