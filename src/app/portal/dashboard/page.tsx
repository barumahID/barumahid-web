import type { Metadata } from "next";
import { redirect } from "next/navigation";
import PortalShell, { SetupNotice } from "@/components/portal/PortalShell";
import MitraDashboard from "@/components/portal/MitraDashboard";
import TeamDashboard, { TABS, type TabId } from "@/components/portal/TeamDashboard";
import { getPortalSession } from "@/lib/portal-session";
import { isTeam, type Mitra, type OrgLevel, type Profile, type TeamMember } from "@/lib/portal";
import { portalConfigured } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Dashboard" };

type Props = { searchParams: Promise<{ tab?: string; kategori?: string; status?: string }> };

export default async function PortalDashboardPage({ searchParams }: Props) {
  if (!portalConfigured()) {
    return (
      <div className="px-5 py-20">
        <SetupNotice title="Portal belum terhubung" body="Variabel lingkungan Supabase belum diatur untuk deployment ini." />
      </div>
    );
  }
  const { supabase, user, profile, schemaMissing } = await getPortalSession();
  if (!user) redirect("/portal");

  if (schemaMissing || !profile) {
    return (
      <PortalShell profile={null} email={user.email ?? ""}>
        <SetupNotice
          title="Data portal belum siap"
          body={
            schemaMissing
              ? "Basis data portal sedang disiapkan oleh admin barumahID. Silakan kembali beberapa saat lagi."
              : "Profil akun Anda belum tersedia. Hubungi admin barumahID."
          }
        />
      </PortalShell>
    );
  }

  if (isTeam(profile)) {
    const sp = await searchParams;
    const tab: TabId = TABS.some((t) => t.id === sp.tab) ? (sp.tab as TabId) : "ringkasan";
    const [levels, team, mitra, accounts] = await Promise.all([
      supabase.from("portal_org_levels").select("*").order("sort"),
      supabase.from("portal_team").select("*").order("sort"),
      supabase.from("portal_mitra").select("*").order("category").order("name"),
      supabase.from("portal_profiles").select("*").order("created_at", { ascending: false }),
    ]);
    return (
      <PortalShell profile={profile} email={user.email ?? ""}>
        <TeamDashboard
          tab={tab}
          filter={{ kategori: sp.kategori, status: sp.status }}
          levels={(levels.data ?? []) as OrgLevel[]}
          team={(team.data ?? []) as TeamMember[]}
          mitra={(mitra.data ?? []) as Mitra[]}
          accounts={(accounts.data ?? []) as Profile[]}
          me={profile}
        />
      </PortalShell>
    );
  }

  const { data: mitra } = await supabase.from("portal_mitra").select("*").eq("user_id", user.id).maybeSingle();
  return (
    <PortalShell profile={profile} email={user.email ?? ""}>
      <MitraDashboard profile={profile} mitra={(mitra as Mitra | null) ?? null} />
    </PortalShell>
  );
}
