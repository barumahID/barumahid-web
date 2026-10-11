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
  type MotionValue,
} from "framer-motion";

// Latar hero beranda, versi "berseni" (arahan user Okt 2026, referensi mockup dari user, bukan ditiru mentah).
// Kolase karya barumahID di tepi layar: model struktur jadi line art tinta, render saluran jadi objek 3D
// yang melayang dengan bayangan, foto proyek jadi kartu bernada hangat. Ditambah bayangan daun samar,
// grid blueprint, dan garis ukur merah. Semua bahan diolah dulu ke palet situs (lihat public/images/beranda/latar).
type Kind = "line" | "object" | "photo";

interface Piece {
  src: string;
  w: number;
  h: number;
  kind: Kind;
  // posisi dan ukuran (Tailwind), termasuk kapan disembunyikan di HP
  className: string;
  opacity: number;
  rotate: number;
  depth: number; // seberapa jauh ikut kursor
  float: number; // durasi melayang (detik)
}

const DIR = "/images/beranda/latar";
const PIECES: Piece[] = [
  // Line art model struktur (tinta + garis merah brand)
  { src: `${DIR}/struktur-gedung.webp`, w: 900, h: 445, kind: "line", className: "hidden md:block left-[-3%] top-[11%] w-[min(31vw,470px)]", opacity: 0.32, rotate: -4, depth: 0.5, float: 9 },
  { src: `${DIR}/struktur-jembatan.webp`, w: 900, h: 380, kind: "line", className: "right-[-22%] top-[10%] w-[88vw] md:right-[-3%] md:top-[9%] md:w-[min(33vw,500px)]", opacity: 0.3, rotate: 3, depth: 0.4, float: 11 },
  { src: `${DIR}/struktur-shelter.webp`, w: 580, h: 466, kind: "line", className: "left-[-12%] bottom-[2%] w-[62vw] md:left-auto md:right-[1%] md:bottom-[-5%] md:w-[min(25vw,390px)]", opacity: 0.3, rotate: 2, depth: 0.8, float: 10 },
  // Objek 3D saluran air dengan bayangan
  { src: `${DIR}/saluran-air.webp`, w: 700, h: 397, kind: "object", className: "right-[-8%] bottom-[9%] w-[44vw] md:right-auto md:left-[1%] md:bottom-[3%] md:w-[min(23vw,350px)]", opacity: 0.85, rotate: -2, depth: 1.1, float: 8 },
  // Foto proyek sebagai kartu
  { src: `${DIR}/foto-jembatan.webp`, w: 640, h: 319, kind: "photo", className: "hidden md:block left-[5%] top-[47%] w-[min(15vw,230px)]", opacity: 0.85, rotate: -6, depth: 1.3, float: 7 },
  { src: `${DIR}/foto-rangka-atap.webp`, w: 560, h: 315, kind: "photo", className: "hidden md:block right-[6%] top-[45%] w-[min(14vw,215px)]", opacity: 0.85, rotate: 5, depth: 1.2, float: 7.5 },
];

function Layer({ piece, index, sx, sy }: { piece: Piece; index: number; sx: MotionValue<number>; sy: MotionValue<number> }) {
  const x = useTransform(sx, (v) => v * 40 * piece.depth);
  const y = useTransform(sy, (v) => v * 26 * piece.depth);
  const frame =
    piece.kind === "photo"
      ? "overflow-hidden rounded-xl border-[5px] border-white bg-white shadow-[0_28px_50px_-18px_rgba(20,20,20,0.45)]"
      : piece.kind === "object"
        ? "drop-shadow-[0_26px_22px_rgba(43,38,34,0.28)]"
        : "mix-blend-multiply";
  return (
    <motion.div className={`absolute ${piece.className}`} style={{ x, y }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 18 }}
        animate={{ opacity: piece.opacity, scale: 1, y: 0 }}
        transition={{ duration: 1.3, delay: 0.15 + index * 0.12, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="hero-float" style={{ animationDuration: `${piece.float}s`, animationDelay: `${-index * 1.3}s` }}>
          <div className={frame} style={{ transform: `rotate(${piece.rotate}deg)` }}>
            <Image src={piece.src} width={piece.w} height={piece.h} alt="" sizes="(min-width: 768px) 33vw, 88vw" className="block h-auto w-full" />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function HeroBackdrop() {
  const reduce = useReducedMotion();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 40, damping: 18 });
  const sy = useSpring(my, { stiffness: 40, damping: 18 });
  const leafX = useTransform(sx, (v) => v * -18);

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
      <div className="absolute inset-0 overflow-hidden">
        <div className="hero-grid-light absolute inset-0" />
        <div className="hero-orb hero-orb-a" />
        <div className="hero-orb hero-orb-b" />

        {PIECES.map((p, i) => (
          <Layer key={p.src} piece={p} index={i} sx={sx} sy={sy} />
        ))}

        {/* Bayangan daun samar, bergoyang pelan */}
        <motion.div className="absolute right-[-12%] top-[-14%] w-[90vw] md:w-[52vw]" style={{ x: leafX }}>
          <div className="leaf-sway origin-top-right opacity-[0.16] mix-blend-multiply">
            <Image src={`${DIR}/bayangan-daun.webp`} width={900} height={900} alt="" sizes="52vw" className="h-auto w-full" />
          </div>
        </motion.div>
        <div className="absolute bottom-[-22%] left-[-14%] hidden w-[40vw] md:block">
          <div className="leaf-sway leaf-sway-alt origin-bottom-left -scale-100 opacity-[0.08] mix-blend-multiply">
            <Image src={`${DIR}/bayangan-daun.webp`} width={900} height={900} alt="" sizes="40vw" className="h-auto w-full" />
          </div>
        </div>

        {/* Krem di tengah supaya judul dan panel tetap jelas */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_52%_58%_at_50%_45%,rgba(245,242,237,0.94),rgba(245,242,237,0.6)_55%,rgba(245,242,237,0)_80%)]" />

        {/* Garis ukur merah ala gambar kerja */}
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1440 900" preserveAspectRatio="none" fill="none" aria-hidden="true">
          <path className="hero-line-draw" pathLength={1} d="M40 842H1400" stroke="#C53B3B" strokeOpacity="0.35" strokeWidth="1" vectorEffect="non-scaling-stroke" />
          <path className="hero-line-draw hero-line-delay" pathLength={1} d="M40 828V856M1400 828V856M720 834V850" stroke="#C53B3B" strokeOpacity="0.35" strokeWidth="1" vectorEffect="non-scaling-stroke" />
          <path className="hero-line-flow" d="M86 60V840" stroke="#141414" strokeOpacity="0.12" strokeWidth="1" vectorEffect="non-scaling-stroke" />
        </svg>
      </div>
    </MotionConfig>
  );
}
