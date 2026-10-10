@AGENTS.md

# barumahID — Website

## Brand
- Nama: **barumahID**, badan hukum **PT Inditek Bluprim Mahaksa**.
- Domain bisnis: ConsTech + PropTech + GreenTech, berbasis Padang.
- Tagline utama (hero): "Sewa hari ini. Miliki hunian nantinya."
- Tagline jasa (LBAG/ConsTech): "Proyekmu, Dibikin Mudah Aja."

## Warna (Tailwind v4 theme tokens, didefinisikan di `@theme` di `src/app/globals.css`)
| Token | Hex | Contoh class |
|---|---|---|
| Merah (aksen utama) | #C53B3B | `bg-brand-red` / `text-brand-red` |
| Merah gelap (hover) | #A02E2E | `bg-brand-red-dark` |
| Gelap | #141414 | `bg-brand-dark` / `text-brand-dark` |
| Ink | #1A1A1A | `text-brand-ink` |
| Abu | #6B6B6B | `text-brand-gray` |
| Abu muda | #9A9A9A | `text-brand-mute` |
| Krem (background body) | #F5F2ED | `bg-brand-cream` |
| Terang | #FAFAF7 | `bg-brand-light` |

Warna segmen: `credit` #2D7A4F, `build` #C25E20, `buy-blue` #1A5C9A. Tipografi pakai utility custom (`type-h1`, `type-h3`, `type-body`, `type-small`, `type-micro`) dan garis `hairline` / `hairline-strong`, juga di `globals.css`.

## Font
Montserrat (via `next/font/google`), di-load di `src/app/layout.tsx`, jadi default `font-sans`.

## Struktur situs (multi-halaman, App Router)
Layout global (`src/app/layout.tsx`): `ScrollProgress` + `layout/Navbar` + `layout/Footer`. Menu utama: Beranda, Tentang, Ekosistem, Kontak, CTA "Mulai" → `/daftar`.

| Route | Isi |
|---|---|
| `/` | Beranda: `ScrollExpandHeroSection` → `PickYourFit` → `ProblemSection` → `RTOExplainer` → `DPAccelerator` → `ConsTechSection` → `TrackRecord` → `PersonaCards` → `LeadCaptureSection` (`#daftar`) → `FAQSection` (semua di `src/components/sections/`) |
| `/rto` | Program Rent-to-Own + `RTOSimulator` (kalkulator DP). Pakai `SegmentNavbar`. |
| `/services` | Layanan ConsTech LBAG + pricing tiers. Sub-halaman: `/services/jasa-gambar`, `/services/analisa-struktur`, `/services/renovasi` (fee 8–14%). |
| `/mitra` | Kemitraan (mitrabarumahID Construction / Projectlink / mitra hunian). |
| `/ekosistem` | Graph 3D ekosistem (`EkosistemGraph`, pakai `three`). |
| `/tentang`, `/rekrutmen` | Profil perusahaan, lowongan. |
| `/daftar` | Halaman daftar → `LeadCaptureSection` + CTA WhatsApp. |
| `/kontak` | Info kontak + `ContactForm`. |
| `/layanan`, `/portofolio` → redirect `/services`; `/program-rto` → redirect `/rto` | |

Komponen sisa desain lama (one-page) yang **tidak dipakai** di halaman mana pun: `Header`, `Hero`, `Footer` (root), `LeadForms` + `forms/*`, `Marquee`, `PageHero`, `sections/HeroLanding`, `sections/PathwayCards`, `sections/EcosystemPreview`, `sections/EcosystemSimulator`, `ui/Button`, `ui/Card`, `ui/StatCard`.

