import type { Metadata } from "next";
import { redirect } from "next/navigation";
import PortalShell, { SetupNotice } from "@/components/portal/PortalShell";
import MitraDashboard from "@/components/portal/MitraDashboard";
import TeamDashboard, { TABS, type Bagian, type TabId } from "@/components/portal/TeamDashboard";
import PenyewaDashboard from "@/components/portal/PenyewaDashboard";
import MitraUnits from "@/components/portal/MitraUnits";
import DevUnits from "@/components/portal/DevUnits";
import type { RtoTeamData } from "@/components/portal/TeamRto";
import type {
  DevPipelineRow,
  MyTarget,
  RtoAgreement,
  RtoAssessment,
  RtoDevUnit,
  RtoLedgerEntry,
  RtoPayment,
  RtoTenancy,
  RtoTenant,
  RtoUnit,
} from "@/lib/rto";
import { getPortalSession } from "@/lib/portal-session";
import { isTeam, type AccountMeta, type FormSubmission, type Mitra, type OrgLevel, type Profile, type StaffInvite, type TeamMember } from "@/lib/portal";
import { portalConfigured } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Dashboard" };

type Props = { searchParams: Promise<{ bagian?: string; tab?: string; kategori?: string; status?: string; grup?: string; q?: string }> };

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
    let rto: RtoTeamData | null = null;
    if (bagian === "dashboard" && tab === "rto") {
      const [tenants, assessments, tenancies, payments, ledger, units, devUnits] = await Promise.all([
        supabase.from("rto_tenants").select("*"),
        supabase.from("rto_assessments").select("*").order("created_at", { ascending: false }).limit(1000),
        supabase.from("rto_tenancies").select("*").order("start_date", { ascending: false }),
        supabase.from("rto_payments").select("*").order("period", { ascending: false }).limit(2000),
        supabase.from("rto_dp_ledger").select("*").order("created_at", { ascending: false }).limit(2000),
        supabase.from("rto_units").select("*").order("created_at", { ascending: false }),
        supabase.from("rto_dev_units").select("*").order("created_at", { ascending: false }),
      ]);
      if (!tenants.error) {
        rto = {
          tenants: (tenants.data ?? []) as RtoTenant[],
          assessments: (assessments.data ?? []) as RtoAssessment[],
          tenancies: (tenancies.data ?? []) as RtoTenancy[],
          payments: (payments.data ?? []) as RtoPayment[],
          ledger: (ledger.data ?? []) as RtoLedgerEntry[],
          units: (units.data ?? []) as RtoUnit[],
          devUnits: (devUnits.data ?? []) as RtoDevUnit[],
        };
      }
    }
    return (
      <PortalShell profile={profile} email={user.email ?? ""}>
        <TeamDashboard
          bagian={bagian}
          tab={tab}
          filter={{ kategori: sp.kategori, status: sp.status, grup: sp.grup, q: sp.q }}
          levels={(levels.data ?? []) as OrgLevel[]}
          team={(team.data ?? []) as TeamMember[]}
          mitra={(mitra.data ?? []) as Mitra[]}
          accounts={(accounts.data ?? []) as Profile[]}
          accountMeta={(accountMeta.data ?? []) as AccountMeta[]}
          submissions={(submissions.data ?? []) as FormSubmission[]}
          invites={(invites.data ?? []) as StaffInvite[]}
          me={profile}
          rto={rto}
        />
      </PortalShell>
    );
  }

  // Penyewa: level, saldo DP, sewa, pembayaran, asesmen, dokumen (RLS: hanya data milik akun ini)
  if (profile.role === "penyewa") {
    const [tenant, assessment, tenancies, payments, ledger, agreements, streak, target] = await Promise.all([
      supabase.from("rto_tenants").select("*").eq("user_id", user.id).maybeSingle(),
      supabase.from("rto_assessments").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(1).maybeSingle(),
      supabase.from("rto_tenancies").select("*").eq("tenant_user_id", user.id).eq("status", "aktif").order("start_date", { ascending: false }).limit(1),
      supabase.from("rto_payments").select("*").eq("tenant_user_id", user.id).order("period", { ascending: false }).limit(60),
      supabase.from("rto_dp_ledger").select("*").eq("tenant_user_id", user.id).order("created_at", { ascending: false }).limit(200),
      supabase.from("rto_agreements").select("*").eq("user_id", user.id),
      supabase.rpc("rto_ontime_streak", { p_user: user.id }),
      supabase.rpc("rto_my_target"),
    ]);
    const active = ((tenancies.data ?? []) as RtoTenancy[])[0] ?? null;
    let unit: Pick<RtoUnit, "title" | "city"> | null = null;
    if (active?.unit_id) {
      const { data: u } = await supabase.from("rto_units").select("title, city").eq("id", active.unit_id).maybeSingle();
      unit = (u as Pick<RtoUnit, "title" | "city"> | null) ?? null;
    }
    return (
      <PortalShell profile={profile} email={user.email ?? ""}>
        <PenyewaDashboard
          profile={profile}
          data={{
            tenant: (tenant.data as RtoTenant | null) ?? null,
            assessment: (assessment.data as RtoAssessment | null) ?? null,
            tenancy: active ? { ...active, unit_title: unit?.title ?? null, unit_city: unit?.city ?? null } : null,
            payments: (payments.data ?? []) as RtoPayment[],
            ledger: (ledger.data ?? []) as RtoLedgerEntry[],
            agreements: (agreements.data ?? []) as RtoAgreement[],
            streak: typeof streak.data === "number" ? streak.data : 0,
            target: ((target.data ?? []) as MyTarget[])[0] ?? null,
          }}
        />
      </PortalShell>
    );
  }

  const { data: mitra } = await supabase.from("portal_mitra").select("*").eq("user_id", user.id).maybeSingle();
  const m = (mitra as Mitra | null) ?? null;
  const category = m?.category ?? profile.requested_category;
  const isKos = category === "penyedia_kos";
  let unitsPanel: React.ReactNode = null;
  // Developer mitra: rumah tujuan RTO dan pipeline peserta (tanpa identitas)
  if (category === "developer") {
    const [devUnits, pipeline] = await Promise.all([
      supabase.from("rto_dev_units").select("*").eq("owner_user_id", user.id).order("created_at", { ascending: false }),
      supabase.rpc("rto_dev_pipeline"),
    ]);
    unitsPanel = <DevUnits units={(devUnits.data ?? []) as RtoDevUnit[]} pipeline={(pipeline.data ?? []) as DevPipelineRow[]} />;
  }
  if (isKos) {
    const [units, tenancies, payments] = await Promise.all([
      supabase.from("rto_units").select("*").eq("owner_user_id", user.id).order("created_at", { ascending: false }),
      supabase.from("rto_tenancies").select("*"),
      supabase.from("rto_payments").select("*").order("period", { ascending: false }).limit(500),
    ]);
    unitsPanel = (
      <MitraUnits
        units={(units.data ?? []) as RtoUnit[]}
        tenancies={(tenancies.data ?? []) as RtoTenancy[]}
        payments={(payments.data ?? []) as RtoPayment[]}
      />
    );
  }
  return (
    <PortalShell profile={profile} email={user.email ?? ""}>
      <MitraDashboard profile={profile} mitra={m} />
      {unitsPanel && <div className="mt-6">{unitsPanel}</div>}
    </PortalShell>
  );
}
