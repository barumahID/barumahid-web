"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { portalClient, portalConfigured } from "@/lib/supabase/server";
import { getPortalSession } from "@/lib/portal-session";
import { FORM_META, answerText, isCategory, isTeam, type FormSubmission, type MitraStatus, type Role, type SubmissionStatus } from "@/lib/portal";
import { SITE } from "@/data/site";

// Server action Portal barumahID. Semua akses data lewat sesi pengguna, jadi izin ditegakkan RLS di database.
// Pesan untuk pengguna ditulis formal (portal dipakai mitra dan tim).

export interface FormState {
  ok?: boolean;
  error?: string;
  message?: string;
}

const NOT_READY = "Portal belum terhubung ke database. Hubungi admin barumahID.";

/** Alamat situs untuk tautan di email. Hanya domain sendiri, preview Vercel tim, atau localhost; selain itu domain utama. */
async function origin() {
  const h = await headers();
  const host = (h.get("x-forwarded-host") ?? h.get("host") ?? "").toLowerCase();
  if (/^localhost(:\d+)?$/.test(host)) return `http://${host}`;
  if (host === "barumahid.com" || host === "www.barumahid.com" || /^[a-z0-9-]+-barumahids-projects\.vercel\.app$/.test(host)) return `https://${host}`;
  return SITE.url;
}

/** Pesan yang jelas untuk pengguna dari error Supabase Auth (kode dulu, lalu teks pesan sebagai cadangan) */
function authMessage(error: { message: string; code?: string }) {
  switch (error.code) {
    case "email_address_invalid":
      return "Alamat email tidak valid atau tidak aktif. Periksa lagi ejaannya (nama Gmail minimal 6 huruf), atau pakai email lain.";
    case "email_address_not_authorized":
      return "Email konfirmasi belum bisa dikirim ke alamat ini. Hubungi admin barumahID lewat WhatsApp.";
    case "over_email_send_rate_limit":
      return "Pendaftaran sedang ramai, email konfirmasi tertunda. Coba lagi sekitar 1 jam lagi, atau hubungi admin barumahID.";
    case "user_already_exists":
    case "email_exists":
      return "Email ini sudah terdaftar. Silakan masuk, atau pakai Lupa kata sandi.";
    case "weak_password":
      return "Kata sandi terlalu lemah. Pakai minimal 8 karakter, campur huruf dan angka.";
    case "signup_disabled":
      return "Pendaftaran akun sedang ditutup. Hubungi admin barumahID.";
  }
  const m = error.message.toLowerCase();
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
  if (error) return { error: authMessage(error) };
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
  const city = text(fd, "city", 80);
  // Jenis akun: penyewa (calon penghuni program RTO) atau mitra. Peran tim/admin tidak bisa dipilih sendiri.
  const account = text(fd, "account", 10) === "penyewa" ? "penyewa" : "mitra";
  if (!fullName || !email || !phone) return { error: "Lengkapi nama, email, dan nomor WhatsApp." };
  if (!/^\S+@\S+\.\S+$/.test(email)) return { error: "Format email tidak valid." };
  if (!/^[0-9+\-\s]{8,20}$/.test(phone)) return { error: "Nomor WhatsApp tidak valid." };
  if (password.length < 8) return { error: "Kata sandi minimal 8 karakter." };
  if (account === "mitra" && !isCategory(category)) return { error: "Pilih jenis kemitraan." };
  if (account === "penyewa" && city.length < 2) return { error: "Isi kota tempat kamu tinggal atau mencari hunian." };
  if (fd.get("agree") !== "on") return { error: "Setujui syarat dan ketentuan serta kebijakan privasi untuk melanjutkan." };

  const supabase = await portalClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data:
        account === "penyewa"
          ? { full_name: fullName, phone, city, account, terms: "v1" }
          : { full_name: fullName, phone, company, category, account, terms: "v1" },
      emailRedirectTo: `${await origin()}/portal/auth/callback`,
    },
  });
  if (error) return { error: authMessage(error) };
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
  if (error) return { error: authMessage(error) };
  redirect("/portal/dashboard");
}

// ---- Aksi tim (admin dan tim). RLS tetap menjadi penjaga utama. ----

async function requireTeam() {
  const s = await getPortalSession();
  if (!s.user || !isTeam(s.profile)) throw new Error("Akses khusus tim barumahID");
  return s;
}

/** Hentikan aksi dengan pesan; dipakai pilihan status (AutoSelect) untuk mengembalikan nilai dan menampilkan "Gagal". */
function fail(message: string): never {
  throw new Error(message);
}

const STATUSES: MitraStatus[] = ["terdaftar", "bersedia", "terverifikasi", "aktif", "nonaktif"];