## Lead capture (form → Supabase)
- Semua form submit lewat `submitLead(jenis, data)` di `src/lib/leads.ts` → `POST /api/leads` (`src/app/api/leads/route.ts`) → insert ke tabel Supabase `public.barumahid_leads`.
- `jenis`: `customer` | `mitra` | `developer` | `kontak`. Route menormalkan kolom `nama`, `kontak` (wa/hp/email), `kota`; semua field asli disimpan di kolom `data` (jsonb), plus `sumber` (path halaman) dan `status` (default `baru`).
- Form aktif: `LeadCaptureSection` (beranda & `/daftar`, 3 tab: customer/mitra/developer — Nama, WA, Kota) dan `ContactForm` (`/kontak` — Nama, Email, HP, Keperluan, Pesan). `LeadForms` + `forms/*` juga tersambung tapi tidak dipakai.
- Supabase project: **`barumahid-web`** — khusus barumahID (URL-nya di env `SUPABASE_URL`). Jangan pakai project Supabase lain untuk website ini.
- Keamanan: route pakai publishable key; RLS + grant hanya mengizinkan role `anon` **INSERT** (kolom jenis/nama/kontak/kota/data/sumber). Publik tidak bisa membaca lead. Baca/kelola lead lewat dashboard Supabase (Table Editor) atau SQL.
- Env (lokal di `.env.local`, tidak di-commit; di Vercel sudah di-set untuk Production/Preview/Development):
  - `SUPABASE_URL`
  - `SUPABASE_PUBLISHABLE_KEY`
- Link Google Form opsional (tombol "Isi form lengkap →"): `NEXT_PUBLIC_FORM_CUSTOMER_RTO`, `NEXT_PUBLIC_FORM_MITRA_HUNIAN`, `NEXT_PUBLIC_FORM_DEVELOPER`, `NEXT_PUBLIC_FORM_REKRUTMEN` (default `#` = tombol disembunyikan).

## Kontak resmi
Semua di `src/constants/index.ts`: WA admin `+62 851-5788-3292` (WA_ADMIN1) & `+62 896-3641-0565` (WA_ADMIN2), email `barumahid@gmail.com`, Instagram `@barumahid`, LinkedIn, alamat HQ Padang & virtual office Alam Sutera. Ini data asli dari user, bukan placeholder — jangan diganti tanpa konfirmasi.

## Program RTO = pre-launch
Program RTO belum berjalan (channel ditandai "Segera Hadir"). Semua copy RTO (`/rto`, `RTOExplainer`, `DPAccelerator`, FAQ) harus menghindari klaim "sudah berjalan" / "sudah ada transaksi" — jangan ubah tanpa instruksi eksplisit dari user.

## Catatan teknis
- Next.js 16.2 (App Router, Turbopack) + React 19 + Tailwind CSS v4 (config via `@theme` di CSS, tidak ada `tailwind.config.js`). Animasi: `framer-motion`; 3D: `three`.
- Versi Next.js ini punya breaking changes dari training data model — cek `node_modules/next/dist/docs/` sebelum pakai API yang nggak familiar.
- Deploy: Vercel project **`barumahid`** di team **barumahid's projects**, tersambung ke GitHub `barumahID/barumahid-web` — push ke `main` = deploy production, branch/PR lain = preview. Folder `.vercel` lokal menunjuk ke project lama di team lain — abaikan.
- Repo GitHub ini **publik**: jangan commit ID internal, key, atau detail database ke file mana pun (termasuk CLAUDE.md).
- **Windows + path panjang:** path folder project ini ±150 karakter dan `LongPathsEnabled = 0`, jadi **Turbopack gagal di laptop ini** (`next build`: "path length ... exceeds max length of filesystem"; `next dev`: panic "Next.js package not found" saat hot reload). Junction ke path pendek tidak membantu (Next resolve ke path asli). Solusi yang dipakai: **webpack untuk lokal** — `npm run dev` = `next dev --webpack`, `npm run build:local` = `next build --webpack`. Script `build` tetap Turbopack untuk Vercel (Linux, tidak kena batas path).
- **Alur kerja dengan user:** user menjalankan `npm run dev` di panel Terminal aplikasi Claude (PowerShell) → Claude baca output-nya dengan `read_terminal`, cek tampilan di browser pane (`http://localhost:3000`, buka dengan `preview_start {url}` — jangan start server kedua di port yang sama). Kalau dev server belum jalan, jalankan dengan `run_in_terminal` (`npm run dev`) supaya user bisa lihat & stop sendiri.
- Cek sebelum commit: `npx tsc --noEmit` dan `npm run lint`.
