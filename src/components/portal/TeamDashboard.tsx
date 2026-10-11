import Link from "next/link";
import {
  inviteStaff,
  linkAccount,
  removeInvite,
  setMitraStatus,
  setRole,
  setSubmissionStatus,
  setTeamStatus,
  unlinkAccount,
  verifySubmission,
} from "@/app/portal/actions";
import { waHref } from "./PortalShell";
import OrgChart from "./OrgChart";
import { Bars, CountUp, Donut } from "./Viz";
import {
  CATEGORY_LABEL,
  CATEGORY_LINE,
  FORM_GROUP_LABEL,
  FORM_META,
  STATUS_LABEL,
  STATUS_TONE,
  SUBMISSION_STATUS,
  TEAM_STATUS,
  answerText,
  phoneKey,
  type AccountMeta,
  type FormGroupId,
  type FormSubmission,
  type Mitra,
  type MitraCategory,
  type MitraStatus,
  type OrgLevel,
  type Profile,
  type StaffInvite,
  type SubmissionStatus,
  type TeamMember,
} from "@/lib/portal";

// Portal tim barumahID (pusat data internal), dibagi dua bagian (arahan user Okt 2026):
// 1) Struktur Organisasi: bagan beranimasi, jobdesk, dan daftar tim (status aktif/nonaktif/ditunda diubah admin).
// 2) Dashboard: ringkasan (angka, grafik, perlu tindakan, aktivitas terbaru), formulir masuk (jawaban Google Form dan
//    verifikasi mitra), mitra, developer RTO, akun portal. Tampilan informatif dengan animasi ringan (arahan user).
// Data dari Supabase (RLS: hanya admin/tim).

export type Bagian = "struktur" | "dashboard";

export const TABS = [
  { id: "ringkasan", label: "Ringkasan" },
  { id: "formulir", label: "Formulir masuk" },
  { id: "mitra", label: "Mitra" },
  { id: "developer", label: "Developer RTO" },
  { id: "akun", label: "Akun portal" },
] as const;
export type TabId = (typeof TABS)[number]["id"];

const PROFILE_LABEL: Record<string, string> = {
  pimpinan: "Pengurus",
  alamat: "Alamat",
  kontak_lain: "Kontak lain",
  akta: "Akta pendirian",
  sk_kemenkumham: "SK Kemenkumham",
  nib: "NIB",
  npwp: "NPWP badan usaha",
  skala: "Skala usaha",
  sbu: "Sertifikat badan usaha",
  kbli: "Bidang usaha (KBLI)",
  bidang: "Bidang usaha",
  legalitas: "Legalitas lain",
  keanggotaan: "Keanggotaan",
  struktur: "Struktur",
  pengalaman: "Pengalaman",
  sertifikat_standar: "Sertifikat standar",
  pendiri: "Pendiri",
  kelengkapan: "Kelengkapan dokumen",
  formulir: "Formulir",
  jawaban: "Jawaban formulir",
  catatan: "Catatan",
};

const CATEGORY_COLOR: Record<MitraCategory, string> = {
  tenaga_kerja: "#C53B3B",
  kontraktor_mandor: "#141414",
  supplier_vendor: "#C25E20",
  penyedia_kos: "#2D7A4F",
  developer: "#1A5C9A",
};
const MITRA_STATUS_COLOR: Record<MitraStatus, string> = {
  terdaftar: "#9A9A9A",
  bersedia: "#1A5C9A",
  terverifikasi: "#C25E20",
  aktif: "#2D7A4F",
  nonaktif: "#C53B3B",
};
const GROUP_COLOR: Record<FormGroupId, string> = {
  mitra: "#C53B3B",
  feedback: "#C25E20",
  klien: "#1A5C9A",
  pelanggan_rto: "#2D7A4F",
  umum: "#6B6B6B",
};

const card = "rounded-2xl border border-brand-dark/10 bg-white";
const th = "px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[0.12em] text-brand-gray";
const td = "px-4 py-3 align-middle text-[13.5px]";
const select = "rounded-md border border-brand-dark/15 bg-white px-2 py-1 text-[12.5px]";
const btnDark = "rounded-md bg-brand-dark px-2.5 py-1 text-[12px] font-bold text-white hover:bg-brand-red";
const btnLine = "rounded-md border border-brand-dark/20 px-2.5 py-1 text-[12px] font-bold hover:border-brand-dark";

