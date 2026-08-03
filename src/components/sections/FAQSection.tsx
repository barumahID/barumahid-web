import Reveal from "@/components/Reveal";
import Section from "@/components/ui/Section";
import SectionLabel from "@/components/ui/SectionLabel";
import AccordionFAQ from "@/components/ui/AccordionFAQ";

const faqItems = [
  {
    question: "Apa itu barumahID?",
    answer: "Platform pendamping kepemilikan rumah — membantu kamu dari penyewa jadi pemilik lewat program Rent-to-Own dan layanan konstruksi profesional.",
  },
  {
    question: "Bagaimana cara kerja program Rent-to-Own?",
    answer: "Kamu menyewa unit mitra barumahID. Setiap bulan, 25% sewa otomatis masuk tabungan DP. Saat DP cukup, jalur konversi kepemilikan terbuka sesuai kondisi finansialmu.",
  },
  {
    question: "Berapa yang masuk ke tabungan DP setiap bulan?",
    answer: "25% dari sewa bulanan. Kamu juga bisa menambah lewat ekosistem barumahID (Kosanesia, GreenPoint, dll) yang sedang dikembangkan.",
  },
  {
    question: "Apakah ada biaya untuk daftar?",
    answer: "Tidak ada biaya pendaftaran. Cukup isi form minat dan tim kami akan menghubungi untuk penjelasan detail program.",
  },
  {
    question: "Di kota mana saja barumahID beroperasi?",
    answer: "Pilot market di Padang, Jambi, Palembang, dan Riau. Rencana ekspansi ke kota lain di Indonesia.",
  },
  {
    question: "Apa bedanya dengan beli properti biasa?",
    answer: "Jalur alternatif selain KPR konvensional. Mulai dari sewa — DP terakumulasi dari sewa itu sendiri. Cocok untuk yang belum memenuhi syarat KPR atau belum punya DP cukup.",
  },
  {
    question: "Bagaimana dengan layanan konstruksi?",
    answer: "ConsTech LBAG — jasa gambar, analisa struktur, renovasi dan pembangunan. Fee kompetitif 8–14% dari RAB proyek.",
  },
  {
    question: "Kapan program RTO mulai bisa diikuti?",
    answer: "Program pertama sedang dipersiapkan. Daftar minat sekarang agar jadi yang pertama mendapat info saat program diluncurkan.",
  },
];

export default function FAQSection() {
  return (
    <Section background="cream" id="faq">
      <Reveal>
        <div className="grid gap-6 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <SectionLabel number="10">FAQ</SectionLabel>
            <h2 className="mt-6 type-h1 text-brand-dark">
              Pertanyaan yang<br />sering ditanyakan.
            </h2>
          </div>
        </div>
      </Reveal>

      <Reveal delay={100}>
        <div className="mt-16 md:mt-20 max-w-4xl">
          <AccordionFAQ items={faqItems} />
        </div>
      </Reveal>
    </Section>
  );
}
