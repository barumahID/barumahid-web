import Link from "next/link";
import { linkAccount, setMitraStatus, setRole, unlinkAccount } from "@/app/portal/actions";
import { waHref } from "./PortalShell";
import {
  CATEGORY_LABEL,
  CATEGORY_LINE,
  STATUS_LABEL,
  STATUS_TONE,
  type Mitra,
  type MitraCategory,
  type MitraStatus,
  type OrgLevel,
  type Profile,
  type TeamMember,
} from "@/lib/portal";

// Dashboard monitoring tim barumahID (datacenter internal): ringkasan, struktur organisasi + jobdesk, personil,
// mitra (verifikasi), developer RTO, dan akun portal. Data dari Supabase (RLS: hanya admin/tim).

export const TABS = [
  { id: "ringkasan", label: "Ringkasan" },
  { id: "struktur", label: "Struktur organisasi" },
  { id: "tim", label: "Tim" },
  { id: "mitra", label: "Mitra" },
  { id: "developer", label: "Developer RTO" },
  { id: "akun", label: "Akun portal" },
] as const;
export type TabId = (typeof TABS)[number]["id"];

// Nilai & prinsip dari bagan "Organisasi Kami" (user, Okt 2026)
const NILAI = [
  { name: "Leadership", body: "Memimpin dengan visi, integritas, dan inspirasi." },
  { name: "Management", body: "Mengelola dengan strategi, data, dan kolaborasi." },
  { name: "Execution", body: "Menjalankan rencana dengan fokus, disiplin, dan hasil terukur." },
  { name: "Partnership", body: "Bertumbuh bersama mitra untuk nilai yang berkelanjutan." },
];

const TEAM_STATUS = {
  aktif: { label: "Aktif", tone: "bg-[#2D7A4F]/10 text-[#2D7A4F]" },
  perlu_konfirmasi: { label: "Perlu konfirmasi", tone: "bg-[#C25E20]/10 text-[#C25E20]" },
  kosong: { label: "Belum terisi", tone: "bg-brand-dark/[0.06] text-brand-gray" },
} as const;

const PROFILE_LABEL: Record<string, string> = {
  pimpinan: "Pimpinan",
  alamat: "Alamat",
  akta: "Akta pendirian",
  sk_kemenkumham: "SK Kemenkumham",
  nib: "NIB",
  skala: "Skala usaha",
  kbli: "Bidang usaha (KBLI)",
  bidang: "Bidang usaha",
  keanggotaan: "Keanggotaan",
  pengalaman: "Pengalaman",
  sertifikat_standar: "Sertifikat standar",
  pendiri: "Pendiri",
  dokumen: "Sumber",
  catatan: "Catatan",
};

const card = "rounded-2xl border border-brand-dark/10 bg-white";
const th = "px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[0.12em] text-brand-gray";
const td = "px-4 py-3 align-top text-[13.5px]";

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

function Stat({ label, value, note }: { label: string; value: number | string; note?: string }) {
  return (
    <div className={`${card} p-5`}>
      <p className="text-[12px] font-semibold text-brand-gray">{label}</p>
      <p className="mt-1 text-[28px] font-extrabold leading-none tracking-tight">{value}</p>
      {note && <p className="mt-1.5 text-[12px] text-brand-mute">{note}</p>}
    </div>
  );
}

