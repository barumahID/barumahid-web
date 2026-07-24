export default function Marquee({
  items,
  reverse = false,
  speed = "normal",
  variant = "dark",
}: {
  items: string[];
  reverse?: boolean;
  speed?: "slow" | "normal";
  variant?: "dark" | "light" | "red";
}) {
  const bg =
    variant === "dark"
      ? "bg-brand-dark text-white border-y border-white/10"
      : variant === "red"
        ? "bg-brand-red text-white"
        : "bg-brand-light text-brand-dark border-y border-brand-dark/10";

  const anim =
    speed === "slow"
      ? "animate-marquee-slow"
      : reverse
        ? "animate-marquee-reverse"
        : "animate-marquee";

  const doubled = [...items, ...items];

  return (
    <div className={`${bg} overflow-hidden py-5`} aria-hidden="true">
      <div className={`flex w-max shrink-0 items-center gap-10 ${anim}`}>
        {doubled.map((it, i) => (
          <span
            key={i}
            className="flex shrink-0 items-center gap-10 text-sm font-extrabold uppercase tracking-[0.28em] sm:text-base"
          >
            {it}
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              className="opacity-40"
              aria-hidden="true"
            >
              <path
                d="M7 1l3 6-3 6-3-6z"
                fill="currentColor"
              />
            </svg>
          </span>
        ))}
      </div>
    </div>
  );
}
