import Link from "next/link";

interface ButtonProps {
  href: string;
  variant?: "primary" | "outline" | "ghost";
  children: React.ReactNode;
  className?: string;
  external?: boolean;
  ariaLabel?: string;
}

export default function Button({
  href,
  variant = "primary",
  children,
  className = "",
  external = false,
  ariaLabel,
}: ButtonProps) {
  const base = "inline-flex items-center justify-center gap-2 rounded-lg font-bold text-sm transition-all duration-200";

  const variants = {
    primary:
      "bg-brand-red text-white px-7 py-3.5 hover:bg-brand-red-dark shadow-lg shadow-brand-red/20 hover:shadow-brand-red/30 hover:scale-[1.02]",
    outline:
      "border-2 border-white/30 text-white px-7 py-3.5 hover:bg-white/10 hover:border-white/50",
    ghost:
      "text-brand-red px-4 py-2 hover:bg-brand-red/5",
  };

  const cls = `${base} ${variants[variant]} ${className}`;

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={cls}
        aria-label={ariaLabel}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={cls} aria-label={ariaLabel}>
      {children}
    </Link>
  );
}
