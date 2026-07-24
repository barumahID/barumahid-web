/**
 * barumahID logo recreated as SVG.
 * Props:
 *  - variant: "mark" = icon only (circle + houses)
 *             "wordmark" = text only ("barumahID" style)
 *             "full" = circle mark + wordmark side by side (default)
 *             "badge" = full logo inside circle (original layout)
 *  - size: height in px (default 40)
 *  - dark: invert colors for dark backgrounds
 */
export default function Logo({
  variant = "full",
  size = 40,
  dark = false,
}: {
  variant?: "mark" | "wordmark" | "full" | "badge";
  size?: number;
  dark?: boolean;
}) {
  const red = "#C53B3B";
  const ink = dark ? "#FFFFFF" : "#1A1A1A";

  if (variant === "badge") {
    const s = size;
    return (
      <svg
        width={s}
        height={s}
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="barumahID"
      >
        {/* Circle border */}
        <circle cx="100" cy="100" r="96" stroke={ink} strokeWidth="5" fill="white" />

        {/* Big house roof (left) */}
        <path d="M30 110 L75 58 L120 110 Z" fill={red} />
        {/* Chimney on big house */}
        <rect x="62" y="62" width="12" height="20" fill={red} />

        {/* Small house roof (right, overlapping) */}
        <path d="M78 115 L112 78 L146 115 Z" fill={red} />

        {/* Small house body + door */}
        <rect x="100" y="115" width="46" height="28" fill={red} />
        <rect x="118" y="122" width="12" height="21" fill="white" rx="1" />
        {/* Door knob */}
        <circle cx="128" cy="133" r="1.8" fill={red} />

        {/* Wordmark */}
        <text
          x="100"
          y="162"
          textAnchor="middle"
          fontFamily="Montserrat, Arial, sans-serif"
          fontWeight="700"
          fontSize="26"
          fill={red}
          letterSpacing="-0.5"
        >
          barumahID
        </text>
      </svg>
    );
  }

  if (variant === "mark") {
    const s = size;
    return (
      <svg
        width={s}
        height={s}
        viewBox="0 0 56 56"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="barumahID"
      >
        <circle cx="28" cy="28" r="26.5" stroke={ink} strokeWidth="3" fill="transparent" />
        {/* Big roof */}
        <path d="M8 32 L21 16 L34 32 Z" fill={red} />
        {/* Chimney */}
        <rect x="17" y="18" width="4" height="7" fill={red} />
        {/* Small roof */}
        <path d="M22 34 L33 22 L44 34 Z" fill={red} />
        {/* Small house body + door */}
        <rect x="28" y="34" width="16" height="9" fill={red} />
        <rect x="32.5" y="36.5" width="5" height="6.5" fill="white" rx="0.5" />
        <circle cx="36.5" cy="39.5" r="0.8" fill={red} />
      </svg>
    );
  }

  if (variant === "wordmark") {
    const h = size;
    return (
      <svg
        height={h}
        viewBox="0 0 180 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="barumahID"
        style={{ width: "auto" }}
      >
        <text
          x="0"
          y="30"
          fontFamily="Montserrat, Arial, sans-serif"
          fontWeight="800"
          fontSize="28"
          fill={ink}
          letterSpacing="-0.5"
        >
          barumah
        </text>
        <text
          x="126"
          y="30"
          fontFamily="Montserrat, Arial, sans-serif"
          fontWeight="800"
          fontSize="28"
          fill={red}
          letterSpacing="-0.5"
        >
          ID
        </text>
      </svg>
    );
  }

  // variant === "full": mark icon + wordmark side by side
  const h = size;
  return (
    <span className="flex items-center gap-2.5" aria-label="barumahID">
      {/* Icon mark */}
      <svg
        width={h}
        height={h}
        viewBox="0 0 56 56"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <circle cx="28" cy="28" r="26.5" stroke={ink} strokeWidth="3" fill="transparent" />
        <path d="M8 32 L21 16 L34 32 Z" fill={red} />
        <rect x="17" y="18" width="4" height="7" fill={red} />
        <path d="M22 34 L33 22 L44 34 Z" fill={red} />
        <rect x="28" y="34" width="16" height="9" fill={red} />
        <rect x="32.5" y="36.5" width="5" height="6.5" fill="white" rx="0.5" />
        <circle cx="36.5" cy="39.5" r="0.8" fill={red} />
      </svg>

      {/* Text */}
      <span
        style={{
          fontFamily: "Montserrat, Arial, sans-serif",
          fontWeight: 800,
          fontSize: h * 0.55,
          lineHeight: 1,
          color: ink,
          letterSpacing: "-0.03em",
        }}
      >
        barumah<span style={{ color: red }}>ID</span>
      </span>
    </span>
  );
}
