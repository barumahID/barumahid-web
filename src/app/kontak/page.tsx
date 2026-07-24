import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import Section from "@/components/ui/Section";
import SectionLabel from "@/components/ui/SectionLabel";
import ContactForm from "@/components/sections/ContactForm";
import { EMAIL, WA_LINK1, WA_LINK2, IG_URL, LINKEDIN_URL, HQ_ADDRESS, VO_ADDRESS } from "@/constants";

export const metadata: Metadata = {
  title: "Kontak",
  description: "Hubungi barumahID — email, WhatsApp, Instagram, atau kirim pesan langsung dari website.",
};

export default function KontakPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-brand-dark text-white">
        <div className="absolute inset-0 hero-grid" />
        <div className="relative mx-auto max-w-[1200px] px-6 py-20 sm:py-28">
          <Reveal>
            <SectionLabel dark>Kontak</SectionLabel>
            <h1 className="mt-4 max-w-3xl text-4xl font-black tracking-tight sm:text-5xl">
              Hubungi kami
            </h1>
            <p className="mt-5 max-w-xl text-lg text-white/60">
              Tim barumahID siap membantu — kontak kami via WhatsApp, email, atau isi form di bawah.
            </p>
          </Reveal>
        </div>
      </section>

      <Section background="white">
        <div className="grid gap-12 lg:grid-cols-2">
          <Reveal>
            <h2 className="text-2xl font-extrabold text-brand-dark">Kirim Pesan</h2>
            <div className="mt-6">
              <ContactForm />
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-extrabold text-brand-dark">Kantor Pusat</h3>
                <p className="mt-2 text-sm text-brand-gray">{HQ_ADDRESS}</p>
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-brand-dark">Virtual Office</h3>
                <p className="mt-2 text-sm text-brand-gray">{VO_ADDRESS}</p>
              </div>
              <div className="space-y-3">
                <h3 className="text-lg font-extrabold text-brand-dark">Hubungi Langsung</h3>
                <p className="text-sm text-brand-gray">
                  <a href={`mailto:${EMAIL}`} className="hover:text-brand-red">{EMAIL}</a>
                </p>
                <p className="text-sm text-brand-gray">
                  Admin WA 1: <a href={WA_LINK1} target="_blank" rel="noopener noreferrer" className="font-semibold hover:text-brand-red">+62 851-5788-3292</a>
                </p>
                <p className="text-sm text-brand-gray">
                  Admin WA 2: <a href={WA_LINK2} target="_blank" rel="noopener noreferrer" className="font-semibold hover:text-brand-red">+62 896-3641-0565</a>
                </p>
              </div>
              <div className="space-y-3">
                <h3 className="text-lg font-extrabold text-brand-dark">Sosial Media</h3>
                <p className="text-sm text-brand-gray">
                  Instagram: <a href={IG_URL} target="_blank" rel="noopener noreferrer" className="font-semibold hover:text-brand-red">@barumahid</a>
                </p>
                <p className="text-sm text-brand-gray">
                  LinkedIn: <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" className="font-semibold hover:text-brand-red">@barumahID</a>
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </Section>
    </>
  );
}
