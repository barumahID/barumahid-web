// Kabar terkini konstruksi dan properti untuk panel "Kabar" di navbar (arahan user Okt 2026: isu terbaru di
// Indonesia dan dunia, otomatis, 7 hari terakhir).
// Sumber: RSS media yang memang disediakan untuk disebarkan. Yang ditampilkan hanya judul, nama media, tanggal,
// dan link ke artikel aslinya (tanpa isi atau gambar artikel). Media Indonesia berisi berita ekonomi umum, jadi
// disaring dengan kata kunci konstruksi dan properti. Media luar sudah khusus konstruksi dan properti.
// Dipanggil dari /api/berita, hasilnya di-cache 6 jam.

export interface Berita {
  title: string;
  url: string;
  source: string;
  date: string;
}

export interface BeritaFeed {
  indonesia: Berita[];
  dunia: Berita[];
  updated: string;
}

interface Feed {
  source: string;
  url: string;
  filter?: boolean;
}

const INDONESIA: Feed[] = [
  { source: "detikFinance", url: "https://finance.detik.com/rss", filter: true },
  { source: "CNBC Indonesia", url: "https://www.cnbcindonesia.com/news/rss", filter: true },
  { source: "Okezone", url: "https://sindikasi.okezone.com/index.php/rss/11/RSS2.0", filter: true },
  { source: "SINDOnews", url: "https://ekbis.sindonews.com/rss", filter: true },
  { source: "ANTARA", url: "https://www.antaranews.com/rss/terkini.xml", filter: true },
  { source: "Republika", url: "https://www.republika.co.id/rss/ekonomi/", filter: true },
];

const DUNIA: Feed[] = [
  { source: "Construction Dive", url: "https://www.constructiondive.com/feeds/news/" },
  { source: "Global Construction Review", url: "https://www.globalconstructionreview.com/feed/" },
  { source: "Construction News", url: "https://www.constructionnews.co.uk/feed/" },
  { source: "The Guardian", url: "https://www.theguardian.com/society/housing/rss" },
  { source: "HousingWire", url: "https://www.housingwire.com/feed/" },
];

const RELEVAN =
  /\b(konstruksi|properti|perumahan|kpr|hunian|infrastruktur|semen|jalan tol|apartemen|pengembang|developer|kontraktor|rumah subsidi|rumah murah|tapera|pupr|real estat|rusun|rumah susun|bendungan|jembatan|kementerian pkp|3 juta rumah|tiga juta rumah)\b/i;
// Berita duka dan kriminal tidak ditampilkan di situs perusahaan
const HINDARI = /\b(tewas|meninggal|korban jiwa|pembunuhan|pemerkosaan|narkoba|judi)\b/i;

const WINDOW_MS = 7 * 24 * 60 * 60 * 1000;
const PER_LIST = 8;
const PER_SOURCE = 3;

function decode(s: string): string {
  return s
    .replace(/^\s*<!\[CDATA\[([\s\S]*?)\]\]>\s*$/, "$1")
    .replace(/<[^>]+>/g, "")
    .replace(/&#x([0-9a-f]+);/gi, (_, h: string) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d: string) => String.fromCodePoint(Number(d)))
    .replace(/&quot;/g, '"')
    .replace(/&(apos|#39);/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

function tag(item: string, name: string): string {
  const m = item.match(new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)</${name}>`, "i"));
  return m ? decode(m[1]) : "";
}

function parse(xml: string, feed: Feed, now: number): Berita[] {
  const items = xml.match(/<item[\s>][\s\S]*?<\/item>/gi) ?? [];
  const out: Berita[] = [];
  for (const it of items) {
    const title = tag(it, "title");
    const url = tag(it, "link") || tag(it, "guid");
    const time = new Date(tag(it, "pubDate") || tag(it, "dc:date")).getTime();
    if (!title || title.length < 12 || !/^https?:\/\//.test(url) || Number.isNaN(time)) continue;
    if (now - time > WINDOW_MS || time - now > 60 * 60 * 1000) continue;
    if (HINDARI.test(title)) continue;
    if (feed.filter && !RELEVAN.test(title)) continue;
    out.push({ title, url, source: feed.source, date: new Date(time).toISOString() });
  }
  return out;
}

async function ambil(feed: Feed, now: number): Promise<Berita[]> {
  try {
    const res = await fetch(feed.url, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; barumahID-kabar/1.0; +https://www.barumahid.com)" },
      signal: AbortSignal.timeout(8000),
      next: { revalidate: 21600 },
    });
    if (!res.ok) return [];
    return parse(await res.text(), feed, now);
  } catch {
    return [];
  }
}

// Gabung semua sumber: terbaru dulu, judul kembar dibuang, maksimal 3 per media supaya beragam.
function rangkum(lists: Berita[][]): Berita[] {
  const seen = new Set<string>();
  const perSource = new Map<string, number>();
  const out: Berita[] = [];
  for (const b of lists.flat().sort((a, b) => b.date.localeCompare(a.date))) {
    const key = b.title.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
    if (seen.has(key)) continue;
    const n = perSource.get(b.source) ?? 0;
    if (n >= PER_SOURCE) continue;
    seen.add(key);
    perSource.set(b.source, n + 1);
    out.push(b);
    if (out.length >= PER_LIST) break;
  }
  return out;
}

export async function getBerita(): Promise<BeritaFeed> {
  const now = Date.now();
  const [indonesia, dunia] = await Promise.all([
    Promise.all(INDONESIA.map((f) => ambil(f, now))),
    Promise.all(DUNIA.map((f) => ambil(f, now))),
  ]);
  return { indonesia: rangkum(indonesia), dunia: rangkum(dunia), updated: new Date(now).toISOString() };
}
