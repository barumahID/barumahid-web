import { FORMS, isLeadRole, toSupabaseRow, validateLead, type LeadPayload, type LeadRole } from "@/lib/leads";

// Semua form website masuk lewat route ini. Data disimpan ke:
//   1. Supabase, tabel `barumahid_leads` (penyimpanan utama). Publishable key hanya boleh INSERT (RLS).
//   2. Google Sheet CRM Master lewat Apps Script (opsional, untuk kerja harian tim + notifikasi email/WA).
// Pengiriman dianggap berhasil kalau minimal satu tujuan menerima data.
// Kalau dua-duanya gagal atau belum dikonfigurasi, form menampilkan tombol kirim via WhatsApp,
// supaya data pengunjung tidak hilang diam-diam.
//
// Env (isi di Vercel > Settings > Environment Variables, JANGAN di kode; repo ini publik):
//   SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY   tujuan 1
//   LEADS_WEBHOOK_URL, LEADS_WEBHOOK_SECRET  tujuan 2 (opsional), lihat docs/backend/README.md
//   TURNSTILE_SECRET_KEY                     opsional, anti-spam Cloudflare Turnstile

export const dynamic = "force-dynamic";

const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 6;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const list = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  list.push(now);
  hits.set(ip, list);
  if (hits.size > 5000) hits.clear();
  return list.length > MAX_PER_WINDOW;
}

function json(body: unknown, status = 200) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

async function verifyTurnstile(token: string | undefined, ip: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true; // Turnstile belum diaktifkan
  if (!token) return false;
  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret, response: token, remoteip: ip }),
    });
    const data = (await res.json()) as { success?: boolean };
    return Boolean(data.success);
  } catch {
    return false;
  }
}

/** null = tujuan ini belum dikonfigurasi */
type SaveResult = boolean | null;

async function saveToSupabase(role: LeadRole, values: Record<string, string>, page: string): Promise<SaveResult> {
  const baseUrl = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!baseUrl || !key) return null;
  try {
    const res = await fetch(`${baseUrl.replace(/\/+$/, "")}/rest/v1/barumahid_leads`, {
      method: "POST",
      headers: { apikey: key, "Content-Type": "application/json", Prefer: "return=minimal" },
      body: JSON.stringify(toSupabaseRow(role, values, page)),
      signal: AbortSignal.timeout(8_000),
    });
    if (!res.ok) {
      // Jangan log `details` dari Supabase: isinya bisa memuat data pribadi pengisi form.
      const err = (await res.json().catch(() => ({}))) as { code?: string; message?: string };
      console.error(`[leads] supabase menolak form ${role}: ${res.status} ${err.code ?? ""} ${err.message ?? ""}`);
      return false;
    }
    return true;
  } catch (err) {
    console.error(`[leads] supabase error form ${role}:`, err instanceof Error ? err.message : err);
    return false;
  }
}

async function saveToSheet(
  role: LeadRole,
  values: Record<string, string>,
  page: string,
  userAgent: string,
): Promise<SaveResult> {
  const url = process.env.LEADS_WEBHOOK_URL;
  const secret = process.env.LEADS_WEBHOOK_SECRET;
  if (!url || !secret) return null;
  const def = FORMS[role];
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        secret,
        role,
        sheet: def.sheet,
        fields: { ...values, ...(def.fixed ?? {}) },
        meta: { page, submittedAt: new Date().toISOString(), userAgent },
      }),
      redirect: "follow",
      signal: AbortSignal.timeout(12_000),
    });
    const text = await res.text();
    let data: { ok?: boolean; error?: string } = {};
    try {
      data = JSON.parse(text);
    } catch {
      data = {};
    }
    if (!res.ok || data.ok !== true) {
      console.error(`[leads] apps script menolak form ${role}: status ${res.status} ${data.error ?? ""}`);
      return false;
    }
    return true;
  } catch (err) {
    console.error(`[leads] apps script error form ${role}:`, err instanceof Error ? err.message : err);
    return false;
  }
}

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  if (rateLimited(ip)) {
    return json({ ok: false, reason: "rate_limited", message: "Terlalu banyak percobaan. Coba lagi beberapa menit lagi." }, 429);
  }

  let payload: Partial<LeadPayload>;
  try {
    payload = (await request.json()) as Partial<LeadPayload>;
  } catch {
    return json({ ok: false, reason: "bad_request", message: "Format data tidak dikenali." }, 400);
  }

  // Honeypot: bot biasanya mengisi semua field, manusia tidak melihat field ini.
  if (payload.company_website) {
    return json({ ok: true });
  }

  if (!isLeadRole(payload.role)) {
    return json({ ok: false, reason: "bad_request", message: "Jenis form tidak dikenali." }, 400);
  }
  if (payload.consent !== true) {
    return json({ ok: false, reason: "no_consent", message: "Persetujuan pemrosesan data wajib dicentang." }, 400);
  }

  const role = payload.role;
  const result = validateLead(role, (payload.fields ?? {}) as Record<string, unknown>);
  if (!result.ok) {
    return json({ ok: false, reason: "invalid", errors: result.errors, message: "Ada isian yang perlu diperbaiki." }, 400);
  }

  if (!(await verifyTurnstile(payload.turnstileToken, ip))) {
    return json({ ok: false, reason: "captcha", message: "Verifikasi anti-spam gagal. Muat ulang halaman lalu coba lagi." }, 400);
  }

  const page = typeof payload.page === "string" ? payload.page.slice(0, 200) : "";
  const userAgent = (request.headers.get("user-agent") ?? "").slice(0, 200);

  const [db, sheet] = await Promise.all([
    saveToSupabase(role, result.values, page),
    saveToSheet(role, result.values, page, userAgent),
  ]);

  if (db === null && sheet === null) {
    console.error(`[leads] belum ada tujuan penyimpanan yang dikonfigurasi, form ${role} tidak tersimpan`);
    return json(
      { ok: false, reason: "not_configured", message: "Form sedang dalam perbaikan. Kirim lewat WhatsApp dulu ya." },
      503,
    );
  }
  if (db !== true && sheet !== true) {
    return json({ ok: false, reason: "upstream", message: "Data belum berhasil disimpan. Kirim lewat WhatsApp dulu ya." }, 502);
  }

  return json({ ok: true });
}
