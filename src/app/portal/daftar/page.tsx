import type { Metadata } from "next";
import Link from "next/link";
import AuthShell from "@/components/portal/AuthShell";
import { SignupForm } from "@/components/portal/AuthForms";

export const metadata: Metadata = { title: "Buat akun" };

export default async function PortalSignupPage({ searchParams }: { searchParams: Promise<{ akun?: string }> }) {
  const { akun } = await searchParams;
  return (
    <AuthShell
      title="Buat akun"
      subtitle="Penyewa: pantau level, sewa, dan saldo DP program Rent-to-Own. Mitra: dashboard aktif setelah data Anda diverifikasi tim barumahID."
      footer={
        <>
          Sudah punya akun?{" "}
          <Link href="/portal" className="font-bold text-brand-dark underline underline-offset-4 hover:text-brand-red">
            Masuk
          </Link>
        </>
      }
    >
      <SignupForm initial={akun === "mitra" ? "mitra" : "penyewa"} />
    </AuthShell>
  );
}
