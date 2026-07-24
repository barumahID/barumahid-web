import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="bg-brand-dark text-brand-light/70">
      <div className="mx-auto max-w-6xl px-6 pt-16 pb-12">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Logo variant="full" size={36} dark />
            <p className="mt-3 max-w-xs text-sm leading-relaxed">
              ConsTech, PropTech, dan GreenTech dari Padang.
              <br />
              PT Inditek Bluprim Mahaksa.
            </p>
            <a
              href="#daftar"
              className="mt-6 inline-block rounded-full border border-white/20 px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-white/10 hover:border-white/40"
            >
              Daftar Sekarang
            </a>
          </div>

          {/* Links */}
          <div>
            <p className="mb-4 text-xs font-bold uppercase tracking-widest text-white/30">
              Navigasi
            </p>
            <ul className="space-y-3 text-sm">
              <li><a href="#layanan" className="transition hover:text-white hover:underline underline-offset-4 decoration-brand-red">Layanan LBAG</a></li>
              <li><a href="#program-rto" className="transition hover:text-white hover:underline underline-offset-4 decoration-brand-red">Program RTO</a></li>
              <li><a href="#daftar" className="transition hover:text-white hover:underline underline-offset-4 decoration-brand-red">Daftar</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="mb-4 text-xs font-bold uppercase tracking-widest text-white/30">
              Kontak
            </p>
            <ul className="space-y-4 text-sm">
              <li className="flex items-center gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/8">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                </span>
                <a href="https://wa.me/6285157883292" className="transition hover:text-white">
                  +62 851-5788-3292
                </a>
              </li>
              <li className="flex items-center gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/8">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="M2 8l10 6 10-6" />
                  </svg>
                </span>
                <a href="mailto:barumahid@gmail.com" className="transition hover:text-white">
                  barumahid@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/8">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" />
                    <circle cx="12" cy="12" r="4" />
                    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                  </svg>
                </span>
                <a
                  href="https://instagram.com/barumahid"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition hover:text-white"
                >
                  @barumahid
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 sm:flex-row">
          <p className="text-xs text-white/20">
            © {new Date().getFullYear()} PT Inditek Bluprim Mahaksa. Semua hak cipta dilindungi.
          </p>
          <p className="text-xs text-white/15">Padang · Sumatera Barat</p>
        </div>
      </div>
    </footer>
  );
}
