@AGENTS.md

# barumahID — Landing Page

## Brand
- Nama: **barumahID**, badan hukum **PT Inditek Bluprim Mahaksa**.
- Domain bisnis: ConsTech + PropTech + GreenTech, berbasis Padang.
- Tagline utama (hero): "Sewa hari ini. Miliki hunian nantinya."
- Tagline jasa (LBAG/ConsTech): "Proyekmu, Dibikin Mudah Aja."

## Warna (Tailwind v4 theme tokens, didefinisikan di `src/app/globals.css`)
| Token | Hex | Tailwind class |
|---|---|---|
| Merah | #C53B3B | `bg-brand-red` / `text-brand-red` |
| Gelap | #1A1A1A | `bg-brand-dark` / `text-brand-dark` |
| Abu | #2D2D2D | `bg-brand-gray` / `text-brand-gray` |
| Terang | #EBEBEB | `bg-brand-light` / `text-brand-light` |
| Putih | #FFFFFF | `bg-white` |

## Font
Montserrat (via `next/font/google`), di-load di `src/app/layout.tsx`, jadi default `font-sans`.

## Struktur Halaman (single page, scroll) — `src/app/page.tsx`
1. **Header** (`src/components/Header.tsx`) — sticky nav, logo + link ke section + CTA "Daftar Sekarang".
2. **Hero** (`src/components/Hero.tsx`, `#hero`) — tagline utama + CTA scroll ke `#daftar`.
3. **Layanan ConsTech LBAG** (`src/components/ServicesSection.tsx`, `#layanan`) — 4 jasa: Desain, Analisa Struktur, Renovasi, Bangun. Fee jasa 8–14% dari nilai proyek.
4. **Program RTO** (`src/components/RTOSection.tsx`, `#program-rto`) — konsep sewa sambil nabung DP, berlabel **"Pre-launch"**. Section ini sengaja menegaskan belum ada transaksi berjalan — jangan ubah/klaim sebaliknya tanpa instruksi eksplisit dari user.
5. **Lead capture forms** (`src/components/LeadForms.tsx`, `#daftar`) — tab switcher untuk 3 form terpisah, di `src/components/forms/`:
   - `MitraForm.tsx`: Nama, WA, Kota, Jumlah unit, Harga sewa.
   - `CustomerForm.tsx`: Nama, WA, Usia, Kota, Penghasilan (select range), Minat RTO (select).
   - `DeveloperForm.tsx`: Nama perusahaan, PIC, WA/Email, Kota, Jenis proyek (select).
   - Semua submit handler **cuma `console.log`** data form — backend/API belum disambung, jangan asumsikan ada endpoint nyata sampai diintegrasikan.
6. **Footer** (`src/components/Footer.tsx`) — WA `+62 851-5788-3292`, email `barumahid@gmail.com`, Instagram `@barumahid`. Ini data kontak asli dari user, bukan placeholder — jangan diganti tanpa konfirmasi.

## Catatan teknis
- Next.js 16.x (App Router) + Tailwind CSS v4 (config via `@theme` di CSS, tidak ada `tailwind.config.js`).
- Versi Next.js ini punya breaking changes dari training data model — cek `node_modules/next/dist/docs/` sebelum pakai API yang nggak familiar.
- Program RTO masih pre-launch: semua copy di section RTO harus menghindari klaim "sudah berjalan" / "sudah ada transaksi".
