// Google Form resmi barumahID (dari folder form user, Okt 2026). Yang dipakai di sini hanya link responden
// (forms/d/e/.../viewform), bukan link edit. Semua sudah dicek terbuka untuk publik tanpa login.
// Form Projectlink dan Knowledges (F06, F07, F10) tidak dipakai: kedua lini itu sudah dilebur ke Jururancang.

export type FormCode =
  | "F01" | "F02" | "F03"
  | "F04" | "F04a" | "F05" | "F08" | "F09"
  | "F11" | "F12" | "F13" | "F14" | "F15" | "F16" | "F17" | "F18" | "F19";

const base = (id: string) => `https://docs.google.com/forms/d/e/${id}/viewform`;

export const GFORMS: Record<FormCode, string> = {
  // Layanan E2E (diisi klien jasa konstruksi)
  F01: base("1FAIpQLSeG8oQlnC3XlVpyOHzU5X_7EEbJp1sa5Txmzy5pklVf4qS13g"),
  F02: base("1FAIpQLSdRtC1kd3o6sReax2NrH7nn5IV-i_YfVU1y-9yCEy2k1VvEZA"),
  F03: base("1FAIpQLSeeYCaqzM_R0G0g5zUCigEPRtzXkzHSVYQZQnVCgPRYi01f3g"),
  // Kemitraan jasa konstruksi
  F04: base("1FAIpQLScYoXVvF_gdkN1ZCLPCjwBQYVv1p0abe1RF9jGsp827iy_olg"),
  F04a: base("1FAIpQLScXxw_odbDVRCHdcnq9VNq89Atq2L3fedfnnfDVEGT-axO6iw"),
  F05: base("1FAIpQLSf_MkShfMI7t6d9UpN4MKIwNLvvokBdfPWRkc6OvokQ5IuHnw"),
  F08: base("1FAIpQLSfAD5IbGhZGXEKzKO6T8rngIE2M4IGcKlmKTVjPiQcR1bqx3w"),
  F09: base("1FAIpQLSc3ctqdUEBRIhjyqfpPOXt_2rPzrZF4CvGMoF7ApyjNXmRCBA"),
  // Rent-to-Own (penyewa, penyedia kos, developer)
  F11: base("1FAIpQLSf-oMuQuB1HZWZc33hFhg5qeH9G2bqIQSxMw8vsDndxM0nGSA"),
  F12: base("1FAIpQLScrDIG__mPGU4V-q7c8Y-oZldJDSDOFD5g4lnyci3MzAhP9gw"),
  F13: base("1FAIpQLSc6WLYDAn1LB62ytQPP2E84Ap-m-QtiPkP6bVlWGQ6ZTirDoQ"),
  F14: base("1FAIpQLScnVu2bWpDzBiRwS0sg8byZto91n_QCitXSVsB1lrUEWC6KRA"),
  F15: base("1FAIpQLSdNGDZqTB_GJqJ0cdnSk7BSNcqF7n5ctUkfnD6ourjpiW7MZA"),
  F16: base("1FAIpQLSe0yG1n7XMXRDER7Tj5d0Gt0uOYwBQkhBIA1fX8wXjBI4Ujhw"),
  F17: base("1FAIpQLSdL-Xwv8PQstbABEALfMoSVJ4n_FJWWljTLrlxk9PI0d7hruw"),
  F18: base("1FAIpQLSdbfwqC-loH5QRF7-Eey-Z3r5Sz6TXh2GZXESoqGfLPll5e8A"),
  // Umum
  F19: base("1FAIpQLSdi7T0dL8shXLtg2qGRUCs0Azm9PwnK5wTyuQRaFrDk4oFdSw"),
};

/**
 * Isian otomatis (prefill) form F01 Survei Kebutuhan & Konsultasi Awal dari miniCAD. Nomor entry diambil dari
 * halaman responden form yang publik; teks pilihan harus sama persis dengan opsi di form.
 */
const F01_ENTRY = {
  kota: 1031124058,
  layanan: 192065285,
  jenisBangunan: 854335422,
  luas: 1261525533,
  budget: 1542228918,
  detail: 2063825428,
} as const;

export function f01Prefill(v: { kota?: string; layanan?: string[]; jenisBangunan?: string; luas?: string; budget?: string; detail?: string }) {
  const q: string[] = ["usp=pp_url"];
  const add = (id: number, val?: string) => val && q.push(`entry.${id}=${encodeURIComponent(val)}`);
  add(F01_ENTRY.kota, v.kota);
  (v.layanan ?? []).forEach((l) => add(F01_ENTRY.layanan, l));
  add(F01_ENTRY.jenisBangunan, v.jenisBangunan);
  add(F01_ENTRY.luas, v.luas);
  add(F01_ENTRY.budget, v.budget);
  add(F01_ENTRY.detail, v.detail?.slice(0, 1800));
  return `${GFORMS.F01}?${q.join("&")}`;
}

export interface FormLink {
  code: FormCode;
  title: string;
  body: string;
}
