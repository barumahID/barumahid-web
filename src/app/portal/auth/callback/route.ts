import { NextResponse, type NextRequest } from "next/server";
import { portalClient } from "@/lib/supabase/server";

// Tujuan tautan dari email Supabase (konfirmasi akun, atur ulang kata sandi). Kode ditukar menjadi sesi login,
// lalu pengguna diarahkan ke `next` (hanya alamat di dalam /portal).
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/portal/dashboard";
  const safeNext = next.startsWith("/portal") ? next : "/portal/dashboard";
  if (code) {
    const supabase = await portalClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(`${origin}${safeNext}`);
  }
  return NextResponse.redirect(`${origin}/portal?gagal=1`);
}
