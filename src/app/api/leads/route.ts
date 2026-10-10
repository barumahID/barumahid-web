import { FORMS, isLeadRole, validateLead, type LeadPayload } from "@/lib/leads";

// Semua form website masuk lewat route ini, lalu diteruskan ke Google Apps Script
// yang menulis baris baru di sheet "barumahID — CRM Master".
//
// Env yang dibutuhkan (isi di Vercel > Settings > Environment Variables, JANGAN di kode):
//   LEADS_WEBHOOK_URL     URL Web App Apps Script (https://script.google.com/macros/s/.../exec)
//   LEADS_WEBHOOK_SECRET  string acak panjang, sama dengan WEBHOOK_SECRET di Script Properties
//   TURNSTILE_SECRET_KEY  opsional, anti-spam Cloudflare Turnstile
// Kalau URL belum diisi, route mengembalikan 503 dan form menampilkan tombol kirim via WhatsApp,
// supaya data pengunjung tidak hilang diam-diam.

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

  const url = process.env.LEADS_WEBHOOK_URL;
  const secret = process.env.LEADS_WEBHOOK_SECRET;
  if (!url || !secret) {
    console.error(`[leads] webhook belum dikonfigurasi, form ${role} tidak tersimpan`);
    return json(
      { ok: false, reason: "not_configured", message: "Form sedang dalam perbaikan. Kirim lewat WhatsApp dulu ya." },
      503,
    );
  }

  const def = FORMS[role];
  const body = {
    secret,
    role,
    sheet: def.sheet,
    fields: { ...result.values, ...(def.fixed ?? {}) },
    meta: {
      page: typeof payload.page === "string" ? payload.page.slice(0, 200) : "",
      submittedAt: new Date().toISOString(),
      userAgent: (request.headers.get("user-agent") ?? "").slice(0, 200),
    },
  };

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
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
      console.error(`[leads] webhook menolak form ${role}: status ${res.status} ${data.error ?? ""}`);
      return json({ ok: false, reason: "upstream", message: "Data belum berhasil disimpan. Kirim lewat WhatsApp dulu ya." }, 502);
    }
  } catch (err) {
    console.error(`[leads] webhook error form ${role}:`, err instanceof Error ? err.message : err);
    return json({ ok: false, reason: "upstream", message: "Koneksi ke server data gagal. Kirim lewat WhatsApp dulu ya." }, 502);
  }

  return json({ ok: true });
}
