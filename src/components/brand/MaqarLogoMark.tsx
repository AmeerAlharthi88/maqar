interface MaqarLogoMarkProps {
  size?: number;
  className?: string;
}

export function MaqarLogoMark({ size = 40, className = "" }: MaqarLogoMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="مقر"
    >
      <path
        d="M24 8L6 23.5h5V41h9V29h8v12h9V23.5h5L24 8z"
        stroke="#C65D3B"
        strokeWidth="2.5"
        strokeLinejoin="round"
        fill="#C65D3B"
        fillOpacity="0.10"
      />
      <rect x="19" y="31" width="10" height="10" rx="1.5" fill="#C65D3B" fillOpacity="0.35" />
      <circle cx="37" cy="11" r="5" fill="#D4A373" />
    </svg>
  );
}
