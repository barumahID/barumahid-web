"use client";

import { useEffect } from "react";
import Image from "next/image";
import {
  MotionConfig,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";

// Latar hero beranda (arahan user Okt 2026): terang dan bersih seperti versi awal. Lekukan pita dari
// referensi merah hanya tampil sebagai bayangan lembut bernada merah-cokelat, merahnya tidak menonjol,
// tanpa kilau berkedip, tanpa grid. Gedung samar (dari latar awal) di tepi kanan, memudar ke tengah supaya tidak
// menabrak judul dan panel. Anyaman garis samar di bawah.
// Gerak: bayangan dan gedung melayang pelan, garis mengalir pelan, parallax ikut kursor.
const SHADOW = "#7A2A26";
const BUILDING_MASK = "radial-gradient(ellipse 95% 85% at 100% 45%, #000 35%, transparent 78%)";

// Anyaman garis di bawah: tiap garis sedikit bergeser, membentuk permukaan yang melengkung.
const MESH = Array.from({ length: 40 }, (_, i) => {
  const t = i / 39;
  const d = `M-40 ${140 + t * 180}C360 ${300 + t * 60} 760 ${380 - t * 10} 1060 ${300 - t * 30}S1400 ${90 + t * 200} 1480 ${60 + t * 220}`;
  const mid = 1 - Math.abs(t - 0.5) * 2;
  return { d, opacity: 0.03 + mid * 0.06 };
});

function ShadowRibbon({ id, d, w, opacity }: { id: string; d: string; w: number; opacity: number }) {
  return <path d={d} fill="none" stroke={SHADOW} strokeOpacity={opacity} strokeWidth={w} strokeLinecap="round" filter={`url(#${id})`} />;
}

export default function HeroBackdrop() {
  const reduce = useReducedMotion();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 40, damping: 18 });
  const sy = useSpring(my, { stiffness: 40, damping: 18 });
  const leftX = useTransform(sx, (v) => v * 22);
  const rightX = useTransform(sx, (v) => v * -22);
  const shadowY = useTransform(sy, (v) => v * 14);
  const meshX = useTransform(sx, (v) => v * -10);
  const buildingX = useTransform(sx, (v) => v * -14);

  // Parallax hanya untuk mouse (bukan layar sentuh) dan kalau pengguna tidak memilih kurangi animasi.
  useEffect(() => {
    if (reduce || !window.matchMedia("(pointer: fine)").matches) return;
    const onMove = (e: PointerEvent) => {
      mx.set(e.clientX / window.innerWidth - 0.5);
      my.set(e.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduce, mx, my]);

  return (
    <MotionConfig reducedMotion="user">
      <div className="absolute inset-0 overflow-hidden bg-brand-cream">
        {/* Cahaya lembut di tengah */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_38%,rgba(255,255,255,0.75),rgba(255,255,255,0)_70%)]" />

        {/* Gedung samar di tepi kanan (laptop) atau pojok kanan bawah (HP), memudar ke arah tengah */}
        <motion.div
          className="absolute bottom-0 right-0 h-[28%] w-[52vw] md:h-full md:w-[30vw] md:max-w-[460px]"
          style={{ x: buildingX }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
        >
          <div
            className="building-drift relative h-full w-full opacity-60 mix-blend-multiply"
            style={{ maskImage: BUILDING_MASK, WebkitMaskImage: BUILDING_MASK }}
          >
            <Image src="/images/beranda/gedung.webp" alt="" fill sizes="(min-width: 768px) 30vw, 52vw" className="object-cover object-left-top" />
          </div>
        </motion.div>

        {/* Anyaman garis samar di bawah */}
        <motion.div className="absolute inset-x-[-4%] bottom-0 h-[52%]" style={{ x: meshX }}>
          <svg className="mesh-drift h-full w-full" viewBox="0 0 1440 400" preserveAspectRatio="none" fill="none" aria-hidden="true">
            {MESH.map((l, i) => (
              <path key={i} d={l.d} stroke={SHADOW} strokeOpacity={l.opacity} strokeWidth="0.8" vectorEffect="non-scaling-stroke" />
            ))}
          </svg>
        </motion.div>

        {/* Bayangan lekukan pita, kiri */}
        <motion.div
          className="absolute inset-y-0 left-0 w-[40vw] max-w-[520px] md:w-[32vw]"
          style={{ x: leftX, y: shadowY }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <svg className="ribbon-float-a h-full w-full" viewBox="0 0 460 900" preserveAspectRatio="xMinYMid slice" aria-hidden="true">
            <defs>
              <filter id="bayangan-kiri" x="-40%" y="-20%" width="180%" height="140%">
                <feGaussianBlur stdDeviation="22" />
              </filter>
            </defs>
            <ShadowRibbon id="bayangan-kiri" w={86} opacity={0.13} d="M-60 30C250 -20 360 200 225 375S20 640 200 765S370 990 150 1010" />
            <ShadowRibbon id="bayangan-kiri" w={48} opacity={0.09} d="M-70 470C110 430 230 520 210 640S70 860 -40 905" />
          </svg>
        </motion.div>

        {/* Bayangan lekukan pita, kanan */}
        <motion.div
          className="absolute inset-y-0 right-0 w-[40vw] max-w-[520px] md:w-[32vw]"
          style={{ x: rightX, y: shadowY }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        >
          <svg className="ribbon-float-b h-full w-full" viewBox="0 0 460 900" preserveAspectRatio="xMaxYMid slice" aria-hidden="true">
            <defs>
              <filter id="bayangan-kanan" x="-40%" y="-20%" width="180%" height="140%">
                <feGaussianBlur stdDeviation="22" />
              </filter>
            </defs>
            <ShadowRibbon id="bayangan-kanan" w={86} opacity={0.13} d="M540 70C260 100 190 330 320 470S540 770 300 985" />
            <ShadowRibbon id="bayangan-kanan" w={42} opacity={0.09} d="M430 120C300 170 255 300 300 420" />
            <ShadowRibbon id="bayangan-kanan" w={34} opacity={0.08} d="M520 520C430 600 420 720 470 820" />
          </svg>
        </motion.div>
      </div>
    </MotionConfig>
  );
}
