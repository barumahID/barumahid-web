import Link from "@/i18n/Link";

type Variant = "red" | "dark" | "light" | "outline-light" | "outline-dark" | "whatsapp";

const styles: Record<Variant, string> = {
  red: "bg-brand-red text-white hover:bg-brand-red-dark shadow-[0_14px_30px_-12px_rgba(197,59,59,0.7)]",
  dark: "bg-brand-dark text-white hover:bg-brand-red",
  light: "bg-white text-brand-dark hover:bg-brand-cream",
  "outline-light": "border border-white/35 text-white hover:bg-white/10",
  "outline-dark": "border border-brand-dark/20 text-brand-dark hover:border-brand-dark hover:bg-brand-dark hover:text-white",
  whatsapp: "bg-[#1f9d55] text-white hover:bg-[#188a49]",
};

export default function ButtonLink({
  href,
  children,
  variant = "red",
  external,
  arrow = true,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  variant?: Variant;
  external?: boolean;
  arrow?: boolean;
  className?: string;
}) {
  const cls = `group inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-[14px] font-bold transition-colors duration-200 ${styles[variant]} ${className}`;
  const content = (
    <>
      {children}
      {arrow && (
        <svg
          width="14"
          height="14"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          className="transition-transform duration-200 group-hover:translate-x-0.5"
          aria-hidden="true"
        >
          <path d="M3 8h10M9 4l4 4-4 4" />
        </svg>
      )}
    </>
  );
  const isExternal = external ?? /^(https?:|mailto:|tel:)/.test(href);
  if (isExternal) {
    return (
      <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" className={cls}>
        {content}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {content}
    </Link>
  );
}
