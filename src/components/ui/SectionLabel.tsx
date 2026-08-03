export default function SectionLabel({
  children,
  number,
  dark = false,
}: {
  children: React.ReactNode;
  number?: string;
  dark?: boolean;
}) {
  return (
    <span
      className={`type-micro inline-flex items-center gap-3 ${
        dark ? "text-white/60" : "text-brand-gray"
      }`}
    >
      {number && (
        <>
          <span className={dark ? "text-brand-red" : "text-brand-red"}>{number}</span>
          <span className={dark ? "text-white/30" : "text-brand-mute"}>/</span>
        </>
      )}
      <span>{children}</span>
    </span>
  );
}
