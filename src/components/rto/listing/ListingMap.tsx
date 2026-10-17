"use client";

import "leaflet/dist/leaflet.css";
import { useEffect, useRef, useState } from "react";
import type * as Leaflet from "leaflet";

// Peta listing (Leaflet + ubin OpenStreetMap, atribusi wajib tampil). Dimuat dinamis tanpa SSR dari halaman
// yang memakainya, jadi halaman lain tidak ikut berat. Dua mode:
// - pin harga per unit (halaman cari), sinkron dengan kartu yang disorot;
// - area perkiraan (halaman detail): lingkaran, bukan titik persis. Titik di database sudah digeser.

export interface MapItem {
  slug: string;
  lat: number;
  lng: number;
  label: string;
  title: string;
  rto?: boolean;
}

const INDONESIA: [number, number] = [-2.5, 118];
const esc = (s: string) => s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

export default function ListingMap({
  items = [],
  area,
  active = null,
  selected = null,
  onSelect,
  scrollZoom = true,
}: {
  items?: MapItem[];
  area?: { lat: number; lng: number; radius: number };
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

  // Pin atau area
  const areaKey = area ? `${area.lat},${area.lng},${area.radius}` : "";
  useEffect(() => {
    const lib = L.current;
    const m = map.current;
    const group = layer.current;
    if (!ready || !lib || !m || !group) return;
    group.clearLayers();
    markers.current.clear();
    if (area) {
      lib.circle([area.lat, area.lng], { radius: area.radius, color: "#C53B3B", weight: 1.5, fillColor: "#C53B3B", fillOpacity: 0.12 }).addTo(group);
      lib
        .marker([area.lat, area.lng], {
          interactive: false,
          keyboard: false,
          icon: lib.divIcon({
            className: "",
            iconSize: undefined,
            html: '<span class="map-home"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M3 11 12 4l9 7M5 9.5V20h14V9.5"/></svg></span>',
          }),
        })
        .addTo(group);
      fit.current = () => m.setView([area.lat, area.lng], 15);
      fit.current();
      return;
    }
    for (const it of items) {
      const marker = lib.marker([it.lat, it.lng], {
        title: it.title,
        riseOnHover: true,
        icon: lib.divIcon({ className: "", iconSize: undefined, html: `<span class="map-pin${it.rto ? " is-rto" : ""}">${esc(it.label)}</span>` }),
      });
      marker.on("click", (e) => {
        lib.DomEvent.stopPropagation(e);
        select.current?.(it.slug);
      });
      marker.addTo(group);
      markers.current.set(it.slug, marker);
    }
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
