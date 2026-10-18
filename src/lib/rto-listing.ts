import { LISTINGS, type Listing } from "@/data/listings";
import { regularRent } from "@/data/rto";

// Listing RTO publik (server saja). Unit kos dan rumah sewa dari mitra penyedia kos dibaca dari database lewat
// fungsi rto_public_units: hanya unit tayang/penuh yang lolos inspeksi, dan hanya kolom aman (tanpa alamat,
// pemilik, atau hasil inspeksi). Data di-cache 15 menit dan disegarkan langsung saat tim mengubah unit
// (revalidateTag RTO_UNITS_TAG di src/app/portal/rto-actions.ts). Rumah tujuan dari developer mitra dibaca lewat
// rto_public_dev_units (status tayang/habis, tanpa alamat dan pemilik). Listing manual (data/listings.ts) ikut digabung.

export const RTO_UNITS_TAG = "rto-units";

const PHOTO_PATH = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\/[a-z0-9-]{8,64}\.(webp|jpe?g|png)$/;

/** URL publik foto unit di bucket rto-units. Path yang tidak sesuai pola ditolak. */
export function unitPhotoUrl(path: string): string | null {
  const base = process.env.SUPABASE_URL;
  if (!base || !PHOTO_PATH.test(path)) return null;
  return `${base.replace(/\/+$/, "")}/storage/v1/object/public/rto-units/${path}`;
}

interface PublicUnitRow {
  slug: string;
  title: string;
  kind: "kos" | "rumah";
  city: string;
  kecamatan: string | null;
  kelurahan: string | null;
  rent_monthly: number | string;
  rooms: number | null;
  facilities: string[] | null;
  rto_ready: boolean;
  status: "tayang" | "penuh";
  description: string | null;
  photos: string[] | null;
  approx_lat: number | string | null;
  approx_lng: number | string | null;
}

interface PublicDevUnitRow {
  slug: string;
  title: string;
  project: string | null;
  city: string;
  kecamatan: string | null;
  kelurahan: string | null;
  price: number | string;
  dp_min_pct: number | string;
  tipe: string | null;
  land_area: number | string | null;
  building_area: number | string | null;
  bedrooms: number | null;
  bathrooms: number | null;
  units_available: number | null;
  legal: string | null;
  facilities: string[] | null;
  status: "tayang" | "habis";
  description: string | null;
  photos: string[] | null;
  approx_lat: number | string | null;
  approx_lng: number | string | null;
}

async function fetchRpc<T>(fn: "rto_public_units" | "rto_public_dev_units"): Promise<T[]> {
  const base = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!base || !key) return [];
  try {
    const res = await fetch(`${base.replace(/\/+$/, "")}/rest/v1/rpc/${fn}`, {
      headers: { apikey: key },
      next: { revalidate: 900, tags: [RTO_UNITS_TAG] },
      signal: AbortSignal.timeout(8_000),
    });
    if (!res.ok) {
      console.error(`[listing] ${fn} tidak termuat: ${res.status}`);
      return [];
    }
    const rows: unknown = await res.json();
    return Array.isArray(rows) ? (rows as T[]) : [];
  } catch (err) {
    console.error(`[listing] ${fn} tidak termuat:`, err instanceof Error ? err.message : err);
    return [];
  }
}

const photosOf = (paths: string[] | null, title: string) =>
  (paths ?? [])
    .map((p) => unitPhotoUrl(p))
    .filter((src): src is string => Boolean(src))
    .map((src, i) => ({ src, alt: `${title}, foto ${i + 1}` }));

const pointOf = (lat: number | string | null, lng: number | string | null) => {
  const a = lat === null ? NaN : Number(lat);
  const b = lng === null ? NaN : Number(lng);
  return Number.isFinite(a) && Number.isFinite(b) ? { lat: a, lng: b } : undefined;
};

const numOrUndef = (v: number | string | null) => (v === null || v === undefined ? undefined : Number(v));

/** Rumah tujuan dari developer mitra jadi listing "rumah-tujuan" (tampil di tab Rumah Berdaya) */
function toDevListing(u: PublicDevUnitRow): Listing {
  const rows: [string, string][] = [];
  if (u.project) rows.push(["Proyek", u.project]);
  if (u.units_available) rows.push(["Unit untuk program", String(u.units_available)]);
  if (u.legal) rows.push(["Legalitas", u.legal]);
  return {
    slug: u.slug,
    category: "rumah-tujuan",
    title: u.title,
    kelurahan: u.kelurahan ?? "",
    kecamatan: u.kecamatan ?? "",
    city: u.city,
    status: u.status === "habis" ? "terjual" : "tersedia",
    statusLabel: u.status === "habis" ? "Unit habis" : undefined,
    photos: photosOf(u.photos, u.title),
    description: u.description ?? undefined,
    approx: pointOf(u.approx_lat, u.approx_lng),
    harga: Number(u.price),
    dpMinPct: Number(u.dp_min_pct),
    tipe: u.tipe ? `Tipe ${u.tipe}` : undefined,
    luasTanah: numOrUndef(u.land_area),
    luasBangunan: numOrUndef(u.building_area),
    kamarTidur: u.bedrooms ?? undefined,
    kamarMandi: u.bathrooms ?? undefined,
    fasilitas: u.facilities ?? [],
    rincian: rows.length ? [{ title: "Developer mitra", rows }] : undefined,
  };
}

function toListing(u: PublicUnitRow): Listing {
  return {
    slug: u.slug,
    category: "siap-berdaya",
    title: u.title,
    kelurahan: u.kelurahan ?? "",
    kecamatan: u.kecamatan ?? "",
    city: u.city,
    status: u.status === "penuh" ? "terisi" : "tersedia",
    photos: photosOf(u.photos, u.title),
    description: u.description ?? undefined,
    // rent_monthly = harga deal yang diterima pemilik; yang tampil di listing = sewa biasa (deal + layanan barumahID)
    sewaPerBulan: regularRent(Number(u.rent_monthly)),
    kind: u.kind,
    rooms: u.rooms ?? undefined,
    rtoReady: u.rto_ready,
    fasilitas: u.facilities ?? [],
    approx: pointOf(u.approx_lat, u.approx_lng),
  };
}

/** Semua listing yang tampil di website: unit kos dan rumah tujuan dari Portal, lalu listing manual */
export async function getAllListings(): Promise<Listing[]> {
  const [units, devUnits] = await Promise.all([fetchRpc<PublicUnitRow>("rto_public_units"), fetchRpc<PublicDevUnitRow>("rto_public_dev_units")]);
  return [...units.map(toListing), ...devUnits.map(toDevListing), ...LISTINGS];
}

export async function getListing(slug: string): Promise<Listing | undefined> {
  return (await getAllListings()).find((l) => l.slug === slug);
}
