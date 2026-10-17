import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import PageHero from "@/components/ui/PageHero";
import ButtonLink from "@/components/ui/ButtonLink";
import Link from "@/i18n/Link";
import {
  GUIDES,
  PRICE_LOCK_STAGES,
  READINESS_BANDS,
  REFUND_POLICY,
  RTO_DOCUMENTS,
  RTO_ROLES,
  RTO_UNLOCK_MONTHS,
  RTO_UNLOCK_SCORE,
} from "@/data/rto";
import { GFORMS } from "@/data/google-forms";
import { waLink } from "@/data/site";

// Panduan program RTO per peran (arahan user Okt 2026: platform RTO harus punya guideline, MoU, dan NDA).
// Isinya ringkasan publik dari SOP RTO/01-15. Detail internal (PIC, SLA tim, nominal fee developer) tidak ditulis di sini.

export const metadata: Metadata = {
  title: "Panduan Rent-to-Own",
  description:
    "Panduan program Rent-to-Own barumahID untuk penyewa, penyedia kos, dan developer: langkah, syarat membuka RTO, aturan dana, dan dokumen perjanjian.",
  alternates: { canonical: "/layanan/rto/panduan" },
};

export default function RtoGuidePage() {
  return (
    <>
      <PageHero
        label="Panduan Rent-to-Own"
        title="Cara kerjanya, dari awal sampai akad."
        subtitle={
          <p>
            Panduan untuk tiga peran di program RTO barumahID. Program masih tahap persiapan, jadi ketentuan final tertulis di perjanjian
            yang kamu terima sebelum tanda tangan.
          </p>
        }
        image="/images/hero-card.webp"
        size="md"
      >
        {RTO_ROLES.map((r, i) => (
          <ButtonLink key={r.id} href={`#${r.id}`} variant={i === 0 ? "red" : "outline-light"} arrow={false}>
            {r.name}
          </ButtonLink>
        ))}
      </PageHero>

      {RTO_ROLES.map((role, ri) => {
        const g = GUIDES[role.id];
        const dark = ri === 1;
        return (
          <section key={role.id} id={role.id} className={`scroll-mt-20 ${dark ? "bg-brand-dark text-white" : ri === 0 ? "bg-brand-cream" : "bg-brand-cream-warm"}`}>
            <div className="mx-auto grid max-w-[1280px] gap-10 px-5 py-20 md:px-10 md:py-24 lg:grid-cols-12 lg:px-14">
              <div className="lg:col-span-4">
                <Reveal>
                  <p className="type-micro text-brand-red">Panduan 0{ri + 1}</p>
                  <h2 className={`mt-5 text-[clamp(1.8rem,3.6vw,2.6rem)] font-extrabold leading-[1.08] tracking-[-0.02em] ${dark ? "" : "text-brand-dark"}`}>
                    {role.name}
                  </h2>
                  <p className={`mt-4 text-[15px] leading-relaxed ${dark ? "text-white/65" : "text-brand-gray"}`}>{g.intro}</p>
                  <div className="mt-7">
                    <ButtonLink href={GFORMS[role.form.code]} variant="red">
                      {role.form.label}
                    </ButtonLink>
                  </div>
                </Reveal>
              </div>
              <div className="lg:col-span-8">
                <ol className={`border-t ${dark ? "border-white/15" : "border-brand-dark/10"}`}>
                  {g.steps.map((s, i) => (
                    <li key={s.title} className={`flex gap-5 border-b py-5 ${dark ? "border-white/15" : "border-brand-dark/10"}`}>
                      <span className="w-8 shrink-0 pt-0.5 text-[14px] font-black text-brand-red">{String(i + 1).padStart(2, "0")}</span>
                      <span>
                        <span className={`block text-[17px] font-extrabold leading-snug ${dark ? "" : "text-brand-dark"}`}>{s.title}</span>
                        <span className={`mt-1.5 block text-[14.5px] leading-relaxed ${dark ? "text-white/65" : "text-brand-gray"}`}>{s.body}</span>
                      </span>
                    </li>
                  ))}
                </ol>
                <ul className={`mt-6 space-y-2.5 rounded-3xl p-6 ${dark ? "bg-white/[0.06]" : "bg-white card-shadow"}`}>
                  {g.notes.map((n) => (
                    <li key={n} className={`flex gap-3 text-[14px] leading-relaxed ${dark ? "text-white/80" : "text-brand-dark"}`}>
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-red" aria-hidden="true" />
                      {n}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        );
      })}

      {/* Syarat membuka RTO dan skor */}
      <section id="skor" className="scroll-mt-20 bg-brand-cream">
        <div className="mx-auto max-w-[1280px] px-5 py-20 md:px-10 md:py-24 lg:px-14">
          <Reveal>
            <p className="type-micro text-brand-red">Syarat membuka RTO</p>
            <h2 className="mt-5 max-w-3xl text-[clamp(1.8rem,3.6vw,2.6rem)] font-extrabold leading-[1.08] tracking-[-0.02em] text-brand-dark">
              KTP terverifikasi, {RTO_UNLOCK_MONTHS} bulan bayar tepat waktu, skor minimal {RTO_UNLOCK_SCORE}.
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {READINESS_BANDS.map((b, i) => (
              <Reveal key={b.range} delay={i * 80}>
                <div className={`h-full rounded-3xl p-6 ${i === 1 ? "bg-brand-red text-white" : "bg-white card-shadow"}`}>
                  <p className={`text-[30px] font-black leading-none ${i === 1 ? "" : "text-brand-dark"}`}>{b.range}</p>
                  <p className={`mt-4 text-[17px] font-extrabold ${i === 1 ? "" : "text-brand-dark"}`}>{b.title}</p>
                  <p className={`mt-2 text-[14px] leading-relaxed ${i === 1 ? "text-white/85" : "text-brand-gray"}`}>{b.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <p className="mt-6 text-[13.5px] leading-relaxed text-brand-gray">
            Lima aspek skor dan bobotnya ada di{" "}
            <Link href="/layanan/rto#level" className="font-bold text-brand-dark underline-offset-4 hover:underline">
              halaman Rent-to-Own
            </Link>
            . Skor dihitung ulang setiap 6 bulan, atau lebih cepat kalau penghasilan atau asetmu berubah.
          </p>
        </div>
      </section>

      {/* Aturan dana */}
      <section id="dana" className="scroll-mt-20 bg-brand-dark text-white">
        <div className="mx-auto grid max-w-[1280px] gap-4 px-5 py-20 md:px-10 md:py-24 lg:grid-cols-2 lg:px-14">
          <div className="lg:col-span-2">
            <p className="type-micro text-brand-red">Aturan dana</p>
            <h2 className="mt-5 max-w-3xl text-[clamp(1.8rem,3.6vw,2.6rem)] font-extrabold leading-[1.08] tracking-[-0.02em]">
              Pengembalian saldo dan penguncian harga.
            </h2>
            <p className="mt-4 max-w-3xl text-[15px] leading-relaxed text-white/65">
              Saldo DP adalah dana titipan atas namamu di rekening terpisah atas nama perusahaan. Saldo tidak hilang saat kamu pindah jalur.
            </p>
          </div>
          <div className="mt-6 rounded-3xl bg-white/[0.06] p-6 md:p-7">
            <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-white/55">Kalau kamu mundur dari program</p>
            <table className="mt-4 w-full text-left text-[14px]">
              <tbody>
                {REFUND_POLICY.map((r) => (
                  <tr key={r.when} className="border-t border-white/10">
                    <td className="py-2.5 pr-4 text-white/80">{r.when}</td>
                    <td className="py-2.5 text-right text-[16px] font-extrabold">{r.back}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-3 text-[12.5px] leading-relaxed text-white/50">
              Persentase dari saldo DP. Ajukan lewat formulir pengembalian, dicairkan paling lambat 14 hari kerja.
            </p>
          </div>
          <div className="mt-6 rounded-3xl bg-white/[0.06] p-6 md:p-7">
            <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-white/55">Harga unit dikunci bertahap</p>
            <ol className="mt-4">
              {PRICE_LOCK_STAGES.map((s, i) => (
                <li key={s.at} className="flex gap-4 border-t border-white/10 py-2.5">
                  <span className={`w-28 shrink-0 text-[14px] font-extrabold ${i === 2 ? "text-brand-red" : ""}`}>{s.at}</span>
                  <span className="text-[14px] leading-snug text-white/75">{s.body}</span>
                </li>
              ))}
            </ol>
            <p className="mt-3 text-[12.5px] leading-relaxed text-white/50">Setelah PPJB ditandatangani, harga tidak bisa berubah.</p>
          </div>
        </div>
      </section>

      {/* Dokumen dan perjanjian */}
      <section id="dokumen" className="scroll-mt-20 bg-brand-cream-warm">
        <div className="mx-auto max-w-[1280px] px-5 py-20 md:px-10 md:py-24 lg:px-14">
          <Reveal>
            <p className="type-micro text-brand-red">Dokumen dan perjanjian</p>
            <h2 className="mt-5 max-w-3xl text-[clamp(1.8rem,3.6vw,2.6rem)] font-extrabold leading-[1.08] tracking-[-0.02em] text-brand-dark">
              Semua kesepakatan tertulis.
            </h2>
            <p className="mt-4 max-w-3xl text-[15px] leading-relaxed text-brand-gray">
              Setiap peran menandatangani dokumen yang sesuai. Salinannya nanti tersimpan di dashboard akunmu.
            </p>
          </Reveal>
          <div className="mt-10 overflow-hidden rounded-3xl bg-white card-shadow">
            <ul>
              {RTO_DOCUMENTS.map((d, i) => (
                <li key={d.name} className={`grid gap-1 px-6 py-5 md:grid-cols-12 md:items-center md:gap-4 ${i ? "border-t border-brand-dark/10" : ""}`}>
                  <span className="text-[16px] font-extrabold text-brand-dark md:col-span-4">{d.name}</span>
                  <span className="text-[14px] text-brand-gray md:col-span-4">{d.who}</span>
                  <span className="text-[14px] text-brand-dark md:col-span-4">{d.when}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <ButtonLink href={waLink("Halo barumahID, saya mau membaca draf perjanjian program Rent-to-Own.")} variant="whatsapp" arrow={false}>
              Minta draf perjanjian
            </ButtonLink>
            <ButtonLink href="/layanan/rto" variant="outline-dark">
              Kembali ke Rent-to-Own
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
