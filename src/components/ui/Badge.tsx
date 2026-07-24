interface BadgeProps {
  variant: "active" | "coming-soon" | "blocked" | "pre-launch";
  children: React.ReactNode;
  className?: string;
}

export default function Badge({ variant, children, className = "" }: BadgeProps) {
  const styles = {
    active: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    "coming-soon": "bg-brand-gray/10 text-brand-gray border-brand-gray/20",
    blocked: "bg-gray-200 text-gray-500 border-gray-300",
    "pre-launch": "bg-brand-red/10 text-brand-red border-brand-red/20",
  };

  const dot = {
    active: "bg-emerald-500",
    "coming-soon": "bg-brand-gray",
    blocked: "bg-gray-400",
    "pre-launch": "bg-brand-red",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-wider ${styles[variant]} ${className}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${dot[variant]}`} />
      {children}
    </span>
  );
}
