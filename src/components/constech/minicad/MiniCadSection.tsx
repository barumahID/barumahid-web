"use client";

import { useSyncExternalStore } from "react";
import MiniCad from "./MiniCad";

// Pembungkus miniCAD di halaman ConTech: tautan ?denah=... (dari isian form F01) langsung membuka denah yang sama.

const noop = () => () => {};
const readParam = () => new URLSearchParams(window.location.search).get("denah");

export default function MiniCadSection() {
  const code = useSyncExternalStore(noop, readParam, () => null);
  return <MiniCad initialCode={code} />;
}
