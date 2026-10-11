"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// Kanvas sketsa untuk "Ceritakan proyekmu" (referensi visual "Drawing Canvas" dari user, dibuat ulang).
// Pengunjung bisa menggambar ide proyeknya: pena, penghapus, garis, kotak, lingkaran, 5 warna brand,
// 3 ukuran, grid gambar kerja, undo/redo (Ctrl+Z / Ctrl+Shift+Z), hapus, dan unduh PNG.
// Bisa dipakai dengan mouse/trackpad, pen (tebal ikut tekanan, ujung penghapus pen menghapus), atau jari.
// Sketsa tersimpan otomatis di browser pengunjung (localStorage), bukan dikirim ke server.

type Tool = "pen" | "eraser" | "line" | "rect" | "circle";

const COLORS = [
  { v: "#141414", name: "Hitam" },
  { v: "#C53B3B", name: "Merah" },
  { v: "#1A5C9A", name: "Biru" },
  { v: "#2D7A4F", name: "Hijau" },
  { v: "#C25E20", name: "Oranye" },
];
const SIZES = [2, 5, 10];
const KEY = "barumahid-sketsa-proyek";
const MAX_HISTORY = 20;

const TOOLS: { id: Tool; label: string; path: string }[] = [
  { id: "pen", label: "Pena", path: "M4 20l4-1 11-11-3-3L5 16l-1 4zM14 6l3 3" },
  { id: "eraser", label: "Penghapus", path: "M7 20h10M5 15l8-8 6 6-6 6H9l-4-4z" },
  { id: "line", label: "Garis", path: "M5 19L19 5" },
  { id: "rect", label: "Kotak", path: "M5 6h14v12H5z" },
  { id: "circle", label: "Lingkaran", path: "M12 4a8 8 0 1 0 0 16a8 8 0 1 0 0-16z" },
];

function Icon({ d }: { d: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={d} />
    </svg>
  );
}

