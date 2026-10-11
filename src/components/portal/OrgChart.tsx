"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { setTeamStatus } from "@/app/portal/actions";
import { TEAM_STATUS, type OrgLevel, type TeamMember } from "@/lib/portal";

// Bagan struktur organisasi barumahID (mengikuti bagan "Organisasi Kami" dari user, Okt 2026).
// Desktop: pohon dengan garis komando yang tergambar berurutan (SVG, pathLength=1) dan titik yang mengalir ke bawah;
// Komisaris tersambung ke Founder dengan garis pengawasan putus-putus; Nilai & Prinsip di kanan. HP: daftar bertingkat.
// Klik kartu untuk melihat jobdesk lengkap dan personil; admin dapat mengubah status personil (aktif/nonaktif/ditunda).

type Box = { x: number; y: number; w: number; h: number };

const STYLE: Record<string, { head: string; accent: string }> = {
  founder: { head: "bg-brand-red", accent: "#C53B3B" },
  komisaris: { head: "bg-[#1f2a44]", accent: "#1f2a44" },
  cofounder: { head: "bg-brand-dark", accent: "#141414" },
  clevel: { head: "bg-brand-dark", accent: "#141414" },
  manajer: { head: "bg-[#1A5C9A]", accent: "#1A5C9A" },
  apac: { head: "bg-[#1A5C9A]", accent: "#1A5C9A" },
  staff: { head: "bg-[#2D7A4F]", accent: "#2D7A4F" },
  kemitraan: { head: "bg-[#C25E20]", accent: "#C25E20" },
};

// Posisi di grid desktop (4 kolom: Komisaris | pohon 2 kolom | Nilai)
const PLACE: Record<string, string> = {
  komisaris: "lg:col-start-1 lg:row-start-1",
  founder: "lg:col-start-2 lg:col-span-2 lg:row-start-1 lg:justify-self-center lg:w-[78%]",
  cofounder: "lg:col-start-2 lg:row-start-2",
  clevel: "lg:col-start-3 lg:row-start-2",
  manajer: "lg:col-start-2 lg:row-start-3",
  apac: "lg:col-start-3 lg:row-start-3",
  staff: "lg:col-start-2 lg:col-span-2 lg:row-start-4 lg:justify-self-center lg:w-[78%]",
  kemitraan: "lg:col-start-2 lg:col-span-2 lg:row-start-5 lg:justify-self-center lg:w-[78%]",
};
const ROW: Record<string, number> = { komisaris: 0, founder: 0, cofounder: 1, clevel: 1, manajer: 2, apac: 2, staff: 3, kemitraan: 4 };

const NILAI = [
  { name: "Leadership", body: "Memimpin dengan visi, integritas, dan inspirasi." },
  { name: "Management", body: "Mengelola dengan strategi, data, dan kolaborasi." },
  { name: "Execution", body: "Menjalankan rencana dengan fokus, disiplin, dan hasil terukur." },
  { name: "Partnership", body: "Bertumbuh bersama mitra untuk nilai yang berkelanjutan." },
];

