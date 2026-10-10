import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import PageHero from "@/components/ui/PageHero";
import ButtonLink from "@/components/ui/ButtonLink";
import { ARTICLES, ARTICLE_CATEGORIES } from "@/data/articles";
import { CHANNELS } from "@/data/site";

export const metadata: Metadata = {
  title: "Artikel mitrabarumahID Knowledges",
  description: "Info terbaru seputar konstruksi, teknik sipil, arsitektur, konstruksi berkelanjutan, serta properti dan Rent-to-Own.",
  alternates: { canonical: "/artikel" },
  robots: ARTICLES.length === 0 ? { index: false, follow: true } : undefined,
};

const fmtDate = (d: string) =>
  new Date(d + "T00:00:00+07:00").toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });

export default function ArtikelPage() {
  const ig = CHANNELS.find((c) => c.id === "instagram");
  const sorted = [...ARTICLES].sort((a, b) => b.date.localeCompare(a.date));
  return (
    <>
      <PageHero
        label="mitrabarumahID Knowledges"
        title="Belajar konstruksi dan properti, tanpa ribet."
        subtitle={<p>Ditulis tim barumahID dan mitra Knowledges, dari pengalaman lapangan.</p>}
        size="sm"
      />
      <section className="bg-brand-cream">
        <div className="mx-auto max-w-[1280px] px-5 py-14 md:px-10 md:py-20 lg:px-14">
          <ul className="flex flex-wrap gap-2">
            {ARTICLE_CATEGORIES.map((c) => (
              <li key={c} className="rounded-full border border-brand-dark/15 bg-white px-4 py-2 text-[13px] font-semibold text-brand-dark">
                {c}
              </li>
            ))}
          </ul>

          {sorted.length === 0 ? (
            <div className="mt-10 rounded-3xl border-2 border-dashed border-brand-dark/15 bg-white px-6 py-14 text-center">
              <p className="text-[20px] font-extrabold text-brand-dark">Artikel pertama sedang ditulis.</p>
              <p className="mx-auto mt-2 max-w-lg text-[15px] leading-relaxed text-brand-gray">
                Sambil menunggu, konten edukasi kami rutin tayang di Instagram. Institusi atau praktisi yang mau ikut menulis
                bisa gabung jadi mitra Knowledges.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                {ig && (
                  <ButtonLink href={ig.href} variant="dark">
                    Buka Instagram {ig.handle}
                  </ButtonLink>
                )}
                <ButtonLink href="/kemitraan/daftar/knowledges" variant="outline-dark" arrow={false}>
                  Jadi mitra Knowledges
                </ButtonLink>
              </div>
            </div>
          ) : (
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {sorted.map((a) => (
                <Link key={a.slug} href={`/artikel/${a.slug}`} className="group flex flex-col overflow-hidden rounded-3xl border border-brand-dark/10 bg-white">
                  {a.cover && (
                    <div className="relative aspect-[16/9]">
                      <Image src={a.cover} alt="" fill sizes="(min-width: 1024px) 33vw, 100vw" className="object-cover" />
                    </div>
                  )}
                  <div className="flex flex-1 flex-col p-6">
                    <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-brand-red">{a.category}</p>
                    <h2 className="mt-2 text-[18px] font-extrabold leading-snug text-brand-dark group-hover:text-brand-red">{a.title}</h2>
                    <p className="mt-2 text-[14px] leading-relaxed text-brand-gray">{a.excerpt}</p>
                    <p className="mt-auto pt-5 text-[12px] text-brand-mute">
                      {a.author} · {fmtDate(a.date)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
