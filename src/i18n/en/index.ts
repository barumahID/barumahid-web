import { COMMON } from "./common";
import { BERANDA } from "./beranda";
import { CONTECH } from "./contech";
import { FORMS_EN } from "./forms";
import { EKOSISTEM } from "./ekosistem";
import { SEMESTA_EN } from "./semesta";
import { KARIER } from "./karier";
import { KEMITRAAN } from "./kemitraan";
import { DENAH_EN } from "./denah";

// Kamus Indonesia -> Inggris. Kuncinya teks Indonesia persis seperti di kode/data (lihat src/i18n/t.ts).
export const EN: Record<string, string> = {
  ...FORMS_EN,
  ...EKOSISTEM,
  ...SEMESTA_EN,
  ...KARIER,
  ...KEMITRAAN,
  ...BERANDA,
  ...CONTECH,
  ...DENAH_EN,
  ...COMMON,
};

// Rute yang sudah diterjemahkan penuh. Rute lain di /en tetap tampil dalam bahasa Indonesia dengan
// pemberitahuan kecil (TranslationNotice) sampai terjemahannya selesai. "/x/*" = semua di bawah /x.
export const TRANSLATED_PATHS = ["/", "/layanan/contech", "/tentang", "/rekrutmen", "/kemitraan"];
