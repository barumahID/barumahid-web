"use client";

import { useMemo, useState } from "react";

const RTO_RATE = 0.25;

function formatRp(n: number) {
  return "Rp " + new Intl.NumberFormat("id-ID").format(Math.round(n));
}

function formatRpShort(n: number) {
  return new Intl.NumberFormat("id-ID").format(Math.round(n));
}

const ecoChannels = [
  {
    id: "laundry",
    label: "Rajin laundry",
    sub: "est. 8x/bulan",
    value: 80_000,
    tooltip:
      "Cashback 10% dari markup 20% harga laundry mitra. Rp 700/kg × est. 30kg/bulan.",
    badge: "Post-MVP",
  },
  {
    id: "sampah",
    label: "Pilah sampah rutin",
    sub: "est. 20kg/bulan",
    value: 40_000,
    tooltip:
      "80% dari nilai sampah terpilah. Harga bank sampah rata-rata Rp 1.500/kg.",
    badge: "Post-MVP",
  },
  {
    id: "titip",
    label: "Jasa titip barang",
    sub: "2x/bulan",
    value: 50_000,
    tooltip:
      "Cashback 10% dari transaksi jasa titip. Markup 20% dari harga pasar.",
    badge: "Post-MVP",
  },
  {
    id: "pindahan",
    label: "Jasa pindahan",
    sub: "1x/tahun ÷ 12",
    value: 15_000,
    tooltip:
      "Cashback 10% dari jasa pindahan. Dibagi 12 bulan untuk estimasi bulanan.",
    badge: "Post-MVP",
  },
];

