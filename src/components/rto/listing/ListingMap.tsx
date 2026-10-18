"use client";

import "leaflet/dist/leaflet.css";
import { useEffect, useRef, useState } from "react";
import type * as Leaflet from "leaflet";
import type { MapTone } from "@/data/listings";

// Peta listing (Leaflet + ubin OpenStreetMap, atribusi wajib tampil). Dimuat dinamis tanpa SSR dari halaman
// yang memakainya, jadi halaman lain tidak ikut berat. Dua mode:
// - pin per unit (halaman cari), sinkron dengan kartu yang disorot;
// - satu pin unit + lingkaran area 300 m (halaman detail).
// Pin gaya shareloc tanpa label (arahan user Okt 2026): biru = buka, hijau = penuh, merah = proses. Pin jatuh pelan saat
// muncul dan ujungnya berdenyut (CSS `.map-pin` di globals.css). Titik di database sudah digeser 120-300 m, jadi
// lingkaran 300 m di halaman detail memuat lokasi aslinya tanpa membukanya.

export interface MapItem {
  slug: string;
  lat: number;
  lng: number;
  title: string;
  tone: MapTone;
}

const INDONESIA: [number, number] = [-2.5, 118];
const AREA_RADIUS_M = 300;

/** Pin: badan berwarna status dengan titik putih, denyut di ujungnya. `i` menggeser jeda animasi supaya tidak serempak. */
const pinHtml = (tone: MapTone, i = 0, lg = false) =>
  `<span class="map-pin is-${tone}${lg ? " is-lg" : ""}" style="--d:${(i % 12) * 70}ms"><span class="map-pin-pulse"></span>` +
  `<svg class="map-pin-body" viewBox="0 0 28 36" aria-hidden="true"><path d="M14 35C14 35 3 23.6 3 14a11 11 0 0 1 22 0c0 9.6-11 21-11 21z"/><circle cx="14" cy="14" r="4.6"/></svg></span>`;

export default function ListingMap({
  items = [],
  area,
  active = null,
  selected = null,
  onSelect,
  scrollZoom = true,
}: {
  items?: MapItem[];
  area?: { lat: number; lng: number; tone: MapTone };
  active?: string | null;
  selected?: string | null;
  onSelect?: (slug: string | null) => void;
  scrollZoom?: boolean;
}) {
  const el = useRef<HTMLDivElement>(null);
  const L = useRef<typeof Leaflet | null>(null);
  const map = useRef<Leaflet.Map | null>(null);
  const layer = useRef<Leaflet.LayerGroup | null>(null);
  const markers = useRef(new Map<string, Leaflet.Marker>());
  const select = useRef(onSelect);
  /** Atur ulang tampilan (pin atau area). Dipanggil lagi saat peta yang tadinya tersembunyi mulai terlihat. */
  const fit = useRef<(() => void) | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    select.current = onSelect;
  });

  // Buat peta sekali
  useEffect(() => {
    let cancelled = false;
    const store = markers.current;
    import("leaflet").then((mod) => {
      if (cancelled || !el.current) return;
      const lib = (mod as unknown as { default?: typeof Leaflet }).default ?? (mod as unknown as typeof Leaflet);
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const m = lib.map(el.current, {
        zoomControl: false,
        scrollWheelZoom: scrollZoom,
        zoomAnimation: !reduce,
        fadeAnimation: !reduce,
        markerZoomAnimation: !reduce,
      });
      lib.control.zoom({ position: "topright", zoomInTitle: "Perbesar", zoomOutTitle: "Perkecil" }).addTo(m);
      lib
        .tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 19,
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>',
        })
        .addTo(m);
      m.attributionControl.setPrefix(false);
      m.setView(INDONESIA, 5);
      m.on("click", () => select.current?.(null));
      layer.current = lib.layerGroup().addTo(m);
      L.current = lib;
      map.current = m;
      // Peta di HP dibuat saat masih tersembunyi (ukuran 0): hitung ulang ukuran dan posisi begitu terlihat
      let wasHidden = el.current.clientWidth === 0;
      observer = new ResizeObserver(() => {
        const hidden = !el.current || el.current.clientWidth === 0;
        m.invalidateSize();
        if (wasHidden && !hidden) fit.current?.();
        wasHidden = hidden;
      });
      observer.observe(el.current);
      setReady(true);
    });
    let observer: ResizeObserver | null = null;
    return () => {
      cancelled = true;
      observer?.disconnect();
      map.current?.remove();
      map.current = null;
      store.clear();
    };
  }, [scrollZoom]);

  // Pin unit, atau satu pin dengan lingkaran area
  const areaKey = area ? `${area.lat},${area.lng},${area.tone}` : "";
  useEffect(() => {
    const lib = L.current;
    const m = map.current;
    const group = layer.current;
    if (!ready || !lib || !m || !group) return;
    group.clearLayers();
    markers.current.clear();
    if (area) {
      lib
        .circle([area.lat, area.lng], { radius: AREA_RADIUS_M, interactive: false, weight: 1.5, dashArray: "4 5", fillOpacity: 0.1, className: `map-area is-${area.tone}` })
        .addTo(group);
      lib
        .marker([area.lat, area.lng], {
          interactive: false,
          keyboard: false,
          icon: lib.divIcon({ className: "", iconSize: undefined, html: pinHtml(area.tone, 0, true) }),
        })
        .addTo(group);
      fit.current = () => m.setView([area.lat, area.lng], 15);
      fit.current();
      return;
    }
    items.forEach((it, i) => {
      const marker = lib.marker([it.lat, it.lng], {
        title: it.title,
        riseOnHover: true,
        icon: lib.divIcon({ className: "", iconSize: undefined, html: pinHtml(it.tone, i) }),
      });
      marker.on("click", (e) => {
        lib.DomEvent.stopPropagation(e);
        select.current?.(it.slug);
      });
      marker.addTo(group);
      markers.current.set(it.slug, marker);
    });
    fit.current = () => {
      if (items.length) m.fitBounds(lib.latLngBounds(items.map((i) => [i.lat, i.lng] as [number, number])), { padding: [56, 56], maxZoom: 15 });
      else m.setView(INDONESIA, 5);
    };
    if (el.current && el.current.clientWidth > 0) fit.current();
    // areaKey mewakili area (objek baru tiap render tidak memicu ulang)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, items, areaKey]);

  // Sorot pin dari kartu yang disorot atau pin yang dipilih
  useEffect(() => {
    markers.current.forEach((marker, slug) => {
      const on = slug === active || slug === selected;
      marker.getElement()?.firstElementChild?.classList.toggle("is-active", on);
      marker.setZIndexOffset(on ? 1000 : 0);
    });
  }, [active, selected, items, ready]);

  return <div ref={el} className="map-soft isolate h-full w-full" role="region" aria-label="Peta lokasi perkiraan unit" />;
}
