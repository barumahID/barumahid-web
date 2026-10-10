// Artikel mitrabarumahID Knowledges.
// Selama array ini kosong, menu Artikel tidak tampil di navigasi dan halaman /artikel menampilkan info "segera".
// Ritme awal di PRD: 2 artikel per bulan. Tiap artikel wajib punya penulis dan tanggal.
// Body memakai format sederhana: paragraf dipisah baris kosong, "## " untuk subjudul, "- " untuk poin.

export const ARTICLE_CATEGORIES = [
  "Konstruksi",
  "Teknik Sipil",
  "Arsitektur",
  "Konstruksi Berkelanjutan",
  "Properti dan RTO",
] as const;

export type ArticleCategory = (typeof ARTICLE_CATEGORIES)[number];

export interface Article {
  slug: string;
  title: string;
  excerpt: string;
  category: ArticleCategory;
  author: string;
  /** YYYY-MM-DD */
  date: string;
  cover?: string;
  body: string;
}

export const ARTICLES: Article[] = [];

export function getArticle(slug: string) {
  return ARTICLES.find((a) => a.slug === slug);
}
