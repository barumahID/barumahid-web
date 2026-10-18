import type { Metadata } from "next";
import Image from "next/image";
import Link from "@/i18n/Link";
import { notFound } from "next/navigation";
import ButtonLink from "@/components/ui/ButtonLink";
import AreaMap from "@/components/rto/listing/AreaMap";
import FacilityIcon from "@/components/rto/listing/FacilityIcon";
import PhotoMosaic from "@/components/rto/listing/PhotoMosaic";
import { ListingRow } from "@/components/rto/listing/ListingRows";
import { SaveTextButton, ShareButton } from "@/components/rto/listing/Buttons";
import { priceMain, rp, rpShort } from "@/components/rto/listing/format";
import { listingKind, listingPath, listingPlace, listingPrice, listingRto, listingStatusLabel, type Listing } from "@/data/listings";
import {
  RTO_CONVERT_OPTIONS,
  RTO_CONVERT_YEARS,
  RTO_PATHS,
  RTO_PROGRAM_FEE,
  RTO_RATE,
  RTO_UNLOCK_MONTHS,
  RTO_UNLOCK_SCORE,
  dpPerMonth,
  maxHomePrice,
  programRent,
  saldoAfter,
} from "@/data/rto";
import { SITE, waLink } from "@/data/site";
import { getAllListings, getListing } from "@/lib/rto-listing";

// Detail listing (acuan tampilan halaman unit katalog hunian): foto mozaik + galeri, ringkasan, sorotan, fasilitas
// berikon, rincian per kategori, jalan menuju saldo DP (unit Program RTO), peta AREA perkiraan, hal yang perlu
// diketahui, dan unit lain di kota yang sama. Alamat persis TIDAK ditampilkan, cukup kelurahan dan kecamatan.
// Unit dari Portal muncul tanpa deploy ulang (data di-cache, disegarkan saat tim mengubah unit).

