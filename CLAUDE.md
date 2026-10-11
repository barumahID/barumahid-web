@AGENTS.md

# barumahID: Website

Website resmi barumahID (PT Inditek Bluprim Mahaksa). Next.js 16 App Router, multi-halaman.

Sumber isi: **PRD Website barumahID v1** dan **Brief & Copy halaman Tentang v1**. Dua dokumen itu ada di Claude Docs milik Japoe (founder) dan sengaja tidak disalin ke repo, karena repo ini publik. Kalau butuh detail yang tidak ada di file ini, tanya user. Jangan mengarang.

## Aturan konten (wajib)
- **Tidak ada data dummy.** Kalau datanya belum ada, tampilkan empty state atau sembunyikan section. Jangan isi contoh.
  - `TESTIMONIALS = []` di `src/data/faq.ts`: section testimoni otomatis hilang, tinggal FAQ.
  - `LISTINGS = []` di `src/data/listings.ts`: grid listing tampil empty state dan ajakan daftar.
  - `ARTICLES = []` di `src/data/articles.ts`: menu Artikel disembunyikan, `/artikel` noindex.
- **Angka statistik** hanya dari `STATS` di `src/data/projects.ts`. Jangan menulis angka langsung di komponen.
- **Peta proyek** hanya menampilkan kota `verified: true`. Basis `"klien"` artinya kliennya berbasis di kota itu, bukan lokasi proyek.
- **Nama dan logo klien** tidak tampil tanpa izin tertulis. Judul proyek ditulis generik, misalnya "Desain dan analisa struktur shelter".
- Proyek "From Other" (dikerjakan pihak lain) tidak masuk portofolio maupun statistik.
- **Bank atau lembaga pembiayaan** (misalnya BTN) tidak boleh disebut mitra sebelum ada perjanjian tertulis.
- Jangan pakai singkatan "IBM" untuk PT Inditek Bluprim Mahaksa.
- **Program RTO masih pre-launch.** Siap Bangun = "Inti program", Siap Beli = "Segera". Copy RTO tidak boleh mengklaim program sudah berjalan atau sudah ada transaksi. 25% dari sewa bulanan dicatat jadi saldo DP (`RTO_RATE` di `src/data/rto.ts`).
- **Gaya bahasa:** santai seperti ngobrol, kalimat pendek, bahasa Indonesia sehari-hari. Tanpa em dash (—) di tengah kalimat. Hindari kata "implikasi", "signifikan", "terkuantifikasi".
- **Kontak resmi** ada di `src/data/site.ts`: WA admin 1 dan 2, email, alamat (`ADDRESSES`: "Base barumahID" di Padang dan "VO" di Alam Sutera, masing-masing dengan `mapsUrl` ke Google Maps), kanal sosial. Ini data asli, bukan placeholder. Jangan diganti tanpa konfirmasi. Kanal tanpa link (`active: false`) tidak ditampilkan.
- Hal yang masih menunggu jawaban user ada di `docs/KONFIRMASI.md`. Kalau sudah dijawab, ubah datanya lalu hapus barisnya.

