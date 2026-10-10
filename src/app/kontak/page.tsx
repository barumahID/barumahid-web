import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import LeadForm from "@/components/forms/LeadForm";
import ChannelGrid from "@/components/ui/ChannelGrid";
import ButtonLink from "@/components/ui/ButtonLink";
import { ADDRESSES, EMAIL, WA_ADMIN_1_LABEL, WA_ADMIN_2, WA_ADMIN_2_LABEL, waLink } from "@/data/site";

export const metadata: Metadata = {
  title: "Kontak",
  description: "Hubungi barumahID lewat WhatsApp, email, atau kirim pesan langsung dari website. Kantor pusat di Padang.",
  alternates: { canonical: "/kontak" },
};

export default function KontakPage() {
  return (
    <>
      <PageHero
        label="Kontak"
        title="Ngobrol dulu, baru putuskan."
        subtitle={<p>Admin kami membalas di jam kerja, biasanya di hari yang sama. Paling cepat lewat WhatsApp.</p>}
        size="sm"
      >
        <ButtonLink href={waLink("Halo barumahID, saya mau tanya.")} variant="whatsapp">
          Chat WhatsApp
        </ButtonLink>
      </PageHero>

      <section className="bg-brand-cream">
        <div className="mx-auto grid max-w-[1280px] gap-12 px-5 py-16 md:px-10 md:py-24 lg:grid-cols-12 lg:px-14">
          <div className="lg:col-span-7">
            <LeadForm role="pesan" tone="card" />
          </div>
          <aside className="space-y-8 lg:col-span-5">
            <div>
              <h2 className="text-[19px] font-extrabold text-brand-dark">Hubungi langsung</h2>
              <ul className="mt-4 space-y-2 text-[15px]">
                <li>
                  <a href={waLink()} target="_blank" rel="noopener noreferrer" className="font-semibold text-brand-dark hover:text-brand-red">
                    WhatsApp Admin 1: {WA_ADMIN_1_LABEL}
                  </a>
                </li>
                <li>
                  <a
                    href={waLink(undefined, WA_ADMIN_2)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-brand-dark hover:text-brand-red"
                  >
                    WhatsApp Admin 2: {WA_ADMIN_2_LABEL}
                  </a>
                </li>
                <li>
                  <a href={`mailto:${EMAIL}`} className="font-semibold text-brand-dark hover:text-brand-red">
                    {EMAIL}
                  </a>
                </li>
              </ul>
            </div>
            {[ADDRESSES.hq, ADDRESSES.vo].map((a) => (
              <div key={a.label}>
                <h2 className="text-[19px] font-extrabold text-brand-dark">{a.label}</h2>
                <address className="mt-3 not-italic text-[15px] leading-relaxed text-brand-gray">
                  <a
                    href={a.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block hover:text-brand-dark"
                    aria-label={`${a.label}: ${a.lines.join(", ")} (buka di Google Maps)`}
                  >
                    {a.lines.map((l) => (
                      <span key={l} className="block">
                        {l}
                      </span>
                    ))}
                    <span className="mt-1 block text-[13px] font-bold text-brand-red group-hover:underline">Lihat di Google Maps</span>
                  </a>
                </address>
              </div>
            ))}
          </aside>
        </div>
      </section>

      <section className="bg-brand-cream-warm">
        <div className="mx-auto max-w-[1280px] px-5 py-16 md:px-10 md:py-20 lg:px-14">
          <h2 className="text-[clamp(1.6rem,3vw,2.3rem)] font-extrabold tracking-tight text-brand-dark">Kanal resmi barumahID</h2>
          <div className="mt-8">
            <ChannelGrid />
          </div>
        </div>
      </section>
    </>
  );
}
