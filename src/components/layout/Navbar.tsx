"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import Logo from "@/components/Logo";
import { WA_LINK1 } from "@/constants";

const navItems = [
  { href: "/", label: "Beranda" },
  { href: "/rto", label: "Program RTO" },
  { href: "/services", label: "Layanan" },
  { href: "/ekosistem", label: "Ekosistem" },
  { href: "/tentang", label: "Tentang" },
  { href: "/mitra", label: "Mitra" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header
      className={`sticky top-0 z-50 bg-brand-dark transition-all duration-300 ${
        scrolled ? "border-b border-white/10 shadow-lg shadow-black/20" : ""
      }`}
    >
      <div className="mx-auto flex max-w-[1200px] items-center justify-between px-6 py-3">
        <Link href="/" className="flex items-center" aria-label="barumahID Beranda">
          <Logo variant="full" size={34} dark />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative rounded-lg px-3.5 py-2 text-[13px] font-semibold transition-colors ${
                  active
                    ? "text-white"
                    : "text-white/60 hover:text-white"
                }`}
              >
                {item.label}
                {active && (
                  <span className="absolute bottom-0 left-3.5 right-3.5 h-0.5 rounded-full bg-brand-red" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Desktop CTAs */}
        <div className="hidden items-center gap-3 lg:flex">
          <a
            href={`${WA_LINK1}?text=${encodeURIComponent("Halo barumahID, saya ingin konsultasi.")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-white/20 px-5 py-2 text-[13px] font-semibold text-white transition hover:border-white/40 hover:bg-white/5"
            aria-label="Konsultasi via WhatsApp"
          >
            Konsultasi
          </a>
          <Link
            href="/daftar"
            className="rounded-lg bg-brand-red px-5 py-2 text-[13px] font-bold text-white shadow-lg shadow-brand-red/30 transition hover:bg-brand-red-dark hover:scale-[1.02]"
          >
            Daftar Gratis
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/15 text-white lg:hidden"
          aria-label="Toggle menu"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            {open ? (
              <path d="M5 5l10 10M15 5L5 15" />
            ) : (
              <path d="M3 6h14M3 10h14M3 14h14" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu — slide in */}
      <div
        className={`overflow-hidden transition-all duration-300 lg:hidden ${
          open ? "max-h-[500px] border-t border-white/10" : "max-h-0"
        }`}
      >
        <nav className="mx-auto flex max-w-[1200px] flex-col gap-1 px-6 py-4">
          {navItems.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-lg px-4 py-3 text-sm font-semibold transition ${
                  active
                    ? "bg-white/10 text-white"
                    : "text-white/60 hover:bg-white/5 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          <div className="mt-3 flex flex-col gap-2 border-t border-white/10 pt-4">
            <a
              href={`${WA_LINK1}?text=${encodeURIComponent("Halo barumahID, saya ingin konsultasi.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-white/20 px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-white/5"
              aria-label="Konsultasi via WhatsApp"
            >
              Konsultasi
            </a>
            <Link
              href="/daftar"
              className="rounded-lg bg-brand-red px-5 py-3 text-center text-sm font-bold text-white"
            >
              Daftar Gratis
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