function Icon({ id }: { id: string }) {
  const p = { width: 18, height: 18, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  switch (id) {
    case "founder":
      return (
        <svg {...p}>
          <circle cx="12" cy="12" r="9" />
          <path d="m15.5 8.5-2 5-5 2 2-5z" />
        </svg>
      );
    case "komisaris":
      return (
        <svg {...p}>
          <path d="M12 3 5 6v5c0 4.5 3 8 7 10 4-2 7-5.5 7-10V6z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      );
    case "cofounder":
      return (
        <svg {...p}>
          <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />
        </svg>
      );
    case "clevel":
      return (
        <svg {...p}>
          <rect x="3" y="7" width="18" height="13" rx="2" />
          <path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M3 13h18" />
        </svg>
      );
    case "manajer":
      return (
        <svg {...p}>
          <rect x="3" y="4" width="18" height="12" rx="1.5" />
          <path d="m7 13 3-3 3 2 4-4M12 16v4M8 20h8" />
        </svg>
      );
    case "apac":
      return (
        <svg {...p}>
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18M12 3c2.5 3 2.5 15 0 18M12 3c-2.5 3-2.5 15 0 18" />
        </svg>
      );
    case "staff":
      return (
        <svg {...p}>
          <circle cx="12" cy="12" r="3" />
          <path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" />
        </svg>
      );
    default:
      return (
        <svg {...p}>
          <path d="m11 17 2 2a1.4 1.4 0 0 0 2-2M14 14l2.5 2.5a1.4 1.4 0 0 0 2-2l-3.9-3.9a2 2 0 0 0-2.8 0l-.9.9a1.4 1.4 0 0 1-2-2l2.8-2.8a4 4 0 0 1 4.5-.8l.4.2a3 3 0 0 0 2 .2L21 6M3 6l2.6 2.6a2 2 0 0 0 2.9 0" />
        </svg>
      );
  }
}

function NodeCard({
  level,
  people,
  active,
  onSelect,
}: {
  level: OrgLevel;
  people: TeamMember[];
  active: boolean;
  onSelect: () => void;
}) {
  const st = STYLE[level.id] ?? STYLE.staff;
  const filled = people.filter((p) => p.name);
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={active}
      className={`group block w-full overflow-hidden rounded-2xl border bg-white text-left shadow-[0_14px_34px_-24px_rgba(20,20,20,0.5)] transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_40px_-22px_rgba(20,20,20,0.45)] ${
        active ? "border-brand-dark ring-2 ring-brand-dark/80" : "border-brand-dark/10"
      }`}
    >
      <span className={`flex items-center gap-2.5 px-4 py-2.5 text-white ${st.head}`}>
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/15">
          <Icon id={level.id} />
        </span>
        <span className="text-[13px] font-extrabold uppercase tracking-[0.08em]">{level.name}</span>
        <span className="ml-auto text-[11px] font-semibold text-white/75">{filled.length} orang</span>
      </span>
      <span className="block px-4 py-3">
        <span className="block space-y-1">
          {level.summary.map((s) => (
            <span key={s} className="flex items-start gap-2 text-[12.5px] leading-snug text-brand-dark/80">
              <span className="mt-[5px] h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: st.accent }} aria-hidden="true" />
              {s}
            </span>
          ))}
        </span>
        {people.length > 0 && (
          <span className="mt-3 flex flex-wrap gap-1.5 border-t border-brand-dark/[0.07] pt-2.5">
            {people.map((p) => (
              <span
                key={p.id}
                className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11.5px] ${p.name ? "bg-brand-dark/[0.05] text-brand-dark" : "text-brand-mute border border-dashed border-brand-dark/25"}`}
                title={`${p.position}${p.name ? ` · ${p.name}` : ""} · ${TEAM_STATUS[p.status].label}`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${TEAM_STATUS[p.status].dot}`} aria-hidden="true" />
                <span className="font-semibold">{p.name ?? p.position}</span>
                {p.name && <span className="text-brand-mute">{p.position}</span>}
              </span>
            ))}
          </span>
        )}
        <span className="mt-2.5 block text-[11.5px] font-bold text-brand-red opacity-0 transition-opacity group-hover:opacity-100">
          Lihat jobdesk dan personil →
        </span>
      </span>
    </button>
  );
}

