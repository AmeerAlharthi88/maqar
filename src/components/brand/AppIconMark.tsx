interface AppIconMarkProps {
  size?: number;
  className?: string;
}

export function AppIconMark({ size = 60, className = "" }: AppIconMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 60 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="مقر"
    >
      {/* Rounded square bg — Deep Emerald */}
      <rect width="60" height="60" rx="14" fill="#0A3C36" />
      {/* House outline */}
      <path
        d="M30 12L12 26.5h5.5V46h8.5V36h8v10h8.5V26.5H48L30 12z"
        fill="#FFFFFF"
        fillOpacity="0.10"
      />
      <path
        d="M30 12L12 26.5h5.5V46h8.5V36h8v10h8.5V26.5H48L30 12z"
        stroke="#FFFFFF"
        strokeWidth="2"
        strokeLinejoin="round"
        fill="none"
      />
      <rect x="25" y="37" width="10" height="9" rx="2"
        stroke="#FFFFFF" strokeWidth="1.5" fill="#FFFFFF" fillOpacity="0.15" />
      {/* Champagne Gold accent */}
      <circle cx="46" cy="14" r="5.5" fill="#E5BA73" />
    </svg>
  );
}