export async function setMitraStatus(fd: FormData) {
  const { supabase, user } = await requireTeam();
  const id = text(fd, "id", 60);
  const status = text(fd, "status", 20) as MitraStatus;
  if (!id || !STATUSES.includes(status)) fail("Status tidak valid");
  const verified = status === "terverifikasi" || status === "aktif";
  const { data, error } = await supabase
    .from("portal_mitra")
    .update({
      status,
      updated_at: new Date().toISOString(),
      ...(verified ? { verified_at: new Date().toISOString(), verified_by: user!.id } : {}),
    })
    .eq("id", id)
    .select("id");
  if (error || !data?.length) fail("Status mitra gagal disimpan");
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
  if (profile?.role !== "admin") fail("Khusus admin");
  const userId = text(fd, "user_id", 60);
  const role = text(fd, "role", 10) as Role;
  if (!userId || !["admin", "tim", "mitra", "penyewa"].includes(role)) fail("Peran tidak valid");
  const { error } = await supabase.rpc("portal_set_role", { target: userId, new_role: role });
  if (error) fail("Peran gagal disimpan");
  revalidatePath("/portal/dashboard");
}

// ---- Formulir masuk: verifikasi mitra dari jawaban Google Form ----

const SUB_STATUSES: SubmissionStatus[] = ["baru", "diproses", "diverifikasi", "ditolak"];

export async function setSubmissionStatus(fd: FormData) {
  const { supabase, user } = await requireTeam();
  const id = text(fd, "id", 60);
  const status = text(fd, "status", 20) as SubmissionStatus;
  if (!id || !SUB_STATUSES.includes(status)) fail("Status tidak valid");
  const { data, error } = await supabase
    .from("portal_form_submissions")
    .update({ status, handled_by: user!.id, handled_at: new Date().toISOString() })
    .eq("id", id)
    .select("id");
  if (error || !data?.length) fail("Status formulir gagal disimpan");
  revalidatePath("/portal/dashboard");
}

/** Buat data mitra terverifikasi dari jawaban form pendaftaran, lalu hubungkan akun portal dengan email yang sama. */
export async function verifySubmission(fd: FormData) {
  const { supabase, user } = await requireTeam();
  const id = text(fd, "id", 60);
  const target = text(fd, "mitra_id", 60) || "baru";
  if (!id) return;
  const { data } = await supabase.from("portal_form_submissions").select("*").eq("id", id).maybeSingle();
  const sub = data as FormSubmission | null;
  if (!sub) return;
  const now = new Date().toISOString();
  let mitraId = target;

  if (target === "baru") {
    const meta = FORM_META[sub.form_code];
    if (!meta?.category) return;
    let accountId: string | null = null;
    if (sub.respondent_email) {
      const { data: acc } = await supabase.from("portal_profiles").select("user_id, role").eq("email", sub.respondent_email.toLowerCase()).maybeSingle();
      if (acc && acc.role === "mitra") {
        const { data: taken } = await supabase.from("portal_mitra").select("id").eq("user_id", acc.user_id).maybeSingle();
        if (!taken) accountId = acc.user_id;
      }
    }
    const jawaban = (sub.answers ?? []).slice(0, 40).map((x) => `${x.q}: ${answerText(x.a)}`.slice(0, 400));
    const { data: created } = await supabase
      .from("portal_mitra")
      .insert({
        category: meta.category,
        name: sub.name || sub.respondent_email || "Tanpa nama",
        phone: sub.phone,
        email: sub.respondent_email,
        status: "terverifikasi",
        source: `Google Form ${sub.form_code}`,
        profile: { formulir: `${sub.form_code} ${meta.title}`, jawaban },
        user_id: accountId,
        verified_at: now,
        verified_by: user!.id,
      })
      .select("id")
      .single();
    if (!created) return;
    mitraId = created.id;
  }

  await supabase
    .from("portal_form_submissions")
    .update({ mitra_id: mitraId, status: "diverifikasi", handled_by: user!.id, handled_at: now })
    .eq("id", id);
  revalidatePath("/portal/dashboard");
}

// ---- Undangan anggota tim (khusus admin): akun dengan email ini otomatis jadi tim/admin setelah email dikonfirmasi ----

export async function inviteStaff(fd: FormData) {
  const { supabase, profile } = await requireTeam();
  if (profile?.role !== "admin") return;
  const email = text(fd, "email", 160).toLowerCase();
  const role = text(fd, "role", 10);
  if (!/^\S+@\S+\.\S+$/.test(email) || !["admin", "tim"].includes(role)) return;
  await supabase.from("portal_staff_invites").upsert({ email, role });
  revalidatePath("/portal/dashboard");
}

export async function removeInvite(fd: FormData) {
  const { supabase, profile } = await requireTeam();
  if (profile?.role !== "admin") return;
  const email = text(fd, "email", 160).toLowerCase();
  if (!email) return;
  await supabase.from("portal_staff_invites").delete().eq("email", email);
  revalidatePath("/portal/dashboard");
}

// ---- Status personil (khusus admin; RLS portal_team juga hanya mengizinkan admin) ----

export async function setTeamStatus(fd: FormData) {
  const { supabase, profile } = await requireTeam();
  if (profile?.role !== "admin") fail("Khusus admin");
  const id = text(fd, "id", 60);
  const status = text(fd, "status", 20);
  if (!id || !["aktif", "nonaktif", "ditunda"].includes(status)) fail("Status tidak valid");
  const { data, error } = await supabase
    .from("portal_team")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id)
    .not("name", "is", null)
    .select("id");
  if (error || !data?.length) fail("Status personil gagal disimpan");
  revalidatePath("/portal/dashboard");
}
