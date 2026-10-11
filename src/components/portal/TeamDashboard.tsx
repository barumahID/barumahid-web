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
// 2) Dashboard: ringkasan, formulir masuk (jawaban Google Form dan verifikasi mitra), mitra, developer RTO, akun portal.
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
  dokumen: "Dokumen",
};

const card = "rounded-2xl border border-brand-dark/10 bg-white";
const th = "px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[0.12em] text-brand-gray";
const td = "px-4 py-3 align-top text-[13.5px]";
const select = "rounded-md border border-brand-dark/15 bg-white px-2 py-1 text-[12.5px]";
const btnDark = "rounded-md bg-brand-dark px-2.5 py-1 text-[12px] font-bold text-white hover:bg-brand-red";
const btnLine = "rounded-md border border-brand-dark/20 px-2.5 py-1 text-[12px] font-bold hover:border-brand-dark";

const fmtDate = (d: string | null) =>
  d ? new Date(d).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Jakarta" }) : "-";

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

function Stat({ label, value, note, href }: { label: string; value: number | string; note?: string; href?: string }) {
  const body = (
    <>
      <p className="text-[12px] font-semibold text-brand-gray">{label}</p>
      <p className="mt-1 text-[28px] font-extrabold leading-none tracking-tight">{value}</p>
      {note && <p className="mt-1.5 text-[12px] text-brand-mute">{note}</p>}
    </>
  );
  return href ? (
    <Link href={href} className={`${card} block p-5 transition-colors hover:border-brand-dark/30`}>
      {body}
    </Link>
  ) : (
    <div className={`${card} p-5`}>{body}</div>
  );
}

function Chip({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={`rounded-full border px-3 py-1 text-[12.5px] font-semibold ${
        active ? "border-brand-dark bg-brand-dark text-white" : "border-brand-dark/15 bg-white text-brand-dark hover:border-brand-dark"
      }`}
    >
      {children}
    </Link>
  );
}

