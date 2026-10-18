import { LISTINGS, type Listing } from "@/data/listings";

// Listing RTO publik (server saja). Unit kos dan rumah sewa dari mitra penyedia kos dibaca dari database lewat
// fungsi rto_public_units: hanya unit tayang/penuh yang lolos inspeksi, dan hanya kolom aman (tanpa alamat,
// pemilik, atau hasil inspeksi). Data di-cache 15 menit dan disegarkan langsung saat tim mengubah unit
// (revalidateTag RTO_UNITS_TAG di src/app/portal/rto-actions.ts). Listing manual (data/listings.ts) ikut digabung.

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

async function fetchPublicUnits(): Promise<PublicUnitRow[]> {
  const base = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!base || !key) return [];
  try {
    const res = await fetch(`${base.replace(/\/+$/, "")}/rest/v1/rpc/rto_public_units`, {
      headers: { apikey: key },
      next: { revalidate: 900, tags: [RTO_UNITS_TAG] },
      signal: AbortSignal.timeout(8_000),
    });
    if (!res.ok) {
      console.error(`[listing] unit tidak termuat: ${res.status}`);
      return [];
    }
    const rows: unknown = await res.json();
    return Array.isArray(rows) ? (rows as PublicUnitRow[]) : [];
  } catch (err) {
    console.error("[listing] unit tidak termuat:", err instanceof Error ? err.message : err);
    return [];
  }
}

function toListing(u: PublicUnitRow): Listing {
  const lat = u.approx_lat === null ? NaN : Number(u.approx_lat);
  const lng = u.approx_lng === null ? NaN : Number(u.approx_lng);
  return {
    slug: u.slug,
    category: "siap-berdaya",
    title: u.title,
    kelurahan: u.kelurahan ?? "",
    kecamatan: u.kecamatan ?? "",
    city: u.city,
    status: u.status === "penuh" ? "terisi" : "tersedia",
    photos: (u.photos ?? [])
      .map((p) => unitPhotoUrl(p))
      .filter((src): src is string => Boolean(src))
      .map((src, i) => ({ src, alt: `${u.title}, foto ${i + 1}` })),
    description: u.description ?? undefined,
    sewaPerBulan: Number(u.rent_monthly),
    kind: u.kind,
    rooms: u.rooms ?? undefined,
    rtoReady: u.rto_ready,
    fasilitas: u.facilities ?? [],
    approx: Number.isFinite(lat) && Number.isFinite(lng) ? { lat, lng } : undefined,
  };
}

/** Semua listing yang tampil di website: unit dari Portal lalu listing manual */
export async function getAllListings(): Promise<Listing[]> {
  const units = await fetchPublicUnits();
  return [...units.map(toListing), ...LISTINGS];
}

export async function getListing(slug: string): Promise<Listing | undefined> {
  return (await getAllListings()).find((l) => l.slug === slug);
}
