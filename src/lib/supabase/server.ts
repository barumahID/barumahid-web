import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

// Klien Supabase untuk Portal (server saja). Memakai sesi login pengguna dari cookie, jadi semua akses data
// dibatasi RLS di database: tim membaca semua data portal, mitra hanya data miliknya. Publishable key saja,
// tanpa secret key. Env sama dengan form lead: SUPABASE_URL dan SUPABASE_PUBLISHABLE_KEY.

export function portalConfigured() {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_PUBLISHABLE_KEY);
}

export async function portalClient() {
  const cookieStore = await cookies();
  return createServerClient(process.env.SUPABASE_URL!, process.env.SUPABASE_PUBLISHABLE_KEY!, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (list) => {
        try {
          list.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Dipanggil dari Server Component (cookie tidak bisa ditulis). Sesi disegarkan oleh src/proxy.ts.
        }
      },
    },
  });
}
