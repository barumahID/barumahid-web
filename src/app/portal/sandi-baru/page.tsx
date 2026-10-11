import type { Metadata } from "next";
import { redirect } from "next/navigation";
import AuthShell from "@/components/portal/AuthShell";
import { NewPasswordForm } from "@/components/portal/AuthForms";
import { getPortalSession } from "@/lib/portal-session";

export const metadata: Metadata = { title: "Kata sandi baru" };

// Dibuka dari tautan atur ulang kata sandi (sesi sementara dibuat di /portal/auth/callback).
export default async function PortalNewPasswordPage() {
  const { user } = await getPortalSession();
  if (!user) redirect("/portal/lupa");
  return (
    <AuthShell title="Atur kata sandi baru" subtitle={`Untuk akun ${user.email}.`}>
      <NewPasswordForm />
    </AuthShell>
  );
}