export interface Filters {
  kategori?: string;
  status?: string;
  grup?: string;
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

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[12px] font-bold uppercase tracking-[0.16em] text-brand-red">Dashboard tim barumahID</p>
          <h1 className="mt-2 text-[24px] font-extrabold tracking-tight">Pusat data internal</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          {newSubmissions.length > 0 && (
            <Link href="/portal/dashboard?tab=formulir&status=baru" className="rounded-full bg-brand-red px-4 py-2 text-[13px] font-bold text-white hover:bg-brand-red-dark">
              {newSubmissions.length} formulir baru
            </Link>
          )}
          {pendingAccounts.length > 0 && (
            <Link href="/portal/dashboard?tab=akun" className="rounded-full bg-brand-dark px-4 py-2 text-[13px] font-bold text-white hover:bg-black">
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
          {TABS.map((t) => (
            <Link
              key={t.id}
              href={`/portal/dashboard?bagian=dashboard&tab=${t.id}`}
              className={`whitespace-nowrap border-b-2 px-3.5 py-2.5 text-[13.5px] font-semibold transition-colors ${
                tab === t.id ? "border-brand-red text-brand-dark" : "border-transparent text-brand-gray hover:text-brand-dark"
              }`}
            >
              {t.label}
            </Link>
          ))}
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
  const aktif = team.filter((t) => t.status === "aktif").length;
  const kosong = team.filter((t) => t.status === "kosong").length;
  const konstruksi = mitra.filter((m) => CATEGORY_LINE[m.category] === "Jasa Konstruksi");
  const konstruksiAktif = konstruksi.filter((m) => m.status === "aktif" || m.status === "terverifikasi").length;
  const perKategori = (Object.keys(CATEGORY_LABEL) as MitraCategory[]).map((c) => ({ c, n: mitra.filter((m) => m.category === c).length }));
  const max = Math.max(1, ...perKategori.map((p) => p.n));
  const baru = submissions.filter((s) => s.status === "baru");
  const loginOf = new Map(accountMeta.map((m) => [m.user_id, m.last_sign_in_at]));
  const recentLogins = accounts
    .map((a) => ({ a, at: loginOf.get(a.user_id) ?? null }))
    .filter((x) => x.at)
    .sort((x, y) => (y.at! > x.at! ? 1 : -1))
    .slice(0, 6);
  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <Stat label="Personil aktif" value={aktif} note={`${kosong} posisi belum terisi`} href="/portal/dashboard?bagian=struktur" />
        <Stat label="Mitra Jasa Konstruksi" value={konstruksi.length} note={`${konstruksiAktif} aktif atau terverifikasi`} href="/portal/dashboard?tab=mitra" />
        <Stat label="Developer RTO" value={developers.length} note={`${developers.filter((d) => d.status === "bersedia").length} bersedia bergabung`} href="/portal/dashboard?tab=developer" />
        <Stat label="Formulir baru" value={baru.length} note={`${submissions.length} jawaban tercatat`} href="/portal/dashboard?tab=formulir&status=baru" />
        <Stat label="Akun menunggu verifikasi" value={pending.length} note={`${accounts.length} akun portal`} href="/portal/dashboard?tab=akun" />
      </div>
      <div className="grid gap-5 lg:grid-cols-3">
        <section className={`${card} p-6`}>
          <h2 className="text-[15px] font-extrabold">Mitra per jenis</h2>
          <ul className="mt-4 space-y-3">
            {perKategori.map(({ c, n }) => (
              <li key={c}>
                <div className="flex justify-between text-[13px]">
                  <span className="font-semibold">{CATEGORY_LABEL[c]}</span>
                  <span className="font-bold">{n}</span>
                </div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-brand-dark/[0.06]">
                  <div className="h-full rounded-full bg-brand-red" style={{ width: `${(n / max) * 100}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </section>
        <section className={`${card} p-6`}>
          <h2 className="text-[15px] font-extrabold">Formulir terbaru</h2>
          {submissions.length === 0 ? (
            <p className="mt-3 text-[13.5px] leading-relaxed text-brand-gray">Belum ada jawaban formulir yang masuk ke portal.</p>
          ) : (
            <ul className="mt-3 divide-y divide-brand-dark/[0.07]">
              {submissions.slice(0, 6).map((s) => (
                <li key={s.id} className="flex items-start justify-between gap-3 py-2.5 text-[13px]">
                  <span>
                    <span className="block font-semibold">{s.name || s.respondent_email || "Tanpa nama"}</span>
                    <span className="text-[12px] text-brand-mute">
                      {s.form_code} · {FORM_META[s.form_code]?.title ?? s.form_title}
                    </span>
                  </span>
                  <Badge tone={SUBMISSION_STATUS[s.status].tone}>{SUBMISSION_STATUS[s.status].label}</Badge>
                </li>
              ))}
            </ul>
          )}
        </section>
        <section className={`${card} p-6`}>
          <h2 className="text-[15px] font-extrabold">Login terakhir</h2>
          {recentLogins.length === 0 ? (
            <p className="mt-3 text-[13.5px] text-brand-gray">Belum ada yang masuk ke portal.</p>
          ) : (
            <ul className="mt-3 divide-y divide-brand-dark/[0.07]">
              {recentLogins.map(({ a, at }) => (
                <li key={a.user_id} className="flex items-start justify-between gap-3 py-2.5 text-[13px]">
                  <span>
                    <span className="block font-semibold">{a.full_name || a.email}</span>
                    <span className="text-[12px] capitalize text-brand-mute">{a.role}</span>
                  </span>
                  <span className="text-right text-[12px] text-brand-gray">{fmtDate(at)}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}

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
    const q = new URLSearchParams({ tab: "formulir" });
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
          Semua formulir
        </Chip>
        {groups.map((g) => (
          <Chip key={g} href={href(g, filter.status)} active={filter.grup === g}>
            {FORM_GROUP_LABEL[g]}
          </Chip>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        <Chip href={href(filter.grup)} active={!filter.status}>
          Semua status
        </Chip>
        {(Object.keys(SUBMISSION_STATUS) as SubmissionStatus[]).map((st) => (
          <Chip key={st} href={href(filter.grup, st)} active={filter.status === st}>
            {SUBMISSION_STATUS[st].label}
          </Chip>
        ))}
      </div>

      {rows.length === 0 ? (
        <div className={`${card} p-8 text-center text-[13.5px] text-brand-gray`}>
          {submissions.length === 0
            ? "Belum ada jawaban formulir. Jawaban mulai masuk setelah skrip Google Form (Apps Script) dipasang."
            : "Tidak ada jawaban untuk filter ini."}
        </div>
      ) : (
        <ul className="space-y-3">
          {rows.map((s) => {
            const meta = FORM_META[s.form_code];
            const acc = accountOf(s);
            const unlinked = mitra.filter((m) => !meta?.category || m.category === meta.category);
            return (
              <li key={s.id} className={`${card} p-5`}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-md bg-brand-dark/[0.06] px-2 py-0.5 font-mono text-[11px] font-bold">{s.form_code}</span>
                      <span className="text-[13px] font-semibold text-brand-gray">{meta?.title ?? s.form_title}</span>
                      <Badge tone={SUBMISSION_STATUS[s.status].tone}>{SUBMISSION_STATUS[s.status].label}</Badge>
                    </div>
                    <p className="mt-2 text-[16px] font-extrabold">{s.name || s.respondent_email || "Tanpa nama"}</p>
                    <p className="mt-0.5 flex flex-wrap gap-x-4 gap-y-1 text-[12.5px] text-brand-gray">
                      <span>{fmtDate(s.submitted_at)}</span>
                      <Phone phone={s.phone} />
                      {s.respondent_email && <span className="break-all">{s.respondent_email}</span>}
                      <span>{acc ? `Punya akun portal (${acc.email})` : "Belum punya akun portal"}</span>
                      {s.mitra_id && <span className="font-semibold text-[#2D7A4F]">Mitra: {mitraName.get(s.mitra_id) ?? "-"}</span>}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {meta?.category && !s.mitra_id && s.status !== "ditolak" && (
                      <form action={verifySubmission} className="flex flex-wrap items-center gap-1.5">
                        <input type="hidden" name="id" value={s.id} />
                        <select name="mitra_id" defaultValue="baru" className={`${select} max-w-[220px]`} aria-label="Data mitra">
                          <option value="baru">Buat data mitra baru</option>
                          {unlinked.map((m) => (
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
                    {s.answers.map((x, i) => (
                      <div key={i} className="border-b border-brand-dark/[0.05] py-2">
                        <dt className="text-brand-gray">{x.q}</dt>
                        <dd className="mt-0.5 whitespace-pre-line font-semibold">{answerText(x.a) || "-"}</dd>
                      </div>
                    ))}
                  </dl>
                </details>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

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
  const rows = mitra.filter((m) => (!filter.kategori || m.category === filter.kategori) && (!filter.status || m.status === filter.status));
  const href = (k?: string, s?: string) => {
    const q = new URLSearchParams({ tab: "mitra" });
    if (k) q.set("kategori", k);
    if (s) q.set("status", s);
    return `/portal/dashboard?${q}`;
  };
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Chip href={href(undefined, filter.status)} active={!filter.kategori}>
          Semua jenis
        </Chip>
        {cats.map((c) => (
          <Chip key={c} href={href(c, filter.status)} active={filter.kategori === c}>
            {CATEGORY_LABEL[c]}
          </Chip>
        ))}
      </div>
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
      <div className={`${card} overflow-x-auto`}>
        <table className="w-full min-w-[900px]">
          <thead className="border-b border-brand-dark/10 bg-brand-dark/[0.02]">
            <tr>
              <th className={th}>Nama</th>
              <th className={th}>Jenis</th>
              <th className={th}>Spesialisasi</th>
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
                <td colSpan={8} className={`${td} text-center text-brand-gray`}>
                  Tidak ada mitra untuk filter ini.
                </td>
              </tr>
            )}
            {rows.map((m) => (
              <tr key={m.id}>
                <td className={td}>
                  <span className="font-semibold">{m.name}</span>
                  {m.company && <span className="block text-[12px] text-brand-mute">{m.company}</span>}
                </td>
                <td className={`${td} text-brand-gray`}>{CATEGORY_LABEL[m.category]}</td>
                <td className={td}>{m.specialty ?? "-"}</td>
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
    </div>
  );
}

function ProfileValue({ value }: { value: string | string[] }) {
  if (Array.isArray(value))
    return (
      <ul className="space-y-0.5">
        {value.map((x) => (
          <li key={x}>{x}</li>
        ))}
      </ul>
    );
  if (/^https?:\/\//.test(value))
    return (
      <a href={value} target="_blank" rel="noopener noreferrer" className="font-semibold text-brand-red underline underline-offset-2">
        Buka dokumen di Google Drive ↗
      </a>
    );
  return <>{value}</>;
}

function Developers({ developers }: { developers: Mitra[] }) {
  if (developers.length === 0) return <p className="text-[14px] text-brand-gray">Belum ada developer tercatat.</p>;
  return (
    <div className="space-y-3">
      <p className="max-w-3xl text-[13.5px] leading-relaxed text-brand-gray">
        Data perusahaan developer yang bersedia bergabung di program RTO. Disimpan sebagai bukti kerja sama; dokumen aslinya
        ada di Google Drive barumahID dan hanya terbuka bagi akun yang diberi akses.
      </p>
      <div className="grid gap-4 lg:grid-cols-2">
        {developers.map((d) => (
          <section key={d.id} className={`${card} p-6`}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-[17px] font-extrabold">{d.name}</h2>
                <p className="mt-0.5 text-[13px] text-brand-gray">{d.specialty}</p>
              </div>
              <Badge tone={STATUS_TONE[d.status]}>{STATUS_LABEL[d.status]}</Badge>
            </div>
            <dl className="mt-4 divide-y divide-brand-dark/[0.07] border-y border-brand-dark/[0.07] text-[13px]">
              <div className="grid grid-cols-[150px_1fr] gap-3 py-2">
                <dt className="text-brand-gray">Kota</dt>
                <dd className="font-semibold">{d.city ?? "-"}</dd>
              </div>
              <div className="grid grid-cols-[150px_1fr] gap-3 py-2">
                <dt className="text-brand-gray">Kontak</dt>
                <dd className="space-y-0.5">
                  <Phone phone={d.phone} />
                  {d.email && <span className="block break-all">{d.email}</span>}
                </dd>
              </div>
              {Object.entries(d.profile).map(([k, v]) => (
                <div key={k} className="grid grid-cols-[150px_1fr] gap-3 py-2">
                  <dt className="text-brand-gray">{PROFILE_LABEL[k] ?? k}</dt>
                  <dd>
                    <ProfileValue value={v} />
                  </dd>
                </div>
              ))}
            </dl>
            <div className="mt-4">
              <StatusForm m={d} />
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

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
        Akun baru otomatis berperan mitra dengan status menunggu verifikasi. Cek formulir yang sudah diisi (kolom Formulir), lalu
        hubungkan akun ke data mitra yang ada atau buat data mitra baru. Peran tim dan admin hanya dapat diberikan oleh admin.
      </p>
      <div className={`${card} overflow-x-auto`}>
        <table className="w-full min-w-[1040px]">
          <thead className="border-b border-brand-dark/10 bg-brand-dark/[0.02]">
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
                <td colSpan={6} className={`${td} text-center text-brand-gray`}>
                  Belum ada akun.
                </td>
              </tr>
            )}
            {accounts.map((a) => {
              const linked = linkedByUser.get(a.user_id);
              const m = meta.get(a.user_id);
              const forms = formsOf(a);
              return (
                <tr key={a.user_id}>
                  <td className={td}>
                    <span className="font-semibold">{a.full_name || "-"}</span>
                    <span className="block break-all text-[12px] text-brand-mute">{a.email}</span>
                    {a.requested_category && <span className="block text-[12px] text-brand-mute">Mengajukan: {CATEGORY_LABEL[a.requested_category]}</span>}
                    {m && !m.email_confirmed_at && <span className="mt-1 inline-block text-[11.5px] font-bold text-[#C25E20]">Email belum dikonfirmasi</span>}
                  </td>
                  <td className={td}>
                    <Phone phone={a.phone} />
                  </td>
                  <td className={`${td} whitespace-nowrap text-[12.5px] text-brand-gray`}>{m?.last_sign_in_at ? fmtDate(m.last_sign_in_at) : "Belum pernah"}</td>
                  <td className={`${td} text-[12.5px]`}>
                    {forms.length === 0 ? (
                      <span className="text-brand-mute">Belum ada</span>
                    ) : (
                      <Link href="/portal/dashboard?tab=formulir" className="font-semibold text-brand-dark hover:text-brand-red">
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
                      <span className="text-[13px] font-semibold capitalize">{a.role}</span>
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
          <h2 className="text-[15px] font-extrabold">Undang anggota tim</h2>
          <p className="mt-1 text-[13px] leading-relaxed text-brand-gray">
            Email yang diundang otomatis mendapat peran tim atau admin setelah pemiliknya membuat akun di Portal dan
            mengonfirmasi emailnya.
          </p>
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
                  <span>
                    <span className="font-semibold">{i.email}</span> <span className="text-brand-mute">· {i.role === "admin" ? "Admin" : "Tim"}</span>
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

function Tim({ levels, team, isAdmin }: { levels: OrgLevel[]; team: TeamMember[]; isAdmin: boolean }) {
  const levelName = new Map(levels.map((l) => [l.id, l.name]));
  return (
    <section className={`${card} overflow-x-auto`}>
      <div className="flex flex-wrap items-end justify-between gap-3 border-b border-brand-dark/10 px-5 py-4">
        <div>
          <p className="text-[12px] font-bold uppercase tracking-[0.16em] text-brand-red">Daftar tim</p>
          <h2 className="mt-1 text-[17px] font-extrabold">Jabatan, personil, dan status</h2>
        </div>
        {isAdmin && <p className="text-[12.5px] text-brand-gray">Status dapat diubah langsung di tabel.</p>}
      </div>
      <table className="w-full min-w-[760px]">
        <thead className="border-b border-brand-dark/10 bg-brand-dark/[0.02]">
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
            <tr key={t.id}>
              <td className={`${td} text-brand-gray`}>{levelName.get(t.level_id)}</td>
              <td className={`${td} font-semibold`}>{t.position}</td>
              <td className={td}>{t.name ?? <span className="text-brand-mute">Belum terisi</span>}</td>
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
