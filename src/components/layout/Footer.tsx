import Link from "next/link";
import Image from "next/image";
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
      <div className="mx-auto max-w-[1280px] px-6 md:px-10 lg:px-14 pt-24 pb-10">
        {/* Editorial closing statement */}
        <div className="mb-20 max-w-3xl">
          <p className="type-micro text-brand-red">Menuju Kepemilikan</p>
          <p className="mt-6 text-[clamp(1.6rem,3.5vw,2.6rem)] font-light leading-[1.15] tracking-tight text-white">
            Dari penyewa jadi pemilik — <span className="font-semibold">mulai perjalananmu hari ini.</span>
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/daftar"
              className="group inline-flex items-center gap-2 rounded-full bg-brand-red px-6 py-3 text-[13px] font-medium text-white transition-all hover:bg-brand-red-dark"
            >
              Mulai Sekarang
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="transition-transform group-hover:translate-x-0.5">
                <path d="M3 8h10M9 4l4 4-4 4" />
              </svg>
            </Link>
            <a
              href={`${WA_LINK1}?text=${encodeURIComponent("Halo barumahID!")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 text-[13px] font-medium text-white hover:bg-white/5 transition-colors"
            >
              WhatsApp
            </a>
          </div>
        </div>

        <div className="grid gap-10 border-t border-white/10 pt-12 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Image
              src="/Logo_Fix_barumahID.png"
              alt="barumahID"
              width={112}
              height={28}
              className="h-7 w-auto brightness-0 invert"
            />
            <p className="mt-5 text-[13px] leading-relaxed text-white/60">
              Platform pendamping kepemilikan rumah.
            </p>
            <p className="mt-1 text-[11px] text-white/30">
              PT Inditek Bluprim Mahaksa
            </p>
            <div className="mt-5 flex gap-2">
              <a
                href={IG_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/70 transition-colors hover:border-white/40 hover:text-white"
                aria-label="Instagram barumahID"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                </svg>
              </a>
              <a
                href={LINKEDIN_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/70 transition-colors hover:border-white/40 hover:text-white"
                aria-label="LinkedIn barumahID"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect x="2" y="9" width="4" height="12" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>
              <a
                href={`${WA_LINK1}?text=${encodeURIComponent("Halo barumahID!")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/70 transition-colors hover:border-white/40 hover:text-white"
                aria-label="WhatsApp barumahID"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </a>
            </div>
          </div>

          <div>
            <p className="type-micro mb-5 text-white/30">Program</p>
            <ul className="space-y-3 text-[13px]">
              {programLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-white/70 transition-colors hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="type-micro mb-5 text-white/30">Perusahaan</p>
            <ul className="space-y-3 text-[13px]">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-white/70 transition-colors hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="type-micro mb-5 text-white/30">Kontak</p>
            <ul className="space-y-3 text-[13px]">
              <li>
                <a href={`mailto:${EMAIL}`} className="text-white/70 transition-colors hover:text-white">
                  {EMAIL}
                </a>
              </li>
              <li>
                <a href={WA_LINK1} target="_blank" rel="noopener noreferrer" className="text-white/70 transition-colors hover:text-white">
                  +62 851-5788-3292
                </a>
              </li>
              <li>
                <a href={WA_LINK2} target="_blank" rel="noopener noreferrer" className="text-white/70 transition-colors hover:text-white">
                  +62 896-3641-0565
                </a>
              </li>
              <li className="text-[11px] leading-relaxed text-white/40">
                {HQ_ADDRESS}
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-3 border-t border-white/10 pt-8 sm:flex-row sm:items-center">
          <p className="text-[11px] text-white/30">
            © 2026 PT Inditek Bluprim Mahaksa
          </p>
          <p className="text-[11px] text-white/30">
            Made in Padang, Indonesia
          </p>
        </div>
      </div>
    </footer>
  );
}
