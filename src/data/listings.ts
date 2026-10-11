// Listing properti untuk halaman Layanan RTO.
//
// ATURAN (PRD Website v1, bagian Layanan RTO):
// - Tidak ada listing dummy. Array ini sengaja kosong sampai data asli siap:
//   izin tertulis pemilik dan dokumen legal sudah dicek. Lihat docs/KONFIRMASI.md.
// - Alamat persis tidak ditampilkan. Cukup kelurahan dan kecamatan.
// - Status ketersediaan nanti dipindah ke Google Sheet supaya admin bisa ubah tanpa deploy ulang (Fase 2).
// Foto listing taruh di /public/images/listing/<slug>/, format .webp, lebar maksimal 1600 px.

import type { RtoCategory } from "./rto";

export type ListingStatus = "tersedia" | "terisi" | "segera";

export const STATUS_LABEL: Record<ListingStatus, string> = {
  tersedia: "Tersedia",
  terisi: "Terisi",
  segera: "Segera",
};

interface ListingBase {
  slug: string;
  category: RtoCategory;
  title: string;
  kelurahan: string;
  kecamatan: string;
  city: string;
  status: ListingStatus;
  availableFrom?: string;
  photos: { src: string; alt: string }[];
  videoUrl?: string;
  /** Jarak ke tempat penting, contoh: "5 menit ke Universitas Andalas" */
  nearby?: string[];
  description?: string;
}

export interface SiapBerdayaListing extends ListingBase {
  category: "siap-berdaya";
  sewaPerBulan: number;
  deposit?: number;
  minSewaBulan?: number;
  luasBangunan?: number;
  kamarTidur?: number;
  kamarMandi?: number;
  listrikVA?: number;
  listrikTipe?: "Token" | "Pascabayar";
  air?: string;
  utilitasTermasuk?: string;
  internet?: string;
  perabot?: "Kosong" | "Semi furnished" | "Furnished";
  fasilitas?: string[];
  aturan?: string[];
}

export interface SiapBeliListing extends ListingBase {
  category: "siap-beli";
  hargaJual: number;
  nego?: boolean;
  luasTanah?: number;
  luasBangunan?: number;
  lantai?: number;
  kamarTidur?: number;
  kamarMandi?: number;
  sertifikat?: "SHM" | "SHGB" | "AJB" | "Lainnya";
  pbg?: string;
  pbbTerakhir?: string;
  listrikVA?: number;
  air?: string;
  fasilitas?: string[];
  kondisi?: string;
  tahunBangun?: number;
  lebarJalan?: string;
  hadap?: string;
  riwayatBanjir?: string;
}

export interface SiapBangunListing extends ListingBase {
  category: "siap-bangun";
  hargaLahanPerM2: number;
  luasLahan: number;
  dimensi?: string;
  kontur?: string;
  sertifikat?: "SHM" | "SHGB" | "AJB" | "Lainnya";
  zonasi?: string;
  kdb?: string;
  klb?: string;
  gsb?: string;
  aksesUtilitas?: string[];
  lebarJalan?: string;
  jenisTanah?: string;
  riwayatBanjir?: string;
  rekomendasi?: string;
}

export type Listing = SiapBerdayaListing | SiapBeliListing | SiapBangunListing;

export const LISTINGS: Listing[] = [];

export function listingPrice(l: Listing): { label: string; value: number; suffix?: string } {
  if (l.category === "siap-berdaya") return { label: "Sewa", value: l.sewaPerBulan, suffix: "/bulan" };
  if (l.category === "siap-beli") return { label: "Harga jual", value: l.hargaJual };
  return { label: "Harga lahan", value: l.hargaLahanPerM2 * l.luasLahan };
}
