"use client";

// Bagian kecil yang dipakai simulasi RTO (simulasi lengkap di /layanan/rto#simulasi dan simulasi di panel unit).

export function Slider({
  id,
  label,
  value,
  min,
  max,
  step,
  onChange,
  display,
  minLabel,
  maxLabel,
}: {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (n: number) => void;
  display: string;
  minLabel: string;
  maxLabel: string;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="rounded-2xl border border-brand-dark/10 bg-white p-5">
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-[12px] font-bold uppercase tracking-[0.12em] text-brand-gray">
          {label}
        </label>
        <span className="text-[17px] font-black text-brand-dark">{display}</span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="rto-slider mt-4 h-1.5 w-full cursor-pointer appearance-none rounded-full"
        style={{ background: `linear-gradient(to right, #C53B3B ${pct}%, #E5E0D8 ${pct}%)` }}
      />
      <div className="mt-2 flex justify-between text-[11px] text-brand-mute">
        <span>{minLabel}</span>
        <span>{maxLabel}</span>
      </div>
    </div>
  );
}

export function Chips({
  value,
  options,
  onChange,
  label,
  suffix = "%",
}: {
  value: number;
  options: number[];
  onChange: (n: number) => void;
  label: string;
  suffix?: string;
}) {
  return (
    <div className="rounded-2xl border border-brand-dark/10 bg-white p-4">
      <p className="text-[12px] font-bold uppercase tracking-[0.12em] text-brand-gray">{label}</p>
      <div className="mt-2.5 flex flex-wrap gap-2" role="radiogroup" aria-label={label}>
        {options.map((o) => (
          <button
            key={o}
            type="button"
            role="radio"
            aria-checked={value === o}
            onClick={() => onChange(o)}
            className={`rounded-full px-3.5 py-1.5 text-[13px] font-bold transition-colors ${
              value === o ? "bg-brand-dark text-white" : "border border-brand-dark/15 text-brand-dark hover:border-brand-dark"
            }`}
          >
            {o}
            {suffix}
          </button>
        ))}
      </div>
    </div>
  );
}

export function Row({ label, value, strong = false, tone }: { label: string; value: string; strong?: boolean; tone?: "credit" | "red" }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-t border-brand-dark/10 py-2.5 text-[14px]">
      <span className="text-brand-gray">{label}</span>
      <span className={`text-right ${strong ? "text-[17px] font-black" : "font-bold"} ${tone === "credit" ? "text-credit" : tone === "red" ? "text-brand-red" : "text-brand-dark"}`}>
        {value}
      </span>
    </div>
  );
}

