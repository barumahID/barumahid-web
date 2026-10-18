"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { getPortalSession } from "@/lib/portal-session";
import { isTeam } from "@/lib/portal";
import { RTO_UNITS_TAG } from "@/lib/rto-listing";
import type { FormState } from "./actions";

// Server action platform RTO di Portal. Semua akses lewat sesi pengguna, izin ditegakkan RLS dan fungsi database
// (rto_submit_assessment, rto_report_payment, rto_apply, rto_confirm_payment, rto_record_payment).
// Pesan galat dari database tidak diteruskan mentah; yang dikenal saja yang ditampilkan.

const text = (fd: FormData, key: string, max = 160) => String(fd.get(key) ?? "").trim().slice(0, max);
const num = (fd: FormData, key: string) => {
  const v = Number(String(fd.get(key) ?? "").replace(/[^\d]/g, ""));
  return Number.isFinite(v) ? v : NaN;
};
/** Angka desimal (luas 72,5 m², persen 7,5) */
const dec = (fd: FormData, key: string) => {
  const v = Number(String(fd.get(key) ?? "").replace(",", ".").replace(/[^\d.]/g, ""));
  return Number.isFinite(v) ? v : NaN;
};
const isDate = (v: string) => /^\d{4}-\d{2}-\d{2}$/.test(v);
/** Unit kos (rto_units) atau rumah tujuan developer (rto_dev_units); foto keduanya di bucket rto-units */
const isDev = (fd: FormData) => fd.get("kind") === "dev";
const isMonth = (v: string) => /^\d{4}-\d{2}$/.test(v);

const KNOWN = [
  "Khusus akun penyewa",
  "Khusus tim barumahID",
  "Nominal tidak valid",
  "Tanggal bayar tidak valid",
  "Belum ada sewa aktif",
  "Periode tidak valid",
  "Periode ini sudah lunas",
  "Sudah lunas",
  "Jalur belum dibuka",
  "Pengajuan sudah ada",
  "KTP belum terverifikasi",
  "Belum 6 bulan bayar tepat waktu",
  "Skor belum mencapai 36",
  "Jawaban belum lengkap",
  "Sewa tidak ditemukan",
  "Pembayaran tidak ditemukan",
  "Unit tidak bisa diubah",
  "Maksimal 12 foto",
  "Foto belum terunggah",
  "Nama file tidak valid",
  "Foto tidak dikenal",
  "Foto ganda",
];
function dbMessage(msg: string | undefined, fallback: string) {
  const hit = KNOWN.find((k) => msg?.includes(k));
  return hit ?? fallback;
}

function done(message: string): FormState {
  revalidatePath("/portal/dashboard");
  return { ok: true, message };
}

/** Hentikan aksi tim dengan pesan (dipakai AutoSelect: pilihan kembali dan tampil "Gagal"). */
function fail(message: string): never {
  throw new Error(message);
}

