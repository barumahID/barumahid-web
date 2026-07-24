import CountUp from "@/components/CountUp";

interface StatCardProps {
  end: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  label: string;
  sublabel?: string;
  className?: string;
}

export default function StatCard({
  end,
  suffix = "",
  prefix = "",
  decimals = 0,
  label,
  sublabel,
  className = "",
}: StatCardProps) {
  return (
    <div className={`text-center ${className}`}>
      <p className="text-3xl font-extrabold text-white sm:text-4xl lg:text-5xl">
        <CountUp end={end} suffix={suffix} prefix={prefix} decimals={decimals} />
      </p>
      <p className="mt-2 text-sm font-semibold text-white/80">{label}</p>
      {sublabel && (
        <p className="mt-0.5 text-xs text-white/50">{sublabel}</p>
      )}
    </div>
  );
}
