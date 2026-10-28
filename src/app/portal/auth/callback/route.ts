import { NextResponse, type NextRequest } from "next/server";
import { portalClient } from "@/lib/supabase/server";

// Tujuan tautan dari email Supabase (konfirmasi akun, atur ulang kata sandi). Kode ditukar menjadi sesi login,
// lalu pengguna diarahkan ke `next` (hanya alamat di dalam /portal).
// Kalau penukaran gagal: biasanya tautan dibuka di browser lain (mis. dari aplikasi Gmail), jadi kode verifier PKCE
// tidak ada. Email sudah dikonfirmasi Supabase sebelum mengarahkan ke sini, jadi untuk konfirmasi akun pengguna
// cukup diminta masuk. Tautan atur ulang kata sandi harus dibuka di browser yang sama, jadi diminta tautan baru.
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/portal/dashboard";
  const safeNext = next.startsWith("/portal") ? next : "/portal/dashboard";
  const isReset = safeNext.startsWith("/portal/sandi-baru");
  if (code) {
    const supabase = await portalClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(`${origin}${safeNext}`);
    return NextResponse.redirect(isReset ? `${origin}/portal/lupa?gagal=1` : `${origin}/portal?konfirmasi=1`);
  }
  // Tautan kedaluwarsa atau sudah dipakai: Supabase mengirim error_code di alamat
  const expired = searchParams.get("error_code") === "otp_expired";
  if (isReset) return NextResponse.redirect(`${origin}/portal/lupa?gagal=1`);
  return NextResponse.redirect(`${origin}/portal?gagal=${expired ? "kedaluwarsa" : "1"}`);
}