function InputCard({
  label,
  value,
  min,
  max,
  step,
  minLabel,
  maxLabel,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  minLabel: string;
  maxLabel: string;
  onChange: (n: number) => void;
}) {
  const [displayValue, setDisplayValue] = useState(formatRpShort(value));
  const [isFocused, setIsFocused] = useState(false);
  const pct = ((value - min) / (max - min)) * 100;

  const handleManualInput = (raw: string) => {
    const numeric = raw.replace(/[^0-9]/g, "");
    setDisplayValue(numeric);
    if (numeric) {
      onChange(Math.min(max, Math.max(min, Number(numeric))));
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    setDisplayValue(formatRpShort(value));
  };

  const handleFocus = () => {
    setIsFocused(true);
    setDisplayValue(String(value));
  };

  const handleSliderChange = (n: number) => {
    onChange(n);
    if (!isFocused) {
      setDisplayValue(formatRpShort(n));
    }
  };

  return (
    <div className="bg-white border border-black/[0.06] rounded-2xl p-6 mb-4">
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-bold tracking-widest uppercase text-[#888]">
          {label}
        </span>
        <div className="flex items-center gap-1 bg-[#F8F5F0] rounded-xl px-3 py-2 border border-black/[0.06]">
          <span className="text-xs font-semibold text-[#888]">Rp</span>
          <input
            type="text"
            value={displayValue}
            onChange={(e) => handleManualInput(e.target.value)}
            onBlur={handleBlur}
            onFocus={handleFocus}
            className="w-28 text-right text-sm font-black text-[#1A1A1A] bg-transparent outline-none border-none"
            placeholder="0"
          />
        </div>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => handleSliderChange(Number(e.target.value))}
        aria-label={label}
        className="rto-slider w-full h-1.5 appearance-none rounded-full cursor-pointer mb-2"
        style={{
          background: `linear-gradient(to right, #C53B3B ${pct}%, #E5E0D8 ${pct}%)`,
          outline: "none",
        }}
      />
      <div className="flex justify-between">
        <span className="text-xs text-[#CCC]">{minLabel}</span>
        <span className="text-xs text-[#CCC]">{maxLabel}</span>
      </div>
    </div>
  );
}

export default function RTOSimulator() {
  const [hargaUnit, setHargaUnit] = useState(250_000_000);
  const [sewa, setSewa] = useState(1_000_000);
  const [dpPct, setDpPct] = useState(15);
  const [activeChannels, setActiveChannels] = useState<Record<string, boolean>>(
    {},
  );

  const toggleChannel = (id: string) => {
    setActiveChannels((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const result = useMemo(() => {
    const dpTarget = (hargaUnit * dpPct) / 100;
    const saldoPerBulan = sewa * RTO_RATE;
    const bulan =
      saldoPerBulan > 0 ? Math.ceil(dpTarget / saldoPerBulan) : Infinity;
    const totalTerbayar = sewa * bulan;
    return { dpTarget, saldoPerBulan, bulan, totalTerbayar };
  }, [hargaUnit, sewa, dpPct]);

  const totalEkosistem = useMemo(
    () =>
      ecoChannels.reduce(
        (sum, ch) => sum + (activeChannels[ch.id] ? ch.value : 0),
        0,
      ),
    [activeChannels],
  );

  const estimasiTahun = isFinite(result.bulan)
    ? +(result.bulan / 12).toFixed(1)
    : 0;

  const totalDPPerBulan = result.saldoPerBulan + totalEkosistem;
  const estimasiTahunDenganEkosistem =
    totalDPPerBulan > 0
      ? +(result.dpTarget / totalDPPerBulan / 12).toFixed(1)
      : 0;

  const dpPctSlider = ((dpPct - 5) / (30 - 5)) * 100;

  const milestones = [1, 2, 3, 5, 10];
  const closestMilestone =
    estimasiTahun > 0
      ? milestones.reduce((prev, curr) =>
          Math.abs(curr - estimasiTahun) < Math.abs(prev - estimasiTahun)
            ? curr
            : prev,
        )
      : -1;

  return (
    <div>
      {/* Section header */}
      <div className="text-center mb-16">
        <p className="text-xs font-bold tracking-widest uppercase text-[#C53B3B] mb-3">
          SIMULASI SALDO DP
        </p>
        <h2 className="text-4xl md:text-5xl font-black text-[#1A1A1A] mb-4 leading-tight">
          Hitung sendiri,
          <br />
          perjalanan DP-mu.
        </h2>
        <p className="text-base text-[#666] max-w-md mx-auto">
          Geser slider di bawah dan lihat berapa cepat kamu bisa punya rumah.
        </p>
      </div>

      {/* 2-column grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* LEFT — Input Panel */}
        <div>
          <InputCard
            label="Harga Unit"
            value={hargaUnit}
            onChange={setHargaUnit}
            min={100_000_000}
            max={2_000_000_000}
            step={5_000_000}
            minLabel="Rp 100 jt"
            maxLabel="Rp 2 M"
          />
          <InputCard
            label="Sewa per Bulan"
            value={sewa}
            onChange={setSewa}
            min={100_000}
            max={10_000_000}
            step={50_000}
            minLabel="Rp 100 rb"
            maxLabel="Rp 10 jt"
          />
          {/* Target DP — slider only */}
          <div className="bg-white border border-black/[0.06] rounded-2xl p-6 mb-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold tracking-widest uppercase text-[#888]">
                Target DP
              </span>
              <span className="text-sm font-black text-[#1A1A1A]">
                {dpPct}% dari harga unit ={" "}
                {formatRp((hargaUnit * dpPct) / 100)}
              </span>
            </div>
            <input
              type="range"
              min={5}
              max={30}
              step={1}
              value={dpPct}
              onChange={(e) => setDpPct(Number(e.target.value))}
              aria-label="Target DP"
              className="rto-slider w-full h-1.5 appearance-none rounded-full cursor-pointer mb-2"
              style={{
                background: `linear-gradient(to right, #C53B3B ${dpPctSlider}%, #E5E0D8 ${dpPctSlider}%)`,
                outline: "none",
              }}
            />
            <div className="flex justify-between">
              <span className="text-xs text-[#CCC]">5%</span>
              <span className="text-xs text-[#CCC]">30%</span>
            </div>
          </div>
        </div>

        {/* RIGHT — Result Card (sticky) */}
        <div className="lg:sticky lg:top-24">
          <div className="bg-[#1A1A1A] rounded-3xl p-7 relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-48 h-48 bg-[#C53B3B] opacity-[0.08] rounded-full blur-3xl pointer-events-none" />

            <div className="inline-flex items-center gap-2 bg-white/[0.08] rounded-full px-3 py-1.5 mb-6">
              <div className="w-1.5 h-1.5 rounded-full bg-[#C53B3B]" />
              <span className="text-xs font-bold text-white/60 tracking-widest uppercase">
                25% Sewa &rarr; DP Otomatis
              </span>
            </div>

            <div className="space-y-5 mb-6">
              <div>
                <p className="text-xs text-white/40 font-semibold uppercase tracking-widest mb-1">
                  DP yang perlu dikumpulkan
                </p>
                <p className="text-3xl font-black text-white leading-none">
                  {formatRp(result.dpTarget)}
                </p>
              </div>
              <div>
                <p className="text-xs text-white/40 font-semibold uppercase tracking-widest mb-1">
                  Saldo DP per bulan
                </p>
                <p className="text-3xl font-black text-[#C53B3B] leading-none">
                  {formatRp(result.saldoPerBulan)}
                </p>
              </div>
              <div>
                <p className="text-xs text-white/40 font-semibold uppercase tracking-widest mb-1">
                  Estimasi waktu
                </p>
                <p className="text-3xl font-black text-white leading-none">
                  {estimasiTahun > 0 ? (
                    <>
                      {estimasiTahun.toFixed(1)}
                      <span className="text-lg font-semibold text-white/40 ml-1">
                        tahun
                      </span>
                    </>
                  ) : (
                    "—"
                  )}
                </p>
              </div>
            </div>

            <div className="border-t border-white/[0.08] mb-5" />

            <div className="mb-2 flex justify-between">
              <span className="text-xs text-white/30">Mulai sewa</span>
              <span className="text-xs text-white/30">
                {estimasiTahun > 0 ? `${estimasiTahun.toFixed(1)} tahun` : "—"}
              </span>
            </div>
            <div className="h-1.5 bg-white/[0.08] rounded-full overflow-hidden mb-4">
              <div className="h-full bg-[#C53B3B] rounded-full w-full" />
            </div>

            <div className="grid grid-cols-5 gap-1.5 mb-6">
              {milestones.map((year) => {
                const pct =
                  estimasiTahun > 0
                    ? Math.min(
                        100,
                        Math.round((year / estimasiTahun) * 100),
                      )
                    : 0;
                const isClosest = year === closestMilestone;
                return (
                  <div
                    key={year}
                    className={`rounded-xl p-2.5 text-center ${
                      isClosest
                        ? "bg-[#C53B3B]"
                        : "bg-white/[0.05] border border-white/[0.06]"
                    }`}
                  >
                    <p
                      className={`text-[10px] font-bold mb-0.5 ${
                        isClosest ? "text-white" : "text-white/30"
                      }`}
                    >
                      {year}th
                    </p>
                    <p
                      className={`text-xs font-black ${
                        isClosest ? "text-white" : "text-white/50"
                      }`}
                    >
                      {pct}%
                    </p>
                  </div>
                );
              })}
            </div>

            {estimasiTahun > 0 && (
              <div className="bg-white/[0.04] rounded-2xl p-4">
                <p className="text-sm text-white/50 leading-relaxed">
                  Dalam{" "}
                  <span className="text-white font-bold">
                    {estimasiTahun.toFixed(1)} tahun
                  </span>{" "}
                  sewa bersama barumahID, kamu sudah punya{" "}
                  <span className="text-[#C53B3B] font-bold">
                    {formatRp(result.dpTarget)}
                  </span>{" "}
                  untuk DP &mdash; sementara yang lain masih bayar sewa tanpa
                  arah.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* FULL WIDTH — Ekosistem DP */}
      <div className="bg-white border border-black/[0.06] rounded-3xl p-7 md:p-8 mt-8">
        <div className="mb-8">
          <p className="text-xs font-bold tracking-widest uppercase text-[#B45309] mb-1">
            EKOSISTEM DP
          </p>
          <h3 className="text-2xl font-black text-[#1A1A1A] mb-1">
            Percepat tabungan DP-mu
          </h3>
          <p className="text-sm text-[#888]">
            Aktifkan channel tambahan dan lihat bedanya.
          </p>
        </div>

        <div className="space-y-3 mb-8">
          {ecoChannels.map((channel) => (
            <div
              key={channel.id}
              onClick={() => toggleChannel(channel.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  toggleChannel(channel.id);
                }
              }}
              className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all duration-200 ${
                activeChannels[channel.id]
                  ? "border-[#C53B3B]/30 bg-red-50/50"
                  : "border-black/[0.06] bg-[#F8F5F0]/50 hover:border-black/[0.12]"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`relative rounded-full transition-colors duration-200 flex-shrink-0 ${
                    activeChannels[channel.id] ? "bg-[#C53B3B]" : "bg-black/10"
                  }`}
                  style={{ height: "22px", width: "40px" }}
                >
                  <div
                    className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200 ${
                      activeChannels[channel.id] ? "translate-x-5" : ""
                    }`}
                  />
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-[#1A1A1A]">
                      {channel.label}
                    </p>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#B45309]/10 text-[#B45309] tracking-wide">
                      {channel.badge}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <p className="text-xs text-[#AAA]">{channel.sub}</p>
                    <div className="group relative">
                      <div className="w-3.5 h-3.5 rounded-full bg-black/10 flex items-center justify-center cursor-help">
                        <span className="text-[9px] font-black text-[#888]">
                          ?
                        </span>
                      </div>
                      <div className="absolute bottom-5 left-0 w-52 bg-[#1A1A1A] text-white text-xs rounded-xl p-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-xl">
                        {channel.tooltip}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <span
                className={`text-sm font-black transition-colors ${
                  activeChannels[channel.id] ? "text-[#C53B3B]" : "text-[#CCC]"
                }`}
              >
                +{formatRp(channel.value)}/bln
              </span>
            </div>
          ))}
        </div>

        {/* Comparison — Tanpa vs Dengan ekosistem */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="bg-[#F8F5F0] rounded-2xl p-5 border border-black/[0.06]">
            <p className="text-xs font-bold text-[#AAA] uppercase tracking-widest mb-3">
              Tanpa Ekosistem
            </p>
            <div className="space-y-2">
              <div>
                <p className="text-xs text-[#888] mb-0.5">DP/bulan</p>
                <p className="text-lg font-black text-[#1A1A1A]">
                  {formatRp(result.saldoPerBulan)}
                </p>
              </div>
              <div>
                <p className="text-xs text-[#888] mb-0.5">Estimasi waktu</p>
                <p className="text-2xl font-black text-[#1A1A1A]">
                  {estimasiTahun > 0 ? estimasiTahun.toFixed(1) : "—"}
                  <span className="text-sm font-semibold text-[#AAA] ml-1">
                    tahun
                  </span>
                </p>
              </div>
            </div>
          </div>

          <div
            className={`rounded-2xl p-5 border transition-all duration-300 ${
              totalEkosistem > 0
                ? "bg-[#1A1A1A] border-[#1A1A1A]"
                : "bg-[#F8F5F0] border-black/[0.06] opacity-40"
            }`}
          >
            <p
              className={`text-xs font-bold uppercase tracking-widest mb-3 ${
                totalEkosistem > 0 ? "text-white/40" : "text-[#AAA]"
              }`}
            >
              Dengan Ekosistem
            </p>
            <div className="space-y-2">
              <div>
                <p
                  className={`text-xs mb-0.5 ${totalEkosistem > 0 ? "text-white/50" : "text-[#888]"}`}
                >
                  DP/bulan
                </p>
                <p
                  className={`text-lg font-black ${
                    totalEkosistem > 0 ? "text-[#C53B3B]" : "text-[#1A1A1A]"
                  }`}
                >
                  {formatRp(result.saldoPerBulan + totalEkosistem)}
                </p>
              </div>
              <div>
                <p
                  className={`text-xs mb-0.5 ${totalEkosistem > 0 ? "text-white/50" : "text-[#888]"}`}
                >
                  Estimasi waktu
                </p>
                <p
                  className={`text-2xl font-black ${
                    totalEkosistem > 0 ? "text-white" : "text-[#1A1A1A]"
                  }`}
                >
                  {estimasiTahunDenganEkosistem > 0
                    ? estimasiTahunDenganEkosistem.toFixed(1)
                    : "—"}
                  <span
                    className={`text-sm font-semibold ml-1 ${
                      totalEkosistem > 0 ? "text-white/40" : "text-[#AAA]"
                    }`}
                  >
                    tahun
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Percepatan highlight */}
        {totalEkosistem > 0 && estimasiTahun > 0 && (
          <div className="bg-gradient-to-r from-[#B45309]/10 to-[#C53B3B]/10 border border-[#B45309]/20 rounded-2xl p-5">
            <div className="flex items-center gap-3">
              <div className="text-2xl" aria-hidden="true">
                &#128640;
              </div>
              <div>
                <p className="text-sm font-black text-[#1A1A1A] mb-0.5">
                  {(estimasiTahun - estimasiTahunDenganEkosistem).toFixed(1)}{" "}
                  tahun lebih cepat
                </p>
                <p className="text-xs text-[#888]">
                  Dari {estimasiTahun.toFixed(1)} tahun menjadi{" "}
                  {estimasiTahunDenganEkosistem.toFixed(1)} tahun dengan channel
                  ekosistem yang kamu aktifkan.
                </p>
              </div>
            </div>
          </div>
        )}

        <p className="text-xs text-[#BBB] mt-4 leading-relaxed">
          * Angka ekosistem bersifat estimasi. Channel selain Sewa Core masih
          dalam tahap pengembangan.
        </p>
      </div>

      {/* CTA */}
      <div className="text-center mt-10">
        <p className="text-sm text-[#666] mb-4 max-w-sm mx-auto">
          Catatan: Ini simulasi indikatif berdasarkan mekanisme 25% sewa &rarr;
          DP. Skema final dikomunikasikan saat program{" "}
          <span className="font-semibold text-[#1A1A1A]">resmi dibuka</span>.
        </p>
        <a
          href="https://wa.me/6285157883292"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-[#C53B3B] text-white rounded-full px-8 py-4 font-bold text-sm hover:bg-red-700 transition-all"
        >
          Gabung Waiting List &rarr;
        </a>
      </div>
    </div>
  );
}
