// Event, program, dan partner barumahID. Event tampil di bagian bawah /tentang; semua yang punya logo
// ikut berjalan di marquee logo beranda.
// Sumber: halaman Event & Partner di Katalog, sheet Compro ADART, folder 08. barumahID Activity,
// dan folder logo dari user (Okt 2026). File logo di /public/logos/ (latar sudah dibuat transparan).
// Logo dan nama klien B2B BELUM boleh tampil sebelum ada izin tertulis dari tiap klien.

export interface LogoFile {
  src: string;
  w: number;
  h: number;
}

export interface PartnerMark {
  name: string;
  note?: string;
  logo?: LogoFile;
}

export const EVENTS_AND_PROGRAMS: PartnerMark[] = [
  { name: "1000 Startup Digital", note: "Top 15 bootcamp, 2018", logo: { src: "/logos/1000-startup-digital.webp", w: 143, h: 160 } },
  { name: "Kemenristekdikti", note: "Finalis Top 50 Inovasi Startup, 2019", logo: { src: "/logos/ristekdikti.webp", w: 162, h: 160 } },
  { name: "Bank Indonesia YELP", note: "Youth Economic Leadership Program", logo: { src: "/logos/bi-institute-yelp.webp", w: 95, h: 120 } },
  { name: "DigitalHub", note: "Next Program Hackathon, 2021", logo: { src: "/logos/digitalhub.webp", w: 202, h: 160 } },
  { name: "Nakama.id", note: "Hackathon Scalebox, 2021", logo: { src: "/logos/nakama-id.webp", w: 357, h: 101 } },
  { name: "Studec International", logo: { src: "/logos/studec.webp", w: 156, h: 138 } },
  { name: "Rocket Incubation", note: "Yayasan Indonesia Setara × Sandination Academy, 2026" },
];

// Partner dan unit grup dari folder logo user. Hanya tampil sebagai logo di marquee beranda.
export const PARTNERS: PartnerMark[] = [
  { name: "Jururancang Engineering Mahaksa", logo: { src: "/logos/jururancang.webp", w: 117, h: 160 } },
  { name: "Laboratorium Material dan Struktur (LMS)", logo: { src: "/logos/lms.webp", w: 116, h: 108 } },
  { name: "TAKA", logo: { src: "/logos/taka.webp", w: 177, h: 111 } },
];

export const MARQUEE_LOGOS = [...EVENTS_AND_PROGRAMS, ...PARTNERS].filter(
  (m): m is PartnerMark & { logo: LogoFile } => Boolean(m.logo),
);