## Struktur situs
| Route | Isi |
|---|---|
| `/` | Beranda bersih gaya tikalindustries.com. Halaman 1: hero scroll-expand berisi **dua gambar** (Jasa Konstruksi ke `/layanan/contech`, Rent-to-Own ke `/layanan/rto`) di atas latar beranimasi (`HeroBackdrop`: krem terang tanpa grid, lekukan pita jadi bayangan lembut merah-cokelat yang melayang, gedung samar dari latar awal di tepi kanan (`beranda/gedung.webp`, memudar ke tengah supaya tidak menabrak judul dan panel), anyaman garis samar di bawah, parallax kursor; merah sengaja tidak menonjol dan tanpa kilau, arahan user). Foto panel Jasa Konstruksi: `proyek/rumah-selesai-malam.webp` (proyek selesai, malam hari), titik fokus lewat `focus` di `DUA_LAYANAN`. Tagline hero: "Wujudkan proyekmu. Miliki hunian nantinya." (di HP tiap kalimat satu baris), membesar penuh saat digulir. Halaman 2: deskripsi barumahID (ConTech + PropTech) dengan roadmap histori beranimasi di kanan, lalu marquee logo event dan partner (logo saja). Penjelasan lengkap ada di `/tentang`. |
| `/layanan` | Hub 3 layanan (RTO, ConTech, Kemitraan). |
| `/layanan/rto` | Cara kerja, 3 jalur, kanal DP, simulator DP (`#simulasi`), keamanan dana, listing (`#listing`), FAQ dan form customer RTO (`#daftar`). |
| `/layanan/rto/[slug]` | Detail listing RTO, info yang tampil beda per kategori (Siap Berdaya, Siap Bangun, Siap Beli). Selama `LISTINGS` kosong, semua slug 404. Alamat persis tidak ditampilkan, cukup kelurahan dan kecamatan. |
| `/layanan/contech` | Jasa, peta proyek (`#peta`), harga (`#harga`), renovasi dan bangun (`#renovasi`), portofolio, form konsultasi (`#konsultasi`). |
| `/kemitraan` | Ekosistem dan 7 peran mitra. |
| `/kemitraan/daftar/[peran]` | Form per peran, 7 halaman statis dari `src/data/roles.ts`. |
| `/portofolio` | Grid portofolio dengan filter layanan. |
| `/tentang` | About barumahID: apa itu barumahID + PT (hero), cerita dan timeline, masalah yang ingin diselesaikan, visi misi, peta penyebaran proyek + Base barumahID Padang dan VO Tangerang (`#peta`), 4 pilar, nilai BUILD, grup, tim, tanya jawab/testimoni, event yang pernah diikuti, kanal resmi. |
| `/kontak` | Kontak dan form pesan. |
| `/masuk` | Pilih jalur: pelanggan atau mitra. |
| `/rekrutmen` | Batch rekrutmen. Link form dari `NEXT_PUBLIC_FORM_REKRUTMEN`; kalau kosong tampil status tutup. |
| `/kebijakan-privasi` | DRAF v1 mengacu UU PDP. Perlu review hukum sebelum dianggap final. |
| `/artikel`, `/artikel/[slug]` | Siap dipakai, kosong untuk sekarang. |

Redirect permanen di `next.config.ts`: `/rto`, `/program-rto`, `/ekosistem` ke `/layanan/rto`; `/services/*` dan `/layanan/constech` (nama lama, sebelum ConsTech diganti ConTech) ke `/layanan/contech`; `/mitra` ke `/kemitraan`; `/daftar` ke `/masuk`.

SEO: metadata per halaman dengan template `"%s | barumahID"`, `sitemap.ts`, `robots.ts`, `opengraph-image.jpg`, JSON-LD LocalBusiness (layout) dan FAQPage (`/tentang`, dari `FaqTestimonials`).

## Data konten (`src/data/`)
Semua isi halaman diambil dari sini. Ubah data di sini, bukan di komponen.
- `beranda.ts`: judul, tagline, dan subline hero (`HOME_HERO`), roadmap histori singkat (`HOME_HISTORY`, versi lengkap tetap `TIMELINE` di `company.ts`), deskripsi halaman 2 (`HOME_ABOUT`), 2 gambar hero (`DUA_LAYANAN`), dan kartu hub `/layanan`.
- `site.ts`: identitas, kontak, alamat, kanal sosial, `waLink()`.
- `nav.ts`: menu utama dan dropdown Layanan.
- `projects.ts`: kota proyek untuk peta, portofolio, `STATS`. Kota luar negeri diberi `country` (mis. Kota Kinabalu, Malaysia) dan tidak dihitung di `STATS.provinces`; jumlah negara di `STATS.countries`.
- `pricing.ts`: tier harga ConTech (Basic, Plus, Pro per m²), isi paket, langkah order.
- `rto.ts`: jalur RTO, langkah, kanal DP, keamanan dana, FAQ RTO.
- `listings.ts`: listing RTO (kosong). `roles.ts`: 7 peran mitra. `masuk.ts`: pilihan di `/masuk`.
- `company.ts`: isi halaman Tentang. `faq.ts`: FAQ umum dan testimoni (tampil di `/tentang`). `partners.ts`: event dan program (`EVENTS_AND_PROGRAMS`, tampil di `/tentang`) dan partner (`PARTNERS`). Semua yang punya `logo` ({src, w, h}, file di `/public/logos/`) ikut di marquee beranda (`MARQUEE_LOGOS`); tanpa logo, di `/tentang` tampil ikon piala.
- `articles.ts`: artikel (kosong).
- `indonesia-map.ts`: hasil generate `scripts/gen-indonesia-map.mjs`. Jangan diedit manual. Cara pakai ada di header script.

