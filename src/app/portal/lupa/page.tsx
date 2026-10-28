import type { Metadata } from "next";
import Link from "next/link";
import AuthShell from "@/components/portal/AuthShell";
import { Notice, ResetRequestForm } from "@/components/portal/AuthForms";

export const metadata: Metadata = { title: "Lupa kata sandi" };

export default async function PortalForgotPage({ searchParams }: { searchParams: Promise<{ gagal?: string }> }) {
  const { gagal } = await searchParams;
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
      {gagal && (
        <div className="mb-4">
          <Notice
            state={{
              error: "Tautan atur ulang sudah kedaluwarsa, sudah dipakai, atau dibuka di browser lain. Minta tautan baru, lalu buka di browser yang sama.",
            }}
          />
        </div>
      )}
      <ResetRequestForm />
    </AuthShell>
  );
}
