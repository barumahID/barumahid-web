import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import AuthShell from "@/components/portal/AuthShell";
import { LoginForm } from "@/components/portal/AuthForms";
import { getPortalSession } from "@/lib/portal-session";
import { portalConfigured } from "@/lib/supabase/server";

export const metadata: Metadata = { title: { absolute: "Masuk | Portal barumahID" } };

export default async function PortalLoginPage() {
  if (portalConfigured()) {
    const { user } = await getPortalSession();
    if (user) redirect("/portal/dashboard");
  }
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
      <LoginForm />
    </AuthShell>
  );
}