## Form dan lead
- Skema semua form: `src/lib/leads.ts` (`FORMS`, 10 peran). Nama field sama dengan judul kolom di Google Sheet CRM Master.
- Komponen: `src/components/forms/LeadForm.tsx`. Validasi browser dan server pakai fungsi yang sama (`validateLead`). Ada checkbox persetujuan (link ke kebijakan privasi), honeypot `company_website`, dan Turnstile opsional.
- `POST /api/leads` menyimpan ke:
  1. **Supabase**, tabel `public.barumahid_leads` (utama). `toSupabaseRow()` memetakan 10 peran ke kolom `jenis` (`customer`, `mitra`, `developer`, `kontak`; dibatasi CHECK di database). Peran asli ada di `data.form`, semua isian di `data`. Publishable key hanya boleh INSERT (RLS), publik tidak bisa membaca lead. Baca dan kelola lead lewat dashboard Supabase.
  2. **Google Sheet CRM Master** lewat Apps Script (opsional, aktif kalau env-nya diisi). Fungsinya: baris masuk ke sheet kerja tim dan notifikasi email atau WA. Setup di `docs/backend/README.md`.
- Dianggap berhasil kalau minimal satu tujuan menerima data. Kalau semua gagal atau belum dikonfigurasi, form menampilkan tombol "Kirim lewat WhatsApp" dengan isian yang sudah disiapkan, jadi data pengunjung tidak hilang.
- Env (lokal di `.env.local`, di Vercel per environment, jangan pernah di-commit):
  - `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY` (sudah di-set di Vercel untuk Production, Preview, Development)
  - `LEADS_WEBHOOK_URL`, `LEADS_WEBHOOK_SECRET` (opsional, Apps Script)
  - `TURNSTILE_SECRET_KEY` dan `NEXT_PUBLIC_TURNSTILE_SITE_KEY` (opsional, anti-spam)
  - `NEXT_PUBLIC_FORM_REKRUTMEN` (opsional)
- Supabase project khusus website: **`barumahid-web`**. Jangan pakai project Supabase lain.
- Log server tidak boleh memuat data pribadi pengisi form.
- Preview Vercel menulis ke tabel yang sama dengan production. Kalau mengetes form, isi nama dengan "TEST", lalu hapus barisnya dari dashboard.

## Komponen
- `layout/Navbar.tsx`: dropdown Layanan dan Masuk. Panel menu HP dirender **di luar** `<header>`, karena header pakai `backdrop-filter` (elemen `fixed` di dalamnya jadi tidak terlihat).
- `layout/Footer.tsx`: logo PT tampil di sini saja (komponen `brand/PtMark`: simbol saja, warna asli di latar terang, putih di latar gelap seperti logo barumahID; nama PT ditulis pakai font situs, bukan gambar logo utuh). Alamat bisa diklik langsung ke Google Maps, tanpa tombol tambahan (begitu juga di `/kontak` dan `/tentang`).
- `layout/FloatingWhatsApp.tsx` (HP saja), `ScrollProgress.tsx`.
- `ui/`: `PageHero`, `ButtonLink`, `AccordionFAQ`, `ChannelGrid`, `hero-backdrop` (latar hero beranda; foto di-blur di file, bukan CSS blur, supaya ringan), `dual-scroll-hero` (hero dua panel beranda, latar lewat prop `background`; scroll window dikunci di atas sampai panel terbuka penuh, keyboard dan anchor langsung membuka penuh).
- `home/`: `EventMarquee` (logo event dan partner yang bergerak, tinggi logo diatur dari luas bidangnya), `HistoryRoadmap` (roadmap beranda, animasi berurutan saat masuk layar), `ServiceCards` (kartu foto hub `/layanan`, isi lewat props), `ProblemSection` dan `FaqTestimonials` (dipakai di `/tentang`), `ClosingCta`. Hero beranda: `sections/ScrollExpandHeroSection`.
- `about/`: `PetaProyek` (peta + angka + kartu kantor, pakai `ProjectMap` dengan prop `offices`), `PillarCards`, `ValueLetters`.
- `constech/` (`ProjectMap`, `PricingTiers`), `rto/` (`DPSimulator`, `ListingGrid`), `about/`, `portfolio/`.
- `CountUp`: angka final dirender di server, animasi hanya kalau elemen di luar layar dan reduced motion tidak aktif. `Reveal`: animasi muncul, ada fallback `<noscript>` di layout.

## Warna dan font
Token Tailwind v4 di `@theme inline`, `src/app/globals.css`:

