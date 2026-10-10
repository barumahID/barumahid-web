import PageHero from "@/components/ui/PageHero";
import ButtonLink from "@/components/ui/ButtonLink";

export default function NotFound() {
  return (
    <PageHero
      label="404"
      title="Halaman ini tidak ditemukan."
      subtitle={<p>Mungkin alamatnya berubah karena website kami baru dirapikan. Coba mulai dari beranda atau pilih layanan.</p>}
      size="lg"
    >
      <ButtonLink href="/" variant="red">
        Ke beranda
      </ButtonLink>
      <ButtonLink href="/layanan" variant="outline-light" arrow={false}>
        Lihat layanan
      </ButtonLink>
    </PageHero>
  );
}
