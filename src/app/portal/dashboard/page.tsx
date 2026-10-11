import type { Metadata } from "next";
import { redirect } from "next/navigation";
import PortalShell, { SetupNotice } from "@/components/portal/PortalShell";
import MitraDashboard from "@/components/portal/MitraDashboard";
import TeamDashboard, { TABS, type Bagian, type TabId } from "@/components/portal/TeamDashboard";
import { getPortalSession } from "@/lib/portal-session";
import { isTeam, type AccountMeta, type FormSubmission, type Mitra, type OrgLevel, type Profile, type StaffInvite, type TeamMember } from "@/lib/portal";
import { portalConfigured } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Dashboard" };

type Props = { searchParams: Promise<{ bagian?: string; tab?: string; kategori?: string; status?: string; grup?: string }> };

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
    // Bagian utama: Struktur Organisasi (bawaan) atau Dashboard; link lama ?tab=... otomatis ke Dashboard
    const bagian: Bagian = sp.bagian === "dashboard" || (sp.bagian !== "struktur" && sp.tab) ? "dashboard" : "struktur";
    const [levels, team, mitra, accounts, accountMeta, submissions, invites] = await Promise.all([
      supabase.from("portal_org_levels").select("*").order("sort"),
      supabase.from("portal_team").select("*").order("sort"),
      supabase.from("portal_mitra").select("*").order("category").order("name"),
      supabase.from("portal_profiles").select("*").order("created_at", { ascending: false }),
      supabase.rpc("portal_accounts"),
      supabase.from("portal_form_submissions").select("*").order("submitted_at", { ascending: false, nullsFirst: false }).limit(500),
      supabase.from("portal_staff_invites").select("*").order("created_at"),
    ]);
    return (
      <PortalShell profile={profile} email={user.email ?? ""}>
        <TeamDashboard
          bagian={bagian}
          tab={tab}
          filter={{ kategori: sp.kategori, status: sp.status, grup: sp.grup }}
          levels={(levels.data ?? []) as OrgLevel[]}
          team={(team.data ?? []) as TeamMember[]}
          mitra={(mitra.data ?? []) as Mitra[]}
          accounts={(accounts.data ?? []) as Profile[]}
          accountMeta={(accountMeta.data ?? []) as AccountMeta[]}
          submissions={(submissions.data ?? []) as FormSubmission[]}
          invites={(invites.data ?? []) as StaffInvite[]}
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
