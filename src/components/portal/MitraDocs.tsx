import Link from "next/link";
import { WA_ADMIN_1, waLink } from "@/data/site";
import { DOC_LABEL, DOC_VERSION, DOC_WHEN, DOCS_BY_ROLE, dateLabel, type AgreementDoc, type RtoAgreement } from "@/lib/rto";
import { NdaAcceptForm } from "./RtoForms";

// Dokumen kerja sama mitra RTO (penyedia kos atau developer), selaras dengan Legal Kit v2 dan halaman panduan.
// S&K disetujui saat membuat akun, NDA bisa disetujui di sini (klik), MoU dicatat tim setelah ditandatangani.
// Draf dokumen tidak ada di repo (berisi model bisnis); mitra memintanya lewat admin.

/** Dokumen dianggap selesai kalau sudah tercatat; NDA harus versi yang berlaku */
export function signedOf(agreements: RtoAgreement[], doc: AgreementDoc) {
  return agreements.find((a) => a.doc === doc && (doc !== "nda" || a.version === DOC_VERSION.nda)) ?? null;
}

export default function MitraDocs({ role, agreements, name }: { role: "penyedia" | "developer"; agreements: RtoAgreement[]; name: string }) {
  const docs = DOCS_BY_ROLE[role];
  const wa = waLink(`Halo Admin barumahID, saya ${name}. Mohon kirim draf MoU dan NDA untuk ${role === "developer" ? "developer mitra" : "mitra penyedia"}.`, WA_ADMIN_1);
  return (
    <section className="rounded-2xl border border-brand-dark/10 bg-white p-5 md:p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-[16px] font-extrabold">Dokumen kerja sama</h2>
        <span className="text-[12.5px] text-brand-gray">
          {docs.filter((d) => signedOf(agreements, d)).length} dari {docs.length} selesai
        </span>
      </div>
      <ul className="mt-3 divide-y divide-brand-dark/[0.07]">
        {docs.map((d) => {
          const a = signedOf(agreements, d);
          return (
            <li key={d} className="py-2.5 text-[13.5px]">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-semibold text-brand-dark">{DOC_LABEL[d]}</span>
                {a ? (
                  <span className="text-[12.5px] font-semibold text-[#2D7A4F]">
                    {a.method === "klik" ? "Disetujui" : "Ditandatangani"} {dateLabel(a.signed_on ?? a.created_at)} · {a.version}
                  </span>
                ) : (
                  <span className="text-[12.5px] text-brand-mute">{DOC_WHEN[d]}</span>
                )}
              </div>
              {d === "nda" && !a && (
                <div className="mt-2 rounded-xl bg-brand-cream px-3 py-3">
                  <NdaAcceptForm />
                </div>
              )}
            </li>
          );
        })}
      </ul>
      <p className="mt-3 text-[12.5px] leading-relaxed text-brand-gray">
        MoU ditandatangani bersama tim, lalu statusnya diperbarui di sini.{" "}
        <a href={wa} target="_blank" rel="noopener noreferrer" className="font-semibold text-[#1f9d55] hover:underline">
          Minta draf MoU dan NDA
        </a>{" "}
        ·{" "}
        <Link href={`/layanan/rto/panduan#${role}`} className="font-semibold text-brand-dark underline underline-offset-2">
          Baca panduan
        </Link>
      </p>
    </section>
  );
}
