// Generator peta Indonesia untuk halaman ConsTech.
// Cara pakai (sekali jalan, tidak perlu masuk package.json):
//   mkdir -p /tmp/mapgen && cd /tmp/mapgen && npm i world-atlas@2 topojson-client@3 d3-geo@3
//   cp <repo>/scripts/gen-indonesia-map.mjs /tmp/mapgen/ && node gen-indonesia-map.mjs <repo>/src/data/indonesia-map.ts
// Tambah kota baru di array `cities` di bawah, lalu jalankan ulang.
import fs from "node:fs";
import { feature } from "topojson-client";
import { geoMercator, geoPath } from "d3-geo";

const topo = JSON.parse(fs.readFileSync(new URL("./node_modules/world-atlas/countries-50m.json", import.meta.url)));
const countries = feature(topo, topo.objects.countries);
const indo = countries.features.find((f) => f.id === "360");
const neighborIds = new Set(["458", "626", "598", "096", "702", "608"]); // MY, TL, PG, BN, SG, PH
const topo110 = JSON.parse(fs.readFileSync(new URL("./node_modules/world-atlas/countries-110m.json", import.meta.url)));
const neighbors = feature(topo110, topo110.objects.countries).features.filter((f) => neighborIds.has(f.id));

const W = 1000, H = 380;
// Fit to Indonesia bounding box with padding
const projection = geoMercator().fitExtent([[12, 12], [W - 12, H - 12]], indo);
const path = geoPath(projection);
path.digits(1);
const indoPath = path(indo);
// clip neighbors to roughly the view by just drawing; svg viewBox clips anyway
const neighborPath = neighbors.map((f) => path(f)).join("");

const cities = [
  { id: "padang", name: "Padang", prov: "Sumatera Barat", lon: 100.3543, lat: -0.9471 },
  { id: "painan", name: "Painan", prov: "Sumatera Barat", lon: 100.5753, lat: -1.3502 },
  { id: "bukittinggi", name: "Bukittinggi", prov: "Sumatera Barat", lon: 100.3692, lat: -0.3056 },
  { id: "batusangkar", name: "Batusangkar", prov: "Sumatera Barat", lon: 100.5953, lat: -0.4559 },
  { id: "dharmasraya", name: "Dharmasraya", prov: "Sumatera Barat", lon: 101.5469, lat: -1.0236 },
  { id: "bandung", name: "Bandung", prov: "Jawa Barat", lon: 107.6191, lat: -6.9175 },
  { id: "cimahi", name: "Cimahi", prov: "Jawa Barat", lon: 107.5425, lat: -6.8722 },
  { id: "jonggol", name: "Jonggol", prov: "Jawa Barat", lon: 107.0544, lat: -6.4708 },
  { id: "tangerang", name: "Tangerang", prov: "Banten", lon: 106.6319, lat: -6.1783 },
  { id: "mamuju", name: "Mamuju", prov: "Sulawesi Barat", lon: 118.8861, lat: -2.6806 },
  { id: "sumedang", name: "Sumedang", prov: "Jawa Barat", lon: 107.9206, lat: -6.8381 },
];
const pts = Object.fromEntries(cities.map((c) => {
  const [x, y] = projection([c.lon, c.lat]);
  return [c.id, { x: +x.toFixed(1), y: +y.toFixed(1) }];
}));

const out = `// File ini dibuat otomatis oleh scripts/gen-indonesia-map.mjs dari Natural Earth (world-atlas 50m).
// Jangan diedit manual. Tambah kota baru di scripts/gen-indonesia-map.mjs lalu jalankan ulang.
export const MAP_WIDTH = ${W};
export const MAP_HEIGHT = ${H};
export const INDONESIA_PATH = ${JSON.stringify(indoPath)};
export const NEIGHBOR_PATH = ${JSON.stringify(neighborPath)};
export const CITY_POINTS: Record<string, { x: number; y: number }> = ${JSON.stringify(pts, null, 2)};
`;
fs.writeFileSync(process.argv[2], out);
console.log("indo path chars", indoPath.length, "neighbors", neighborPath.length);
console.log(pts);
