import Image from "next/image";
import Link from "next/link";
import { signOut } from "@/app/portal/actions";
import { ROLE_LABEL, type Profile } from "@/lib/portal";

export default function PortalShell({ profile, email, children }: { profile: Profile | null; email: string; children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 border-b border-brand-dark/10 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-[1240px] items-center justify-between gap-4 px-5 md:px-8">
          <div className="flex items-center gap-3">
            <Link href="/" aria-label="barumahID, ke situs utama">
              <Image src="/brand/logo-mark-red.png" alt="barumahID" width={427} height={250} className="h-8 w-auto" />
            </Link>
            <span className="hidden h-5 w-px bg-brand-dark/15 sm:block" aria-hidden="true" />
            <Link href="/portal/dashboard" className="hidden text-[13px] font-bold uppercase tracking-[0.14em] text-brand-dark sm:block">
              Portal
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden text-right leading-tight sm:block">
              <p className="text-[13px] font-semibold text-brand-dark">{profile?.full_name || email}</p>
              <p className="text-[11.5px] text-brand-mute">{profile ? ROLE_LABEL[profile.role] : email}</p>
            </div>
            <form action={signOut}>
              <button type="submit" className="rounded-lg border border-brand-dark/15 px-3.5 py-2 text-[13px] font-semibold text-brand-dark transition-colors hover:border-brand-dark">
                Keluar
              </button>
            </form>
          </div>
        </div>
      </header>
      <div className="mx-auto max-w-[1240px] px-5 py-8 md:px-8 md:py-10">{children}</div>
    </div>
  );
}

export function SetupNotice({ title, body }: { title: string; body: string }) {
  return (
    <div className="mx-auto max-w-xl rounded-2xl border border-brand-dark/10 bg-white p-8 text-center">
      <p className="text-[18px] font-extrabold text-brand-dark">{title}</p>
      <p className="mt-2 text-[14px] leading-relaxed text-brand-gray">{body}</p>
    </div>
  );
}

/** Nomor lokal (08xx) menjadi link WhatsApp internasional (628xx). */
export function waHref(phone: string | null | undefined) {
  if (!phone) return null;
  const d = phone.replace(/\D/g, "").replace(/^0/, "62");
  return d.length >= 9 ? `https://wa.me/${d}` : null;
}
