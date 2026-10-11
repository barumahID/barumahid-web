import Link from "next/link";
import Image from "next/image";
import {
  ADDRESSES,
  EMAIL,
  SITE,
  WA_ADMIN_1_LABEL,
  WA_ADMIN_2,
  WA_ADMIN_2_LABEL,
  activeChannels,
  waLink,
} from "@/data/site";
import { SERVICE_LINKS } from "@/data/nav";
import { ARTICLES } from "@/data/articles";
import ChannelIcon from "@/components/icons/ChannelIcon";
import PtMark from "@/components/brand/PtMark";

const companyLinks = [
  { href: "/tentang", label: "Tentang kami" },
  ...(ARTICLES.length > 0 ? [{ href: "/artikel", label: "Artikel" }] : []),
  { href: "/rekrutmen", label: "Karier" },
  { href: "/kontak", label: "Kontak" },
  { href: "/kebijakan-privasi", label: "Kebijakan privasi" },
];

export default function Footer() {
  const channels = activeChannels();
  return (
    <footer className="border-t border-white/10 bg-brand-dark text-white/70">
      <div className="mx-auto max-w-[1280px] px-5 pb-10 pt-16 md:px-10 md:pt-20 lg:px-14">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Image src="/brand/logo-mark-white.png" alt="barumahID" width={427} height={250} className="h-12 w-auto" />
            <p className="mt-5 max-w-xs text-[14px] leading-relaxed text-white/65">
              Platform Jasa Konstruksi dan Pendamping Kepemilikan Rumah
            </p>
            <ul className="mt-6 flex flex-wrap gap-2" aria-label="Kanal resmi barumahID">
              {channels.map((c) => (
                <li key={c.id}>
                  <a
                    href={c.href}
                    target={c.id === "email" ? undefined : "_blank"}
                    rel={c.id === "email" ? undefined : "noopener noreferrer"}
                    aria-label={`${c.label} ${c.handle}`}
                    title={`${c.label} (${c.handle})`}
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-white/75 transition-colors hover:border-white/50 hover:text-white"
                  >
                    <ChannelIcon id={c.id} size={18} />
                  </a>
                </li>
              ))}
            </ul>
            {/* Logo PT: simbol saja (putih di latar gelap), tulisan pakai font situs supaya proporsional (arahan user) */}
            <div className="mt-8 flex items-center gap-3.5 border-t border-white/10 pt-6">
              <PtMark onDark />
              <div className="leading-tight">
                <p className="text-[10.5px] font-semibold uppercase tracking-[0.18em] text-white/40">Dinaungi oleh</p>
                <p className="mt-1 text-[14px] font-bold text-white/90">{SITE.company}</p>
                <p className="mt-0.5 text-[12px] text-white/45">
                  make it. <span className="font-semibold text-white/60">Future.</span>
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-10 sm:grid-cols-3 lg:col-span-8">
            <div>
              <p className="type-micro mb-5 text-white/35">Layanan</p>
              <ul className="space-y-3 text-[14px]">
                {SERVICE_LINKS.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-white/75 transition-colors hover:text-white">
                      {l.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link href="/layanan/rto#listing" className="text-white/75 transition-colors hover:text-white">
                    Listing rumah
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <p className="type-micro mb-5 text-white/35">Perusahaan</p>
              <ul className="space-y-3 text-[14px]">
                {companyLinks.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-white/75 transition-colors hover:text-white">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="type-micro mb-5 text-white/35">Kontak</p>
              <ul className="space-y-3 text-[14px]">
                <li>
                  <a href={`mailto:${EMAIL}`} className="text-white/75 transition-colors hover:text-white">
                    {EMAIL}
                  </a>
                </li>
                <li>
                  <a href={waLink()} target="_blank" rel="noopener noreferrer" className="text-white/75 transition-colors hover:text-white">
                    WA {WA_ADMIN_1_LABEL}
                  </a>
                </li>
                <li>
                  <a
                    href={waLink(undefined, WA_ADMIN_2)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/75 transition-colors hover:text-white"
                  >
                    WA {WA_ADMIN_2_LABEL}
                  </a>
                </li>
              </ul>
              <div className="mt-6 space-y-4 text-[12.5px] leading-relaxed text-white/50">
                {[ADDRESSES.hq, ADDRESSES.vo].map((a) => (
                  <address key={a.label} className="not-italic">
                    <a
                      href={a.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group block transition-colors hover:text-white"
                      title="Buka di Google Maps"
                      aria-label={`${a.label}: ${a.lines.join(", ")} (buka di Google Maps)`}
                    >
                      <span className="block font-semibold text-white/70 group-hover:text-white">{a.label}</span>
                      {a.lines.map((line) => (
                        <span key={line} className="block">
                          {line}
                        </span>
                      ))}
                    </a>
                  </address>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-white/10 pt-8 text-[12px] text-white/40 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {SITE.company}. Hak cipta dilindungi.</p>
          <p>
            <Link href="/kebijakan-privasi" className="hover:text-white">
              Kebijakan privasi
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
