"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { portalClient, portalConfigured } from "@/lib/supabase/server";
import { getPortalSession } from "@/lib/portal-session";
import { isCategory, isTeam, type MitraStatus, type Role } from "@/lib/portal";

// Server action Portal barumahID. Semua akses data lewat sesi pengguna, jadi izin ditegakkan RLS di database.
// Pesan untuk pengguna ditulis formal (portal dipakai mitra dan tim).

export interface FormState {
  ok?: boolean;
  error?: string;
  message?: string;
}

const NOT_READY = "Portal belum terhubung ke database. Hubungi admin barumahID.";

async function origin() {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const proto = h.get("x-forwarded-proto") ?? (host?.startsWith("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}

function authMessage(msg: string) {
  const m = msg.toLowerCase();
  if (m.includes("invalid login credentials")) return "Email atau kata sandi tidak sesuai.";
  if (m.includes("email not confirmed")) return "Email belum dikonfirmasi. Buka tautan konfirmasi yang kami kirim ke email Anda.";
  if (m.includes("already registered") || m.includes("already been registered")) return "Email ini sudah terdaftar. Silakan masuk.";
  if (m.includes("password")) return "Kata sandi minimal 8 karakter.";
  if (m.includes("rate limit")) return "Terlalu banyak percobaan. Coba lagi beberapa menit lagi.";
  return "Terjadi kendala. Coba lagi atau hubungi admin barumahID.";
}

const text = (fd: FormData, key: string, max = 160) => String(fd.get(key) ?? "").trim().slice(0, max);

export async function signIn(_: FormState, fd: FormData): Promise<FormState> {
  if (!portalConfigured()) return { error: NOT_READY };
  const email = text(fd, "email").toLowerCase();
  const password = String(fd.get("password") ?? "");
  if (!email || !password) return { error: "Isi email dan kata sandi." };
  const supabase = await portalClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: authMessage(error.message) };
  redirect("/portal/dashboard");
}

export async function signUp(_: FormState, fd: FormData): Promise<FormState> {
  if (!portalConfigured()) return { error: NOT_READY };
  const email = text(fd, "email").toLowerCase();
  const password = String(fd.get("password") ?? "");
  const fullName = text(fd, "full_name", 120);
  const phone = text(fd, "phone", 30);
  const company = text(fd, "company", 120);
  const category = text(fd, "category", 40);
  if (!fullName || !email || !phone) return { error: "Lengkapi nama, email, dan nomor WhatsApp." };
  if (!/^\S+@\S+\.\S+$/.test(email)) return { error: "Format email tidak valid." };
  if (!/^[0-9+\-\s]{8,20}$/.test(phone)) return { error: "Nomor WhatsApp tidak valid." };
  if (password.length < 8) return { error: "Kata sandi minimal 8 karakter." };
  if (!isCategory(category)) return { error: "Pilih jenis kemitraan." };
  if (fd.get("agree") !== "on") return { error: "Setujui kebijakan privasi untuk melanjutkan." };

  const supabase = await portalClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName, phone, company, category },
      emailRedirectTo: `${await origin()}/portal/auth/callback`,
    },
  });
  if (error) return { error: authMessage(error.message) };
  if (data.session) redirect("/portal/dashboard");
  return {
    ok: true,
    message: "Akun berhasil dibuat. Buka tautan konfirmasi yang kami kirim ke email Anda, lalu masuk ke Portal.",
  };
}

export async function signOut() {
  const supabase = await portalClient();
  await supabase.auth.signOut();
  redirect("/portal");
}

export async function requestReset(_: FormState, fd: FormData): Promise<FormState> {
  if (!portalConfigured()) return { error: NOT_READY };
  const email = text(fd, "email").toLowerCase();
  if (!/^\S+@\S+\.\S+$/.test(email)) return { error: "Format email tidak valid." };
  const supabase = await portalClient();
  await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${await origin()}/portal/auth/callback?next=/portal/sandi-baru`,
  });
  // Pesan sama untuk email terdaftar atau tidak, supaya daftar akun tidak bisa ditebak
  return { ok: true, message: "Jika email terdaftar, tautan untuk mengatur ulang kata sandi sudah kami kirim." };
}

export async function updatePassword(_: FormState, fd: FormData): Promise<FormState> {
  const password = String(fd.get("password") ?? "");
  if (password.length < 8) return { error: "Kata sandi minimal 8 karakter." };
  if (password !== String(fd.get("confirm") ?? "")) return { error: "Konfirmasi kata sandi tidak sama." };
  const supabase = await portalClient();
  const { error } = await supabase.auth.updateUser({ password });
  if (error) return { error: authMessage(error.message) };
  redirect("/portal/dashboard");
}

// ---- Aksi tim (admin dan tim). RLS tetap menjadi penjaga utama. ----

async function requireTeam() {
  const s = await getPortalSession();
  if (!s.user || !isTeam(s.profile)) throw new Error("Akses khusus tim barumahID");
  return s;
}

const STATUSES: MitraStatus[] = ["terdaftar", "bersedia", "terverifikasi", "aktif", "nonaktif"];

export async function setMitraStatus(fd: FormData) {
  const { supabase, user } = await requireTeam();
  const id = text(fd, "id", 60);
  const status = text(fd, "status", 20) as MitraStatus;
  if (!id || !STATUSES.includes(status)) return;
  const verified = status === "terverifikasi" || status === "aktif";
  await supabase
    .from("portal_mitra")
    .update({
      status,
      updated_at: new Date().toISOString(),
      ...(verified ? { verified_at: new Date().toISOString(), verified_by: user!.id } : {}),
    })
    .eq("id", id);
  revalidatePath("/portal/dashboard");
}

/** Hubungkan akun mitra ke data mitra yang ada, atau buat data mitra baru dari profil akun. */
export async function linkAccount(fd: FormData) {
  const { supabase, user } = await requireTeam();
  const userId = text(fd, "user_id", 60);
  const mitraId = text(fd, "mitra_id", 60);
  if (!userId || !mitraId) return;
  const now = new Date().toISOString();
  if (mitraId === "baru") {
    const { data: p } = await supabase.from("portal_profiles").select("*").eq("user_id", userId).maybeSingle();
    if (!p) return;
    await supabase.from("portal_mitra").insert({
      category: isCategory(p.requested_category) ? p.requested_category : "tenaga_kerja",
      name: p.full_name || p.email,
      company: p.company,
      phone: p.phone,
      email: p.email,
      status: "terverifikasi",
      source: "Pendaftaran Portal",
      user_id: userId,
      verified_at: now,
      verified_by: user!.id,
    });
  } else {
    await supabase
      .from("portal_mitra")
      .update({ user_id: userId, updated_at: now, verified_at: now, verified_by: user!.id })
      .eq("id", mitraId);
  }
  revalidatePath("/portal/dashboard");
}

export async function unlinkAccount(fd: FormData) {
  const { supabase } = await requireTeam();
  const mitraId = text(fd, "mitra_id", 60);
  if (!mitraId) return;
  await supabase.from("portal_mitra").update({ user_id: null, updated_at: new Date().toISOString() }).eq("id", mitraId);
  revalidatePath("/portal/dashboard");
}

export async function setRole(fd: FormData) {
  const { supabase, profile } = await requireTeam();
  if (profile?.role !== "admin") return;
  const userId = text(fd, "user_id", 60);
  const role = text(fd, "role", 10) as Role;
  if (!userId || !["admin", "tim", "mitra"].includes(role)) return;
  await supabase.rpc("portal_set_role", { target: userId, new_role: role });
  revalidatePath("/portal/dashboard");
}
