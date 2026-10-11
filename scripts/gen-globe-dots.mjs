// Generator titik daratan untuk globe di /layanan/contech (ProjectGlobe).
// Cara pakai sama dengan gen-indonesia-map.mjs (sekali jalan, tidak perlu masuk package.json):
//   mkdir -p /tmp/mapgen && cd /tmp/mapgen && npm i world-atlas@2 topojson-client@3 d3-geo@3
//   cp <repo>/scripts/gen-globe-dots.mjs /tmp/mapgen/ && node gen-globe-dots.mjs <repo>/public/data/globe-dots.json
// Hasil: { global: [lat*100, lon*100, ...], detail: [...] }. `global` = daratan dunia selain Indonesia, tersebar
// merata (spiral Fibonacci). `detail` = daratan Indonesia saja dalam grid rapat, supaya Indonesia menonjol dan
// tetap detail saat di-zoom.
import fs from "node:fs";
import { feature } from "topojson-client";
import { geoContains } from "d3-geo";

const out = process.argv[2];
if (!out) throw new Error("Tulis path output, mis. <repo>/public/data/globe-dots.json");

const load = (name) => {
  const topo = JSON.parse(fs.readFileSync(new URL(`./node_modules/world-atlas/${name}.json`, import.meta.url)));
  return feature(topo, topo.objects.land);
};
const land110 = load("land-110m");
const topo50 = JSON.parse(fs.readFileSync(new URL("./node_modules/world-atlas/countries-50m.json", import.meta.url)));
const topo110 = JSON.parse(fs.readFileSync(new URL("./node_modules/world-atlas/countries-110m.json", import.meta.url)));
const indo50 = feature(topo50, topo50.objects.countries).features.find((x) => x.id === "360");
const indo110 = feature(topo110, topo110.objects.countries).features.find((x) => x.id === "360");

// 1) Titik global: spiral Fibonacci (jarak antar titik merata di permukaan bola)
const N = 26000;
const golden = Math.PI * (3 - Math.sqrt(5));
const global = [];
for (let i = 0; i < N; i++) {
  const y = 1 - (i / (N - 1)) * 2;
  const lat = (Math.asin(y) * 180) / Math.PI;
  const lon = ((((i * golden * 180) / Math.PI) % 360) + 540) % 360 - 180;
  if (geoContains(land110, [lon, lat]) && !geoContains(indo110, [lon, lat])) global.push(Math.round(lat * 100), Math.round(lon * 100));
}

// 2) Titik detail Indonesia (grid rapat, data 50m yang lebih halus garis pantainya)
const STEP = 0.2;
const detail = [];
for (let lat = -11.5; lat <= 7; lat += STEP) {
  for (let lon = 94; lon <= 142; lon += STEP) {
    // geser selang-seling supaya pola titik tidak terlihat kaku
    const lo = lon + ((Math.round(lat / STEP) % 2) * STEP) / 2;
    if (geoContains(indo50, [lo, lat])) detail.push(Math.round(lat * 100), Math.round(lo * 100));
  }
}

fs.writeFileSync(out, JSON.stringify({ global, detail }));
console.log(`global ${global.length / 2} titik, detail ${detail.length / 2} titik, ${Math.round(fs.statSync(out).size / 1024)}KB`);
