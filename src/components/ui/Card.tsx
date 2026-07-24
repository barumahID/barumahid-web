interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export default function Card({ children, className = "", hover = true }: CardProps) {
  return (
    <div
      className={`rounded-xl border border-brand-dark/8 bg-white p-6 card-shadow ${
        hover ? "tilt-card card-shadow-hover" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}
