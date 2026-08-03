"use client";

import Link from "next/link";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useRef } from "react";

/* ── Word-by-word clip reveal ────────────────────────────── */
function WordReveal({
  text,
  className,
  highlightWord,
  delay = 0,
}: {
  text: string;
  className?: string;
  highlightWord?: string;
  delay?: number;
}) {
  const words = text.split(" ");
  return (
    <span className={className}>
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden">
          <motion.span
            className="inline-block"
            initial={{ y: "110%", rotateX: -80 }}
            animate={{ y: "0%", rotateX: 0 }}
            transition={{
              duration: 0.7,
              ease: [0.16, 1, 0.3, 1],
              delay: delay + i * 0.08,
            }}
          >
            {word === highlightWord ? (
              <span className="text-brand-red">{word}</span>
            ) : (
              word
            )}
          </motion.span>
          {i < words.length - 1 && " "}
        </span>
      ))}
    </span>
  );
}

/* ── Magnetic button wrapper ─────────────────────────────── */
function MagneticWrap({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 200, damping: 20 });
  const springY = useSpring(y, { stiffness: 200, damping: 20 });

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    x.set((e.clientX - cx) * 0.25);
    y.set((e.clientY - cy) * 0.25);
  };
  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      style={{ x: springX, y: springY }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="inline-block"
    >
      {children}
    </motion.div>
  );
}

/* ── Marquee ticker ──────────────────────────────────────── */
const TICKER =
  "Sewa · Tabung DP Otomatis · Miliki Rumah · Padang · Jambi · Palembang · Riau · ";

function Marquee() {
  return (
    <div className="overflow-hidden border-t border-brand-line bg-brand-cream py-4">
      <div className="flex animate-marquee whitespace-nowrap">
        {Array.from({ length: 4 }).map((_, i) => (
          <span
            key={i}
            className="mx-4 text-[13px] font-semibold uppercase tracking-[0.18em] text-brand-mute"
          >
            {TICKER}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ── Hero ────────────────────────────────────────────────── */
export default function HeroLanding() {
  const blobRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduced || !blobRef.current) return;

    let frame = 0;
    const animate = () => {
      frame++;
      if (blobRef.current) {
        const t = frame * 0.003;
        const x1 = Math.sin(t) * 60;
        const y1 = Math.cos(t * 0.7) * 40;
        const x2 = Math.cos(t * 0.5) * 50;
        const y2 = Math.sin(t * 0.8) * 55;
        blobRef.current.style.setProperty("--bx1", `${50 + x1}%`);
        blobRef.current.style.setProperty("--by1", `${30 + y1}%`);
        blobRef.current.style.setProperty("--bx2", `${40 + x2}%`);
        blobRef.current.style.setProperty("--by2", `${60 + y2}%`);
      }
      requestAnimationFrame(animate);
    };
    const raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <>
      <section className="relative flex min-h-[100svh] w-full items-center overflow-hidden bg-brand-cream">
        {/* Animated gradient mesh blobs */}
        <div
          ref={blobRef}
          className="pointer-events-none absolute inset-0"
          style={
            {
              "--bx1": "55%",
              "--by1": "35%",
              "--bx2": "45%",
              "--by2": "65%",
            } as React.CSSProperties
          }
        >
          <div
            className="absolute h-[600px] w-[600px] rounded-full opacity-30 blur-[120px]"
            style={{
              background:
                "radial-gradient(circle, rgba(197,59,59,0.15) 0%, transparent 70%)",
              left: "var(--bx1)",
              top: "var(--by1)",
              transform: "translate(-50%, -50%)",
              transition: "left 0.05s, top 0.05s",
            }}
          />
          <div
            className="absolute h-[500px] w-[500px] rounded-full opacity-25 blur-[100px]"
            style={{
              background:
                "radial-gradient(circle, rgba(197,59,59,0.1) 0%, rgba(237,232,224,0.3) 60%, transparent 80%)",
              left: "var(--bx2)",
              top: "var(--by2)",
              transform: "translate(-50%, -50%)",
              transition: "left 0.05s, top 0.05s",
            }}
          />
        </div>

        {/* Ghosted background typography */}
        <div
          className="pointer-events-none absolute right-[-5%] top-1/2 -translate-y-1/2 select-none text-[clamp(12rem,22vw,20rem)] font-black uppercase leading-none tracking-tighter text-brand-dark/[0.03]"
          aria-hidden="true"
        >
          RUMAH
        </div>

        {/* Content */}
        <div className="relative z-10 mx-auto w-full max-w-[1280px] px-6 py-32 md:px-10 lg:px-14">
          {/* Label */}
          <motion.span
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0 }}
            className="inline-block text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-red"
          >
            Platform Pendamping Kepemilikan Rumah
          </motion.span>

          {/* Headline — word-by-word reveal */}
          <h1 className="mt-8 max-w-[14ch] text-[clamp(2.8rem,8vw,5.5rem)] font-black leading-[0.98] tracking-[-0.04em] text-brand-dark">
            <WordReveal
              text="Sewa hari ini."
              delay={0.15}
            />
            <br />
            <WordReveal
              text="Miliki hunian"
              highlightWord="Miliki"
              delay={0.45}
            />
            <br />
            <WordReveal text="nantinya." delay={0.65} />
          </h1>

          {/* Sub-headline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              ease: [0.16, 1, 0.3, 1],
              delay: 0.9,
            }}
            className="mt-8 max-w-md text-[clamp(0.95rem,1.15vw,1.1rem)] leading-relaxed text-brand-gray"
          >
            Dari penyewa menjadi pemilik. barumahID mendampingi setiap langkah.
          </motion.p>

          {/* CTA buttons — spring physics */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 20,
              delay: 1.1,
            }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <MagneticWrap>
              <Link
                href="/daftar"
                className="group inline-flex items-center gap-2.5 rounded-full bg-brand-red px-8 py-4 text-[14px] font-bold text-white shadow-lg shadow-brand-red/20 transition-all duration-300 hover:bg-brand-red-dark hover:shadow-xl hover:shadow-brand-red/30"
              >
                Mulai Perjalanan Saya
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  className="transition-transform duration-300 group-hover:translate-x-1"
                >
                  <path d="M3 8h10M9 4l4 4-4 4" />
                </svg>
              </Link>
            </MagneticWrap>

            <MagneticWrap>
              <Link
                href="/rto"
                className="group inline-flex items-center gap-2 rounded-full border-2 border-brand-dark/15 px-8 py-[14px] text-[14px] font-semibold text-brand-dark transition-all duration-300 hover:border-brand-dark hover:bg-brand-dark hover:text-white"
              >
                Pelajari Program
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  className="transition-transform duration-300 group-hover:translate-x-1"
                >
                  <path d="M3 8h10M9 4l4 4-4 4" />
                </svg>
              </Link>
            </MagneticWrap>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.8 }}
          className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2"
        >
          <span className="text-[11px] font-medium uppercase tracking-[0.15em] text-brand-mute">
            Scroll
          </span>
          <div className="flex h-10 w-5 items-start justify-center rounded-full border border-brand-dark/15 p-1">
            <motion.div
              className="h-2 w-1.5 rounded-full bg-brand-red"
              animate={{ y: [0, 14, 0] }}
              transition={{
                duration: 1.8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </div>
        </motion.div>
      </section>

      {/* Marquee ticker */}
      <Marquee />
    </>
  );
}
