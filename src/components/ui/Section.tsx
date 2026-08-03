interface SectionProps {
  children: React.ReactNode;
  id?: string;
  background?: "white" | "cream" | "warm" | "dark";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function Section({
  children,
  id,
  background = "cream",
  size = "lg",
  className = "",
}: SectionProps) {
  const bg =
    background === "dark"
      ? "bg-brand-dark text-white"
      : background === "warm"
        ? "bg-brand-cream-warm"
        : background === "white"
          ? "bg-white"
          : "bg-brand-cream";

  const padding =
    size === "sm"
      ? "py-16 md:py-20"
      : size === "md"
        ? "py-20 md:py-28"
        : "py-24 md:py-36 lg:py-40";

  return (
    <section id={id} className={`${bg} ${className}`}>
      <div className={`mx-auto max-w-[1280px] px-6 md:px-10 lg:px-14 ${padding}`}>
        {children}
      </div>
    </section>
  );
}