export default function DrawingCanvas() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [tool, setTool] = useState<Tool>("pen");
  const [color, setColor] = useState(COLORS[0].v);
  const [size, setSize] = useState(SIZES[1]);
  const [grid, setGrid] = useState(true);
  const [empty, setEmpty] = useState(true);
  const [undoable, setUndoable] = useState(false);
  const [redoable, setRedoable] = useState(false);
  const hist = useRef<{ stack: ImageData[]; redo: ImageData[] }>({ stack: [], redo: [] });
  const stroke = useRef({
    active: false,
    id: -1,
    free: true,
    erase: false,
    sx: 0,
    sy: 0,
    lx: 0,
    ly: 0,
    mx: 0,
    my: 0,
    snap: null as ImageData | null,
  });
  const lastPen = useRef(0);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const ctx = () => canvasRef.current?.getContext("2d") ?? null;

  const autosave = useCallback(() => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      try {
        const c = canvasRef.current;
        if (c) localStorage.setItem(KEY, c.toDataURL("image/png"));
      } catch {
        // penyimpanan browser tidak tersedia, abaikan
      }
    }, 900);
  }, []);

  const syncButtons = () => {
    setUndoable(hist.current.stack.length > 0);
    setRedoable(hist.current.redo.length > 0);
  };

  // Ukuran kanvas mengikuti wadah (tajam di layar retina), isi lama dipertahankan saat diubah ukurannya
  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    const c = canvas?.getContext("2d");
    if (!wrap || !canvas || !c) return;
    const fit = () => {
      const r = wrap.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const prev = document.createElement("canvas");
      prev.width = canvas.width;
      prev.height = canvas.height;
      if (prev.width && prev.height) prev.getContext("2d")?.drawImage(canvas, 0, 0);
      canvas.width = Math.round(r.width * dpr);
      canvas.height = Math.round(r.height * dpr);
      c.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (prev.width && prev.height) c.drawImage(prev, 0, 0, r.width, r.height);
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(wrap);
    // Pulihkan sketsa terakhir
    try {
      const saved = localStorage.getItem(KEY);
      if (saved) {
        const img = new Image();
        img.onload = () => {
          const r = wrap.getBoundingClientRect();
          c.drawImage(img, 0, 0, r.width, r.height);
          setEmpty(false);
        };
        img.src = saved;
      }
    } catch {
      // abaikan
    }
    return () => ro.disconnect();
  }, []);

  const snapshot = () => {
    const c = ctx();
    const canvas = canvasRef.current;
    if (!c || !canvas) return null;
    return c.getImageData(0, 0, canvas.width, canvas.height);
  };

  const pushHistory = () => {
    const snap = snapshot();
    if (!snap) return;
    hist.current.stack.push(snap);
    if (hist.current.stack.length > MAX_HISTORY) hist.current.stack.shift();
    hist.current.redo = [];
    syncButtons();
  };

  const style = (c: CanvasRenderingContext2D, erase: boolean, width: number) => {
    c.lineCap = "round";
    c.lineJoin = "round";
    c.globalCompositeOperation = erase ? "destination-out" : "source-over";
    c.strokeStyle = color;
    c.lineWidth = width;
  };

  // Posisi dari clientX/Y (offsetX tidak selalu akurat untuk sentuhan dan pen di semua browser)
  const pos = (e: { clientX: number; clientY: number }, el: HTMLCanvasElement) => {
    const r = el.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };

  // Pen: tebal garis mengikuti tekanan. Mouse dan jari: tebal tetap.
  const widthFor = (e: PointerEvent, erase: boolean) => {
    const base = erase ? size * 4 : size;
    return e.pointerType === "pen" && e.pressure > 0 ? base * (0.35 + e.pressure * 1.3) : base;
  };

  const shape = (c: CanvasRenderingContext2D, x: number, y: number) => {
    const { sx, sy } = stroke.current;
    c.beginPath();
    if (tool === "line") {
      c.moveTo(sx, sy);
      c.lineTo(x, y);
    } else if (tool === "rect") {
      c.rect(sx, sy, x - sx, y - sy);
    } else if (tool === "circle") {
      c.arc(sx, sy, Math.hypot(x - sx, y - sy), 0, Math.PI * 2);
    }
    c.stroke();
  };

  // Mouse, trackpad, pen (stylus), dan jari lewat pointer events. Satu goresan sekaligus: jari kedua diabaikan,
  // sentuhan diabaikan sesaat setelah pen dipakai (telapak tangan yang menempel layar tidak ikut menggambar).
  const onDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const c = ctx();
    if (!c || stroke.current.active) return;
    if (e.pointerType === "mouse" && e.button !== 0) return;
    if (e.pointerType === "pen") lastPen.current = performance.now();
    if (e.pointerType === "touch" && performance.now() - lastPen.current < 800) return;
    e.preventDefault();
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // pointer sudah tidak aktif; goresan tetap jalan tanpa capture
    }
    pushHistory();
    const { x, y } = pos(e, e.currentTarget);
    // Ujung penghapus pen (tombol 32) langsung menghapus
    const erase = tool === "eraser" || (e.pointerType === "pen" && (e.buttons & 32) !== 0);
    const free = tool === "pen" || erase;
    stroke.current = { active: true, id: e.pointerId, free, erase, sx: x, sy: y, lx: x, ly: y, mx: x, my: y, snap: free ? null : snapshot() };
    style(c, erase, free ? widthFor(e.nativeEvent, erase) : size);
    if (free) {
      c.beginPath();
      c.moveTo(x, y);
      c.lineTo(x + 0.01, y + 0.01);
      c.stroke();
    }
    setEmpty(false);
  };

  const onMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (e.pointerType === "pen") lastPen.current = performance.now();
    const s = stroke.current;
    const c = ctx();
    if (!s.active || e.pointerId !== s.id || !c) return;
    const el = e.currentTarget;
    if (s.free) {
      // Semua titik antara dua frame (coalesced) dipakai supaya goresan pen dan jari tetap halus,
      // lalu disambung dengan kurva lewat titik tengah.
      const coalesced = e.nativeEvent.getCoalescedEvents?.() ?? [];
      const points = coalesced.length ? coalesced : [e.nativeEvent];
      for (const p of points) {
        const { x, y } = pos(p, el);
        const mx = (s.lx + x) / 2, my = (s.ly + y) / 2;
        style(c, s.erase, widthFor(p, s.erase));
        c.beginPath();
        c.moveTo(s.mx, s.my);
        c.quadraticCurveTo(s.lx, s.ly, mx, my);
        c.stroke();
        s.lx = x;
        s.ly = y;
        s.mx = mx;
        s.my = my;
      }
    } else if (s.snap) {
      const { x, y } = pos(e, el);
      c.putImageData(s.snap, 0, 0);
      style(c, false, size);
      shape(c, x, y);
    }
  };

  const onUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const s = stroke.current;
    if (!s.active || e.pointerId !== s.id) return;
    const c = ctx();
    if (c && s.free) {
      c.beginPath();
      c.moveTo(s.mx, s.my);
      c.lineTo(s.lx, s.ly);
      c.stroke();
    }
    s.active = false;
    if (c) c.globalCompositeOperation = "source-over";
    autosave();
  };

  const undo = () => {
    const c = ctx();
    const prev = hist.current.stack.pop();
    const cur = snapshot();
    if (!c || !prev) return;
    if (cur) hist.current.redo.push(cur);
    c.putImageData(prev, 0, 0);
    syncButtons();
    autosave();
  };

  const redo = () => {
    const c = ctx();
    const next = hist.current.redo.pop();
    const cur = snapshot();
    if (!c || !next) return;
    if (cur) hist.current.stack.push(cur);
    c.putImageData(next, 0, 0);
    syncButtons();
    autosave();
  };

  const clear = () => {
    const c = ctx();
    const canvas = canvasRef.current;
    if (!c || !canvas) return;
    pushHistory();
    c.save();
    c.setTransform(1, 0, 0, 1, 0, 0);
    c.clearRect(0, 0, canvas.width, canvas.height);
    c.restore();
    setEmpty(true);
    autosave();
  };

  const download = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const out = document.createElement("canvas");
    out.width = canvas.width;
    out.height = canvas.height;
    const o = out.getContext("2d");
    if (!o) return;
    o.fillStyle = "#ffffff";
    o.fillRect(0, 0, out.width, out.height);
    o.drawImage(canvas, 0, 0);
    out.toBlob((blob) => {
      if (!blob) return;
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "sketsa-proyek-barumahid.png";
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 2000);
    }, "image/png");
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    const mod = e.ctrlKey || e.metaKey;
    if (!mod) return;
    const k = e.key.toLowerCase();
    if (k === "z" && !e.shiftKey) {
      e.preventDefault();
      undo();
    } else if ((k === "z" && e.shiftKey) || k === "y") {
      e.preventDefault();
      redo();
    }
  };

  const btn = "flex h-10 w-10 items-center justify-center rounded-xl transition-colors";

  return (
    <div className="overflow-hidden rounded-3xl bg-white shadow-[0_30px_60px_-30px_rgba(0,0,0,0.6)]" onKeyDown={onKeyDown}>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1.5 border-b border-brand-dark/10 bg-brand-cream px-3 py-2.5" role="toolbar" aria-label="Alat gambar">
        {TOOLS.map((t) => (
          <button
            key={t.id}
            type="button"
            title={t.label}
            aria-label={t.label}
            aria-pressed={tool === t.id}
            onClick={() => setTool(t.id)}
            className={`${btn} ${tool === t.id ? "bg-brand-dark text-white" : "text-brand-dark hover:bg-brand-dark/10"}`}
          >
            <Icon d={t.path} />
          </button>
        ))}
        <span className="mx-1 h-6 w-px bg-brand-dark/15" aria-hidden="true" />
        {COLORS.map((c) => (
          <button
            key={c.v}
            type="button"
            title={c.name}
            aria-label={`Warna ${c.name}`}
            aria-pressed={color === c.v}
            onClick={() => {
              setColor(c.v);
              if (tool === "eraser") setTool("pen");
            }}
            className={`flex h-10 w-8 items-center justify-center rounded-xl ${color === c.v && tool !== "eraser" ? "bg-brand-dark/10" : ""}`}
          >
            <span className="h-5 w-5 rounded-full ring-2 ring-white" style={{ background: c.v, boxShadow: color === c.v ? `0 0 0 2px ${c.v}` : undefined }} />
          </button>
        ))}
        <span className="mx-1 h-6 w-px bg-brand-dark/15" aria-hidden="true" />
        {SIZES.map((s) => (
          <button
            key={s}
            type="button"
            title={`Tebal ${s}px`}
            aria-label={`Tebal garis ${s} piksel`}
            aria-pressed={size === s}
            onClick={() => setSize(s)}
            className={`${btn} ${size === s ? "bg-brand-dark/10" : "hover:bg-brand-dark/5"}`}
          >
            <span className="rounded-full bg-brand-dark" style={{ width: s + 3, height: s + 3 }} />
          </button>
        ))}
        <span className="mx-1 h-6 w-px bg-brand-dark/15" aria-hidden="true" />
        <button
          type="button"
          title="Grid"
          aria-label="Tampilkan grid"
          aria-pressed={grid}
          onClick={() => setGrid((g) => !g)}
          className={`${btn} ${grid ? "bg-brand-dark/10 text-brand-dark" : "text-brand-dark/60 hover:bg-brand-dark/5"}`}
        >
          <Icon d="M4 4h16v16H4zM4 10h16M4 15h16M10 4v16M15 4v16" />
        </button>
        <div className="ml-auto flex items-center gap-1">
          <button type="button" title="Urungkan (Ctrl+Z)" aria-label="Urungkan" disabled={!undoable} onClick={undo} className={`${btn} text-brand-dark hover:bg-brand-dark/10 disabled:opacity-30 disabled:hover:bg-transparent`}>
            <Icon d="M9 14L4 9l5-5M4 9h10a6 6 0 0 1 0 12h-3" />
          </button>
          <button type="button" title="Ulangi (Ctrl+Shift+Z)" aria-label="Ulangi" disabled={!redoable} onClick={redo} className={`${btn} text-brand-dark hover:bg-brand-dark/10 disabled:opacity-30 disabled:hover:bg-transparent`}>
            <Icon d="M15 14l5-5-5-5M20 9H10a6 6 0 0 0 0 12h3" />
          </button>
          <button type="button" title="Hapus semua" aria-label="Hapus semua" onClick={clear} className={`${btn} text-brand-dark hover:bg-brand-red/10 hover:text-brand-red`}>
            <Icon d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" />
          </button>
          <button type="button" title="Unduh PNG" aria-label="Unduh sketsa sebagai PNG" onClick={download} className={`${btn} text-brand-dark hover:bg-brand-dark/10`}>
            <Icon d="M12 4v11M7 10l5 5 5-5M5 20h14" />
          </button>
        </div>
      </div>

      {/* Bidang gambar */}
      <div ref={wrapRef} className="relative aspect-square w-full sm:aspect-[4/3]">
        {grid && (
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(rgba(26,92,154,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(26,92,154,0.12) 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
            aria-hidden="true"
          />
        )}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full touch-none select-none"
          style={{ cursor: tool === "eraser" ? "cell" : "crosshair", WebkitTouchCallout: "none", WebkitUserSelect: "none" }}
          aria-label="Kanvas sketsa proyek. Gambar denah kasar, ukuran, atau bentuk bangunan yang kamu inginkan."
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={onUp}
          onLostPointerCapture={onUp}
          onContextMenu={(e) => e.preventDefault()}
        />
        {empty && (
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-2 px-6 text-center" aria-hidden="true">
            <span className="text-brand-red">
              <Icon d="M4 20l4-1 11-11-3-3L5 16l-1 4zM14 6l3 3" />
            </span>
            <p className="text-[15px] font-bold text-brand-dark/70">Gambarkan ide proyekmu di sini</p>
            <p className="max-w-xs text-[13px] text-brand-gray">Denah kasar, ukuran ruangan, atau bentuk bangunan. Tidak perlu rapi.</p>
            <p className="max-w-xs text-[12px] font-semibold text-brand-dark/50">Bisa pakai mouse, trackpad, pen, atau jari.</p>
          </div>
        )}
      </div>
    </div>
  );
}
