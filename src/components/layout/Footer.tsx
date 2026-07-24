import Link from "next/link";
import Logo from "@/components/Logo";
import { WA_LINK1, WA_LINK2, EMAIL, IG_URL, LINKEDIN_URL, HQ_ADDRESS } from "@/constants";

const programLinks = [
  { href: "/rto", label: "Program RTO" },
  { href: "/services", label: "Layanan ConsTech" },
  { href: "/ekosistem", label: "Ekosistem" },
];

const companyLinks = [
  { href: "/tentang", label: "Tentang" },
  { href: "/mitra", label: "Mitra" },
  { href: "/rekrutmen", label: "Rekrutmen" },
  { href: "/kontak", label: "Kontak" },
];

export default function Footer() {
  return (
    <footer className="bg-brand-dark text-white/70">
      <div className="mx-auto max-w-[1200px] px-6 pt-16 pb-8">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Logo variant="full" size={34} dark />
            <p className="mt-4 text-sm leading-relaxed">
              Platform Pendamping Kepemilikan Rumah.
            </p>
            <p className="mt-1 text-xs text-white/40">
              PT Inditek Bluprim Mahaksa
            </p>
            <div className="mt-5 flex gap-3">
              <a
                href={IG_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/8 transition hover:bg-white/15"
                aria-label="Instagram barumahID"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                </svg>
              </a>
              <a
                href={LINKEDIN_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/8 transition hover:bg-white/15"
                aria-label="LinkedIn barumahID"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect x="2" y="9" width="4" height="12" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>
            </div>
          </div>

          {/* Program */}
          <div>
            <p className="mb-4 text-xs font-bold uppercase tracking-widest text-white/30">
              Program
            </p>
            <ul className="space-y-3 text-sm">
              {programLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="transition hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Perusahaan */}
          <div>
            <p className="mb-4 text-xs font-bold uppercase tracking-widest text-white/30">
              Perusahaan
            </p>
            <ul className="space-y-3 text-sm">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="transition hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Kontak */}
          <div>
            <p className="mb-4 text-xs font-bold uppercase tracking-widest text-white/30">
              Kontak
            </p>
            <ul className="space-y-3 text-sm">
              <li>
                <a href={`mailto:${EMAIL}`} className="transition hover:text-white">
                  {EMAIL}
                </a>
              </li>
              <li>
                <a href={WA_LINK1} target="_blank" rel="noopener noreferrer" className="transition hover:text-white">
                  +62 851-5788-3292
                </a>
              </li>
              <li>
                <a href={WA_LINK2} target="_blank" rel="noopener noreferrer" className="transition hover:text-white">
                  +62 896-3641-0565
                </a>
              </li>
              <li className="text-xs leading-relaxed text-white/40">
                {HQ_ADDRESS}
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 sm:flex-row">
          <p className="text-xs text-white/30">
            &copy; 2024 PT. Inditek Bluprim Mahaksa. Semua hak dilindungi.
          </p>
          <p className="text-xs font-bold text-brand-red">barumahID</p>
        </div>
      </div>
    </footer>
  );
}
