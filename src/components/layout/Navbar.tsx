"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { WA_LINK1 } from "@/constants";

const navItems = [
  { href: "/", label: "Beranda" },
  { href: "/tentang", label: "Tentang" },
  { href: "/ekosistem", label: "Ekosistem" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const isSegmentPage = ["/services", "/rto", "/mitra", "/ekosistem"].some(
    (p) => pathname.startsWith(p),
  );

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Tutup menu mobile saat pindah halaman.
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setOpen(false);
  }

  if (isSegmentPage) return null;

  return (
    <header
      className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/90 shadow-sm backdrop-blur-xl"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-[1280px] items-center justify-between px-6 md:px-10 lg:px-14 py-3.5">
        {/* Logo + brand name */}
        <Link href="/" className="flex items-center gap-2.5" aria-label="barumahID Beranda">
          <Image
            src="/Logo_Fix_barumahID.png"
            alt="barumahID"
            width={160}
            height={48}
            style={{ width: "auto", height: 48 }}
            priority
          />
          <span className={`text-lg font-bold tracking-tight transition-colors duration-300 ${
            scrolled ? "text-brand-dark" : "text-white"
          }`}>
            barumah<span className="text-brand-red">ID</span>
          </span>
        </Link>

        {/* Desktop nav — centered */}
        <nav className="hidden absolute left-1/2 -translate-x-1/2 items-center gap-7 lg:flex">
          {navItems.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-[13px] font-medium tracking-wide transition-colors duration-200 ${
                  active
                    ? scrolled ? "text-brand-dark" : "text-white"
                    : scrolled
                      ? "text-brand-gray hover:text-brand-dark"
                      : "text-white/60 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right CTAs */}
        <div className="hidden items-center gap-3 lg:flex">
          <a
            href={`${WA_LINK1}?text=${encodeURIComponent("Halo barumahID, saya ingin konsultasi.")}`}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex h-9 w-9 items-center justify-center rounded-full border transition-all duration-200 ${
              scrolled
                ? "border-brand-line text-brand-gray hover:bg-brand-dark hover:text-white hover:border-brand-dark"
                : "border-white/20 text-white/70 hover:bg-white/10 hover:text-white"
            }`}
            aria-label="WhatsApp barumahID"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
          </a>
          <Link
            href="/kontak"
            className={`text-[13px] font-medium transition-colors duration-200 ${
              scrolled
                ? "text-brand-gray hover:text-brand-dark"
                : "text-white/60 hover:text-white"
            }`}
          >
            Kontak
          </Link>
          <Link
            href="/daftar"
            className={`group inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[13px] font-medium transition-all duration-200 ${
              scrolled
                ? "bg-brand-dark text-white hover:bg-brand-red"
                : "bg-white/15 text-white backdrop-blur-sm hover:bg-white/25"
            }`}
          >
            Mulai
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="transition-transform duration-200 group-hover:translate-x-0.5">
              <path d="M3 8h10M9 4l4 4-4 4" />
            </svg>
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className={`flex h-10 w-10 items-center justify-center lg:hidden transition-colors ${
            scrolled ? "text-brand-dark" : "text-white"
          }`}
          aria-label="Toggle menu"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            {open ? <path d="M5 5l10 10M15 5L5 15" /> : <path d="M3 7h14M3 13h14" />}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={`overflow-hidden transition-all duration-300 lg:hidden ${
          open ? "max-h-[600px] border-t bg-white/95 backdrop-blur-xl" : "max-h-0"
        }`}
      >
        <nav className="mx-auto flex max-w-[1280px] flex-col px-6 md:px-10 py-6">
          {navItems.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`border-b hairline py-4 text-base transition-colors ${
                  active ? "text-brand-dark font-semibold" : "text-brand-gray hover:text-brand-dark"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          <div className="mt-6 flex flex-col gap-3">
            <a
              href={`${WA_LINK1}?text=${encodeURIComponent("Halo barumahID, saya ingin konsultasi.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border hairline-strong px-5 py-3 text-center text-sm font-medium text-brand-dark"
            >
              +62 851-5788-3292
            </a>
            <Link
              href="/daftar"
              className="rounded-full bg-brand-dark px-5 py-3 text-center text-sm font-medium text-white"
            >
              Mulai
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
