"use client";

import { MotionConfig, motion, type Variants } from "framer-motion";
import { HOME_HISTORY } from "@/data/beranda";

// Roadmap histori singkat di beranda (arahan user: minimalis, beranimasi).
// Saat masuk layar, berurutan per langkah: titik muncul, teks masuk, garis merah tumbuh ke langkah berikutnya.
const EASE = [0.16, 1, 0.3, 1] as const;

const list: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.42, delayChildren: 0.15 } },
};
const line: Variants = {
  hidden: { scaleY: 0 },
  show: { scaleY: 1, transition: { duration: 0.7, delay: 0.25, ease: EASE } },
};
const item: Variants = {
  hidden: { opacity: 0, x: 16 },
  show: { opacity: 1, x: 0, transition: { duration: 0.7, ease: EASE } },
};
const dot: Variants = {
  hidden: { scale: 0 },
  show: { scale: 1, transition: { type: "spring", stiffness: 320, damping: 18 } },
};

export default function HistoryRoadmap() {
  return (
    <MotionConfig reducedMotion="user">
      <div className="relative overflow-hidden rounded-3xl border border-brand-dark/10 bg-white p-7 shadow-[0_24px_60px_-36px_rgba(20,20,20,0.35)] md:p-9">
        <div className="pattern-dots pointer-events-none absolute inset-0" aria-hidden="true" />
        <div className="relative">
          <div className="flex items-baseline justify-between gap-4">
            <p className="type-micro whitespace-nowrap text-brand-red">Perjalanan barumahID</p>
            <p className="hidden whitespace-nowrap text-[12px] font-semibold text-brand-mute sm:block">sejak 2018</p>
          </div>

          <motion.div variants={list} className="relative mt-8" initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.35 }}>
            <ol className="relative">
              {HOME_HISTORY.map((s, i) => (
                <motion.li key={s.period} variants={item} className="relative pb-9 pl-12 last:pb-0">
                  {/* Penghubung ke langkah berikutnya: abu-abu dasar, lalu merah yang tumbuh */}
                  {i < HOME_HISTORY.length - 1 && (
                    <>
                      <span className="absolute bottom-0 left-[11px] top-7 w-px bg-brand-dark/10" aria-hidden="true" />
                      <motion.span variants={line} className="absolute bottom-0 left-[11px] top-7 w-px origin-top bg-brand-red" aria-hidden="true" />
                    </>
                  )}
                  <motion.span variants={dot} className="absolute left-0 top-0 flex h-6 w-6 items-center justify-center" aria-hidden="true">
                    {s.current && <span className="animate-ping-soft absolute inset-0 rounded-full bg-brand-red/40" />}
                    <span
                      className={`relative flex h-6 w-6 items-center justify-center rounded-full border-2 border-brand-red ${
                        s.current ? "bg-brand-red" : "bg-white"
                      }`}
                    >
                      <span className={`h-2 w-2 rounded-full ${s.current ? "bg-white" : "bg-brand-red"}`} />
                    </span>
                  </motion.span>
                  <p className="text-[12px] font-bold tracking-wide text-brand-red">{s.period}</p>
                  <p className="mt-1 text-[18px] font-extrabold leading-snug text-brand-dark md:text-[19px]">{s.title}</p>
                  <p className="mt-1.5 text-[14px] leading-relaxed text-brand-gray">{s.body}</p>
                </motion.li>
              ))}
            </ol>
          </motion.div>
        </div>
      </div>
    </MotionConfig>
  );
}
