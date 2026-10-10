import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageHero from "@/components/ui/PageHero";
import { ARTICLES, getArticle } from "@/data/articles";
import { SITE } from "@/data/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const a = getArticle(slug);
  if (!a) return {};
  return {
    title: a.title,
    description: a.excerpt,
    alternates: { canonical: `/artikel/${a.slug}` },
    openGraph: { type: "article", publishedTime: a.date, authors: [a.author], images: a.cover ? [{ url: a.cover }] : undefined },
  };
}

// Format body sederhana: paragraf dipisah baris kosong, "## " subjudul, "- " poin.
function Body({ text }: { text: string }) {
  const blocks = text.trim().split(/\n\s*\n/);
  return (
    <div className="space-y-5 text-[17px] leading-[1.8] text-brand-dark/85">
      {blocks.map((b, i) => {
        if (b.startsWith("## ")) {
          return (
            <h2 key={i} className="pt-4 text-[24px] font-extrabold leading-snug text-brand-dark">
              {b.slice(3)}
            </h2>
          );
        }
        const lines = b.split("\n");
        if (lines.every((l) => l.startsWith("- "))) {
          return (
            <ul key={i} className="ml-5 list-disc space-y-1.5">
              {lines.map((l, j) => (
                <li key={j}>{l.slice(2)}</li>
              ))}
            </ul>
          );
        }
        return <p key={i}>{b}</p>;
      })}
    </div>
  );
}

export default async function ArtikelDetailPage({ params }: Props) {
  const { slug } = await params;
  const a = getArticle(slug);
  if (!a) notFound();
  const date = new Date(a.date + "T00:00:00+07:00").toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: a.title,
    datePublished: a.date,
    author: { "@type": "Person", name: a.author },
    publisher: { "@type": "Organization", name: SITE.name, url: SITE.url },
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PageHero label={a.category} title={a.title} subtitle={<p>{a.author} · {date}</p>} image={a.cover} size="sm" />
      <article className="bg-brand-cream">
        <div className="mx-auto max-w-3xl px-5 py-14 md:px-10 md:py-20">
          <Body text={a.body} />
          <p className="mt-14 border-t border-brand-dark/10 pt-6 text-[14px]">
            <Link href="/artikel" className="font-bold text-brand-red hover:text-brand-red-dark">
              ← Artikel lainnya
            </Link>
          </p>
        </div>
      </article>
    </>
  );
}
