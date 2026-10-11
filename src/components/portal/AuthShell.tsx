import Image from "next/image";
import Link from "next/link";

// Bingkai halaman masuk/daftar Portal: panel kiri gelap dengan foto mitra, kartu form di kanan.

export default function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <aside className="relative hidden overflow-hidden bg-brand-dark lg:block">
        <Image src="/images/kemitraan/mitra-konstruksi-3.webp" alt="" fill sizes="50vw" className="object-cover opacity-45" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/50 to-brand-dark/20" aria-hidden="true" />
        <div className="relative flex h-full flex-col justify-between p-12 text-white">
          <Link href="/" aria-label="barumahID, ke situs utama">
            <Image src="/brand/logo-mark-white.png" alt="barumahID" width={427} height={250} className="h-10 w-auto" />
          </Link>
          <div className="max-w-md">
            <p className="text-[12px] font-bold uppercase tracking-[0.16em] text-brand-red">Portal barumahID</p>
            <p className="mt-3 text-[26px] font-extrabold leading-tight">Satu tempat untuk mitra dan tim barumahID.</p>
            <p className="mt-3 text-[14.5px] leading-relaxed text-white/70">
              Mitra memantau status kemitraan setelah diverifikasi. Tim barumahID memantau struktur organisasi, mitra, dan
              developer yang bergabung.
            </p>
          </div>
        </div>
      </aside>
      <main className="flex items-center justify-center px-5 py-12">
        <div className="w-full max-w-[460px]">
          <Link href="/" className="mb-8 inline-block lg:hidden" aria-label="barumahID, ke situs utama">
            <Image src="/brand/logo-mark-red.png" alt="barumahID" width={427} height={250} className="h-9 w-auto" />
          </Link>
          <h1 className="text-[24px] font-extrabold tracking-tight text-brand-dark">{title}</h1>
          <p className="mt-1.5 text-[14px] leading-relaxed text-brand-gray">{subtitle}</p>
          <div className="mt-7 rounded-2xl border border-brand-dark/10 bg-white p-6 shadow-[0_20px_50px_-30px_rgba(20,20,20,0.35)]">{children}</div>
          {footer && <div className="mt-5 text-center text-[13.5px] text-brand-gray">{footer}</div>}
        </div>
      </main>
    </div>
  );
}
