import Reveal from "@/components/Reveal";
import Section from "@/components/ui/Section";
import SectionLabel from "@/components/ui/SectionLabel";
import AccordionFAQ from "@/components/ui/AccordionFAQ";

const faqItems = [
  {
    question: "Apa itu barumahID?",
    answer:
      "barumahID adalah platform pendamping kepemilikan rumah yang membantu kamu dari penyewa menjadi pemilik. Kami menyediakan program Rent-to-Own dan layanan konstruksi profesional LBAG.",
  },
  {
    question: "Bagaimana cara kerja program Rent-to-Own?",
    answer:
      "Kamu menyewa unit dari mitra barumahID. Setiap bulan, 25% dari sewa otomatis masuk tabungan DP. Saat DP cukup, kamu bisa mengkonversi ke kepemilikan melalui jalur yang sesuai kondisi finansialmu.",
  },
  {
    question: "Berapa yang masuk ke tabungan DP saya setiap bulan?",
    answer:
      "25% dari biaya sewa bulanan otomatis tersimpan sebagai tabungan DP kamu. Selain itu, kamu juga bisa mengumpulkan poin tambahan dari ekosistem barumahID (Kosanesia, GreenPoint, dll) yang sedang dikembangkan.",
  },
  {
    question: "Apakah ada biaya untuk daftar?",
    answer:
      "Tidak ada biaya pendaftaran. Kamu cukup mengisi form minat dan tim kami akan menghubungi untuk menjelaskan detail program.",
  },
  {
    question: "Di kota mana saja barumahID beroperasi?",
    answer:
      "Saat ini pilot market kami di Padang, Jambi, Palembang, dan Riau. Kami berencana ekspansi ke kota-kota lain di Indonesia.",
  },
  {
    question: "Apa bedanya barumahID dengan beli properti biasa?",
    answer:
      "barumahID menyediakan jalur alternatif selain KPR konvensional. Kamu mulai dari menyewa, lalu DP terakumulasi dari sewa itu sendiri. Ini cocok untuk yang belum memenuhi syarat KPR bank atau belum punya DP cukup.",
  },
  {
    question: "Bagaimana dengan layanan konstruksi barumahID?",
    answer:
      "barumahID juga aktif di layanan konstruksi melalui ConsTech LBAG — meliputi jasa gambar, analisa struktur, renovasi dan pembangunan. Fee kompetitif 8–14% dari RAB proyek.",
  },
  {
    question: "Kapan program RTO mulai bisa diikuti?",
    answer:
      "Program pertama sedang dipersiapkan. Daftar minat sekarang agar kamu jadi yang pertama mendapat info saat program diluncurkan.",
  },
];

export default function FAQSection() {
  return (
    <Section background="white" id="faq">
      <Reveal>
        <SectionLabel>FAQ</SectionLabel>
        <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-brand-dark sm:text-4xl">
          Pertanyaan yang sering ditanyakan
        </h2>
      </Reveal>

      <Reveal delay={100}>
        <div className="mt-10 max-w-3xl">
          <AccordionFAQ items={faqItems} />
        </div>
      </Reveal>
    </Section>
  );
}