export default function OrgChart({ levels, team, isAdmin }: { levels: OrgLevel[]; team: TeamMember[]; isAdmin: boolean }) {
  const reduce = useReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef(new Map<string, HTMLDivElement>());
  const [lines, setLines] = useState<{ d: string; dashed?: boolean; order: number }[]>([]);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [selected, setSelected] = useState<string>(levels[0]?.id ?? "founder");

  // Garis komando dihitung dari posisi kartu (desktop saja), dihitung ulang saat ukuran berubah
  useLayoutEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const measure = () => {
      if (window.innerWidth < 1024) {
        setLines([]);
        return;
      }
      const box = (id: string): Box | null => {
        const el = nodeRefs.current.get(id);
        if (!el) return null;
        return { x: el.offsetLeft, y: el.offsetTop, w: el.offsetWidth, h: el.offsetHeight };
      };
      const [f, k, co, ce, ma, ap, st, km] = ["founder", "komisaris", "cofounder", "clevel", "manajer", "apac", "staff", "kemitraan"].map(box);
      const cx = (b: Box) => b.x + b.w / 2;
      const next: { d: string; dashed?: boolean; order: number }[] = [];
      if (f && co && ce) {
        const my = (f.y + f.h + co.y) / 2;
        next.push({ d: `M${cx(f)},${f.y + f.h} V${my} H${cx(co)} V${co.y}`, order: 1 });
        next.push({ d: `M${cx(f)},${f.y + f.h} V${my} H${cx(ce)} V${ce.y}`, order: 1 });
      }
      if (co && ma) next.push({ d: `M${cx(co)},${co.y + co.h} V${ma.y}`, order: 2 });
      if (ce && ap) next.push({ d: `M${cx(ce)},${ce.y + ce.h} V${ap.y}`, order: 2 });
      if (ma && ap && st) {
        const my = (Math.max(ma.y + ma.h, ap.y + ap.h) + st.y) / 2;
        next.push({ d: `M${cx(ma)},${ma.y + ma.h} V${my} H${cx(st)} V${st.y}`, order: 3 });
        next.push({ d: `M${cx(ap)},${ap.y + ap.h} V${my} H${cx(st)} V${st.y}`, order: 3 });
      }
      if (st && km) next.push({ d: `M${cx(st)},${st.y + st.h} V${km.y}`, order: 4 });
      if (k && f) {
        const y = f.y + Math.min(f.h, k.h) / 2;
        next.push({ d: `M${k.x + k.w},${k.y + k.h / 2} H${(k.x + k.w + f.x) / 2} V${y} H${f.x}`, dashed: true, order: 1 });
      }
      setLines(next);
      setSize({ w: wrap.offsetWidth, h: wrap.offsetHeight });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(wrap);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [levels, team]);

  const level = levels.find((l) => l.id === selected) ?? levels[0];
  const people = (id: string) => team.filter((t) => t.level_id === id);

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-brand-dark/10 bg-white p-4 md:p-8">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[12px] font-bold uppercase tracking-[0.16em] text-brand-red">Organisasi kami</p>
            <h2 className="mt-1 text-[22px] font-extrabold tracking-tight">Struktur organisasi barumahID</h2>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-[12px] text-brand-gray">
            <span className="flex items-center gap-2">
              <span className="h-0.5 w-6 bg-brand-dark" aria-hidden="true" />
              Garis komando
            </span>
            <span className="flex items-center gap-2">
              <span className="h-0 w-6 border-t-2 border-dashed border-brand-dark/60" aria-hidden="true" />
              Garis pengawasan
            </span>
            {(["aktif", "nonaktif", "ditunda", "kosong"] as const).map((s) => (
              <span key={s} className="flex items-center gap-1.5">
                <span className={`h-2 w-2 rounded-full ${TEAM_STATUS[s].dot}`} aria-hidden="true" />
                {TEAM_STATUS[s].label}
              </span>
            ))}
          </div>
        </div>

        <div ref={wrapRef} className="relative grid gap-4 lg:grid-cols-4 lg:gap-x-6 lg:gap-y-12">
          {/* Garis (desktop) */}
          {lines.length > 0 && (
            <svg className="pointer-events-none absolute inset-0 hidden lg:block" width={size.w} height={size.h} aria-hidden="true">
              {lines.map((l, i) => (
                <path
                  key={i}
                  d={l.d}
                  pathLength={1}
                  fill="none"
                  stroke={l.dashed ? "rgba(20,20,20,0.45)" : "#141414"}
                  strokeWidth={l.dashed ? 1.5 : 1.8}
                  strokeLinejoin="round"
                  className={l.dashed ? "org-fade" : "org-draw"}
                  strokeDasharray={l.dashed ? "0.012 0.012" : undefined}
                  style={{ animationDelay: `${200 + l.order * 280}ms` }}
                />
              ))}
              {!reduce &&
                lines
                  .filter((l) => !l.dashed)
                  .map((l, i) => (
                    <circle key={`dot-${i}`} r={3} fill="#C53B3B" opacity={0.85}>
                      <animateMotion dur={`${2.4 + (i % 3) * 0.5}s`} begin={`${1.6 + i * 0.25}s`} repeatCount="indefinite" path={l.d} />
                    </circle>
                  ))}
            </svg>
          )}

          {levels.map((l) => (
            <div
              key={l.id}
              ref={(el) => {
                if (el) nodeRefs.current.set(l.id, el);
                else nodeRefs.current.delete(l.id);
              }}
              className={`org-node relative z-10 ${PLACE[l.id] ?? ""}`}
              style={{ animationDelay: `${(ROW[l.id] ?? 0) * 140}ms` }}
            >
              <NodeCard level={l} people={people(l.id)} active={selected === l.id} onSelect={() => setSelected(l.id)} />
            </div>
          ))}

          {/* Nilai dan prinsip */}
          <aside className="org-node relative z-10 lg:col-start-4 lg:row-span-5 lg:row-start-1" style={{ animationDelay: "500ms" }}>
            <div className="h-full rounded-2xl border border-brand-dark/10 bg-brand-cream/70 p-5">
              <p className="text-[13px] font-extrabold uppercase tracking-[0.08em]">Nilai &amp; prinsip kami</p>
              <ul className="mt-4 space-y-4">
                {NILAI.map((n, i) => (
                  <li key={n.name} className="flex gap-3">
                    <span
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[13px] font-black text-white"
                      style={{ background: ["#C53B3B", "#1A5C9A", "#141414", "#C25E20"][i] }}
                    >
                      {n.name[0]}
                    </span>
                    <span>
                      <span className="block text-[14px] font-extrabold">{n.name}</span>
                      <span className="mt-0.5 block text-[12.5px] leading-relaxed text-brand-gray">{n.body}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </div>

      {/* Detail level terpilih: jobdesk lengkap dan personil */}
      {level && (
        <section key={level.id} className="org-node rounded-3xl border border-brand-dark/10 bg-white">
          <div className={`flex flex-wrap items-center gap-3 rounded-t-3xl px-6 py-4 text-white ${STYLE[level.id]?.head ?? "bg-brand-dark"}`}>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15">
              <Icon id={level.id} />
            </span>
            <div>
              <p className="text-[18px] font-extrabold leading-tight">{level.name}</p>
              <p className="text-[12px] text-white/75">{level.tier}</p>
            </div>
          </div>
          <div className="grid gap-6 p-6 lg:grid-cols-2">
            <div>
              <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-brand-red">Jobdesk</p>
              <ol className="mt-3 space-y-2.5">
                {level.duties.map((d, i) => (
                  <li key={d} className="flex gap-3 text-[13.5px] leading-relaxed">
                    <span className="mt-0.5 font-mono text-[11.5px] font-bold text-brand-mute">{String(i + 1).padStart(2, "0")}</span>
                    {d}
                  </li>
                ))}
              </ol>
            </div>
            <div>
              <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-brand-red">Jabatan dan personil</p>
              <ul className="mt-3 divide-y divide-brand-dark/[0.07] border-y border-brand-dark/[0.07]">
                {people(level.id).length === 0 && <li className="py-3 text-[13px] text-brand-gray">Belum ada jabatan tercatat di level ini.</li>}
                {people(level.id).map((p) => (
                  <li key={p.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                    <span className="min-w-0">
                      <span className="block text-[14px] font-bold">{p.position}</span>
                      <span className="block text-[13px] text-brand-gray">{p.name ?? "Belum terisi"}</span>
                      {p.focus && <span className="block text-[12px] text-brand-mute">{p.focus}</span>}
                      {p.notes && <span className="block text-[12px] text-brand-mute">{p.notes}</span>}
                    </span>
                    {p.name && isAdmin ? (
                      <form action={setTeamStatus} className="flex items-center gap-1.5">
                        <input type="hidden" name="id" value={p.id} />
                        <select name="status" defaultValue={p.status} className="rounded-md border border-brand-dark/15 bg-white px-2 py-1 text-[12.5px]" aria-label={`Status ${p.name}`}>
                          <option value="aktif">Aktif</option>
                          <option value="nonaktif">Nonaktif</option>
                          <option value="ditunda">Ditunda</option>
                        </select>
                        <button type="submit" className="rounded-md bg-brand-dark px-2.5 py-1 text-[12px] font-bold text-white hover:bg-brand-red">
                          Simpan
                        </button>
                      </form>
                    ) : (
                      <span className={`rounded-full px-2.5 py-0.5 text-[11.5px] font-bold ${TEAM_STATUS[p.status].tone}`}>{TEAM_STATUS[p.status].label}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