export async function generateStaticParams() {
  return (await getAllListings()).map((l) => ({ slug: l.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const l = await getListing(slug);
  if (!l) return {};
  const place = listingPlace(l);
  return {
    title: `${l.title}, ${place}`,
    description: `${listingKind(l)} di ${place}. ${listingRto(l) ? "Bisa ikut program Rent-to-Own barumahID. " : ""}Harga, fasilitas, dan lokasi area di listing barumahID.`,
    alternates: { canonical: `/layanan/rto/${l.slug}` },
    openGraph: l.photos[0] ? { images: [{ url: l.photos[0].src }] } : undefined,
  };
}

type Row = [string, string | number | undefined | null];

const range = (a: number, b?: number) => (b ? `${rp(a)} sampai ${rp(b)}` : rp(a));

/** Rincian per kategori, ditambah rincian khusus listing (l.rincian) */
function groups(l: Listing): { title: string; rows: Row[] }[] {
  return [...baseGroups(l), ...(l.rincian ?? [])];
}

function baseGroups(l: Listing): { title: string; rows: Row[] }[] {
  const list = (xs?: string[]) => (xs && xs.length ? xs.join(", ") : undefined);
  if (l.category === "siap-berdaya") {
    return [
      {
        title: "Sewa",
        rows: [
          ...((l.sewaPerTahun
            ? [
                ["Kontrak per tahun", rp(l.sewaPerTahun)],
                ["Setara per bulan", rp(l.sewaPerBulan)],
              ]
            : [["Sewa per bulan", range(l.sewaPerBulan, l.sewaPerBulanMaks)]]) as Row[]),
          ["Listrik dan air", l.utilitasTermasuk],
          ["Deposit", l.deposit ? rp(l.deposit) : undefined],
          ["Minimal lama sewa", l.minSewaBulan ? `${l.minSewaBulan} bulan` : undefined],
        ],
      },
      {
        title: "Unit",
        rows: [
          ["Jenis", l.kind === "kos" ? "Kos, sewa per kamar" : l.kind === "rumah" ? "Rumah sewa, per unit" : undefined],
          [l.kind === "kos" ? "Jumlah kamar" : "Jumlah unit", l.rooms],
          ["Luas bangunan", l.luasBangunan ? `${l.luasBangunan} m²` : undefined],
          ["Kamar tidur", l.kamarTidur],
          ["Kamar mandi", l.kamarMandi],
          ["Perabot", l.perabot],
        ],
      },
      {
        title: "Utilitas",
        rows: [
          ["Listrik", l.listrikVA ? `${l.listrikVA} VA${l.listrikTipe ? `, ${l.listrikTipe}` : ""}` : undefined],
          ["Air", l.air],
          ["Internet", l.internet],
        ],
      },
      { title: "Aturan penghuni", rows: [["Aturan", list(l.aturan)]] },
    ];
  }
  if (l.category === "siap-beli") {
    return [
      {
        title: "Harga",
        rows: [
          [l.status === "terjual" ? "Terjual di kisaran" : "Harga jual", range(l.hargaJual, l.hargaJualMaks)],
          ["Bisa nego", l.nego === undefined ? undefined : l.nego ? "Ya" : "Tidak"],
        ],
      },
      {
        title: "Ukuran",
        rows: [
          ["Luas tanah", l.luasTanah ? `${l.luasTanah} m²` : undefined],
          ["Luas bangunan", l.luasBangunan ? `${l.luasBangunan} m²` : undefined],
          ["Jumlah lantai", l.lantai],
          ["Kamar tidur", l.kamarTidur],
          ["Kamar mandi", l.kamarMandi],
        ],
      },
      {
        title: "Legalitas",
        rows: [
          ["Sertifikat", l.sertifikat],
          ["PBG atau IMB", l.pbg],
          ["PBB terakhir", l.pbbTerakhir],
        ],
      },
      {
        title: "Kondisi dan lokasi",
        rows: [
          ["Kondisi bangunan", l.kondisi],
          ["Tahun dibangun atau direnovasi", l.tahunBangun],
          ["Listrik", l.listrikVA ? `${l.listrikVA} VA` : undefined],
          ["Air", l.air],
          ["Lebar jalan depan", l.lebarJalan],
          ["Hadap", l.hadap],
          ["Riwayat banjir", l.riwayatBanjir],
        ],
      },
    ];
  }
  if (l.category === "rumah-tujuan") {
    return [
      {
        title: "Harga",
        rows: [
          ["Harga rumah", range(l.harga, l.hargaMaks)],
          ["DP minimal", `${l.dpMinPct ?? 10}%`],
        ],
      },
      {
        title: "Ukuran",
        rows: [
          ["Tipe", l.tipe],
          ["Luas tanah", l.luasTanah ? `${l.luasTanah} m²` : undefined],
          ["Luas bangunan", l.luasBangunan ? `${l.luasBangunan} m²` : undefined],
          ["Kamar tidur", l.kamarTidur],
          ["Kamar mandi", l.kamarMandi],
        ],
      },
    ];
  }
  return [
    {
      title: "Harga",
      rows: [
        ["Harga lahan per m²", l.hargaLahanPerM2 ? rp(l.hargaLahanPerM2) : undefined],
        ["Total harga lahan", l.hargaLahanPerM2 && l.luasLahan ? rp(l.hargaLahanPerM2 * l.luasLahan) : undefined],
        ["Kisaran nilai", l.harga ? range(l.harga, l.hargaMaks) : undefined],
      ],
    },
    {
      title: "Lahan",
      rows: [
        ["Luas lahan", l.luasLahan ? `${l.luasLahan} m²` : undefined],
        ["Dimensi dan bentuk", l.dimensi],
        ["Kontur", l.kontur],
        ["Jenis tanah", l.jenisTanah],
      ],
    },
    {
      title: "Legalitas dan aturan bangun",
      rows: [
        ["Sertifikat", l.sertifikat],
        ["Peruntukan zonasi (RDTR)", l.zonasi],
        ["KDB", l.kdb],
        ["KLB", l.klb],
        ["GSB", l.gsb],
      ],
    },
    {
      title: "Akses dan lokasi",
      rows: [
        ["Akses utilitas", list(l.aksesUtilitas)],
        ["Lebar jalan", l.lebarJalan],
        ["Riwayat banjir", l.riwayatBanjir],
        ["Rekomendasi bangunan", l.rekomendasi],
      ],
    },
  ];
}

/** Ringkasan satu baris di bawah judul */
function facts(l: Listing): string[] {
  if (l.category === "siap-berdaya") {
    return [
      l.rooms ? `${l.rooms} ${l.kind === "kos" ? "kamar" : "unit"}` : "",
      l.luasBangunan ? `${l.luasBangunan} m²` : "",
      l.kamarTidur ? `${l.kamarTidur} kamar tidur` : "",
      l.kamarMandi ? `${l.kamarMandi} kamar mandi` : "",
      l.perabot ?? "",
    ].filter(Boolean);
  }
  if (l.category === "siap-beli") {
    return [
      l.luasTanah ? `Tanah ${l.luasTanah} m²` : "",
      l.luasBangunan ? `Bangunan ${l.luasBangunan} m²` : "",
      l.kamarTidur ? `${l.kamarTidur} kamar tidur` : "",
      l.kamarMandi ? `${l.kamarMandi} kamar mandi` : "",
    ].filter(Boolean);
  }
  if (l.category === "rumah-tujuan") {
    return [
      l.tipe ?? "",
      l.luasTanah ? `Tanah ${l.luasTanah} m²` : "",
      l.luasBangunan ? `Bangunan ${l.luasBangunan} m²` : "",
      l.kamarTidur ? `${l.kamarTidur} kamar tidur` : "",
    ].filter(Boolean);
  }
  return [
    l.lantai ? `${l.lantai} lantai` : "",
    l.luasBangunan ? `Bangunan ${l.luasBangunan} m²` : "",
    l.kamarTidur ? `${l.kamarTidur} kamar tidur` : "",
    l.kamarMandi ? `${l.kamarMandi} kamar mandi` : "",
    l.luasLahan ? `Lahan ${l.luasLahan} m²` : "",
    l.dimensi ?? "",
  ].filter(Boolean);
}

const fee = Math.round(RTO_PROGRAM_FEE * 100);
const ratePct = Math.round(RTO_RATE * 100);

function Svg({ d }: { d: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="h-7 w-7 shrink-0 text-brand-dark" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  );
}

/** Catatan status di kartu harga */
function statusNote(l: Listing): string | null {
  if (l.status === "terisi")
    return l.availableFrom ? `Sedang dikontrak. Tersedia lagi mulai ${l.availableFrom}. Kamu bisa pesan duluan.` : "Unit ini sedang penuh. Kami kabari kalau ada kamar kosong.";
  if (l.status === "terjual") return "Rumah ini sudah terjual. Cari rumah serupa? Ceritakan kebutuhanmu ke tim kami.";
  if (l.status === "selesai") return "Sudah dibangun di lahan milik pemiliknya lewat jalur Siap Bangun.";
  if (l.status === "segera") return `${listingStatusLabel(l)}. Belum bisa dipesan, kami kabari saat dibuka.`;
  return null;
}

/** Tombol utama per status: teks dan pesan WhatsApp */
function primaryCta(l: Listing, waText: string): { label: string; text: string } {
  const unit = `"${l.title}" (${SITE.url}/layanan/rto/${l.slug})`;
  if (l.status === "terisi") return { label: "Kabari saya", text: `Halo barumahID, saya tertarik dengan unit ${unit}. Tolong kabari kalau sudah bisa disewa.` };
  if (l.status === "terjual") return { label: "Cari rumah serupa", text: `Halo barumahID, saya cari rumah seperti ${unit}. Bisa dibantu?` };
  if (l.status === "selesai") return { label: "Konsultasi Siap Bangun", text: `Halo barumahID, saya punya lahan dan ingin membangun seperti ${unit}. Bisa konsultasi?` };
  if (l.status === "segera") return { label: "Kabari saya", text: `Halo barumahID, saya tertarik dengan ${unit}. Tolong kabari saat sudah dibuka.` };
  if (l.category === "rumah-tujuan")
    return { label: "Tanya rumah ini", text: `Halo barumahID, saya tertarik dengan ${unit} sebagai rumah tujuan DP program RTO. Bisa dijelaskan?` };
  return { label: "Jadwalkan survei", text: waText };
}

const ICON = {
  shield: "M12 3l7 3v5c0 4.5-3 8.5-7 10-4-1.5-7-5.5-7-10V6zM9 12l2 2 4-4",
  home: "M3 11 12 4l9 7M5 9.5V20h14V9.5M10 20v-5h4v5",
  pin: "M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21ZM12 12.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z",
  plan: "M4 4h16v16H4zM4 10h6M10 4v16M14 14h6",
  key: "M15 7a4 4 0 1 1-3.9 4.9L4 19v2h3v-2h2v-2h2l1.1-1.1A4 4 0 0 1 15 7Z",
};

const PARTNER: Record<Listing["category"], { title: string; body: string }> = {
  "siap-berdaya": { title: "Mitra penyedia barumahID", body: "Unit dari jaringan mitra penyedia kos dan rumah sewa barumahID." },
  "siap-beli": { title: "Jaringan rumah barumahID", body: "Rumah dari jaringan pemilik dan developer mitra barumahID." },
  "siap-bangun": { title: "Proyek Siap Bangun", body: "Dirancang dan didampingi tim Jasa Konstruksi barumahID bersama pemilik lahan." },
  "rumah-tujuan": { title: "Developer mitra RTO", body: "Unit dari developer yang bekerja sama di program Rent-to-Own barumahID." },
};

/** Sorotan di bawah judul, menyesuaikan kategori dan status */
function highlights(l: Listing): { icon: string; title: string; body: string }[] {
  const out: { icon: string; title: string; body: string }[] = [];
  if (l.category === "rumah-tujuan") {
    out.push({ icon: ICON.key, title: "Rumah tujuan saldo DP", body: "Peserta RTO bisa memakai saldo DP dari sewa di kos mitra untuk uang muka rumah ini." });
    out.push({
      icon: ICON.shield,
      title: "Harga dicatat di MoU",
      body: `Rumah dan harganya disepakati lewat MoU di awal. Saldo dikonversi jadi DP setelah ${RTO_CONVERT_YEARS.min} sampai ${RTO_CONVERT_YEARS.max} tahun.`,
    });
  } else if (l.category === "siap-bangun") {
    out.push(
      l.status === "selesai"
        ? { icon: ICON.home, title: "Sudah berdiri", body: "Contoh nyata jalur Siap Bangun: rumah dibangun di lahan milik pemiliknya. Foto pertama rumah jadinya, sisanya render desain." }
        : { icon: ICON.plan, title: "Desain dari tim barumahID", body: "Denah dan visualisasi 3D dibuat untuk rencana ini. Foto terakhir menunjukkan kondisi bangunan saat ini." },
    );
    out.push({ icon: ICON.key, title: "Bangun bertahap", body: "Jalur Siap Bangun cocok untuk pemilik lahan yang ingin membangun sambil mengumpulkan modal." });
  } else if (l.status === "terjual") {
    out.push({ icon: ICON.key, title: "Sudah terjual", body: "Rumah ini sudah laku. Masih bisa jadi gambaran harga dan tipe rumah di area ini." });
  } else {
    out.push({ icon: ICON.shield, title: "Foto asli, bukan ilustrasi", body: "Foto diambil langsung di kamar dan rumahnya." });
    if (l.category === "siap-berdaya")
      out.push({
        icon: ICON.home,
        title: "Sewa tepat waktu dihitung untuk naik level",
        body: `${RTO_UNLOCK_MONTHS} bulan bayar tepat waktu di unit mitra jadi salah satu syarat membuka RTO.`,
      });
    if (l.category === "siap-berdaya")
      out.push({
        icon: ICON.key,
        title: "Saldo DP untuk rumah developer mitra",
        body: "Setelah ikut RTO, saldo DP dari sewa di sini dipakai untuk uang muka rumah dari developer mitra, bukan untuk unit sewa ini.",
      });
  }
  out.push({ icon: ICON.pin, title: "Alamat lengkap tidak ditampilkan", body: "Di website hanya kelurahan, kecamatan, dan area perkiraan di peta. Alamat dibagikan saat survei." });
  return out;
}

function PriceCard({ l, waText }: { l: Listing; waText: string }) {
  const price = listingPrice(l);
  const rto = listingRto(l) && l.category === "siap-berdaya";
  const note = statusNote(l);
  const cta = primaryCta(l, waText);
  return (
    <div className="rounded-2xl border border-brand-dark/10 bg-white p-6 shadow-[0_14px_36px_-18px_rgba(20,20,20,0.4)]">
      <p className="text-[12.5px] font-semibold text-brand-gray">{l.status === "terjual" ? "Terjual di kisaran" : price.label}</p>
      <p className="text-brand-dark">
        <span className="text-[24px] font-extrabold">{priceMain(price)}</span>
        {price.suffix && price.value !== null && <span className="text-[15px] text-brand-gray"> {price.suffix.replace("/", "/ ")}</span>}
      </p>
      {l.category === "siap-berdaya" && l.sewaPerTahun && <p className="text-[13px] text-brand-gray">Setara {rp(l.sewaPerBulan)} per bulan</p>}
      {note && <p className="mt-3 rounded-lg bg-brand-cream px-3 py-2 text-[13px] leading-snug text-brand-dark">{note}</p>}
      {rto && (
        <dl className="mt-4 overflow-hidden rounded-xl border border-brand-dark/15 text-[13.5px]">
          <div className="flex items-center justify-between gap-3 px-4 py-3">
            <dt className="text-brand-gray">Sewa program RTO</dt>
            <dd className="font-bold text-brand-dark">{rp(programRent(l.sewaPerBulan))}</dd>
          </div>
          <div className="flex items-center justify-between gap-3 border-t border-brand-dark/15 px-4 py-3">
            <dt className="text-brand-gray">Jadi saldo DP</dt>
            <dd className="font-bold text-credit">{rp(dpPerMonth(l.sewaPerBulan))}/bulan</dd>
          </div>
          <div className="flex items-center justify-between gap-3 border-t border-brand-dark/15 px-4 py-3">
            <dt className="text-brand-gray">Saldo setelah {RTO_CONVERT_YEARS.default} tahun</dt>
            <dd className="font-bold text-credit">±{rpShort(saldoAfter(l.sewaPerBulan, RTO_CONVERT_YEARS.default))}</dd>
          </div>
        </dl>
      )}
      {l.category === "siap-beli" && l.status !== "terjual" && (
        <p className="mt-4 rounded-xl bg-brand-cream px-4 py-3 text-[13px] text-brand-dark/80">
          Listing jual beli. Kami pertemukan pembeli dan penjual, lalu bantu hitung DP, cicilan KPR, BPHTB, dan biaya notaris.
        </p>
      )}
      {l.category === "rumah-tujuan" && (
        <p className="mt-4 rounded-xl bg-brand-cream px-4 py-3 text-[13px] leading-snug text-brand-dark/80">
          Rumah tujuan program RTO. Mulai dari ngekos di unit mitra, lalu saldo DP dari sewa dipakai untuk uang muka rumah ini.
        </p>
      )}
      <div className="mt-5 grid gap-2.5">
        <ButtonLink href={waLink(cta.text)} variant="red" arrow={false} className="w-full">
          {cta.label}
        </ButtonLink>
        {l.category === "siap-berdaya" || l.category === "rumah-tujuan" ? (
          <ButtonLink href="/portal/daftar?akun=penyewa" variant="outline-dark" arrow={false} className="w-full">
            Buat akun penyewa
          </ButtonLink>
        ) : (
          <ButtonLink href={`/layanan/rto#${listingPath(l)}`} variant="outline-dark" arrow={false} className="w-full">
            Pelajari jalur {RTO_PATHS.find((p) => p.id === listingPath(l))?.name}
          </ButtonLink>
        )}
      </div>
      {l.status === "tersedia" && <p className="mt-3 text-center text-[12.5px] text-brand-gray">Belum ada pembayaran saat menjadwalkan survei.</p>}
      {rto && (
        <p className="mt-4 border-t border-brand-dark/10 pt-4 text-[12.5px] leading-relaxed text-brand-gray">
          Saldo DP mulai dicatat setelah RTO terbuka: KTP terverifikasi, {RTO_UNLOCK_MONTHS} bulan sewa tepat waktu, dan skor minimal {RTO_UNLOCK_SCORE}.
          Sewa program sudah termasuk biaya program {fee}%. Saldo DP dipakai untuk rumah dari developer mitra, bukan unit ini.
        </p>
      )}
    </div>
  );
}

export default async function ListingDetailPage({ params }: Props) {
  const { slug } = await params;
  const all = await getAllListings();
  const l = all.find((x) => x.slug === slug);
  if (!l) notFound();

  const path = RTO_PATHS.find((p) => p.id === listingPath(l));
  const place = listingPlace(l);
  const rto = listingRto(l) && l.category === "siap-berdaya";
  const facilities = l.fasilitas ?? [];
  const others = all.filter((x) => x.city === l.city && x.slug !== l.slug).slice(0, 10);
  const waText = `Halo barumahID, saya tertarik dengan unit "${l.title}" (${SITE.url}/layanan/rto/${l.slug}). Bisa jadwalkan survei?`;
  const dp = l.category === "siap-berdaya" ? dpPerMonth(l.sewaPerBulan) : 0;
  const line = facts(l);

  return (
    <div className="bg-brand-cream pt-[68px]">
      <div className="mx-auto max-w-[1180px] px-5 pb-16 md:px-10">
        <nav aria-label="Lokasi halaman" className="flex flex-wrap items-center gap-1.5 pt-5 text-[13px] text-brand-gray">
          <Link href="/layanan/rto" className="hover:text-brand-dark hover:underline">
            Rent-to-Own
          </Link>
          <span aria-hidden>›</span>
          <Link href="/layanan/rto/cari" className="hover:text-brand-dark hover:underline">
            Cari unit
          </Link>
          <span aria-hidden>›</span>
          <Link href={`/layanan/rto/cari?kota=${encodeURIComponent(l.city)}`} className="hover:text-brand-dark hover:underline">
            {l.city}
          </Link>
        </nav>

        <div className="mt-3 flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
          <h1 className="text-[clamp(1.45rem,2.6vw,2rem)] font-extrabold leading-tight tracking-tight text-brand-dark">{l.title}</h1>
          <div className="-mr-3 flex">
            <ShareButton title={l.title} />
            <SaveTextButton slug={l.slug} title={l.title} />
          </div>
        </div>

        <div className="mt-5">
          <PhotoMosaic photos={l.photos} />
        </div>

        <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_370px] lg:gap-16">
          <div className="min-w-0">
            <h2 className="text-[20px] font-extrabold text-brand-dark md:text-[22px]">
              {listingKind(l)} di {place}
            </h2>
            {line.length > 0 && <p className="mt-1 text-[15px] text-brand-gray">{line.join(" · ")}</p>}
            <div className="mt-3 flex flex-wrap gap-2">
              {path && <span className="rounded-full bg-brand-dark px-3 py-1 text-[12px] font-bold text-white">{path.name}</span>}
              <span className="rounded-full bg-white px-3 py-1 text-[12px] font-bold text-brand-dark">{listingStatusLabel(l)}</span>
            </div>

            {rto && (
              <a
                href="#jalan-rto"
                className="mt-6 flex items-center gap-5 rounded-2xl border border-brand-dark/10 bg-white px-5 py-4 transition-shadow hover:shadow-[0_10px_28px_-16px_rgba(20,20,20,0.45)] md:px-6"
              >
                <span className="flex shrink-0 items-center gap-1.5 text-[15px] font-extrabold leading-tight text-brand-dark">
                  <span className="h-2 w-2 rounded-full bg-brand-red" />
                  Program
                  <br />
                  RTO
                </span>
                <span className="min-w-0 flex-1 text-[14px] leading-snug text-brand-dark">
                  Ngekos di sini bisa jadi jalan menuju rumah sendiri. {ratePct}% sewa program jadi saldo DP atas namamu, untuk rumah dari developer mitra.
                </span>
                <span className="hidden shrink-0 text-right sm:block">
                  <span className="block text-[17px] font-extrabold text-credit">{rp(dp)}</span>
                  <span className="block text-[11.5px] text-brand-gray">saldo DP/bulan</span>
                </span>
              </a>
            )}

            <div className="mt-6 lg:hidden">
              <PriceCard l={l} waText={waText} />
            </div>

            <div className="mt-8 flex items-center gap-4 border-t border-brand-dark/10 pt-6">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-brand-dark">
                <Image src="/brand/logo-mark-white.png" alt="" width={427} height={250} className="h-auto w-7" />
              </span>
              <div>
                <p className="text-[15px] font-bold text-brand-dark">{PARTNER[l.category].title}</p>
                <p className="text-[13.5px] text-brand-gray">{PARTNER[l.category].body}</p>
              </div>
            </div>

            <ul className="mt-6 space-y-6 border-y border-brand-dark/10 py-7">
              {highlights(l).map((h) => (
                <li key={h.title} className="flex gap-4">
                  <Svg d={h.icon} />
                  <div>
                    <p className="text-[15px] font-bold text-brand-dark">{h.title}</p>
                    <p className="text-[14px] text-brand-gray">{h.body}</p>
                  </div>
                </li>
              ))}
            </ul>

            {l.description && (
              <section className="border-b border-brand-dark/10 py-8">
                <h2 className="text-[20px] font-extrabold text-brand-dark">Tentang unit ini</h2>
                <p className="mt-4 whitespace-pre-line text-[15.5px] leading-relaxed text-brand-dark/80">{l.description}</p>
              </section>
            )}

            {facilities.length > 0 && (
              <section className="border-b border-brand-dark/10 py-8">
                <h2 className="text-[20px] font-extrabold text-brand-dark">Fasilitas</h2>
                <ul className="mt-5 grid gap-x-8 gap-y-4 sm:grid-cols-2">
                  {facilities.map((f) => (
                    <li key={f} className="flex items-center gap-4 text-[15px] text-brand-dark">
                      <FacilityIcon name={f} />
                      {f}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {(() => {
              const shown = groups(l)
                .map((g) => ({ ...g, rows: g.rows.filter(([, v]) => v !== undefined && v !== null && v !== "") }))
                .filter((g) => g.rows.length > 0);
              if (!shown.length) return null;
              return (
                <section className="border-b border-brand-dark/10 py-8">
                  <h2 className="text-[20px] font-extrabold text-brand-dark">Rincian</h2>
                  <div className="mt-5 grid gap-4 md:grid-cols-2">
                    {shown.map((g) => (
                      <div key={g.title} className="rounded-2xl border border-brand-dark/10 bg-white p-5">
                        <h3 className="text-[14px] font-extrabold text-brand-dark">{g.title}</h3>
                        <dl className="mt-3 divide-y divide-brand-dark/10">
                          {g.rows.map(([k, v]) => (
                            <div key={k} className="flex justify-between gap-4 py-2.5 text-[14px]">
                              <dt className="text-brand-gray">{k}</dt>
                              <dd className="text-right font-semibold text-brand-dark">{v}</dd>
                            </div>
                          ))}
                        </dl>
                      </div>
                    ))}
                  </div>
                </section>
              );
            })()}

            {l.nearby && l.nearby.length > 0 && (
              <section className="border-b border-brand-dark/10 py-8">
                <h2 className="text-[20px] font-extrabold text-brand-dark">Sekitar unit</h2>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {l.nearby.map((n) => (
                    <li key={n} className="rounded-full bg-white px-3.5 py-1.5 text-[13px] text-brand-dark">
                      {n}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {rto && l.category === "siap-berdaya" && (
              <section id="jalan-rto" className="scroll-mt-24 py-8">
                <h2 className="text-[20px] font-extrabold text-brand-dark">Dari sewa ke saldo DP</h2>
                <p className="mt-1 text-[14px] text-brand-gray">Ilustrasi kalau kamu tinggal di unit ini lalu ikut program RTO.</p>
                <ol className="mt-5 grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                  {[
                    { k: `Bulan 1 sampai ${RTO_UNLOCK_MONTHS}`, t: "Sewa biasa", b: `${rp(l.sewaPerBulan)}/bulan, bayar tepat waktu, isi Skor Siap Punya Rumah.` },
                    {
                      k: "RTO terbuka",
                      t: "Kontrak RTO dan MoU",
                      b: `Pilih rumah dari developer mitra. Sewa program ${rp(programRent(l.sewaPerBulan))}/bulan, termasuk biaya program ${fee}%.`,
                    },
                    {
                      k: `${RTO_CONVERT_YEARS.min} sampai ${RTO_CONVERT_YEARS.max} tahun`,
                      t: "Saldo jadi DP",
                      b: `${rp(dp)} tercatat tiap bulan, lalu dikonversi jadi DP rumah tujuan sesuai jadwal di MoU.`,
                    },
                  ].map((s, i) => (
                    <li key={s.k} className="rounded-2xl border border-brand-dark/10 bg-white p-5">
                      <span className="grid h-7 w-7 place-items-center rounded-full bg-brand-red text-[12px] font-extrabold text-white">{i + 1}</span>
                      <p className="mt-3 text-[11.5px] font-bold uppercase tracking-wider text-brand-gray">{s.k}</p>
                      <p className="mt-0.5 text-[15px] font-extrabold text-brand-dark">{s.t}</p>
                      <p className="mt-1 text-[13.5px] leading-snug text-brand-gray">{s.b}</p>
                    </li>
                  ))}
                </ol>
                <div className="mt-5 rounded-2xl bg-brand-dark p-5 text-white md:p-6">
                  <p className="text-[13px] font-semibold text-white/60">Saldo DP saat konversi, dan rumah yang DP 10%-nya tertutup</p>
                  <div className="mt-4 space-y-3">
                    {RTO_CONVERT_OPTIONS.map((y) => {
                      const s = saldoAfter(l.sewaPerBulan, y);
                      return (
                        <div key={y} className="grid grid-cols-[64px_1fr_auto] items-center gap-3 text-[13.5px]">
                          <span className="text-white/70">{y} tahun</span>
                          <span className="h-2.5 overflow-hidden rounded-full bg-white/10">
                            <span className="block h-full rounded-full bg-brand-red" style={{ width: `${(y / RTO_CONVERT_YEARS.max) * 100}%` }} />
                          </span>
                          <span className="text-right">
                            <span className="block font-extrabold tabular-nums">{rpShort(s)}</span>
                            <span className="block text-[11.5px] text-white/55">rumah s.d. {rpShort(maxHomePrice(s, 10))}</span>
                          </span>
                        </div>
                      );
                    })}
                  </div>
                  <p className="mt-4 text-[12px] leading-relaxed text-white/50">
                    Tanpa channel tambahan, dengan harga sewa hari ini. Saldo DP adalah dana titipan, bukan simpanan bank.{" "}
                    <Link href="/layanan/rto#simulasi" className="font-bold text-white/80 underline underline-offset-4">
                      Hitung versimu di simulasi DP
                    </Link>
                  </p>
                </div>
              </section>
            )}
          </div>

          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <PriceCard l={l} waText={waText} />
            </div>
          </aside>
        </div>

        <section className="mt-2 border-t border-brand-dark/10 py-10">
          <h2 className="text-[20px] font-extrabold text-brand-dark">Lokasi</h2>
          <p className="mt-1 text-[15px] text-brand-gray">{place}</p>
          {l.approx ? (
            <div className="mt-5 h-[320px] overflow-hidden rounded-2xl md:h-[420px]">
              <AreaMap lat={l.approx.lat} lng={l.approx.lng} />
            </div>
          ) : (
            <p className="mt-4 rounded-2xl bg-white px-5 py-4 text-[14px] text-brand-gray">Titik peta menyusul setelah survei lokasi.</p>
          )}
          <p className="mt-3 text-[13px] text-brand-gray">
            {l.approx ? "Lingkaran di peta adalah area perkiraan. " : ""}Alamat lengkap dibagikan saat jadwal survei.
          </p>
        </section>

        <section className="border-t border-brand-dark/10 py-10">
          <h2 className="text-[20px] font-extrabold text-brand-dark">Hal yang perlu diketahui</h2>
          <div className="mt-6 grid gap-8 md:grid-cols-3">
            {[
              l.category === "siap-berdaya"
                ? {
                    t: "Sebelum sewa",
                    items: ["Survei unit dulu bersama tim atau pemilik.", "Jangan transfer apa pun sebelum survei dan tanda tangan Perjanjian Sewa.", "Ketentuan sewa tertulis di Perjanjian Sewa."],
                  }
                : l.category === "rumah-tujuan"
                  ? {
                      t: "Sebelum memilih rumah",
                      items: ["Survei lokasi dan unit bersama tim.", "Unit, harga, dan jadwal konversi dicatat di MoU sejak awal.", "Keputusan KPR tetap ada di bank."],
                    }
                  : l.category === "siap-beli"
                  ? {
                      t: "Sebelum membeli",
                      items: ["Cek langsung rumah dan dokumennya bersama tim.", "Jangan transfer apa pun sebelum dokumen diperiksa.", "Kami bantu hitung DP, KPR, BPHTB, dan biaya notaris."],
                    }
                  : {
                      t: "Sebelum membangun",
                      items: ["Pastikan lahan dan dokumennya atas nama pemilik.", "Rancangan, RAB, dan jadwal dibahas dulu bersama tim.", "Pembangunan bertahap sesuai modal yang terkumpul."],
                    },
              {
                t: "Program RTO",
                items: [
                  `Buka RTO setelah ${RTO_UNLOCK_MONTHS} bulan tepat waktu dan skor minimal ${RTO_UNLOCK_SCORE}.`,
                  "Saldo DP dipantau di dashboard penyewa.",
                  "Program masih tahap persiapan, ketentuan final di Kontrak RTO.",
                ],
              },
              {
                t: "Data dan bantuan",
                items: ["Data penyewa dilindungi sesuai kebijakan privasi.", "Ada kendala dengan unit? Hubungi admin barumahID.", "Baca syarat dan ketentuan sebelum daftar."],
              },
            ].map((c) => (
              <div key={c.t}>
                <h3 className="text-[15px] font-bold text-brand-dark">{c.t}</h3>
                <ul className="mt-3 space-y-2 text-[14px] leading-snug text-brand-gray">
                  {c.items.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="mt-6 text-[13.5px]">
            <Link href="/layanan/rto/panduan#penyewa" className="font-bold text-brand-dark underline underline-offset-4 hover:text-brand-red">
              Panduan penyewa
            </Link>
            <span className="mx-2 text-brand-mute">·</span>
            <Link href="/syarat-ketentuan" className="font-bold text-brand-dark underline underline-offset-4 hover:text-brand-red">
              Syarat dan ketentuan
            </Link>
          </p>
        </section>

        {others.length > 0 && (
          <section className="border-t border-brand-dark/10 py-10">
            <ListingRow title={`Unit lain di ${l.city}`} href={`/layanan/rto/cari?kota=${encodeURIComponent(l.city)}`} items={others} />
          </section>
        )}
      </div>
    </div>
  );
}
