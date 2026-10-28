import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import AuthShell from "@/components/portal/AuthShell";
import { LoginForm, Notice } from "@/components/portal/AuthForms";
import { getPortalSession } from "@/lib/portal-session";
import { portalConfigured } from "@/lib/supabase/server";

export const metadata: Metadata = { title: { absolute: "Masuk | Portal barumahID" } };

/** Pesan dari tautan email (lihat /portal/auth/callback) */
const LINK_NOTICE: Record<string, { error?: string; message?: string }> = {
  konfirmasi: { message: "Email Anda sudah terkonfirmasi. Silakan masuk dengan email dan kata sandi." },
  kedaluwarsa: { error: "Tautan sudah kedaluwarsa atau sudah dipakai. Kalau email sudah dikonfirmasi, silakan masuk." },
  gagal: { error: "Tautan tidak bisa dipakai. Silakan masuk, atau hubungi admin barumahID kalau tetap gagal." },
};

export default async function PortalLoginPage({ searchParams }: { searchParams: Promise<{ konfirmasi?: string; gagal?: string }> }) {
  if (portalConfigured()) {
    const { user } = await getPortalSession();
    if (user) redirect("/portal/dashboard");
  }
  const q = await searchParams;
  const notice = q.konfirmasi ? LINK_NOTICE.konfirmasi : q.gagal === "kedaluwarsa" ? LINK_NOTICE.kedaluwarsa : q.gagal ? LINK_NOTICE.gagal : null;
  return (
    <AuthShell
      title="Masuk ke Portal"
      subtitle="Untuk penyewa program Rent-to-Own, mitra barumahID, dan tim internal barumahID."
      footer={
        <>
          Belum punya akun?{" "}
          <Link href="/portal/daftar" className="font-bold text-brand-dark underline underline-offset-4 hover:text-brand-red">
            Buat akun
          </Link>
        </>
      }
    >
      {notice && (
        <div className="mb-4">
          <Notice state={notice} />
        </div>
      )}
      <LoginForm />
    </AuthShell>
  );
}
