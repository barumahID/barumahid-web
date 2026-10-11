import { portalClient } from "@/lib/supabase/server";
import type { Profile } from "@/lib/portal";

/** Pengguna yang sedang login beserta profil portalnya. `schemaMissing` = tabel portal belum dibuat. */
export async function getPortalSession() {
  const supabase = await portalClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { supabase, user: null, profile: null, schemaMissing: false };
  const { data, error } = await supabase.from("portal_profiles").select("*").eq("user_id", user.id).maybeSingle();
  const schemaMissing = Boolean(error && (error.code === "42P01" || error.code === "PGRST205"));
  return { supabase, user, profile: (data as Profile | null) ?? null, schemaMissing };
}
