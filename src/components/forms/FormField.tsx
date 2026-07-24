export const inputClass =
  "w-full rounded-xl border-2 border-brand-dark/15 bg-white px-4 py-3 text-sm font-medium text-brand-dark placeholder:text-brand-gray/30 focus:border-brand-red focus:outline-none focus:ring-4 focus:ring-brand-red/15 transition";

export function FormField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-[11px] font-extrabold uppercase tracking-[0.14em] text-brand-dark">
        {label}
      </span>
      {children}
    </label>
  );
}
