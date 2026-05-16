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
      {/* Rounded square bg */}
      <rect width="60" height="60" rx="14" fill="#FAF7F2" />
      {/* House */}
      <path
        d="M30 12L12 26.5h5.5V46h8.5V36h8v10h8.5V26.5H48L30 12z"
        fill="#C65D3B"
        fillOpacity="0.14"
      />
      <path
        d="M30 12L12 26.5h5.5V46h8.5V36h8v10h8.5V26.5H48L30 12z"
        stroke="#C65D3B"
        strokeWidth="2.5"
        strokeLinejoin="round"
        fill="none"
      />
      <rect x="25" y="37" width="10" height="9" rx="2" fill="#C65D3B" fillOpacity="0.3" />
      {/* Accent */}
      <circle cx="46" cy="14" r="6" fill="#D4A373" />
    </svg>
  );
}
