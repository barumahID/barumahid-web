import type { Metadata } from "next";
import Link from "@/i18n/Link";
import PageHero from "@/components/ui/PageHero";
import { MASUK_OPTIONS } from "@/data/masuk";

export const metadata: Metadata = {
  title: "Masuk",
  description: "Pilih peranmu di ekosistem barumahID: calon pemilik rumah, klien konstruksi, atau mitra.",
  alternates: { canonical: "/masuk" },
};

export default function MasukPage() {
  return (
    <>
      <PageHero
        label="Masuk"
        title="Kamu datang sebagai siapa?"
        subtitle={
          <p>
            Klien konstruksi langsung ke form layanan. Penyewa, mitra, dan tim barumahID masuk lewat Portal, akun mitra aktif
            setelah diverifikasi tim kami.
          </p>
        }
        size="sm"
      />
      <section className="bg-brand-cream">
        <div className="mx-auto max-w-[1280px] px-5 py-16 md:px-10 md:py-20 lg:px-14">
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {MASUK_OPTIONS.map((o) => (
              <li key={o.label}>
                <Link
                  href={o.href}
                  className="group flex h-full flex-col rounded-3xl border border-brand-dark/10 bg-white p-6 transition-colors hover:border-brand-red"
                >
                  <span className="self-start rounded-full bg-brand-cream px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-brand-gray">
                    {o.hint}
                  </span>
                  <span className="mt-4 text-[20px] font-extrabold text-brand-dark group-hover:text-brand-red">{o.label}</span>
                  <span className="mt-2 text-[14.5px] leading-relaxed text-brand-gray">{o.description}</span>
                  <span className="mt-6 text-[13px] font-bold text-brand-red">Lanjut →</span>
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-10 text-[14px] text-brand-gray">
            Belum terdaftar sebagai mitra? Pilih jalur dan formulirnya di{" "}
            <Link href="/kemitraan" className="font-bold text-brand-dark underline underline-offset-4 hover:text-brand-red">
              halaman Kemitraan
            </Link>
            .
          </p>
        </div>
      </section>
    </>
  );
}
