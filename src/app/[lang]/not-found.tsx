"use client";

import PageHero from "@/components/ui/PageHero";
import ButtonLink from "@/components/ui/ButtonLink";
import { useT } from "@/i18n/LangProvider";

export default function NotFound() {
  const t = useT();
  return (
    <PageHero
      label="404"
      title={t("Halaman ini tidak ditemukan.")}
      subtitle={<p>{t("Mungkin alamatnya berubah karena website kami baru dirapikan. Coba mulai dari beranda atau pilih layanan.")}</p>}
      size="lg"
    >
      <ButtonLink href="/" variant="red">
        {t("Ke beranda")}
      </ButtonLink>
      <ButtonLink href="/layanan" variant="outline-light" arrow={false}>
        {t("Lihat layanan")}
      </ButtonLink>
    </PageHero>
  );
}
