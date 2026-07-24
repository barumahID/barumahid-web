interface SectionProps {
  children: React.ReactNode;
  id?: string;
  background?: "white" | "light" | "dark";
  className?: string;
}

export default function Section({
  children,
  id,
  background = "white",
  className = "",
}: SectionProps) {
  const bg =
    background === "dark"
      ? "bg-brand-dark text-white"
      : background === "light"
        ? "bg-brand-light"
        : "bg-white";

  return (
    <section id={id} className={`${bg} ${className}`}>
      <div className="mx-auto max-w-[1200px] px-6 py-20 sm:py-28">
        {children}
      </div>
    </section>
  );
}
