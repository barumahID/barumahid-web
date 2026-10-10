import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/ui/PageHero";
import ButtonLink from "@/components/ui/ButtonLink";
import { EMAIL } from "@/data/site";

export const metadata: Metadata = {
  title: "Karier",
  description: "Bergabung dengan tim barumahID di Padang. Lihat posisi yang dibuka dan cara melamar.",
  alternates: { canonical: "/rekrutmen" },
};

// Halaman dibangun ulang tiap jam supaya status buka/tutup mengikuti tanggal.
export const revalidate = 3600;

// Batch rekrutmen. Tambah batch baru di sini, cukup ubah tanggal tutup dan link form.
const BATCH = {
  name: "Rekrutmen Juli 2026",
  closesAt: "2026-07-31T23:59:59+07:00",
  closesLabel: "31 Juli 2026",
  formUrl: process.env.NEXT_PUBLIC_FORM_REKRUTMEN || "",
  positions: [
    { title: "Marketing Specialist", dept: "Marketing", location: "Padang atau remote" },
    { title: "Customer Administration", dept: "Operasional", location: "Padang" },
    { title: "AI Engineer", dept: "Teknologi", location: "Remote" },
    { title: "BIM Modeller", dept: "Engineering", location: "Padang atau remote" },
    { title: "Arsitek", dept: "Desain", location: "Padang" },
    { title: "Desainer Interior dan Eksterior", dept: "Desain", location: "Padang atau remote" },
  ],
};

export default function RekrutmenPage() {
  const open = new Date() <= new Date(BATCH.closesAt);
  return (
    <>
      <PageHero
        label="Karier"
        title="Ikut membangun jalan orang punya rumah."
        subtitle={
          <p>
            Tim kami kecil dan bergerak cepat. Kami mencari orang yang mau belajar di lapangan, jujur soal angka, dan
            betah mengurus detail.
          </p>
        }
        size="sm"
      />

      <section className="bg-brand-cream">
        <div className="mx-auto max-w-[1280px] px-5 py-16 md:px-10 md:py-24 lg:px-14">
          <div
            className={`rounded-3xl p-6 md:p-8 ${open ? "bg-brand-red text-white" : "border border-brand-dark/10 bg-white text-brand-dark"}`}
          >
            <p className="text-[13px] font-semibold uppercase tracking-[0.16em] opacity-70">{BATCH.name}</p>
            <p className="mt-2 text-[22px] font-extrabold">
              {open ? `Dibuka sampai ${BATCH.closesLabel}` : `Sudah ditutup pada ${BATCH.closesLabel}`}
            </p>
            <p className={`mt-2 max-w-2xl text-[15px] leading-relaxed ${open ? "text-white/85" : "text-brand-gray"}`}>
              {open
                ? "Pilih posisi di bawah, lalu isi formulir lamaran."
                : "Terima kasih untuk semua pelamar. Batch berikutnya kami umumkan di Instagram @barumahid dan halaman ini."}
            </p>
          </div>

          <h2 className="mt-14 text-[clamp(1.5rem,2.8vw,2.1rem)] font-extrabold tracking-tight text-brand-dark">
            {open ? "Posisi yang dibuka" : "Posisi di batch terakhir"}
          </h2>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {BATCH.positions.map((p) => (
              <li key={p.title} className={`rounded-2xl border border-brand-dark/10 bg-white p-5 ${open ? "" : "opacity-70"}`}>
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-brand-red">{p.dept}</p>
                <p className="mt-2 text-[17px] font-extrabold text-brand-dark">{p.title}</p>
                <p className="mt-1 text-[13px] text-brand-gray">{p.location}</p>
                {open && BATCH.formUrl && (
                  <a
                    href={BATCH.formUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex rounded-full bg-brand-dark px-4 py-2 text-[13px] font-bold text-white hover:bg-brand-red"
                  >
                    Lamar posisi ini
                  </a>
                )}
              </li>
            ))}
          </ul>

          <div className="mt-14 grid gap-4 md:grid-cols-2">
            <div className="rounded-3xl bg-brand-dark p-7 text-white">
              <p className="text-[19px] font-extrabold">Belum ada posisi yang cocok?</p>
              <p className="mt-2 text-[15px] leading-relaxed text-white/70">
                Kirim CV dan portofolio ke email kami dengan subjek &quot;Lamaran umum&quot;. Kami simpan untuk batch berikutnya.
              </p>
              <div className="mt-5">
                <ButtonLink href={`mailto:${EMAIL}?subject=Lamaran%20umum`} variant="light">
                  Kirim CV lewat email
                </ButtonLink>
              </div>
            </div>
            <div className="rounded-3xl border border-brand-dark/10 bg-white p-7">
              <p className="text-[19px] font-extrabold text-brand-dark">Lebih suka kerja per proyek?</p>
              <p className="mt-2 text-[15px] leading-relaxed text-brand-gray">
                Arsitek, drafter, estimator, dan modeller bisa gabung sebagai freelancer lewat mitrabarumahID Projectlink.
              </p>
              <Link
                href="/kemitraan/daftar/projectlink"
                className="mt-5 inline-flex items-center gap-2 text-[14px] font-bold text-brand-red hover:text-brand-red-dark"
              >
                Daftar Projectlink →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
