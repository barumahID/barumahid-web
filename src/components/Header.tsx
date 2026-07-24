"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Logo from "./Logo";

const navItems = [
  { href: "/layanan", label: "Layanan" },
  { href: "/program-rto", label: "Program RTO" },
  { href: "/portofolio", label: "Portofolio" },
  { href: "/tentang", label: "Tentang" },
];

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-brand-gray/10 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <Link href="/" className="flex items-center" onClick={() => setOpen(false)}>
          <Logo variant="full" size={36} />
        </Link>

        <nav className="hidden items-center gap-7 text-sm font-medium text-brand-gray md:flex">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative transition hover:text-brand-dark ${
                  active ? "text-brand-dark" : ""
                }`}
              >
                {item.label}
                {active && (
                  <span className="absolute -bottom-1.5 left-0 right-0 h-0.5 bg-brand-red" />
                )}
              </Link>
            );
          })}
        </nav>

        <Link
          href="/daftar"
          className="hidden rounded-full bg-brand-red px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-brand-red/30 transition hover:bg-brand-red/90 hover:shadow-brand-red/40 hover:scale-105 md:inline-block"
        >
          Daftar Sekarang
        </Link>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-brand-dark/10 md:hidden"
          aria-label="Toggle menu"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {open ? (
              <>
                <path d="M5 5l10 10M15 5L5 15" />
              </>
            ) : (
              <>
                <path d="M3 6h14M3 10h14M3 14h14" />
              </>
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-brand-dark/10 bg-white md:hidden">
          <nav className="mx-auto flex max-w-6xl flex-col gap-1 px-6 py-4">
            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                    active
                      ? "bg-brand-dark text-white"
                      : "text-brand-gray hover:bg-brand-light"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            <Link
              href="/daftar"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-full bg-brand-red px-5 py-3 text-center text-xs font-bold uppercase tracking-wider text-white"
            >
              Daftar Sekarang
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
