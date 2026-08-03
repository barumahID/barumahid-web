import Reveal from "@/components/Reveal";
import Section from "@/components/ui/Section";
import SegmentNavbar from "@/components/layout/SegmentNavbar";
import { FORM_MITRA_HUNIAN, FORM_DEVELOPER, WA_LINK1 } from "@/constants";

const mitraMenuItems = [
  { label: "Home", href: "/" },
  { label: "Program Mitra", href: "/mitra" },
  { label: "Cara Kerja", href: "/mitra#cara-kerja" },
  { label: "FAQ", href: "/mitra#faq" },
];

const heroChips = [
  { icon: "🔧", label: "mitrabarumahID Construction" },
  { icon: "🤝", label: "mitrabarumahID Projectlink" },
  { icon: "📚", label: "mitrabarumahID Knowledges" },
];

const mitraTypes = [
  {
    id: "construction",
    title: "mitrabarumahID Construction",
    subtitle: "Subkontraktor, supplier, konsultan teknis",
    desc: "Bergabung dalam jaringan konstruksi barumahID sebagai subkontraktor, supplier material, atau konsultan teknis.",
    benefits: [
      "Akses ke proyek-proyek barumahID",
      "Jaringan kerja profesional",
      "Sistem pembayaran terstruktur",
      "Peluang kolaborasi jangka panjang",
    ],
    ctaLabel: "Daftar Sekarang →",
    ctaHref: `${WA_LINK1}?text=${encodeURIComponent("Halo barumahID, saya ingin mendaftar sebagai Mitra Konstruksi.")}`,
    color: "border-brand-red",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
      </svg>
    ),
  },
  {
    id: "projectlink",
    title: "mitrabarumahID Projectlink",
    subtitle: "Jaringan proyek konstruksi profesional",
    desc: "Jaringan proyek konstruksi profesional — akses ke proyek-proyek barumahID dan partner ecosystem.",
    benefits: [
      "Pipeline proyek yang terus bertambah",
      "Tracking progress real-time",
      "Akses ke ekosistem barumahID",
      "Partnership jangka panjang",
    ],
    ctaLabel: "Daftar Sekarang →",
    ctaHref: FORM_DEVELOPER,
    color: "border-build",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <line x1="19" y1="8" x2="19" y2="14" />
        <line x1="22" y1="11" x2="16" y2="11" />
      </svg>
    ),
  },
  {
    id: "knowledges",
    title: "mitrabarumahID Knowledges",
    subtitle: "Ekosistem edukasi & pengembangan SDM",
    desc: "Ekosistem edukasi dan pengembangan SDM konstruksi — pelatihan, sertifikasi, dan knowledge sharing.",
    benefits: [
      "Akses ke pelatihan dan sertifikasi",
      "Knowledge sharing community",
      "Pengembangan SDM berkelanjutan",
      "Kolaborasi dengan pakar industri",
    ],
    ctaLabel: "Daftar Sekarang →",
    ctaHref: FORM_MITRA_HUNIAN,
    color: "border-credit",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 10l9-5 9 5-9 5-9-5z" />
        <path d="M7 12v4c2 2 8 2 10 0v-4" />
        <path d="M21 10v6" />
      </svg>
    ),
  },
];

export default function MitraPage() {
  return (
    <>
      <SegmentNavbar segment="mitra" menuItems={mitraMenuItems} />

      {/* Split Hero */}
      <section className="bg-[#F8F5F0] px-6 py-24 md:px-10 md:py-32">
        <div className="mx-auto grid max-w-[1200px] items-center gap-12 md:grid-cols-[55fr_45fr]">
          <div>
            <p className="mb-4 text-xs font-bold uppercase tracking-widest text-[#C53B3B]">
              KEMITRAAN BARUMAHID
            </p>
            <h1 className="mb-6 text-4xl font-black leading-tight text-[#1A1A1A] md:text-5xl lg:text-6xl">
              Bergabung dalam ekosistem barumahID.
            </h1>
            <p className="mb-8 max-w-md text-base leading-relaxed text-[#666]">
              Tiga jalur kemitraan untuk subkontraktor, supplier, developer, dan
              institusi pendidikan yang ingin tumbuh bersama.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href={`${WA_LINK1}?text=${encodeURIComponent("Halo barumahID, saya ingin mendaftar sebagai mitra.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-[#C53B3B] px-8 py-4 text-sm font-bold text-white transition hover:bg-red-700"
              >
                Daftar Sebagai Mitra
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M3 8h10M9 4l4 4-4 4" />
                </svg>
              </a>
              <a
                href="#program"
                className="inline-flex items-center gap-2 rounded-full border-2 border-[#1A1A1A]/15 px-8 py-[14px] text-sm font-semibold text-[#1A1A1A] transition hover:border-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white"
              >
                Pelajari program
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M3 8h10M9 4l4 4-4 4" />
                </svg>
              </a>
            </div>
            <p className="mt-6 text-xs tracking-wide text-[#aaa]">
              mitrabarumahID Construction · Projectlink · Knowledges
            </p>
          </div>

          <div className="flex flex-col gap-3">
            {heroChips.map((chip) => (
              <div
                key={chip.label}
                className="flex items-center gap-3 rounded-xl border border-black/[0.08] bg-white px-5 py-4 text-sm font-semibold text-[#1A1A1A] shadow-sm"
              >
                <span className="text-lg">{chip.icon}</span>
                {chip.label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mitra Types */}
      <Section background="white" id="program">
        <div className="grid gap-6 lg:grid-cols-3">
          {mitraTypes.map((m, i) => (
            <Reveal key={m.id} delay={i * 120}>
              <div className={`flex h-full flex-col gap-5 rounded-xl border-t-4 bg-white p-7 card-shadow ${m.color}`}>
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-red/8 text-brand-red">
                  {m.icon}
                </span>
                <div>
                  <h2 className="text-lg font-extrabold text-brand-dark">{m.title}</h2>
                  <p className="mt-0.5 text-xs font-semibold text-brand-gray">{m.subtitle}</p>
                </div>
                <p className="text-sm leading-relaxed text-brand-gray">{m.desc}</p>
                <ul className="flex-1 space-y-2">
                  {m.benefits.map((b) => (
                    <li key={b} className="flex items-start gap-2 text-sm text-brand-gray">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#C53B3B" strokeWidth="2.5" strokeLinecap="round" className="mt-0.5 shrink-0"><path d="M3 8l3.5 3.5L13 5" /></svg>
                      {b}
                    </li>
                  ))}
                </ul>
                <a
                  href={m.ctaHref !== "#" ? m.ctaHref : `${WA_LINK1}?text=${encodeURIComponent(`Halo barumahID, saya ingin mendaftar sebagai ${m.title}.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto rounded-lg bg-brand-red px-6 py-3 text-center text-sm font-bold text-white shadow-lg shadow-brand-red/20 transition hover:bg-brand-red-dark"
                >
                  {m.ctaLabel}
                </a>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>
    </>
  );
}
