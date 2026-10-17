"use server";

import { revalidatePath } from "next/cache";
import { getPortalSession } from "@/lib/portal-session";
import { isTeam } from "@/lib/portal";
import type { FormState } from "./actions";

// Server action platform RTO di Portal. Semua akses lewat sesi pengguna, izin ditegakkan RLS dan fungsi database
// (rto_submit_assessment, rto_report_payment, rto_apply, rto_confirm_payment, rto_record_payment).
// Pesan galat dari database tidak diteruskan mentah; yang dikenal saja yang ditampilkan.

const text = (fd: FormData, key: string, max = 160) => String(fd.get(key) ?? "").trim().slice(0, max);
const num = (fd: FormData, key: string) => {
  const v = Number(String(fd.get(key) ?? "").replace(/[^\d]/g, ""));
  return Number.isFinite(v) ? v : NaN;
};
const isDate = (v: string) => /^\d{4}-\d{2}-\d{2}$/.test(v);
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
  });
  if (error) return { error: "Unit belum tersimpan. Pastikan akun Anda terdaftar sebagai penyedia kos." };
  return done("Unit terkirim. Tim barumahID menghubungi Anda untuk jadwal inspeksi.");
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
  if (!id) return { error: "Data tidak lengkap." };
  const { data, error } = await supabase
    .from("rto_tenants")
    .update({
      path: ["siap-berdaya", "siap-bangun", "siap-beli"].includes(path) ? path : null,
      target_price: targetPrice > 0 ? targetPrice : null,
      dp_target: dpTarget > 0 ? dpTarget : null,
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
  if (error || !data?.length) return { error: "Hasil inspeksi belum tersimpan." };
  return done("Hasil inspeksi tersimpan.");
}