| Token | Hex | Contoh class |
|---|---|---|
| Merah (aksen utama) | #C53B3B | `bg-brand-red`, `text-brand-red` |
| Merah gelap (hover) | #A02E2E | `bg-brand-red-dark` |
| Gelap | #141414 | `bg-brand-dark`, `text-brand-dark` |
| Abu | #6B6B6B | `text-brand-gray` |
| Abu muda | #9A9A9A | `text-brand-mute` |
| Krem (body) | #F5F2ED | `bg-brand-cream` |
| Krem hangat | #EFEAE1 | `bg-brand-cream-warm` |

Warna segmen: `credit` #2D7A4F, `build` #C25E20, `buy-blue` #1A5C9A. Utility tipografi `type-display`, `type-h1` sampai `type-h3`, `type-body`, `type-small`, `type-micro`, dan garis `hairline`, juga di `globals.css`.

Font: Montserrat lewat `next/font/google` di `src/app/layout.tsx`, jadi default `font-sans`.

## Catatan teknis
- Next.js 16.2 + React 19 + Tailwind CSS v4 (tidak ada `tailwind.config.js`). Animasi pakai `framer-motion`. Library `three` sudah dihapus.
- Versi Next.js ini punya breaking changes dari data latih model. Cek `node_modules/next/dist/docs/` sebelum pakai API yang tidak familiar.
- ESLint `react-hooks/set-state-in-effect`: untuk mereset state saat prop atau route berubah, simpan nilai sebelumnya di state lalu bandingkan saat render (contoh di `Navbar.tsx`). Jangan `setState` langsung di `useEffect`.
- Bahan mentah dari user ada di folder `Picture/` (di-ignore git, jangan di-commit: berisi kartu nama dengan no HP dan logo pihak lain). Yang dipakai situs diolah dulu ke `public/` (latar transparan, trim, webp) dengan sharp dari `node_modules`.
- Gambar proyek di `public/images/proyek/*.webp` (lebar maks 1600 px), tampilkan dengan `next/image`. Logo di `public/brand/`: `logo-mark-red.png` (merahnya disamakan dengan `brand-red` #C53B3B), `logo-mark-white.png`, `logo-icon-192/512.png` (ikon tanpa lingkaran). Logo tidak boleh pakai border lingkaran.
- **Windows + path panjang:** path folder project ini sekitar 150 karakter dan `LongPathsEnabled = 0`, jadi **Turbopack gagal di laptop ini** (`next build`: "path length ... exceeds max length of filesystem"; `next dev`: panic "Next.js package not found" saat hot reload). Junction ke path pendek tidak membantu, karena Next resolve ke path asli. Solusinya **webpack untuk lokal**: `npm run dev` = `next dev --webpack`, `npm run build:local` = `next build --webpack`. Script `build` tetap Turbopack untuk Vercel (Linux, tidak kena batas path).
- Build di lingkungan tanpa akses Google Fonts (sandbox tertutup): pakai `NEXT_FONT_GOOGLE_MOCKED_RESPONSES=<file mock>` dan `next build --webpack`. Di laptop dan Vercel tidak perlu.
- **Alur kerja dengan user:** user menjalankan `npm run dev` di panel Terminal aplikasi Claude (PowerShell). Claude membaca output-nya dengan `read_terminal`, lalu cek tampilan di browser pane (`http://localhost:3000`, buka dengan `preview_start {url}`). Jangan start server kedua di port yang sama. Kalau dev server belum jalan, jalankan dengan `run_in_terminal` (`npm run dev`) supaya user bisa lihat dan stop sendiri.
- Deploy: Vercel project **`barumahid`** di team **barumahid's projects**, tersambung ke GitHub `barumahID/barumahid-web`. Push ke `main` = deploy production. Branch atau PR lain = preview. Folder `.vercel` lokal menunjuk ke project lama di team lain, abaikan.
- Repo GitHub ini **publik**: jangan commit ID internal, key, URL dokumen internal, atau detail database ke file mana pun (termasuk CLAUDE.md).
- Satu tempat yang mengubah kode: Claude Code di laptop. Perubahan dari luar (misalnya sesi Claude di cloud) datang lewat branch dan PR, bukan langsung ke `main`.
- Cek sebelum commit: `npx tsc --noEmit`, `npm run lint`, `npm run build:local`.

## Status
- Revamp fase 0 dan 1 (struktur baru sesuai PRD v1) dikerjakan di branch `revamp/fase-0-1`. Merge ke `main` lewat PR setelah dicek di preview Vercel.
- Fase 2 (belum dikerjakan): status listing dari Google Sheet supaya admin bisa ubah tanpa deploy, artikel pertama, testimoni setelah ada izin, foto tim, halaman detail portofolio.
