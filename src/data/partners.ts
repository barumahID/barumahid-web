// Logo bergerak di beranda. Sumber: halaman Event & Partner di Katalog, sheet Compro ADART,
// dan folder 08. barumahID Activity.
// `logo` diisi path file di /public/logos/ kalau file logonya sudah ada. Selama kosong,
// yang tampil adalah nama dalam bentuk wordmark teks.
// Logo dan nama klien B2B BELUM boleh tampil sebelum ada izin tertulis dari tiap klien.

export interface PartnerMark {
  name: string;
  note?: string;
  logo?: string;
}

export const EVENTS_AND_PROGRAMS: PartnerMark[] = [
  { name: "1000 Startup Digital", note: "Top 15 bootcamp, 2018" },
  { name: "Kemenristekdikti", note: "Finalis Top 50 Inovasi Startup, 2019" },
  { name: "Bank Indonesia YELP", note: "Youth Economic Leadership Program" },
  { name: "DigitalHub", note: "Next Program Hackathon, 2021" },
  { name: "Nakama.id", note: "Hackathon Scalebox, 2021" },
  { name: "Studec International" },
  { name: "Rocket Incubation", note: "Yayasan Indonesia Setara × Sandination Academy, 2026" },
];

export const GROUP_UNITS: PartnerMark[] = [
  { name: "PT Inditek Bluprim Mahaksa" },
  { name: "barumahID" },
  { name: "Jururancang Engineering Mahaksa" },
];
