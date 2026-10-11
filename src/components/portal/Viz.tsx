"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useReducedMotion } from "framer-motion";

// Komponen visual kecil untuk dashboard Portal: angka menghitung naik, donut, dan batang. Tanpa library grafik.
// Animasi hanya sekali saat muncul dan menghormati reduced motion.

export function CountUp({ value, duration = 900 }: { value: number; duration?: number }) {
  const reduce = useReducedMotion();
  const [n, setN] = useState(value);
  const started = useRef(false);
  useEffect(() => {
    if (reduce || started.current || value === 0) return;
    started.current = true;
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / duration);
      setN(Math.round(value * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame((t) => {
      setN(0);
      tick(t);
    });
    return () => cancelAnimationFrame(raf);
  }, [value, duration, reduce]);
  return <>{n.toLocaleString("id-ID")}</>;
}

export interface Segment {
  label: string;
  value: number;
  color: string;
}

export function Donut({ segments, center, sub }: { segments: Segment[]; center: string; sub: string }) {
  const total = segments.reduce((a, s) => a + s.value, 0);
  const r = 15.9155; // keliling 100
  let acc = 0;
  return (
    <div className="flex items-center gap-5">
      <div className="donut-in relative h-32 w-32 shrink-0">
        <svg viewBox="0 0 36 36" className="h-full w-full -rotate-90">
          <circle cx="18" cy="18" r={r} fill="none" stroke="rgba(20,20,20,0.06)" strokeWidth="3.6" />
          {total > 0 &&
            segments
              .filter((s) => s.value > 0)
              .map((s) => {
                const len = (s.value / total) * 100;
                const el = (
                  <circle
                    key={s.label}
                    cx="18"
                    cy="18"
                    r={r}
                    fill="none"
                    stroke={s.color}
                    strokeWidth="3.6"
                    strokeDasharray={`${Math.max(len - 0.6, 0.4)} ${100 - Math.max(len - 0.6, 0.4)}`}
                    strokeDashoffset={-acc}
                    strokeLinecap="butt"
                  />
                );
                acc += len;
                return el;
              })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-[22px] font-extrabold leading-none">{center}</span>
          <span className="mt-1 text-[10.5px] font-semibold uppercase tracking-[0.1em] text-brand-mute">{sub}</span>
        </div>
      </div>
      <ul className="min-w-0 flex-1 space-y-1.5">
        {segments.map((s) => (
          <li key={s.label} className="flex items-center justify-between gap-3 text-[13px]">
            <span className="flex min-w-0 items-center gap-2">
              <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: s.color }} aria-hidden="true" />
              <span className="truncate text-brand-dark/80">{s.label}</span>
            </span>
            <span className="font-bold tabular-nums">{s.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Bars({ items }: { items: (Segment & { href?: string })[] }) {
  const max = Math.max(1, ...items.map((i) => i.value));
  return (
    <ul className="space-y-3">
      {items.map((it, i) => {
        const row = (
          <>
            <span className="flex justify-between gap-3 text-[13px]">
              <span className="truncate font-semibold text-brand-dark/85">{it.label}</span>
              <span className="font-bold tabular-nums">{it.value}</span>
            </span>
            <span className="mt-1.5 block h-2 overflow-hidden rounded-full bg-brand-dark/[0.06]">
              <span
                className="bar-grow block h-full rounded-full"
                style={{ width: `${Math.max((it.value / max) * 100, it.value > 0 ? 4 : 0)}%`, background: it.color, animationDelay: `${i * 90}ms` }}
              />
            </span>
          </>
        );
        return (
          <li key={it.label}>
            {it.href ? (
              <Link href={it.href} className="block rounded-md transition-opacity hover:opacity-80">
                {row}
              </Link>
            ) : (
              row
            )}
          </li>
        );
      })}
    </ul>
  );
}
