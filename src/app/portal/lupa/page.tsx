import type { Metadata } from "next";
import Link from "next/link";
import AuthShell from "@/components/portal/AuthShell";
import { ResetRequestForm } from "@/components/portal/AuthForms";

export const metadata: Metadata = { title: "Lupa kata sandi" };

export default function PortalForgotPage() {
  return (
    <AuthShell
      title="Lupa kata sandi"
      subtitle="Masukkan email akun Anda. Kami kirimkan tautan untuk mengatur ulang kata sandi."
      footer={
        <Link href="/portal" className="font-bold text-brand-dark underline underline-offset-4 hover:text-brand-red">
          Kembali ke halaman masuk
        </Link>
      }
    >
      <ResetRequestForm />
    </AuthShell>
  );
}
