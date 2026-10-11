# Menunggu konfirmasi

Isi website yang sengaja belum diisi, disembunyikan, atau masih perlu dicek. Jangan mengarang jawabannya. Kalau user sudah menjawab, ubah datanya, lalu hapus barisnya dari daftar ini.

## Konten

| Hal | Kondisi sekarang | File |
|---|---|---|
| Ejaan nama tim, terutama "Hariyanto" atau "Haryanto" | Ditulis "Hariyanto Djalil" | `src/data/company.ts` |
| Jabatan dan bio singkat tiap anggota tim | Draf | `src/data/company.ts` |
| Foto tim | Pakai inisial | `src/data/company.ts` (`photo`) |
| Kota proyek Sumedang | `verified: false`, tidak tampil di peta | `src/data/projects.ts` |
| Judul proyek Cikarang | Ditulis umum "Analisa struktur bangunan" (jenis dikonfirmasi user, detail belum) | `src/data/projects.ts` |
| "Analisa struktur jembatan" di daftar Padang | Mungkin proyek yang sama dengan Kota Kinabalu. Kalau sama, hapus dari Padang | `src/data/projects.ts` |
| Lokasi proyek "Bangun rumah 2 lantai" | Dimasukkan ke Padang | `src/data/projects.ts` |
| Beda isi paket Basic dan Plus selain harga dan durasi | Isi paket sama, beda di harga dan lama kerja | `src/data/pricing.ts` |
| Link YouTube dan Facebook | `active: false`, tidak tampil | `src/data/site.ts` |
| Link DM Instagram Jururancang (`ig.me`) | Belum dites di HP | `src/data/site.ts` |
| Testimoni pelanggan | Kosong, menunggu izin tampil dari pemberi testimoni | `src/data/faq.ts` |
| Foto katalog proyek dari Canva dan Google Drive | Belum diambil (Canva perlu login). Perlu file PNG/JPG di folder `Picture/` atau link view per folder | `public/images/proyek/` |
| Listing RTO pertama | Kosong. Dua calon unit sudah diusulkan (satu Siap Berdaya, satu Siap Beli). Menunggu foto, data unit, izin tertulis pemilik, dan cek dokumen legal | `src/data/listings.ts` |
| Proyek di Jambi dan Palembang | Titik sudah tampil di peta, rincian proyeknya belum ada (panel peta menulis "menyusul") | `src/data/projects.ts` (`PROJECT_CITIES`) |
| Total proyek "30+" vs angka per lini (10+, 15+, 10+ = 35+) | Total di beranda dan Tentang masih 30+. Perlu konfirmasi apakah total dinaikkan | `src/data/projects.ts` (`STATS`) |
| Sketsa dari kanvas "Ceritakan proyekmu" | Belum ikut terkirim bersama form (skema form dan sheet CRM belum punya kolomnya). Pengunjung bisa mengunduh PNG lalu mengirim lewat WhatsApp. Kalau mau dikirim otomatis, perlu kolom baru di form dan CRM | `src/components/constech/DrawingCanvas.tsx`, `src/lib/leads.ts` |
| Website Jururancang | Belum ada, tampil "Website segera hadir" | `src/data/site.ts` (`JURURANCANG.website`) |
| Kebijakan privasi | DRAF v1, perlu review orang hukum | `src/app/kebijakan-privasi/page.tsx` |
| Batch rekrutmen berikutnya | Batch Juli 2026 sudah tutup. Halaman tampil status tutup dan email untuk kirim CV. | `src/app/rekrutmen/page.tsx` (`BATCH`) |

## Teknis

| Hal | Kondisi sekarang | Rujukan |
|---|---|---|
| Apps Script ke CRM Master | Belum di-deploy. Form tetap tersimpan di Supabase. | `docs/backend/README.md` |
| Tempat kerja harian lead: sheet CRM atau Supabase | Belum diputuskan | `docs/backend/README.md` |
| Notifikasi lead baru ke admin | Belum ada. Lead di Supabase tidak mengabari siapa pun. | `docs/backend/README.md` |
| Error `#REF!` di sheet Dashboard CRM Master | Belum diperbaiki | Sheet CRM Master |
| Paket Vercel | Kemungkinan Hobby. Menurut ketentuan Vercel, Hobby untuk penggunaan non-komersial. | Dashboard Vercel > Settings > Billing |
