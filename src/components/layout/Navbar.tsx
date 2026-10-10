"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { NAV_ITEMS, SERVICE_LINKS } from "@/data/nav";
import { MASUK_OPTIONS } from "@/data/masuk";
import { waLink } from "@/data/site";
import ChannelIcon from "@/components/icons/ChannelIcon";

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
      aria-hidden="true"
    >
      <path d="M4 6l4 4 4-4" />
    </svg>
  );
}

function useDismiss(open: boolean, close: () => void) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) close();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, close]);
  return ref;
}

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [serviceOpen, setServiceOpen] = useState(false);
  const [masukOpen, setMasukOpen] = useState(false);
  const closeService = () => setServiceOpen(false);
  const closeMasuk = () => setMasukOpen(false);
  const serviceRef = useDismiss(serviceOpen, closeService);
  // Hover membuka menu. Klik tepat setelah hover jangan menutupnya lagi (bug klasik hover + toggle).
  const hoverOpenedAt = useRef(0);
  const masukRef = useDismiss(masukOpen, closeMasuk);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Tutup semua menu saat pindah halaman (pola "reset state saat prop berubah", tanpa effect).
  const [prevPath, setPrevPath] = useState(pathname);
  if (pathname !== prevPath) {
    setPrevPath(pathname);
    setMobileOpen(false);
    setServiceOpen(false);
    setMasukOpen(false);
  }

  // Kunci scroll body saat menu mobile terbuka.
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const solid = scrolled || mobileOpen;
  const isActive = (href: string) =>
    // "Beranda" aktif di kedua tab beranda: Konstruksi (/) dan Rent-to-Own (/rent-to-own).
    href === "/" ? pathname === "/" || pathname === "/rent-to-own" : pathname === href || pathname.startsWith(href + "/");
  const serviceActive = SERVICE_LINKS.some((s) => isActive(s.href)) || pathname === "/layanan";

  const linkCls = (active: boolean) =>
    `rounded-full px-3.5 py-2 text-[13.5px] font-semibold tracking-tight transition-colors duration-200 ${
      solid
        ? active
          ? "text-brand-red"
          : "text-brand-dark/75 hover:text-brand-dark"
        : active
          ? "text-white"
          : "text-white/70 hover:text-white"
    }`;

  return (
    <>
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,backdrop-filter] duration-300 ${
        solid ? "bg-white/95 shadow-[0_1px_0_rgba(20,20,20,0.08)] backdrop-blur-xl" : "bg-gradient-to-b from-black/45 to-transparent"
      }`}
    >
      <div className="mx-auto flex h-[68px] max-w-[1280px] items-center justify-between gap-4 px-5 md:px-10 lg:px-14">
        <Link href="/" className="flex shrink-0 items-center" aria-label="barumahID, ke beranda">
          <Image
            src={solid ? "/brand/logo-mark-red.png" : "/brand/logo-mark-white.png"}
            alt="barumahID"
            width={427}
            height={250}
            priority
            className="h-10 w-auto"
          />
        </Link>

        {/* Desktop */}
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Menu utama">
          {NAV_ITEMS.map((item) =>
            item.children ? (
              <div
                key={item.href}
                ref={serviceRef}
                className="relative"
                onMouseEnter={() => {
                  hoverOpenedAt.current = Date.now();
                  setServiceOpen(true);
                }}
                onMouseLeave={() => setServiceOpen(false)}
              >
                <button
                  type="button"
                  onClick={() => {
                    if (Date.now() - hoverOpenedAt.current < 700) return;
                    setServiceOpen((o) => !o);
                  }}
                  aria-expanded={serviceOpen}
                  aria-haspopup="true"
                  className={`${linkCls(serviceActive)} inline-flex items-center gap-1.5`}
                >
                  {item.label}
                  <Chevron open={serviceOpen} />
                </button>
                <div
                  className={`absolute left-1/2 top-full w-[560px] -translate-x-1/2 pt-3 transition-all duration-200 ${
                    serviceOpen ? "visible opacity-100" : "invisible -translate-y-1 opacity-0"
                  }`}
                >
                  <div className="grid gap-1 rounded-2xl border border-brand-dark/10 bg-white p-2 shadow-[0_24px_60px_-20px_rgba(20,20,20,0.35)]">
                    {item.children.map((c) => (
                      <Link
                        key={c.href}
                        href={c.href}
                        className={`group flex items-start gap-4 rounded-xl p-4 transition-colors hover:bg-brand-cream ${
                          isActive(c.href) ? "bg-brand-cream" : ""
                        }`}
                      >
                        <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-brand-red" aria-hidden="true" />
                        <span>
                          <span className="block text-[15px] font-bold text-brand-dark group-hover:text-brand-red">{c.label}</span>
                          <span className="mt-0.5 block text-[13px] leading-snug text-brand-gray">{c.description}</span>
                          <span className="mt-1.5 block text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-mute">
                            {c.audience}
                          </span>
                        </span>
                      </Link>
                    ))}
                    <Link
                      href="/layanan"
                      className="m-1 rounded-xl px-4 py-3 text-[13px] font-semibold text-brand-dark/70 hover:bg-brand-cream hover:text-brand-dark"
                    >
                      Lihat semua layanan →
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <Link key={item.href} href={item.href} className={linkCls(isActive(item.href))}>
                {item.label}
              </Link>
            ),
          )}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <a
            href={waLink("Halo barumahID, saya ingin konsultasi.")}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat WhatsApp barumahID"
            className={`flex h-10 w-10 items-center justify-center rounded-full border transition-colors ${
              solid
                ? "border-brand-dark/15 text-brand-dark hover:border-[#1f9d55] hover:bg-[#1f9d55] hover:text-white"
                : "border-white/25 text-white hover:bg-white/15"
            }`}
          >
            <ChannelIcon id="whatsapp" size={17} />
          </a>
          <div ref={masukRef} className="relative">
            <button
              type="button"
              onClick={() => setMasukOpen((o) => !o)}
              aria-expanded={masukOpen}
              aria-haspopup="true"
              className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[13.5px] font-bold transition-colors ${
                solid ? "bg-brand-dark text-white hover:bg-brand-red" : "bg-white text-brand-dark hover:bg-brand-cream"
              }`}
            >
              Masuk
              <Chevron open={masukOpen} />
            </button>
            <div
              className={`absolute right-0 top-full w-[320px] pt-3 transition-all duration-200 ${
                masukOpen ? "visible opacity-100" : "invisible -translate-y-1 opacity-0"
              }`}
            >
              <div className="rounded-2xl border border-brand-dark/10 bg-white p-2 shadow-[0_24px_60px_-20px_rgba(20,20,20,0.35)]">
                <p className="px-3 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-mute">Masuk sebagai</p>
                {MASUK_OPTIONS.map((o) => (
                  <Link
                    key={o.href}
                    href={o.href}
                    className="flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-[14px] font-semibold text-brand-dark hover:bg-brand-cream hover:text-brand-red"
                  >
                    {o.label}
                    <span className="text-[12px] font-medium text-brand-mute">{o.hint}</span>
                  </Link>
                ))}
                <p className="mx-3 mb-2 mt-2 border-t border-brand-dark/10 pt-3 text-[12px] leading-relaxed text-brand-gray">
                  Akun dan dashboard per peran sedang dibangun. Untuk sekarang, daftar lewat form dan tim kami menghubungi lewat WhatsApp.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setMobileOpen((o) => !o)}
          className={`flex h-11 w-11 items-center justify-center rounded-full lg:hidden ${solid ? "text-brand-dark" : "text-white"}`}
          aria-label={mobileOpen ? "Tutup menu" : "Buka menu"}
          aria-expanded={mobileOpen}
        >
          <svg width="22" height="22" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
            {mobileOpen ? <path d="M5 5l10 10M15 5L5 15" /> : <path d="M3 6.5h14M3 13.5h14" />}
          </svg>
        </button>
      </div>

    </header>
      {/* Mobile menu */}
      <div
        className={`fixed inset-x-0 bottom-0 top-[68px] z-40 overflow-y-auto bg-white transition-[opacity,visibility] duration-200 lg:hidden ${
          mobileOpen ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        <nav className="px-5 pb-10 pt-2" aria-label="Menu mobile">
          {NAV_ITEMS.map((item) =>
            item.children ? (
              <div key={item.href} className="border-b border-brand-dark/10 py-4">
                <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-brand-mute">{item.label}</p>
                <div className="mt-2 grid gap-1">
                  {item.children.map((c) => (
                    <Link
                      key={c.href}
                      href={c.href}
                      className={`rounded-xl px-3 py-3 ${isActive(c.href) ? "bg-brand-cream" : "active:bg-brand-cream"}`}
                    >
                      <span className={`block text-[17px] font-bold ${isActive(c.href) ? "text-brand-red" : "text-brand-dark"}`}>{c.label}</span>
                      <span className="block text-[13px] text-brand-gray">{c.description}</span>
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className={`block border-b border-brand-dark/10 py-4 text-[17px] font-bold ${
                  isActive(item.href) ? "text-brand-red" : "text-brand-dark"
                }`}
              >
                {item.label}
              </Link>
            ),
          )}
          <Link href="/kontak" className="block border-b border-brand-dark/10 py-4 text-[17px] font-bold text-brand-dark">
            Kontak
          </Link>
          <div className="mt-6 grid gap-3">
            <Link href="/masuk" className="rounded-full bg-brand-dark px-5 py-3.5 text-center text-[15px] font-bold text-white">
              Masuk sebagai mitra atau pelanggan
            </Link>
            <a
              href={waLink("Halo barumahID, saya ingin konsultasi.")}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-full border border-brand-dark/15 px-5 py-3.5 text-[15px] font-bold text-brand-dark"
            >
              <ChannelIcon id="whatsapp" size={17} />
              Chat WhatsApp
            </a>
          </div>
        </nav>
      </div>
    </>
  );
}
