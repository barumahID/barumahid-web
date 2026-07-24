import Reveal from "@/components/Reveal";
import SectionLabel from "@/components/ui/SectionLabel";

const pathways = [
  {
    title: "Option Credit",
    score: "Skor 36–75",
    desc: "Sewa → Escrow → KPR via developer mitra",
    color: "border-credit text-credit",
    bgIcon: "bg-credit/10",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M3 9h18" />
        <path d="M9 21V9" />
      </svg>
    ),
  },
  {
    title: "Option Build",
    score: "Skor 36–75 + Punya Tanah",
    desc: "Sewa → Modal → Bangun di tanah sendiri (IndDev)",
    color: "border-build text-build",
    bgIcon: "bg-build/10",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 20h20" />
        <path d="M5 20V8.5L12 3l7 5.5V20" />
        <path d="M14 20v-4a2 2 0 0 0-4 0v4" />
      </svg>
    ),
  },
  {
    title: "Option Buy",
    score: "Skor 76–100",
    desc: "Sedang Dipersiapkan",
    color: "border-gray-300 text-gray-400",
    bgIcon: "bg-gray-100",
    comingSoon: true,
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
      </svg>
    ),
  },
];

export default function PathwayCards() {
  return (
    <section className="bg-brand-dark text-white">
      <div className="mx-auto max-w-[1200px] px-6 py-20 sm:py-28">
        <Reveal>
          <SectionLabel dark>Skor Siap Punya Rumah&trade;</SectionLabel>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
            Satu platform, tiga jalur adaptif
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/60">
            Sistem kami merekomendasikan jalur terbaik berdasarkan kondisi
            finansialmu — bukan memaksa semua orang masuk satu cara.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {pathways.map((p, i) => (
            <Reveal key={p.title} delay={i * 120}>
              <div
                className={`relative flex h-full flex-col gap-5 rounded-xl border-2 bg-white/5 p-7 backdrop-blur-sm transition ${
                  p.comingSoon ? "border-white/10 opacity-60" : p.color
                }`}
              >
                <span className={`flex h-12 w-12 items-center justify-center rounded-xl ${p.bgIcon} ${p.color.split(" ")[1]}`}>
                  {p.icon}
                </span>
                <div>
                  <h3 className="text-xl font-extrabold text-white">{p.title}</h3>
                  <p className="mt-1 text-xs font-semibold text-white/50">{p.score}</p>
                </div>
                <p className="text-sm leading-relaxed text-white/70">{p.desc}</p>
                {p.comingSoon && (
                  <span className="mt-auto inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white/50">
                    <span className="h-1.5 w-1.5 rounded-full bg-white/30" />
                    Segera Hadir
                  </span>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