const TZ = "Asia/Jakarta";
const fmtDate = (d: string | null) => (d ? new Date(d).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short", timeZone: TZ }) : "-");

function relTime(d: string | null) {
  if (!d) return "-";
  const diff = Date.now() - new Date(d).getTime();
  const m = Math.round(diff / 60000);
  if (m < 1) return "baru saja";
  if (m < 60) return `${m} menit lalu`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h} jam lalu`;
  const day = Math.round(h / 24);
  if (day < 30) return `${day} hari lalu`;
  return new Date(d).toLocaleDateString("id-ID", { dateStyle: "medium", timeZone: TZ });
}

const AVATAR = ["#C53B3B", "#1A5C9A", "#2D7A4F", "#C25E20", "#141414", "#6B4FA0"];
function Avatar({ name, size = 34 }: { name: string; size?: number }) {
  const clean = name.replace(/^(cv|pt)\.?\s+/i, "");
  const initials = clean
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");
  const color = AVATAR[[...name].reduce((a, c) => a + c.charCodeAt(0), 0) % AVATAR.length];
  return (
    <span
      className="inline-flex shrink-0 items-center justify-center rounded-full font-extrabold text-white"
      style={{ width: size, height: size, background: color, fontSize: size * 0.36 }}
      aria-hidden="true"
    >
      {initials || "?"}
    </span>
  );
}

function Badge({ tone, children }: { tone: string; children: React.ReactNode }) {
  return <span className={`inline-block whitespace-nowrap rounded-full px-2.5 py-0.5 text-[11.5px] font-bold ${tone}`}>{children}</span>;
}

function Phone({ phone }: { phone: string | null }) {
  const href = waHref(phone);
  if (!phone) return <span className="text-brand-mute">-</span>;
  return href ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className="whitespace-nowrap font-semibold text-[#1f9d55] hover:underline">
      {phone}
    </a>
  ) : (
    <span>{phone}</span>
  );
}

function Chip({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={`rounded-full border px-3 py-1 text-[12.5px] font-semibold transition-colors ${
        active ? "border-brand-dark bg-brand-dark text-white" : "border-brand-dark/15 bg-white text-brand-dark hover:border-brand-dark"
      }`}
    >
      {children}
    </Link>
  );
}

function PanelTitle({ title, sub, action }: { title: string; sub?: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div>
        <h2 className="text-[15px] font-extrabold">{title}</h2>
        {sub && <p className="mt-0.5 text-[12.5px] text-brand-gray">{sub}</p>}
      </div>
      {action}
    </div>
  );
}

function StatIcon({ id }: { id: string }) {
  const p = { width: 18, height: 18, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.9, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  if (id === "tim")
    return (
      <svg {...p}>
        <circle cx="9" cy="8" r="3.2" />
        <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6M16 4.5a3 3 0 0 1 0 6M21 20c0-2.6-1.5-4.8-3.6-5.6" />
      </svg>
    );
  if (id === "mitra")
    return (
      <svg {...p}>
        <path d="m11 17 2 2a1.4 1.4 0 0 0 2-2M14 14l2.5 2.5a1.4 1.4 0 0 0 2-2l-3.9-3.9a2 2 0 0 0-2.8 0l-.9.9a1.4 1.4 0 0 1-2-2l2.8-2.8a4 4 0 0 1 4.5-.8l.4.2a3 3 0 0 0 2 .2L21 6M3 6l2.6 2.6a2 2 0 0 0 2.9 0" />
      </svg>
    );
  if (id === "developer")
    return (
      <svg {...p}>
        <path d="M3 21V9l7-5 7 5v12M3 21h18M9 21v-5h2v5M17 21v-8h4v8" />
      </svg>
    );
  if (id === "formulir")
    return (
      <svg {...p}>
        <rect x="5" y="3" width="14" height="18" rx="2" />
        <path d="M9 8h6M9 12h6M9 16h4" />
      </svg>
    );
  return (
    <svg {...p}>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20c0-3.9 3.1-7 7-7s7 3.1 7 7" />
    </svg>
  );
}

export interface Filters {
  kategori?: string;
  status?: string;
  grup?: string;
  q?: string;
}

export default function TeamDashboard({
  bagian,
  tab,
  filter,
  levels,
  team,
  mitra,
  accounts,
  accountMeta,
  submissions,
  invites,
  me,
}: {
  bagian: Bagian;
  tab: TabId;
  filter: Filters;
  levels: OrgLevel[];
  team: TeamMember[];
  mitra: Mitra[];
  accounts: Profile[];
  accountMeta: AccountMeta[];
  submissions: FormSubmission[];
  invites: StaffInvite[];
  me: Profile;
}) {
  const isAdmin = me.role === "admin";
  const developers = mitra.filter((m) => m.category === "developer");
  const linkedByUser = new Map(mitra.filter((m) => m.user_id).map((m) => [m.user_id!, m]));
  const pendingAccounts = accounts.filter((a) => a.role === "mitra" && !linkedByUser.has(a.user_id));
  const newSubmissions = submissions.filter((s) => s.status === "baru");

  // Cocokkan akun portal dengan jawaban form (email atau nomor WhatsApp yang sama)
  const accountByEmail = new Map(accounts.map((a) => [a.email.toLowerCase(), a]));
  const accountByPhone = new Map(accounts.filter((a) => phoneKey(a.phone)).map((a) => [phoneKey(a.phone)!, a]));
  const accountOf = (s: FormSubmission) =>
    (s.respondent_email && accountByEmail.get(s.respondent_email.toLowerCase())) || (phoneKey(s.phone) && accountByPhone.get(phoneKey(s.phone)!)) || null;
  const formsOf = (a: Profile) =>
    submissions.filter(
      (s) => (s.respondent_email && s.respondent_email.toLowerCase() === a.email.toLowerCase()) || (phoneKey(a.phone) && phoneKey(s.phone) === phoneKey(a.phone)),
    );
  const today = new Date().toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: TZ });

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[12px] font-bold uppercase tracking-[0.16em] text-brand-red">Portal tim barumahID</p>
          <h1 className="mt-2 text-[24px] font-extrabold tracking-tight">Halo, {me.full_name || me.email.split("@")[0]}.</h1>
          <p className="mt-0.5 text-[13px] text-brand-gray">{today}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {newSubmissions.length > 0 && (
            <Link href="/portal/dashboard?bagian=dashboard&tab=formulir&status=baru" className="rounded-full bg-brand-red px-4 py-2 text-[13px] font-bold text-white hover:bg-brand-red-dark">
              {newSubmissions.length} formulir baru
            </Link>
          )}
          {pendingAccounts.length > 0 && (
            <Link href="/portal/dashboard?bagian=dashboard&tab=akun" className="rounded-full bg-brand-dark px-4 py-2 text-[13px] font-bold text-white hover:bg-black">
              {pendingAccounts.length} akun menunggu verifikasi
            </Link>
          )}
        </div>
      </div>

      <div className="mt-6 inline-flex rounded-xl border border-brand-dark/10 bg-white p-1" role="tablist" aria-label="Bagian portal">
        {(
          [
            { id: "struktur", label: "Struktur Organisasi", href: "/portal/dashboard?bagian=struktur" },
            { id: "dashboard", label: "Dashboard", href: "/portal/dashboard?bagian=dashboard" },
          ] as const
        ).map((b) => (
          <Link
            key={b.id}
            href={b.href}
            role="tab"
            aria-selected={bagian === b.id}
            className={`rounded-lg px-4 py-2 text-[13.5px] font-bold transition-colors ${
              bagian === b.id ? "bg-brand-dark text-white" : "text-brand-gray hover:text-brand-dark"
            }`}
          >
            {b.label}
          </Link>
        ))}
      </div>

      {bagian === "dashboard" && (
        <nav className="no-scrollbar mt-5 flex gap-1 overflow-x-auto border-b border-brand-dark/10" aria-label="Sub bagian dashboard">
          {TABS.map((t) => {
            const count = t.id === "formulir" ? newSubmissions.length : t.id === "akun" ? pendingAccounts.length : 0;
            return (
              <Link
                key={t.id}
                href={`/portal/dashboard?bagian=dashboard&tab=${t.id}`}
                className={`flex items-center gap-1.5 whitespace-nowrap border-b-2 px-3.5 py-2.5 text-[13.5px] font-semibold transition-colors ${
                  tab === t.id ? "border-brand-red text-brand-dark" : "border-transparent text-brand-gray hover:text-brand-dark"
                }`}
              >
                {t.label}
                {count > 0 && <span className="rounded-full bg-brand-red px-1.5 text-[10.5px] font-bold text-white">{count}</span>}
              </Link>
            );
          })}
        </nav>
      )}

      {bagian === "struktur" ? (
        <div className="mt-6 space-y-6">
          <OrgChart levels={levels} team={team} isAdmin={isAdmin} />
          <Tim levels={levels} team={team} isAdmin={isAdmin} />
        </div>
      ) : (
        <div className="mt-6">
          {tab === "ringkasan" && (
            <Ringkasan team={team} mitra={mitra} developers={developers} pending={pendingAccounts} submissions={submissions} accounts={accounts} accountMeta={accountMeta} />
          )}
          {tab === "formulir" && <Formulir submissions={submissions} mitra={mitra} filter={filter} accountOf={accountOf} />}
          {tab === "mitra" && <MitraTable mitra={mitra.filter((m) => m.category !== "developer")} accounts={accounts} filter={filter} />}
          {tab === "developer" && <Developers developers={developers} />}
          {tab === "akun" && (
            <Akun
              accounts={accounts}
              accountMeta={accountMeta}
              mitra={mitra}
              linkedByUser={linkedByUser}
              formsOf={formsOf}
              invites={invites}
              isAdmin={isAdmin}
              meId={me.user_id}
            />
          )}
        </div>
      )}
    </div>
  );
}

// ---------------- Ringkasan ----------------

function Ringkasan({
  team,
  mitra,
  developers,
  pending,
  submissions,
  accounts,
  accountMeta,
}: {
  team: TeamMember[];
  mitra: Mitra[];
  developers: Mitra[];
  pending: Profile[];
  submissions: FormSubmission[];
  accounts: Profile[];
  accountMeta: AccountMeta[];
}) {
  const named = team.filter((t) => t.name);
  const aktif = team.filter((t) => t.status === "aktif").length;
  const kosong = team.filter((t) => t.status === "kosong").length;
  const konstruksi = mitra.filter((m) => CATEGORY_LINE[m.category] === "Jasa Konstruksi");
  const baru = submissions.filter((s) => s.status === "baru");
  const loginOf = new Map(accountMeta.map((m) => [m.user_id, m.last_sign_in_at]));
  const nameOf = (a: Profile) => a.full_name || a.email;

  // Aktivitas terbaru: formulir masuk, akun baru, login, dan verifikasi mitra
  type Ev = { at: string; text: string; sub: string; tone: string; who: string };
  const events: Ev[] = [
    ...submissions.filter((s) => s.submitted_at).map((s) => ({
      at: s.submitted_at!,
      who: s.name || s.respondent_email || "Pengisi",
      text: `${s.name || s.respondent_email || "Seseorang"} mengisi ${s.form_code}`,
      sub: FORM_META[s.form_code]?.title ?? s.form_title ?? "",
      tone: GROUP_COLOR[FORM_META[s.form_code]?.group ?? "umum"],
    })),
    ...accounts.map((a) => ({ at: a.created_at, who: nameOf(a), text: `${nameOf(a)} membuat akun portal`, sub: a.role === "mitra" ? "Akun mitra" : "Akun tim", tone: "#1A5C9A" })),
    ...accounts
      .filter((a) => loginOf.get(a.user_id))
      .map((a) => ({ at: loginOf.get(a.user_id)!, who: nameOf(a), text: `${nameOf(a)} masuk ke portal`, sub: "Login terakhir", tone: "#2D7A4F" })),
    ...mitra.filter((m) => m.verified_at).map((m) => ({ at: m.verified_at!, who: m.name, text: `${m.name} diverifikasi`, sub: CATEGORY_LABEL[m.category], tone: "#C25E20" })),
  ]
    .sort((a, b) => (a.at < b.at ? 1 : -1))
    .slice(0, 8);

  const kpis = [
    { id: "tim", label: "Personil aktif", value: aktif, note: `${named.length} tercatat, ${kosong} posisi belum terisi`, href: "/portal/dashboard?bagian=struktur", color: "#2D7A4F" },
    { id: "mitra", label: "Mitra Jasa Konstruksi", value: konstruksi.length, note: `${konstruksi.filter((m) => m.status === "aktif" || m.status === "terverifikasi").length} aktif atau terverifikasi`, href: "/portal/dashboard?bagian=dashboard&tab=mitra", color: "#C53B3B" },
    { id: "developer", label: "Developer RTO", value: developers.length, note: `${developers.filter((d) => d.status === "bersedia").length} bersedia bergabung`, href: "/portal/dashboard?bagian=dashboard&tab=developer", color: "#1A5C9A" },
    { id: "formulir", label: "Formulir masuk", value: submissions.length, note: `${baru.length} baru belum diproses`, href: "/portal/dashboard?bagian=dashboard&tab=formulir", color: "#C25E20" },
    { id: "akun", label: "Akun portal", value: accounts.length, note: `${pending.length} menunggu verifikasi`, href: "/portal/dashboard?bagian=dashboard&tab=akun", color: "#141414" },
  ];

  const todo = [
    { label: "Formulir baru belum diproses", n: baru.length, href: "/portal/dashboard?bagian=dashboard&tab=formulir&status=baru" },
    { label: "Akun mitra menunggu verifikasi", n: pending.length, href: "/portal/dashboard?bagian=dashboard&tab=akun" },
    { label: "Mitra berstatus terdaftar", n: mitra.filter((m) => m.status === "terdaftar").length, href: "/portal/dashboard?bagian=dashboard&tab=mitra&status=terdaftar" },
    { label: "Posisi organisasi belum terisi", n: kosong, href: "/portal/dashboard?bagian=struktur" },
  ];

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-5">
        {kpis.map((k, i) => (
          <Link
            key={k.id}
            href={k.href}
            className={`${card} org-node group block p-5 transition-[border-color,transform] duration-300 hover:-translate-y-0.5 hover:border-brand-dark/30`}
            style={{ animationDelay: `${i * 70}ms` }}
          >
            <span className="flex items-center justify-between">
              <span className="flex h-9 w-9 items-center justify-center rounded-full text-white" style={{ background: k.color }}>
                <StatIcon id={k.id} />
              </span>
              <span className="text-[12px] font-bold text-brand-mute transition-colors group-hover:text-brand-red">→</span>
            </span>
            <p className="mt-3 text-[30px] font-extrabold leading-none tracking-tight">
              <CountUp value={k.value} />
            </p>
            <p className="mt-1.5 text-[13px] font-semibold">{k.label}</p>
            <p className="mt-0.5 text-[12px] text-brand-mute">{k.note}</p>
          </Link>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <section className={`${card} org-node p-6`} style={{ animationDelay: "200ms" }}>
          <PanelTitle title="Perlu tindakan" sub="Hal yang menunggu keputusan tim." />
          <ul className="mt-4 space-y-2">
            {todo.map((t) => (
              <li key={t.label}>
                <Link
                  href={t.href}
                  className={`flex items-center justify-between gap-3 rounded-xl border px-3.5 py-3 text-[13.5px] transition-colors ${
                    t.n > 0 ? "border-brand-red/25 bg-brand-red/[0.04] hover:border-brand-red/50" : "border-brand-dark/10 hover:border-brand-dark/25"
                  }`}
                >
                  <span className="font-semibold">{t.label}</span>
                  <span className={`min-w-7 rounded-full px-2 py-0.5 text-center text-[12px] font-extrabold ${t.n > 0 ? "bg-brand-red text-white" : "bg-brand-dark/[0.06] text-brand-gray"}`}>
                    {t.n}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
        <section className={`${card} org-node p-6 lg:col-span-2`} style={{ animationDelay: "260ms" }}>
          <PanelTitle title="Aktivitas terbaru" sub="Formulir, akun, login, dan verifikasi mitra." />
          {events.length === 0 ? (
            <p className="mt-4 text-[13.5px] text-brand-gray">Belum ada aktivitas.</p>
          ) : (
            <ol className="relative mt-4 space-y-4 border-l border-brand-dark/10 pl-5">
              {events.map((e, i) => (
                <li key={`${e.at}-${i}`} className="org-node relative" style={{ animationDelay: `${300 + i * 60}ms` }}>
                  <span className="absolute -left-[27px] top-1 h-3 w-3 rounded-full ring-4 ring-white" style={{ background: e.tone }} aria-hidden="true" />
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                    <p className="text-[13.5px] font-semibold">{e.text}</p>
                    <span className="text-[12px] text-brand-mute" title={fmtDate(e.at)}>
                      {relTime(e.at)}
                    </span>
                  </div>
                  <p className="text-[12.5px] text-brand-gray">{e.sub}</p>
                </li>
              ))}
            </ol>
          )}
        </section>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <section className={`${card} org-node p-6`} style={{ animationDelay: "320ms" }}>
          <PanelTitle title="Status tim" sub="Jumlah posisi di struktur organisasi." />
          <div className="mt-4">
            <Donut
              center={String(team.length)}
              sub="posisi"
              segments={(["aktif", "ditunda", "nonaktif", "kosong"] as const).map((s) => ({
                label: TEAM_STATUS[s].label,
                value: team.filter((t) => t.status === s).length,
                color: { aktif: "#2D7A4F", ditunda: "#C25E20", nonaktif: "#9A9A9A", kosong: "#E3DED6" }[s],
              }))}
            />
          </div>
        </section>
        <section className={`${card} org-node p-6`} style={{ animationDelay: "380ms" }}>
          <PanelTitle title="Status mitra" sub="Termasuk developer RTO." />
          <div className="mt-4">
            <Donut
              center={String(mitra.length)}
              sub="mitra"
              segments={(Object.keys(STATUS_LABEL) as MitraStatus[]).map((s) => ({ label: STATUS_LABEL[s], value: mitra.filter((m) => m.status === s).length, color: MITRA_STATUS_COLOR[s] }))}
            />
          </div>
        </section>
        <section className={`${card} org-node p-6`} style={{ animationDelay: "440ms" }}>
          <PanelTitle title="Mitra per jenis" />
          <div className="mt-4">
            <Bars
              items={(Object.keys(CATEGORY_LABEL) as MitraCategory[]).map((c) => ({
                label: CATEGORY_LABEL[c],
                value: mitra.filter((m) => m.category === c).length,
                color: CATEGORY_COLOR[c],
                href: c === "developer" ? "/portal/dashboard?bagian=dashboard&tab=developer" : `/portal/dashboard?bagian=dashboard&tab=mitra&kategori=${c}`,
              }))}
            />
          </div>
        </section>
        <section className={`${card} org-node p-6`} style={{ animationDelay: "500ms" }}>
          <PanelTitle title="Formulir per kelompok" sub={submissions.length === 0 ? "Belum ada jawaban yang masuk." : undefined} />
          <div className="mt-4">
            <Bars
              items={(Object.keys(FORM_GROUP_LABEL) as FormGroupId[]).map((g) => ({
                label: FORM_GROUP_LABEL[g],
                value: submissions.filter((s) => FORM_META[s.form_code]?.group === g).length,
                color: GROUP_COLOR[g],
                href: `/portal/dashboard?bagian=dashboard&tab=formulir&grup=${g}`,
              }))}
            />
          </div>
        </section>
      </div>
    </div>
  );
}

// ---------------- Formulir masuk ----------------

function Formulir({
  submissions,
  mitra,
  filter,
  accountOf,
}: {
  submissions: FormSubmission[];
  mitra: Mitra[];
  filter: Filters;
  accountOf: (s: FormSubmission) => Profile | null;
}) {
  const mitraName = new Map(mitra.map((m) => [m.id, m.name]));
  const groups = Object.keys(FORM_GROUP_LABEL) as FormGroupId[];
  const rows = submissions.filter(
    (s) => (!filter.grup || FORM_META[s.form_code]?.group === filter.grup) && (!filter.status || s.status === filter.status),
  );
  const href = (g?: string, st?: string) => {
    const q = new URLSearchParams({ bagian: "dashboard", tab: "formulir" });
    if (g) q.set("grup", g);
    if (st) q.set("status", st);
    return `/portal/dashboard?${q}`;
  };
  return (
    <div className="space-y-4">
      <p className="max-w-3xl text-[13.5px] leading-relaxed text-brand-gray">
        Jawaban Google Form resmi barumahID masuk otomatis ke sini. Untuk formulir pendaftaran mitra, periksa jawabannya lalu klik
        Verifikasi: data mitra terverifikasi dibuat dan akun portal dengan email yang sama ikut terhubung.
      </p>
      <div className="flex flex-wrap gap-2">
        <Chip href={href(undefined, filter.status)} active={!filter.grup}>
          Semua formulir ({submissions.length})
        </Chip>
        {groups.map((g) => (
          <Chip key={g} href={href(g, filter.status)} active={filter.grup === g}>
            {FORM_GROUP_LABEL[g]} ({submissions.filter((s) => FORM_META[s.form_code]?.group === g).length})
          </Chip>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        <Chip href={href(filter.grup)} active={!filter.status}>
          Semua status
        </Chip>
        {(Object.keys(SUBMISSION_STATUS) as SubmissionStatus[]).map((st) => (
          <Chip key={st} href={href(filter.grup, st)} active={filter.status === st}>
            {SUBMISSION_STATUS[st].label} ({submissions.filter((s) => s.status === st).length})
          </Chip>
        ))}
      </div>

      {rows.length === 0 ? (
        <div className={`${card} p-10 text-center`}>
          <p className="text-[15px] font-bold">{submissions.length === 0 ? "Belum ada jawaban formulir" : "Tidak ada jawaban untuk filter ini"}</p>
          <p className="mt-1 text-[13px] text-brand-gray">
            {submissions.length === 0 ? "Jawaban mulai masuk setelah skrip Google Form (Apps Script) aktif." : "Coba ubah filter kelompok atau status."}
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {rows.map((s, i) => {
            const meta = FORM_META[s.form_code];
            const acc = accountOf(s);
            const options = mitra.filter((m) => !meta?.category || m.category === meta.category);
            const label = s.name || s.respondent_email || "Tanpa nama";
            return (
              <li key={s.id} className={`${card} org-node overflow-hidden`} style={{ animationDelay: `${Math.min(i, 10) * 50}ms` }}>
                <div className="h-1" style={{ background: GROUP_COLOR[meta?.group ?? "umum"] }} aria-hidden="true" />
                <div className="p-5">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex min-w-0 gap-3">
                      <Avatar name={label} size={40} />
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-[16px] font-extrabold">{label}</p>
                          <Badge tone={SUBMISSION_STATUS[s.status].tone}>{SUBMISSION_STATUS[s.status].label}</Badge>
                        </div>
                        <p className="mt-0.5 flex flex-wrap items-center gap-2 text-[12.5px] text-brand-gray">
                          <span className="rounded-md bg-brand-dark/[0.06] px-1.5 py-0.5 font-mono text-[11px] font-bold text-brand-dark">{s.form_code}</span>
                          {meta?.title ?? s.form_title}
                          <span className="text-brand-mute">· {relTime(s.submitted_at)}</span>
                        </p>
                        <p className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-[12.5px]">
                          <Phone phone={s.phone} />
                          {s.respondent_email && <span className="break-all text-brand-gray">{s.respondent_email}</span>}
                          <span className={acc ? "font-semibold text-[#1A5C9A]" : "text-brand-mute"}>{acc ? "Punya akun portal" : "Belum punya akun portal"}</span>
                          {s.mitra_id && <span className="font-semibold text-[#2D7A4F]">Mitra: {mitraName.get(s.mitra_id) ?? "-"}</span>}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      {meta?.category && !s.mitra_id && s.status !== "ditolak" && (
                        <form action={verifySubmission} className="flex flex-wrap items-center gap-1.5">
                          <input type="hidden" name="id" value={s.id} />
                          <select name="mitra_id" defaultValue="baru" className={`${select} max-w-[220px]`} aria-label="Data mitra">
                            <option value="baru">Buat data mitra baru</option>
                            {options.map((m) => (
                              <option key={m.id} value={m.id}>
                                {m.name}
                              </option>
                            ))}
                          </select>
                          <button type="submit" className={btnDark}>
                            Verifikasi
                          </button>
                        </form>
                      )}
                      <form action={setSubmissionStatus} className="flex items-center gap-1.5">
                        <input type="hidden" name="id" value={s.id} />
                        <select name="status" defaultValue={s.status} className={select} aria-label="Status formulir">
                          {(Object.keys(SUBMISSION_STATUS) as SubmissionStatus[]).map((st) => (
                            <option key={st} value={st}>
                              {SUBMISSION_STATUS[st].label}
                            </option>
                          ))}
                        </select>
                        <button type="submit" className={btnLine}>
                          Simpan
                        </button>
                      </form>
                    </div>
                  </div>
                  <details className="group mt-3">
                    <summary className="cursor-pointer list-none text-[12.5px] font-bold text-brand-red">
                      <span className="group-open:hidden">Lihat jawaban ({s.answers.length})</span>
                      <span className="hidden group-open:inline">Tutup jawaban</span>
                    </summary>
                    <dl className="mt-2 grid gap-x-6 border-t border-brand-dark/[0.07] pt-3 text-[13px] md:grid-cols-2">
                      {s.answers.map((x, j) => (
                        <div key={j} className="border-b border-brand-dark/[0.05] py-2">
                          <dt className="text-brand-gray">{x.q}</dt>
                          <dd className="mt-0.5 whitespace-pre-line font-semibold">{answerText(x.a) || "-"}</dd>
                        </div>
                      ))}
                    </dl>
                  </details>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

// ---------------- Mitra ----------------

function StatusForm({ m }: { m: Mitra }) {
  return (
    <form action={setMitraStatus} className="flex items-center gap-1.5">
      <input type="hidden" name="id" value={m.id} />
      <select name="status" defaultValue={m.status} className={select} aria-label={`Status ${m.name}`}>
        {(Object.keys(STATUS_LABEL) as MitraStatus[]).map((s) => (
          <option key={s} value={s}>
            {STATUS_LABEL[s]}
          </option>
        ))}
      </select>
      <button type="submit" className={btnDark}>
        Simpan
      </button>
    </form>
  );
}

function MitraTable({ mitra, accounts, filter }: { mitra: Mitra[]; accounts: Profile[]; filter: Filters }) {
  const emailOf = new Map(accounts.map((a) => [a.user_id, a.email]));
  const cats = (Object.keys(CATEGORY_LABEL) as MitraCategory[]).filter((c) => c !== "developer");
  const q = (filter.q ?? "").trim().toLowerCase();
  const rows = mitra.filter(
    (m) =>
      (!filter.kategori || m.category === filter.kategori) &&
      (!filter.status || m.status === filter.status) &&
      (!q || [m.name, m.specialty, m.company, m.phone, m.city].some((v) => v?.toLowerCase().includes(q))),
  );
  const href = (k?: string, s?: string) => {
    const p = new URLSearchParams({ bagian: "dashboard", tab: "mitra" });
    if (k) p.set("kategori", k);
    if (s) p.set("status", s);
    return `/portal/dashboard?${p}`;
  };
  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {cats.map((c, i) => {
          const n = mitra.filter((m) => m.category === c).length;
          const active = filter.kategori === c;
          return (
            <Link
              key={c}
              href={active ? href(undefined, filter.status) : href(c, filter.status)}
              className={`${card} org-node flex items-center gap-3 p-4 transition-colors ${active ? "border-brand-dark ring-1 ring-brand-dark" : "hover:border-brand-dark/30"}`}
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <span className="h-10 w-1.5 rounded-full" style={{ background: CATEGORY_COLOR[c] }} aria-hidden="true" />
              <span>
                <span className="block text-[22px] font-extrabold leading-none">{n}</span>
                <span className="mt-1 block text-[12.5px] font-semibold text-brand-gray">{CATEGORY_LABEL[c]}</span>
              </span>
            </Link>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <Chip href={href(filter.kategori)} active={!filter.status}>
            Semua status
          </Chip>
          {(Object.keys(STATUS_LABEL) as MitraStatus[]).map((s) => (
            <Chip key={s} href={href(filter.kategori, s)} active={filter.status === s}>
              {STATUS_LABEL[s]}
            </Chip>
          ))}
        </div>
        <form className="flex items-center gap-2" action="/portal/dashboard">
          <input type="hidden" name="bagian" value="dashboard" />
          <input type="hidden" name="tab" value="mitra" />
          {filter.kategori && <input type="hidden" name="kategori" value={filter.kategori} />}
          {filter.status && <input type="hidden" name="status" value={filter.status} />}
          <input
            name="q"
            defaultValue={filter.q}
            placeholder="Cari nama, keahlian, nomor..."
            className="w-60 rounded-lg border border-brand-dark/15 bg-white px-3 py-1.5 text-[13px]"
            aria-label="Cari mitra"
          />
          <button type="submit" className={btnDark}>
            Cari
          </button>
        </form>
      </div>

      <div className={`${card} overflow-x-auto`}>
        <table className="w-full min-w-[920px]">
          <thead className="sticky top-0 border-b border-brand-dark/10 bg-brand-cream/80 backdrop-blur">
            <tr>
              <th className={th}>Mitra</th>
              <th className={th}>Jenis</th>
              <th className={th}>WhatsApp</th>
              <th className={th}>Sumber</th>
              <th className={th}>Akun portal</th>
              <th className={th}>Status</th>
              <th className={th}>Ubah status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-dark/[0.07]">
            {rows.length === 0 && (
              <tr>
                <td colSpan={7} className={`${td} py-10 text-center text-brand-gray`}>
                  Tidak ada mitra untuk filter atau pencarian ini.
                </td>
              </tr>
            )}
            {rows.map((m) => (
              <tr key={m.id} className="transition-colors hover:bg-brand-cream/50">
                <td className={td}>
                  <span className="flex items-center gap-3">
                    <Avatar name={m.name} />
                    <span>
                      <span className="block font-semibold">{m.name}</span>
                      <span className="block text-[12px] text-brand-mute">{m.specialty ?? m.company ?? "-"}</span>
                    </span>
                  </span>
                </td>
                <td className={td}>
                  <span className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-brand-gray">
                    <span className="h-2 w-2 rounded-full" style={{ background: CATEGORY_COLOR[m.category] }} aria-hidden="true" />
                    {CATEGORY_LABEL[m.category]}
                  </span>
                </td>
                <td className={td}>
                  <Phone phone={m.phone} />
                </td>
                <td className={`${td} text-[12.5px] text-brand-gray`}>{m.source ?? "-"}</td>
                <td className={`${td} text-[12.5px] text-brand-gray`}>{m.user_id ? emailOf.get(m.user_id) ?? "Terhubung" : "-"}</td>
                <td className={td}>
                  <Badge tone={STATUS_TONE[m.status]}>{STATUS_LABEL[m.status]}</Badge>
                </td>
                <td className={td}>
                  <StatusForm m={m} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-[12.5px] text-brand-mute">
        Menampilkan {rows.length} dari {mitra.length} mitra.
      </p>
    </div>
  );
}

// ---------------- Developer RTO ----------------

function ProfileValue({ value }: { value: string | string[] }) {
  if (Array.isArray(value))
    return (
      <ul className="space-y-0.5">
        {value.map((x) => (
          <li key={x} className="flex gap-1.5">
            <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-brand-dark/40" aria-hidden="true" />
            {x}
          </li>
        ))}
      </ul>
    );
  return <>{value}</>;
}

function Developers({ developers }: { developers: Mitra[] }) {
  if (developers.length === 0) return <p className="text-[14px] text-brand-gray">Belum ada developer tercatat.</p>;
  return (
    <div className="space-y-4">
      <p className="max-w-3xl text-[13.5px] leading-relaxed text-brand-gray">
        Data perusahaan developer yang bersedia bergabung di program RTO. Disimpan sebagai bukti kerja sama; dokumen aslinya ada
        di Google Drive barumahID dan hanya terbuka bagi akun yang diberi akses.
      </p>
      <div className="grid gap-4 lg:grid-cols-2">
        {developers.map((d, i) => {
          const doc = typeof d.profile.dokumen === "string" ? d.profile.dokumen : null;
          const entries = Object.entries(d.profile).filter(([k]) => k !== "dokumen");
          return (
            <section key={d.id} className={`${card} org-node overflow-hidden`} style={{ animationDelay: `${i * 80}ms` }}>
              <div className="flex flex-wrap items-center gap-3 border-b border-brand-dark/10 bg-brand-cream/60 px-6 py-4">
                <Avatar name={d.name} size={42} />
                <div className="min-w-0 flex-1">
                  <h2 className="text-[17px] font-extrabold leading-tight">{d.name}</h2>
                  <p className="text-[12.5px] text-brand-gray">
                    {d.specialty} · {d.city ?? "-"}
                  </p>
                </div>
                <Badge tone={STATUS_TONE[d.status]}>{STATUS_LABEL[d.status]}</Badge>
              </div>
              <div className="px-6 py-4">
                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px]">
                  <Phone phone={d.phone} />
                  {d.email && <span className="break-all text-brand-gray">{d.email}</span>}
                  {doc && (
                    <a href={doc} target="_blank" rel="noopener noreferrer" className="ml-auto rounded-full bg-brand-dark px-3.5 py-1.5 text-[12.5px] font-bold text-white hover:bg-brand-red">
                      Buka dokumen ↗
                    </a>
                  )}
                </div>
                <details className="group mt-3">
                  <summary className="cursor-pointer list-none text-[12.5px] font-bold text-brand-red">
                    <span className="group-open:hidden">Lihat data perusahaan ({entries.length})</span>
                    <span className="hidden group-open:inline">Tutup data perusahaan</span>
                  </summary>
                  <dl className="mt-2 divide-y divide-brand-dark/[0.07] border-y border-brand-dark/[0.07] text-[13px]">
                    {entries.map(([k, v]) => (
                      <div key={k} className="grid grid-cols-[140px_1fr] gap-3 py-2">
                        <dt className="text-brand-gray">{PROFILE_LABEL[k] ?? k}</dt>
                        <dd>
                          <ProfileValue value={v} />
                        </dd>
                      </div>
                    ))}
                  </dl>
                </details>
                <div className="mt-4">
                  <StatusForm m={d} />
                </div>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}

// ---------------- Akun portal ----------------

const ROLE_TONE = { admin: "bg-brand-red/10 text-brand-red", tim: "bg-[#1A5C9A]/10 text-[#1A5C9A]", mitra: "bg-brand-dark/[0.06] text-brand-dark" } as const;

function Akun({
  accounts,
  accountMeta,
  mitra,
  linkedByUser,
  formsOf,
  invites,
  isAdmin,
  meId,
}: {
  accounts: Profile[];
  accountMeta: AccountMeta[];
  mitra: Mitra[];
  linkedByUser: Map<string, Mitra>;
  formsOf: (a: Profile) => FormSubmission[];
  invites: StaffInvite[];
  isAdmin: boolean;
  meId: string;
}) {
  const unlinked = mitra.filter((m) => !m.user_id);
  const meta = new Map(accountMeta.map((m) => [m.user_id, m]));
  return (
    <div className="space-y-5">
      <p className="max-w-3xl text-[13.5px] leading-relaxed text-brand-gray">
        Akun baru otomatis berperan mitra dengan status menunggu verifikasi. Cek formulir yang sudah diisi, lalu hubungkan akun ke
        data mitra yang ada atau buat data mitra baru. Peran tim dan admin hanya dapat diberikan oleh admin.
      </p>
      <div className={`${card} overflow-x-auto`}>
        <table className="w-full min-w-[1040px]">
          <thead className="border-b border-brand-dark/10 bg-brand-cream/80">
            <tr>
              <th className={th}>Akun</th>
              <th className={th}>WhatsApp</th>
              <th className={th}>Login terakhir</th>
              <th className={th}>Formulir</th>
              <th className={th}>Data mitra</th>
              <th className={th}>Peran</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-dark/[0.07]">
            {accounts.length === 0 && (
              <tr>
                <td colSpan={6} className={`${td} py-10 text-center text-brand-gray`}>
                  Belum ada akun.
                </td>
              </tr>
            )}
            {accounts.map((a) => {
              const linked = linkedByUser.get(a.user_id);
              const m = meta.get(a.user_id);
              const forms = formsOf(a);
              return (
                <tr key={a.user_id} className="transition-colors hover:bg-brand-cream/50">
                  <td className={td}>
                    <span className="flex items-center gap-3">
                      <Avatar name={a.full_name || a.email} />
                      <span className="min-w-0">
                        <span className="block font-semibold">{a.full_name || "-"}</span>
                        <span className="block break-all text-[12px] text-brand-mute">{a.email}</span>
                        {a.requested_category && <span className="block text-[12px] text-brand-mute">Mengajukan: {CATEGORY_LABEL[a.requested_category]}</span>}
                        {m && !m.email_confirmed_at && <span className="mt-0.5 inline-block text-[11.5px] font-bold text-[#C25E20]">Email belum dikonfirmasi</span>}
                      </span>
                    </span>
                  </td>
                  <td className={td}>
                    <Phone phone={a.phone} />
                  </td>
                  <td className={`${td} whitespace-nowrap text-[12.5px] text-brand-gray`} title={m?.last_sign_in_at ? fmtDate(m.last_sign_in_at) : undefined}>
                    {m?.last_sign_in_at ? relTime(m.last_sign_in_at) : "Belum pernah"}
                  </td>
                  <td className={`${td} text-[12.5px]`}>
                    {forms.length === 0 ? (
                      <span className="text-brand-mute">Belum ada</span>
                    ) : (
                      <Link href="/portal/dashboard?bagian=dashboard&tab=formulir" className="font-semibold text-brand-dark hover:text-brand-red">
                        {forms.map((f) => f.form_code).join(", ")}
                      </Link>
                    )}
                  </td>
                  <td className={td}>
                    {a.role !== "mitra" ? (
                      <span className="text-brand-mute">Akun tim</span>
                    ) : linked ? (
                      <form action={unlinkAccount} className="flex flex-wrap items-center gap-2">
                        <input type="hidden" name="mitra_id" value={linked.id} />
                        <span className="font-semibold">{linked.name}</span>
                        <Badge tone={STATUS_TONE[linked.status]}>{STATUS_LABEL[linked.status]}</Badge>
                        <button type="submit" className="text-[12px] font-semibold text-brand-gray underline underline-offset-2 hover:text-brand-red">
                          Lepas
                        </button>
                      </form>
                    ) : (
                      <form action={linkAccount} className="flex flex-wrap items-center gap-1.5">
                        <input type="hidden" name="user_id" value={a.user_id} />
                        <select name="mitra_id" defaultValue="baru" className={`${select} max-w-[230px]`} aria-label={`Data mitra untuk ${a.email}`}>
                          <option value="baru">Buat data mitra baru dari akun</option>
                          {unlinked.map((x) => (
                            <option key={x.id} value={x.id}>
                              {x.name} · {CATEGORY_LABEL[x.category]}
                            </option>
                          ))}
                        </select>
                        <button type="submit" className={btnDark}>
                          Verifikasi
                        </button>
                      </form>
                    )}
                  </td>
                  <td className={td}>
                    {isAdmin && a.user_id !== meId ? (
                      <form action={setRole} className="flex items-center gap-1.5">
                        <input type="hidden" name="user_id" value={a.user_id} />
                        <select name="role" defaultValue={a.role} className={select} aria-label={`Peran ${a.email}`}>
                          <option value="mitra">Mitra</option>
                          <option value="tim">Tim</option>
                          <option value="admin">Admin</option>
                        </select>
                        <button type="submit" className={btnLine}>
                          Ubah
                        </button>
                      </form>
                    ) : (
                      <Badge tone={ROLE_TONE[a.role]}>{a.role === "admin" ? "Admin" : a.role === "tim" ? "Tim" : "Mitra"}</Badge>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {isAdmin && (
        <section className={`${card} p-6`}>
          <PanelTitle
            title="Undang anggota tim"
            sub="Email yang diundang otomatis mendapat peran tim atau admin setelah pemiliknya membuat akun di Portal dan mengonfirmasi emailnya."
          />
          <form action={inviteStaff} className="mt-4 flex flex-wrap items-center gap-2">
            <input name="email" type="email" required placeholder="email@contoh.com" className="w-64 rounded-md border border-brand-dark/15 px-3 py-1.5 text-[13px]" aria-label="Email anggota tim" />
            <select name="role" defaultValue="tim" className={select} aria-label="Peran">
              <option value="tim">Tim</option>
              <option value="admin">Admin</option>
            </select>
            <button type="submit" className={btnDark}>
              Undang
            </button>
          </form>
          {invites.length > 0 && (
            <ul className="mt-4 divide-y divide-brand-dark/[0.07] border-t border-brand-dark/[0.07]">
              {invites.map((i) => (
                <li key={i.email} className="flex items-center justify-between gap-3 py-2.5 text-[13px]">
                  <span className="flex items-center gap-2.5">
                    <Avatar name={i.email} size={26} />
                    <span className="font-semibold">{i.email}</span>
                    <Badge tone={ROLE_TONE[i.role]}>{i.role === "admin" ? "Admin" : "Tim"}</Badge>
                  </span>
                  <form action={removeInvite}>
                    <input type="hidden" name="email" value={i.email} />
                    <button type="submit" className="text-[12px] font-semibold text-brand-gray underline underline-offset-2 hover:text-brand-red">
                      Hapus
                    </button>
                  </form>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </div>
  );
}

// ---------------- Daftar tim (bagian Struktur) ----------------

function Tim({ levels, team, isAdmin }: { levels: OrgLevel[]; team: TeamMember[]; isAdmin: boolean }) {
  const levelName = new Map(levels.map((l) => [l.id, l.name]));
  const nameById = new Map(team.map((t) => [t.id, t.name]));
  return (
    <section className={`${card} overflow-x-auto`}>
      <div className="flex flex-wrap items-end justify-between gap-3 border-b border-brand-dark/10 px-5 py-4">
        <div>
          <p className="text-[12px] font-bold uppercase tracking-[0.16em] text-brand-red">Daftar tim</p>
          <h2 className="mt-1 text-[17px] font-extrabold">Jabatan, personil, dan status</h2>
        </div>
        <div className="flex flex-wrap gap-2 text-[12px]">
          {(["aktif", "ditunda", "nonaktif", "kosong"] as const).map((s) => (
            <Badge key={s} tone={TEAM_STATUS[s].tone}>
              {TEAM_STATUS[s].label}: {team.filter((t) => t.status === s).length}
            </Badge>
          ))}
        </div>
      </div>
      <table className="w-full min-w-[820px]">
        <thead className="border-b border-brand-dark/10 bg-brand-cream/80">
          <tr>
            <th className={th}>Level</th>
            <th className={th}>Jabatan</th>
            <th className={th}>Nama</th>
            <th className={th}>Fokus / keterangan</th>
            <th className={th}>WhatsApp</th>
            <th className={th}>Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-brand-dark/[0.07]">
          {team.map((t) => (
            <tr key={t.id} className="transition-colors hover:bg-brand-cream/50">
              <td className={`${td} text-brand-gray`}>{levelName.get(t.level_id)}</td>
              <td className={`${td} font-semibold`}>
                {t.position}
                {t.reports_to && nameById.get(t.reports_to) && <span className="block text-[12px] font-normal text-brand-mute">di bawah {nameById.get(t.reports_to)}</span>}
              </td>
              <td className={td}>
                {t.name ? (
                  <span className="flex items-center gap-2.5">
                    <Avatar name={t.name} size={28} />
                    {t.name}
                  </span>
                ) : (
                  <span className="text-brand-mute">Belum terisi</span>
                )}
              </td>
              <td className={`${td} max-w-[300px] text-brand-gray`}>
                {t.focus ?? "-"}
                {t.notes && <span className="mt-1 block text-[12px] text-brand-mute">{t.notes}</span>}
              </td>
              <td className={td}>
                <Phone phone={t.phone} />
              </td>
              <td className={td}>
                {isAdmin && t.name ? (
                  <form action={setTeamStatus} className="flex items-center gap-1.5">
                    <input type="hidden" name="id" value={t.id} />
                    <select name="status" defaultValue={t.status} className={select} aria-label={`Status ${t.name}`}>
                      <option value="aktif">Aktif</option>
                      <option value="nonaktif">Nonaktif</option>
                      <option value="ditunda">Ditunda</option>
                    </select>
                    <button type="submit" className={btnDark}>
                      Simpan
                    </button>
                  </form>
                ) : (
                  <Badge tone={TEAM_STATUS[t.status].tone}>{TEAM_STATUS[t.status].label}</Badge>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