export default function TeamDashboard({
  tab,
  filter,
  levels,
  team,
  mitra,
  accounts,
  me,
}: {
  tab: TabId;
  filter: { kategori?: string; status?: string };
  levels: OrgLevel[];
  team: TeamMember[];
  mitra: Mitra[];
  accounts: Profile[];
  me: Profile;
}) {
  const isAdmin = me.role === "admin";
  const developers = mitra.filter((m) => m.category === "developer");
  const linkedByUser = new Map(mitra.filter((m) => m.user_id).map((m) => [m.user_id!, m]));
  const pendingAccounts = accounts.filter((a) => a.role === "mitra" && !linkedByUser.has(a.user_id));

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[12px] font-bold uppercase tracking-[0.16em] text-brand-red">Dashboard tim barumahID</p>
          <h1 className="mt-2 text-[24px] font-extrabold tracking-tight">Pusat data internal</h1>
        </div>
        {pendingAccounts.length > 0 && (
          <Link href="/portal/dashboard?tab=akun" className="rounded-full bg-brand-red px-4 py-2 text-[13px] font-bold text-white hover:bg-brand-red-dark">
            {pendingAccounts.length} akun menunggu verifikasi
          </Link>
        )}
      </div>

      <nav className="no-scrollbar mt-6 flex gap-1 overflow-x-auto border-b border-brand-dark/10" aria-label="Bagian dashboard">
        {TABS.map((t) => (
          <Link
            key={t.id}
            href={`/portal/dashboard?tab=${t.id}`}
            className={`whitespace-nowrap border-b-2 px-3.5 py-2.5 text-[13.5px] font-semibold transition-colors ${
              tab === t.id ? "border-brand-red text-brand-dark" : "border-transparent text-brand-gray hover:text-brand-dark"
            }`}
          >
            {t.label}
          </Link>
        ))}
      </nav>

      <div className="mt-6">
        {tab === "ringkasan" && <Ringkasan team={team} mitra={mitra} developers={developers} pending={pendingAccounts} />}
        {tab === "struktur" && <Struktur levels={levels} team={team} />}
        {tab === "tim" && <Tim levels={levels} team={team} />}
        {tab === "mitra" && <MitraTable mitra={mitra.filter((m) => m.category !== "developer")} accounts={accounts} filter={filter} />}
        {tab === "developer" && <Developers developers={developers} />}
        {tab === "akun" && <Akun accounts={accounts} mitra={mitra} linkedByUser={linkedByUser} isAdmin={isAdmin} meId={me.user_id} />}
      </div>
    </div>
  );
}

