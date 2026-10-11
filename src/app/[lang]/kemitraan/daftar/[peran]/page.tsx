import type { Metadata } from "next";
import Link from "@/i18n/Link";
import { notFound } from "next/navigation";
import PageHero from "@/components/ui/PageHero";
import LeadForm from "@/components/forms/LeadForm";
import { PARTNER_ROLES, getRole } from "@/data/roles";

export const dynamicParams = false;

export function generateStaticParams() {
  return PARTNER_ROLES.map((r) => ({ peran: r.slug }));
}

type Props = { params: Promise<{ peran: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { peran } = await params;
  const role = getRole(peran);
  if (!role) return {};
  return {
    title: `Daftar ${role.name}`,
    description: `Daftar jadi mitra barumahID sebagai ${role.name.toLowerCase()}. ${role.benefit}`,
    alternates: { canonical: `/kemitraan/daftar/${role.slug}` },
  };
}

export default async function DaftarPeranPage({ params }: Props) {
  const { peran } = await params;
  const role = getRole(peran);
  if (!role) notFound();

  return (
    <>
      <PageHero
        label="Daftar mitra"
        title={role.name}
        subtitle={<p>{role.benefit}</p>}
        size="sm"
      />
      <section className="bg-brand-cream">
        <div className="mx-auto grid max-w-[1280px] gap-10 px-5 py-14 md:px-10 md:py-20 lg:grid-cols-12 lg:px-14">
          <aside className="space-y-6 lg:col-span-4">
            <div className="rounded-3xl bg-white p-6">
              <p className="text-[13px] font-bold uppercase tracking-[0.14em] text-brand-gray">Syarat singkat</p>
              <ul className="mt-3 space-y-2">
                {role.requirements.map((q) => (
                  <li key={q} className="flex gap-2 text-[14.5px] text-brand-dark/85">
                    <span className="mt-[8px] h-1.5 w-1.5 shrink-0 rounded-full bg-brand-red" aria-hidden="true" />
                    {q}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-3xl bg-white p-6">
              <p className="text-[13px] font-bold uppercase tracking-[0.14em] text-brand-gray">Setelah daftar</p>
              <ol className="mt-3 space-y-3">
                {role.steps.map((s, i) => (
                  <li key={s} className="flex items-start gap-3 text-[14.5px] text-brand-dark">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-dark text-[12px] font-bold text-white">
                      {i + 1}
                    </span>
                    {s}
                  </li>
                ))}
              </ol>
            </div>
            <p className="text-[13.5px] text-brand-gray">
              Bukan peran ini?{" "}
              <Link href="/kemitraan#peran" className="font-bold text-brand-dark underline underline-offset-4 hover:text-brand-red">
                Lihat semua peran
              </Link>
            </p>
          </aside>
          <div className="lg:col-span-8">
            <LeadForm role={role.leadRole} tone="card" />
          </div>
        </div>
      </section>
    </>
  );
}
