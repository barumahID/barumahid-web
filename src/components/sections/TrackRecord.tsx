import Reveal from "@/components/Reveal";
import CountUp from "@/components/CountUp";

const stats = [
  { end: 7, suffix: "+", label: "Tahun", sublabel: "Pengalaman Konstruksi" },
  { end: 584, prefix: "Rp ", suffix: " Jt", label: "Total Revenue", sublabel: "2018–2026" },
  { end: 30, suffix: "+", label: "Proyek", sublabel: "Selesai" },
  { end: 4, suffix: "", label: "Kota", sublabel: "Pilot Market" },
];

export default function TrackRecord() {
  return (
    <section className="bg-brand-dark text-white">
      <div className="mx-auto max-w-[1200px] px-6 py-20 sm:py-28">
        <Reveal>
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-brand-red">
            Track Record
          </span>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
            Dibangun dari lapangan, bukan ruang rapat
          </h2>
        </Reveal>

        <div className="mt-14 grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 100}>
              <div className="text-center">
                <p className="text-3xl font-black sm:text-4xl lg:text-5xl">
                  <CountUp end={s.end} prefix={s.prefix || ""} suffix={s.suffix} />
                </p>
                <p className="mt-2 text-sm font-semibold text-white/80">{s.label}</p>
                <p className="mt-0.5 text-xs text-white/40">{s.sublabel}</p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Founder quote */}
        <Reveal delay={450}>
          <div className="mt-16 rounded-xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="mb-4 text-brand-red/40">
              <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" fill="currentColor" />
              <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" fill="currentColor" />
            </svg>
            <blockquote className="text-lg font-medium italic leading-relaxed text-white/80 sm:text-xl">
              &ldquo;Saya bekerja di proyek tol 5 tahun. Saya tahu betul
              bagaimana konstruksi seharusnya dikerjakan — dan bagaimana
              kepemilikan rumah harusnya bisa dijangkau semua orang.&rdquo;
            </blockquote>
            <p className="mt-4 text-sm font-bold text-white/50">
              — Zulprima, Founder &amp; CEO barumahID
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