function Ringkasan({ team, mitra, developers, pending }: { team: TeamMember[]; mitra: Mitra[]; developers: Mitra[]; pending: Profile[] }) {
  const aktif = team.filter((t) => t.status === "aktif").length;
  const konfirmasi = team.filter((t) => t.status === "perlu_konfirmasi").length;
  const kosong = team.filter((t) => t.status === "kosong").length;
  const konstruksi = mitra.filter((m) => CATEGORY_LINE[m.category] === "Jasa Konstruksi");
  const konstruksiAktif = konstruksi.filter((m) => m.status === "aktif" || m.status === "terverifikasi").length;
  const perKategori = (Object.keys(CATEGORY_LABEL) as MitraCategory[]).map((c) => ({ c, n: mitra.filter((m) => m.category === c).length }));
  const max = Math.max(1, ...perKategori.map((p) => p.n));
  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Personil aktif" value={aktif} note={`${konfirmasi} perlu konfirmasi, ${kosong} posisi belum terisi`} />
        <Stat label="Mitra Jasa Konstruksi" value={konstruksi.length} note={`${konstruksiAktif} aktif atau terverifikasi`} />
        <Stat label="Developer RTO" value={developers.length} note={`${developers.filter((d) => d.status === "bersedia").length} bersedia bergabung`} />
        <Stat label="Akun menunggu verifikasi" value={pending.length} note="Akun mitra yang belum dihubungkan" />
      </div>
      <div className="grid gap-5 lg:grid-cols-2">
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
          <h2 className="text-[15px] font-extrabold">Akun terbaru</h2>
          {pending.length === 0 ? (
            <p className="mt-3 text-[13.5px] text-brand-gray">Tidak ada akun yang menunggu verifikasi.</p>
          ) : (
            <ul className="mt-3 divide-y divide-brand-dark/[0.07]">
              {pending.slice(0, 6).map((a) => (
                <li key={a.user_id} className="flex items-center justify-between gap-3 py-2.5 text-[13.5px]">
                  <span>
                    <span className="block font-semibold">{a.full_name || a.email}</span>
                    <span className="text-[12px] text-brand-mute">{a.requested_category ? CATEGORY_LABEL[a.requested_category] : "Jenis belum dipilih"}</span>
                  </span>
                  <Link href="/portal/dashboard?tab=akun" className="text-[12.5px] font-bold text-brand-red">
                    Verifikasi →
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}

function Struktur({ levels, team }: { levels: OrgLevel[]; team: TeamMember[] }) {
  return (
    <div className="grid gap-5 lg:grid-cols-12">
      <div className="space-y-3 lg:col-span-8">
        {levels.map((l) => {
          const people = team.filter((t) => t.level_id === l.id && t.name);
          return (
            <section key={l.id} className={`${card} p-5`}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-[16px] font-extrabold">{l.name}</h2>
                <Badge tone="bg-brand-dark/[0.06] text-brand-dark">{l.tier}</Badge>
              </div>
              {l.summary.length > 0 && (
                <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[13px] text-brand-gray">
                  {l.summary.map((s) => (
                    <li key={s} className="flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-brand-red" aria-hidden="true" />
                      {s}
                    </li>
                  ))}
                </ul>
              )}
              {people.length > 0 && (
                <ul className="mt-3 flex flex-wrap gap-1.5">
                  {people.map((p) => (
                    <li key={p.id} className="rounded-full border border-brand-dark/10 px-2.5 py-1 text-[12.5px]">
                      <span className="font-semibold">{p.name}</span> <span className="text-brand-mute">· {p.position}</span>
                    </li>
                  ))}
                </ul>
              )}
              {l.duties.length > 0 && (
                <details className="group mt-3">
                  <summary className="cursor-pointer list-none text-[12.5px] font-bold text-brand-red">
                    <span className="group-open:hidden">Lihat jobdesk lengkap</span>
                    <span className="hidden group-open:inline">Tutup jobdesk</span>
                  </summary>
                  <ul className="mt-2 space-y-1.5 border-t border-brand-dark/[0.07] pt-3">
                    {l.duties.map((d) => (
                      <li key={d} className="flex gap-2 text-[13px] leading-relaxed text-brand-dark/85">
                        <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-brand-dark/50" aria-hidden="true" />
                        {d}
                      </li>
                    ))}
                  </ul>
                </details>
              )}
            </section>
          );
        })}
      </div>
      <aside className="lg:col-span-4">
        <section className={`${card} p-5 lg:sticky lg:top-24`}>
          <h2 className="text-[15px] font-extrabold">Nilai &amp; prinsip</h2>
          <ul className="mt-3 divide-y divide-brand-dark/[0.07]">
            {NILAI.map((n) => (
              <li key={n.name} className="py-3">
                <p className="text-[13.5px] font-extrabold text-brand-red">{n.name}</p>
                <p className="mt-0.5 text-[13px] text-brand-gray">{n.body}</p>
              </li>
            ))}
          </ul>
        </section>
      </aside>
    </div>
  );
}

function Tim({ levels, team }: { levels: OrgLevel[]; team: TeamMember[] }) {
  const levelName = new Map(levels.map((l) => [l.id, l.name]));
  return (
    <div className={`${card} overflow-x-auto`}>
      <table className="w-full min-w-[760px]">
        <thead className="border-b border-brand-dark/10 bg-brand-dark/[0.02]">
          <tr>
            <th className={th}>Level</th>
            <th className={th}>Posisi</th>
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
              <td className={`${td} max-w-[280px] text-brand-gray`}>
                {t.focus ?? "-"}
                {t.notes && <span className="mt-1 block text-[12px] text-brand-mute">{t.notes}</span>}
              </td>
              <td className={td}>
                <Phone phone={t.phone} />
              </td>
              <td className={td}>
                <Badge tone={TEAM_STATUS[t.status].tone}>{TEAM_STATUS[t.status].label}</Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function StatusForm({ m }: { m: Mitra }) {
  return (
    <form action={setMitraStatus} className="flex items-center gap-1.5">
      <input type="hidden" name="id" value={m.id} />
      <select name="status" defaultValue={m.status} className="rounded-md border border-brand-dark/15 bg-white px-2 py-1 text-[12.5px]" aria-label={`Status ${m.name}`}>
        {(Object.keys(STATUS_LABEL) as MitraStatus[]).map((s) => (
          <option key={s} value={s}>
            {STATUS_LABEL[s]}
          </option>
        ))}
      </select>
      <button type="submit" className="rounded-md bg-brand-dark px-2.5 py-1 text-[12px] font-bold text-white hover:bg-brand-red">
        Simpan
      </button>
    </form>
  );
}

function MitraTable({ mitra, accounts, filter }: { mitra: Mitra[]; accounts: Profile[]; filter: { kategori?: string; status?: string } }) {
  const emailOf = new Map(accounts.map((a) => [a.user_id, a.email]));
  const cats = (Object.keys(CATEGORY_LABEL) as MitraCategory[]).filter((c) => c !== "developer");
  const rows = mitra.filter((m) => (!filter.kategori || m.category === filter.kategori) && (!filter.status || m.status === filter.status));
  const chip = (active: boolean) =>
    `rounded-full border px-3 py-1 text-[12.5px] font-semibold ${active ? "border-brand-dark bg-brand-dark text-white" : "border-brand-dark/15 bg-white text-brand-dark hover:border-brand-dark"}`;
  const href = (k?: string, s?: string) => {
    const q = new URLSearchParams({ tab: "mitra" });
    if (k) q.set("kategori", k);
    if (s) q.set("status", s);
    return `/portal/dashboard?${q}`;
  };
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Link href={href(undefined, filter.status)} className={chip(!filter.kategori)}>
          Semua jenis
        </Link>
        {cats.map((c) => (
          <Link key={c} href={href(c, filter.status)} className={chip(filter.kategori === c)}>
            {CATEGORY_LABEL[c]}
          </Link>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        <Link href={href(filter.kategori)} className={chip(!filter.status)}>
          Semua status
        </Link>
        {(Object.keys(STATUS_LABEL) as MitraStatus[]).map((s) => (
          <Link key={s} href={href(filter.kategori, s)} className={chip(filter.status === s)}>
            {STATUS_LABEL[s]}
          </Link>
        ))}
      </div>
      <div className={`${card} overflow-x-auto`}>
        <table className="w-full min-w-[860px]">
          <thead className="border-b border-brand-dark/10 bg-brand-dark/[0.02]">
            <tr>
              <th className={th}>Nama</th>
              <th className={th}>Jenis</th>
              <th className={th}>Spesialisasi</th>
              <th className={th}>WhatsApp</th>
              <th className={th}>Akun portal</th>
              <th className={th}>Status</th>
              <th className={th}>Ubah status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-dark/[0.07]">
            {rows.length === 0 && (
              <tr>
                <td colSpan={7} className={`${td} text-center text-brand-gray`}>
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

function Developers({ developers }: { developers: Mitra[] }) {
  if (developers.length === 0) return <p className="text-[14px] text-brand-gray">Belum ada developer tercatat.</p>;
  return (
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
            <div className="grid grid-cols-[140px_1fr] gap-3 py-2">
              <dt className="text-brand-gray">Kota</dt>
              <dd className="font-semibold">{d.city ?? "-"}</dd>
            </div>
            <div className="grid grid-cols-[140px_1fr] gap-3 py-2">
              <dt className="text-brand-gray">Kontak</dt>
              <dd className="space-y-0.5">
                <Phone phone={d.phone} />
                {d.email && <span className="block break-all">{d.email}</span>}
              </dd>
            </div>
            {Object.entries(d.profile).map(([k, v]) => (
              <div key={k} className="grid grid-cols-[140px_1fr] gap-3 py-2">
                <dt className="text-brand-gray">{PROFILE_LABEL[k] ?? k}</dt>
                <dd>
                  {Array.isArray(v) ? (
                    <ul className="space-y-0.5">
                      {v.map((x) => (
                        <li key={x}>{x}</li>
                      ))}
                    </ul>
                  ) : (
                    v
                  )}
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
  );
}

function Akun({
  accounts,
  mitra,
  linkedByUser,
  isAdmin,
  meId,
}: {
  accounts: Profile[];
  mitra: Mitra[];
  linkedByUser: Map<string, Mitra>;
  isAdmin: boolean;
  meId: string;
}) {
  const unlinked = mitra.filter((m) => !m.user_id);
  return (
    <div className="space-y-4">
      <p className="max-w-3xl text-[13.5px] leading-relaxed text-brand-gray">
        Akun baru otomatis berperan mitra dengan status menunggu verifikasi. Setelah data dicek (telepon atau formulir), hubungkan
        akun ke data mitra yang sudah ada atau buat data mitra baru. Peran tim dan admin hanya dapat diberikan oleh admin.
      </p>
      <div className={`${card} overflow-x-auto`}>
        <table className="w-full min-w-[920px]">
          <thead className="border-b border-brand-dark/10 bg-brand-dark/[0.02]">
            <tr>
              <th className={th}>Akun</th>
              <th className={th}>WhatsApp</th>
              <th className={th}>Jenis diajukan</th>
              <th className={th}>Data mitra</th>
              <th className={th}>Peran</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-dark/[0.07]">
            {accounts.length === 0 && (
              <tr>
                <td colSpan={5} className={`${td} text-center text-brand-gray`}>
                  Belum ada akun.
                </td>
              </tr>
            )}
            {accounts.map((a) => {
              const linked = linkedByUser.get(a.user_id);
              return (
                <tr key={a.user_id}>
                  <td className={td}>
                    <span className="font-semibold">{a.full_name || "-"}</span>
                    <span className="block break-all text-[12px] text-brand-mute">{a.email}</span>
                    {a.company && <span className="block text-[12px] text-brand-mute">{a.company}</span>}
                  </td>
                  <td className={td}>
                    <Phone phone={a.phone} />
                  </td>
                  <td className={`${td} text-brand-gray`}>{a.requested_category ? CATEGORY_LABEL[a.requested_category] : "-"}</td>
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
                        <select name="mitra_id" defaultValue="baru" className="max-w-[230px] rounded-md border border-brand-dark/15 bg-white px-2 py-1 text-[12.5px]" aria-label={`Data mitra untuk ${a.email}`}>
                          <option value="baru">Buat data mitra baru dari akun</option>
                          {unlinked.map((m) => (
                            <option key={m.id} value={m.id}>
                              {m.name} · {CATEGORY_LABEL[m.category]}
                            </option>
                          ))}
                        </select>
                        <button type="submit" className="rounded-md bg-brand-dark px-2.5 py-1 text-[12px] font-bold text-white hover:bg-brand-red">
                          Verifikasi
                        </button>
                      </form>
                    )}
                  </td>
                  <td className={td}>
                    {isAdmin && a.user_id !== meId ? (
                      <form action={setRole} className="flex items-center gap-1.5">
                        <input type="hidden" name="user_id" value={a.user_id} />
                        <select name="role" defaultValue={a.role} className="rounded-md border border-brand-dark/15 bg-white px-2 py-1 text-[12.5px]" aria-label={`Peran ${a.email}`}>
                          <option value="mitra">Mitra</option>
                          <option value="tim">Tim</option>
                          <option value="admin">Admin</option>
                        </select>
                        <button type="submit" className="rounded-md border border-brand-dark/20 px-2.5 py-1 text-[12px] font-bold hover:border-brand-dark">
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
    </div>
  );
}
