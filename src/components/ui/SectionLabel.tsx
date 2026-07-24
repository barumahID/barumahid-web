export default function SectionLabel({
  children,
  dark = false,
}: {
  children: React.ReactNode;
  dark?: boolean;
}) {
  return (
    <span
      className={`text-xs font-bold uppercase tracking-[0.18em] ${
        dark ? "text-brand-red" : "text-brand-red"
      }`}
    >
      {children}
    </span>
  );
}
