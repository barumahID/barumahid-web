import Reveal from "@/components/Reveal";
import CountUp from "@/components/CountUp";
import SectionLabel from "@/components/ui/SectionLabel";

const stats = [
  { end: 30, suffix: "+", label: "Proyek Selesai" },
  { end: 7, suffix: "+", label: "Tahun Pengalaman" },
];

export default function TrackRecord() {
  return (
    <section className="bg-brand-dark text-white">
      <div className="mx-auto max-w-[1280px] px-6 md:px-10 lg:px-14 py-24 md:py-36 lg:py-40">
        <Reveal>
          <div className="grid gap-10 md:grid-cols-12 md:items-end">
            <div className="md:col-span-7">
              <SectionLabel number="07" dark>Track Record</SectionLabel>
              <h2 className="mt-6 type-h1 text-white">
                Dibangun dari lapangan,<br />bukan ruang rapat.
              </h2>
            </div>
            <div className="md:col-span-4 md:col-start-9">
              <p className="type-body text-white/50 max-w-sm">
                Pengalaman konstruksi nyata sebelum barumahID lahir — jadi fondasi kepercayaan mitra dan customer.
              </p>
            </div>
          </div>
        </Reveal>

        <div className="mt-16 md:mt-24 grid grid-cols-2 gap-8 md:gap-16 border-t border-white/10 pt-12 md:pt-16">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 120}>
              <div>
                <p className="text-[clamp(3rem,7vw,6rem)] font-black tracking-tight leading-none">
                  <CountUp end={s.end} suffix={s.suffix} />
                </p>
                <p className="mt-4 type-micro text-white/40">{s.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