/** Listing publik dibaca ulang dari database pada kunjungan berikutnya (unit tayang, foto, deskripsi, peta) */
function refreshListing() {
  revalidateTag(RTO_UNITS_TAG, { expire: 0 });
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

async function requireTeam() {
  const s = await getPortalSession();
  if (!s.user || !isTeam(s.profile)) throw new Error("Akses khusus tim barumahID");
  return s;
}

// ---------------- Penyewa ----------------

export async function submitAssessment(_: FormState, fd: FormData): Promise<FormState> {
  const { supabase, profile } = await getPortalSession();
  if (profile?.role !== "penyewa") return { error: "Khusus akun penyewa." };
  const answers: Record<string, string> = {};
  for (const k of ["penghasilan", "menabung", "riwayat", "aset", "target"]) answers[k] = text(fd, k, 30);
  if (Object.values(answers).some((v) => !v)) return { error: "Jawab semua pertanyaan dulu." };
  const { data, error } = await supabase.rpc("rto_submit_assessment", { p_answers: answers });
  if (error) return { error: dbMessage(error.message, "Asesmen belum tersimpan. Coba lagi.") };
  return done(`Tersimpan. Skormu ${data}.`);
}

export async function reportPayment(_: FormState, fd: FormData): Promise<FormState> {
  const { supabase, profile } = await getPortalSession();
  if (profile?.role !== "penyewa") return { error: "Khusus akun penyewa." };
  const period = text(fd, "period", 7);
  const paidAt = text(fd, "paid_at", 10);
  const amount = num(fd, "amount");
  if (!isMonth(period)) return { error: "Pilih bulan sewa." };
  if (!isDate(paidAt)) return { error: "Isi tanggal bayar." };
  if (!(amount > 0)) return { error: "Isi nominal yang dibayar." };
  const { error } = await supabase.rpc("rto_report_payment", {
    p_period: `${period}-01`,
    p_amount: amount,
    p_paid_at: paidAt,
    p_reference: text(fd, "reference", 160),
  });
  if (error) return { error: dbMessage(error.message, "Laporan belum terkirim. Coba lagi.") };
  return done("Laporan pembayaran terkirim. Tim kami mengonfirmasi setelah dana diterima.");
}

export async function applyRto(_: FormState, fd: FormData): Promise<FormState> {
  const { supabase, profile } = await getPortalSession();
  if (profile?.role !== "penyewa") return { error: "Khusus akun penyewa." };
  const path = text(fd, "path", 20);
  const { error } = await supabase.rpc("rto_apply", { p_path: path });
  if (error) return { error: dbMessage(error.message, "Pengajuan belum terkirim. Coba lagi.") };
  return done("Pengajuan RTO terkirim. Tim kami menghubungimu untuk menjelaskan kontraknya.");
}

export async function acceptTerms(_: FormState, fd: FormData): Promise<FormState> {
  const { supabase, user } = await getPortalSession();
  if (!user) return { error: "Silakan masuk dulu." };
  const doc = text(fd, "doc", 30);
  if (doc !== "syarat_ketentuan" && doc !== "nda") return { error: "Dokumen tidak dikenal." };
  if (fd.get("agree") !== "on") return { error: "Centang persetujuan dulu." };
  const { error } = await supabase.from("rto_agreements").insert({ user_id: user.id, doc, version: "v1", method: "klik" });
  if (error && error.code !== "23505") return { error: "Persetujuan belum tersimpan. Coba lagi." };
  return done("Terima kasih, persetujuanmu tercatat.");
}

// ---------------- Mitra penyedia kos ----------------

export async function submitUnit(_: FormState, fd: FormData): Promise<FormState> {
  const { supabase, user, profile } = await getPortalSession();
  if (!user || profile?.role !== "mitra") return { error: "Khusus akun mitra." };
  const title = text(fd, "title", 120);
  const kind = text(fd, "kind", 10);
  const city = text(fd, "city", 80);
  const rent = num(fd, "rent_monthly");
  const rooms = num(fd, "rooms");
  if (title.length < 3) return { error: "Isi nama unit, minimal 3 huruf." };
  if (kind !== "kos" && kind !== "rumah") return { error: "Pilih jenis unit." };
  if (city.length < 2) return { error: "Isi kota." };
  if (!(rent > 0 && rent < 100_000_000)) return { error: "Isi harga sewa per bulan." };
  const facilities = fd
    .getAll("facilities")
    .map((f) => String(f).slice(0, 40))
    .slice(0, 20);
  const { error } = await supabase.from("rto_units").insert({
    owner_user_id: user.id,
    title,
    kind,
    city,
    kecamatan: text(fd, "kecamatan", 80) || null,
    kelurahan: text(fd, "kelurahan", 80) || null,
    address_private: text(fd, "address_private", 400) || null,
    rent_monthly: rent,
    rooms: rooms > 0 && rooms <= 500 ? rooms : null,
    facilities,
    rto_ready: fd.get("rto_ready") === "on",
    description: text(fd, "description", 1500) || null,
  });
  if (error) return { error: "Unit belum tersimpan. Pastikan akun Anda terdaftar sebagai penyedia kos." };
  return done("Unit terkirim. Tambahkan foto lewat daftar Unit Anda. Tim barumahID menghubungi Anda untuk jadwal inspeksi.");
}

// ---------------- Developer mitra: rumah tujuan RTO ----------------

/** Isian rumah tujuan dari form (dipakai developer saat mendaftar dan tim saat mengubah) */
function devUnitFields(fd: FormData) {
  const pos = (k: string, max: number) => {
    const v = dec(fd, k);
    return v > 0 && v <= max ? v : null;
  };
  const dp = dec(fd, "dp_min_pct");
  return {
    title: text(fd, "title", 120),
    project: text(fd, "project", 120) || null,
    city: text(fd, "city", 80),
    kecamatan: text(fd, "kecamatan", 80) || null,
    kelurahan: text(fd, "kelurahan", 80) || null,
    address_private: text(fd, "address_private", 400) || null,
    price: num(fd, "price"),
    dp_min_pct: dp >= 1 && dp <= 50 ? dp : 10,
    tipe: text(fd, "tipe", 40) || null,
    land_area: pos("land_area", 99_999),
    building_area: pos("building_area", 99_999),
    bedrooms: pos("bedrooms", 20),
    bathrooms: pos("bathrooms", 20),
    units_available: pos("units_available", 10_000),
    legal: text(fd, "legal", 200) || null,
    facilities: fd
      .getAll("facilities")
      .map((f) => String(f).slice(0, 40))
      .slice(0, 20),
  };
}

function devUnitError(f: ReturnType<typeof devUnitFields>): string | null {
  if (f.title.length < 3) return "Isi nama rumah, minimal 3 huruf.";
  if (f.city.length < 2) return "Isi kota.";
  if (!(f.price >= 10_000_000 && f.price < 100_000_000_000)) return "Isi harga rumah.";
  return null;
}

export async function submitDevUnit(_: FormState, fd: FormData): Promise<FormState> {
  const { supabase, user, profile } = await getPortalSession();
  if (!user) return { error: "Sesi berakhir. Silakan masuk lagi." };
  const team = isTeam(profile);
  if (!team && profile?.role !== "mitra") return { error: "Khusus akun developer mitra." };
  const f = devUnitFields(fd);
  const invalid = devUnitError(f);
  if (invalid) return { error: invalid };
  const owner = text(fd, "owner_user_id", 40);
  const { error } = await supabase.from("rto_dev_units").insert({
    ...f,
    owner_user_id: team ? (UUID.test(owner) ? owner : null) : user.id,
    description: text(fd, "description", 1500) || null,
  });
  if (error) return { error: team ? "Rumah tujuan belum tersimpan." : "Rumah belum tersimpan. Pastikan akun Anda terdaftar sebagai developer mitra." };
  return done(
    team
      ? "Rumah tujuan tersimpan dengan status Diajukan."
      : "Rumah terkirim. Tambahkan foto lewat daftar rumah Anda. Tim barumahID menghubungi Anda untuk peninjauan dan MoU.",
  );
}

export async function updateDevUnit(_: FormState, fd: FormData): Promise<FormState> {
  const { supabase } = await requireTeam();
  const id = text(fd, "id", 40);
  if (!UUID.test(id)) return { error: "Rumah tidak dikenal." };
  const f = devUnitFields(fd);
  const invalid = devUnitError(f);
  if (invalid) return { error: invalid };
  const { data, error } = await supabase
    .from("rto_dev_units")
    .update({ ...f, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select("id");
  if (error || !data?.length) return { error: "Data rumah belum tersimpan." };
  refreshListing();
  return done("Data rumah tersimpan.");
}

const DEV_STATUSES = ["diajukan", "ditinjau", "perbaikan", "tayang", "habis", "ditolak", "nonaktif"];

export async function setDevUnitStatus(fd: FormData) {
  const { supabase } = await requireTeam();
  const id = text(fd, "id", 60);
  const status = text(fd, "status", 20);
  if (!UUID.test(id) || !DEV_STATUSES.includes(status)) fail("Status tidak valid");
  const { data, error } = await supabase.from("rto_dev_units").update({ status, updated_at: new Date().toISOString() }).eq("id", id).select("id");
  if (error || !data?.length) fail("Status rumah gagal disimpan");
  revalidatePath("/portal/dashboard");
  refreshListing();
}

export async function setDevUnitReview(_: FormState, fd: FormData): Promise<FormState> {
  const { supabase } = await requireTeam();
  const id = text(fd, "id", 40);
  if (!UUID.test(id)) return { error: "Rumah tidak dikenal." };
  const { data, error } = await supabase
    .from("rto_dev_units")
    .update({ review_note: text(fd, "review_note", 1000) || null, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select("id");
  if (error || !data?.length) return { error: "Catatan belum tersimpan." };
  return done("Catatan untuk developer tersimpan.");
}

// ---------------- Foto, deskripsi, dan titik peta unit (pemilik sebelum tayang, tim kapan saja) ----------------

const PHOTO_TYPES: Record<string, { ext: string; magic: (b: Uint8Array) => boolean }> = {
  "image/webp": {
    ext: "webp",
    magic: (b) => b[0] === 0x52 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x46 && b[8] === 0x57 && b[9] === 0x45 && b[10] === 0x42 && b[11] === 0x50,
  },
  "image/jpeg": { ext: "jpg", magic: (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff },
  "image/png": { ext: "png", magic: (b) => b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47 },
};

export async function uploadUnitPhoto(fd: FormData): Promise<{ error?: string }> {
  const { supabase, user } = await getPortalSession();
  if (!user) return { error: "Sesi berakhir. Silakan masuk lagi." };
  const unit = text(fd, "unit_id", 40);
  const file = fd.get("file");
  if (!UUID.test(unit) || !(file instanceof File)) return { error: "Data foto tidak lengkap." };
  const type = PHOTO_TYPES[file.type];
  if (!type) return { error: "Format foto harus WebP, JPG, atau PNG." };
  if (file.size > 1_000_000) return { error: "Foto terlalu besar." };
  // Bucket ini publik: pastikan isinya benar-benar gambar, bukan file lain yang diberi nama foto
  if (!type.magic(new Uint8Array(await file.slice(0, 12).arrayBuffer()))) return { error: "File ini bukan foto." };
  const path = `${unit}/${crypto.randomUUID()}.${type.ext}`;
  const bucket = supabase.storage.from("rto-units");
  const up = await bucket.upload(path, file, { contentType: file.type, cacheControl: "31536000", upsert: false });
  if (up.error) return { error: "Foto belum terunggah. Setelah unit tayang, foto hanya bisa diubah tim barumahID." };
  const { error } = await supabase.rpc(isDev(fd) ? "rto_dev_unit_add_photo" : "rto_unit_add_photo", { p_unit: unit, p_path: path });
  if (error) {
    await bucket.remove([path]);
    return { error: dbMessage(error.message, "Foto belum tersimpan. Coba lagi.") };
  }
  revalidatePath("/portal/dashboard");
  refreshListing();
  return {};
}

/** Susun ulang atau hapus foto. Foto yang tidak ada lagi di daftar ikut dihapus dari penyimpanan. */
export async function setUnitPhotos(fd: FormData): Promise<{ error?: string }> {
  const { supabase, user } = await getPortalSession();
  if (!user) return { error: "Sesi berakhir. Silakan masuk lagi." };
  const unit = text(fd, "unit_id", 40);
  let next: unknown;
  try {
    next = JSON.parse(String(fd.get("photos") ?? "[]"));
  } catch {
    next = null;
  }
  if (!UUID.test(unit) || !Array.isArray(next) || next.length > 12 || !next.every((p) => typeof p === "string")) {
    return { error: "Data foto tidak valid." };
  }
  const list = next as string[];
  const dev = isDev(fd);
  const { data: row } = await supabase.from(dev ? "rto_dev_units" : "rto_units").select("photos").eq("id", unit).maybeSingle();
  const before = (row as { photos: string[] } | null)?.photos ?? [];
  const { error } = await supabase.rpc(dev ? "rto_dev_unit_set_photos" : "rto_unit_set_photos", { p_unit: unit, p_photos: list });
  if (error) return { error: dbMessage(error.message, "Foto belum tersimpan. Coba lagi.") };
  const removed = before.filter((p) => !list.includes(p));
  if (removed.length) await supabase.storage.from("rto-units").remove(removed);
  revalidatePath("/portal/dashboard");
  refreshListing();
  return {};
}

export async function setUnitDescription(_: FormState, fd: FormData): Promise<FormState> {
  const { supabase, user } = await getPortalSession();
  if (!user) return { error: "Sesi berakhir. Silakan masuk lagi." };
  const unit = text(fd, "id", 40);
  if (!UUID.test(unit)) return { error: "Unit tidak dikenal." };
  const { error } = await supabase.rpc(isDev(fd) ? "rto_dev_unit_set_description" : "rto_unit_set_description", {
    p_unit: unit,
    p_text: text(fd, "description", 1500),
  });
  if (error) return { error: dbMessage(error.message, "Deskripsi belum tersimpan.") };
  refreshListing();
  return done("Deskripsi tersimpan.");
}

const MAPS_HOSTS = ["maps.app.goo.gl", "goo.gl", "google.com", "www.google.com", "maps.google.com", "www.google.co.id", "google.co.id"];

/** Ambil koordinat dari link Google Maps atau teks "lat, lng". Link pendek diikuti maksimal 3 kali, hanya ke domain Google. */
async function parseLocation(input: string): Promise<[number, number] | null> {
  const fromText = (s: string): [number, number] | null => {
    let t = s.replace(/\+/g, " ");
    try {
      t = decodeURIComponent(t);
    } catch {
      // biarkan apa adanya
    }
    const pin = t.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/);
    if (pin) return [Number(pin[1]), Number(pin[2])];
    const at = t.match(/@(-?\d+\.\d+),\s*(-?\d+\.\d+)/);
    if (at) return [Number(at[1]), Number(at[2])];
    const plain = t.match(/(-?\d{1,2}\.\d{3,})\s*,\s*(-?\d{2,3}\.\d{3,})/);
    if (plain) return [Number(plain[1]), Number(plain[2])];
    return null;
  };
  let current = input.trim();
  for (let hop = 0; hop < 4; hop++) {
    const found = fromText(current);
    if (found) return found;
    let url: URL;
    try {
      url = new URL(current);
    } catch {
      return null;
    }
    if (url.protocol !== "https:" || !MAPS_HOSTS.includes(url.hostname)) return null;
    const res = await fetch(url, { redirect: "manual", signal: AbortSignal.timeout(5_000) }).catch(() => null);
    const location = res?.headers.get("location");
    if (!location) return null;
    current = new URL(location, url).toString();
  }
  return null;
}

export async function setUnitLocation(_: FormState, fd: FormData): Promise<FormState> {
  const { supabase } = await requireTeam();
  const unit = text(fd, "id", 40);
  const raw = text(fd, "location", 600);
  if (!UUID.test(unit)) return { error: "Unit tidak dikenal." };
  if (!raw) return { error: "Tempel link Google Maps atau koordinat." };
  const point = await parseLocation(raw);
  if (!point) return { error: "Koordinat tidak terbaca. Salin link dari Google Maps, atau tulis seperti -0.9471, 100.4172." };
  const [lat, lng] = point;
  if (!(lat > -11.5 && lat < 6.5 && lng > 94.5 && lng < 141.5)) return { error: "Titik berada di luar Indonesia." };
  // Geser acak 120 sampai 300 m supaya peta publik hanya menunjukkan area; yang disimpan hanya titik hasil geseran
  const d = 120 + Math.random() * 180;
  const angle = Math.random() * 2 * Math.PI;
  const approxLat = Number((lat + (d * Math.cos(angle)) / 111_320).toFixed(5));
  const approxLng = Number((lng + (d * Math.sin(angle)) / (111_320 * Math.cos((lat * Math.PI) / 180))).toFixed(5));
  const { data, error } = await supabase
    .from(isDev(fd) ? "rto_dev_units" : "rto_units")
    .update({ approx_lat: approxLat, approx_lng: approxLng, updated_at: new Date().toISOString() })
    .eq("id", unit)
    .select("id");
  if (error || !data?.length) return { error: "Titik peta belum tersimpan." };
  refreshListing();
  return done("Titik peta tersimpan (sudah digeser, bukan lokasi persis).");
}

// ---------------- Tim barumahID ----------------

export async function verifyKtp(fd: FormData) {
  const { supabase, user } = await requireTeam();
  const id = text(fd, "user_id", 60);
  const on = fd.get("on") === "1";
  if (!id) fail("Data tidak lengkap");
  const { data, error } = await supabase
    .from("rto_tenants")
    .update({ ktp_verified_at: on ? new Date().toISOString() : null, ktp_verified_by: on ? user!.id : null, updated_at: new Date().toISOString() })
    .eq("user_id", id)
    .select("user_id");
  if (error || !data?.length) fail("Verifikasi gagal disimpan");
  revalidatePath("/portal/dashboard");
}

export async function setTenantPlan(_: FormState, fd: FormData): Promise<FormState> {
  const { supabase } = await requireTeam();
  const id = text(fd, "user_id", 60);
  const path = text(fd, "path", 20);
  const targetPrice = num(fd, "target_price");
  const dpTarget = num(fd, "dp_target");
  const contract = text(fd, "contract_signed_at", 10);
  const ppjb = text(fd, "ppjb_signed_at", 10);
  const devUnit = text(fd, "target_dev_unit_id", 40);
  if (!id) return { error: "Data tidak lengkap." };
  let price = targetPrice > 0 ? targetPrice : null;
  let dp = dpTarget > 0 ? dpTarget : null;
  let devId: string | null = null;
  // Rumah tujuan dari developer mitra: harga dan target DP terisi dari unit kalau dikosongkan
  if (UUID.test(devUnit)) {
    const { data: u } = await supabase.from("rto_dev_units").select("id, price, dp_min_pct").eq("id", devUnit).maybeSingle();
    const unit = u as { id: string; price: number; dp_min_pct: number } | null;
    if (!unit) return { error: "Rumah tujuan tidak ditemukan." };
    devId = unit.id;
    price = price ?? Number(unit.price);
    dp = dp ?? Math.round((Number(unit.price) * Number(unit.dp_min_pct)) / 100);
  }
  const { data, error } = await supabase
    .from("rto_tenants")
    .update({
      path: ["siap-berdaya", "siap-bangun", "siap-beli"].includes(path) ? path : null,
      target_price: price,
      dp_target: dp,
      target_dev_unit_id: devId,
      contract_signed_at: isDate(contract) ? contract : null,
      ppjb_signed_at: isDate(ppjb) ? ppjb : null,
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", id)
    .select("user_id");
  if (error || !data?.length) return { error: "Rencana belum tersimpan." };
  return done("Rencana penyewa tersimpan.");
}

const RTO_STATUSES = ["belum", "diajukan", "disetujui", "ditolak", "selesai", "mundur"];

export async function setRtoStatus(fd: FormData) {
  const { supabase, user } = await requireTeam();
  const id = text(fd, "user_id", 60);
  const status = text(fd, "rto_status", 20);
  if (!id || !RTO_STATUSES.includes(status)) fail("Status tidak valid");
  const decided = status === "disetujui" || status === "ditolak";
  const { data, error } = await supabase
    .from("rto_tenants")
    .update({
      rto_status: status,
      updated_at: new Date().toISOString(),
      ...(decided ? { rto_decided_at: new Date().toISOString(), rto_decided_by: user!.id } : {}),
    })
    .eq("user_id", id)
    .select("user_id");
  if (error || !data?.length) fail("Status RTO gagal disimpan");
  revalidatePath("/portal/dashboard");
}

export async function createTenancy(_: FormState, fd: FormData): Promise<FormState> {
  const { supabase, user } = await requireTeam();
  const tenant = text(fd, "user_id", 60);
  const unitId = text(fd, "unit_id", 60);
  const label = text(fd, "unit_label", 120);
  const start = text(fd, "start_date", 10);
  const rent = num(fd, "rent_monthly");
  const dueDay = num(fd, "due_day");
  if (!tenant || !isDate(start)) return { error: "Isi tanggal mulai sewa." };
  if (!unitId && label.length < 3) return { error: "Pilih unit atau tulis nama unit." };
  if (!(rent > 0)) return { error: "Isi harga sewa per bulan." };
  const { error } = await supabase.from("rto_tenancies").insert({
    tenant_user_id: tenant,
    unit_id: unitId || null,
    unit_label: unitId ? null : label,
    start_date: start,
    rent_monthly: rent,
    due_day: dueDay >= 1 && dueDay <= 28 ? dueDay : 5,
    created_by: user!.id,
  });
  if (error) return { error: "Sewa belum tersimpan." };
  return done("Sewa tercatat.");
}

export async function endTenancy(fd: FormData) {
  const { supabase } = await requireTeam();
  const id = text(fd, "id", 60);
  const { data, error } = await supabase
    .from("rto_tenancies")
    .update({ status: "selesai", end_date: new Date().toISOString().slice(0, 10) })
    .eq("id", id)
    .select("id");
  if (error || !data?.length) fail("Sewa gagal diakhiri");
  revalidatePath("/portal/dashboard");
}

export async function recordPayment(_: FormState, fd: FormData): Promise<FormState> {
  const { supabase } = await requireTeam();
  const tenancy = text(fd, "tenancy_id", 60);
  const period = text(fd, "period", 7);
  const paidAt = text(fd, "paid_at", 10);
  const amount = num(fd, "amount");
  if (!tenancy || !isMonth(period) || !isDate(paidAt) || !(amount > 0)) return { error: "Lengkapi bulan, tanggal bayar, dan nominal." };
  const { error } = await supabase.rpc("rto_record_payment", {
    p_tenancy: tenancy,
    p_period: `${period}-01`,
    p_amount: amount,
    p_paid_at: paidAt,
    p_reference: text(fd, "reference", 160),
  });
  if (error) return { error: dbMessage(error.message, "Pembayaran belum tercatat.") };
  return done("Pembayaran tercatat. Kalau penyewa sudah peserta RTO, 25% otomatis masuk saldo DP.");
}

export async function confirmPayment(fd: FormData) {
  const { supabase } = await requireTeam();
  const id = text(fd, "id", 60);
  const paidAt = text(fd, "paid_at", 10);
  const { error } = await supabase.rpc("rto_confirm_payment", { p_payment: id, p_paid_at: isDate(paidAt) ? paidAt : null });
  if (error) fail(dbMessage(error.message, "Konfirmasi gagal"));
  revalidatePath("/portal/dashboard");
}

export async function rejectPayment(fd: FormData) {
  const { supabase, user } = await requireTeam();
  const id = text(fd, "id", 60);
  const { data, error } = await supabase
    .from("rto_payments")
    .update({ status: "ditolak", recorded_by: user!.id })
    .eq("id", id)
    .neq("status", "lunas")
    .select("id");
  if (error || !data?.length) fail("Laporan gagal ditolak");
  revalidatePath("/portal/dashboard");
}

export async function addLedger(_: FormState, fd: FormData): Promise<FormState> {
  const { supabase, user } = await requireTeam();
  const tenant = text(fd, "user_id", 60);
  const kind = text(fd, "kind", 20);
  const raw = String(fd.get("amount") ?? "").trim();
  const amount = Number(raw.replace(/[^\d-]/g, ""));
  const note = text(fd, "note", 300);
  if (!tenant || !["koreksi", "pengembalian", "konversi"].includes(kind)) return { error: "Pilih jenis catatan." };
  if (!Number.isFinite(amount) || amount === 0) return { error: "Isi nominal (pakai minus untuk mengurangi)." };
  if (note.length < 5) return { error: "Tulis alasan singkat." };
  const signed = kind === "koreksi" ? amount : -Math.abs(amount);
  const { error } = await supabase.from("rto_dp_ledger").insert({ tenant_user_id: tenant, kind, amount: signed, note, created_by: user!.id });
  if (error) return { error: "Catatan saldo belum tersimpan." };
  return done("Catatan saldo tersimpan.");
}

const UNIT_STATUSES = ["diajukan", "inspeksi", "perbaikan", "tayang", "penuh", "ditolak", "nonaktif"];

export async function setUnitStatus(fd: FormData) {
  const { supabase } = await requireTeam();
  const id = text(fd, "id", 60);
  const status = text(fd, "status", 20);
  if (!id || !UNIT_STATUSES.includes(status)) fail("Status tidak valid");
  const { data, error } = await supabase.from("rto_units").update({ status, updated_at: new Date().toISOString() }).eq("id", id).select("id");
  if (error || !data?.length) fail("Status unit gagal disimpan");
  revalidatePath("/portal/dashboard");
  refreshListing();
}

export async function setUnitInspection(_: FormState, fd: FormData): Promise<FormState> {
  const { supabase } = await requireTeam();
  const id = text(fd, "id", 60);
  const result = text(fd, "inspection_result", 20);
  if (!id || !["layak", "layak_catatan", "tidak_layak"].includes(result)) return { error: "Pilih hasil inspeksi." };
  const { data, error } = await supabase
    .from("rto_units")
    .update({ inspection_result: result, inspection_note: text(fd, "inspection_note", 1000) || null, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select("id");
  if (error?.code === "23514") return { error: "Unit masih tayang. Ubah statusnya dulu sebelum menandai tidak layak." };
  if (error || !data?.length) return { error: "Hasil inspeksi belum tersimpan." };
  return done("Hasil inspeksi tersimpan.");
}
