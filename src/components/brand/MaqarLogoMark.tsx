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
        stroke="#0A3C36"
        strokeWidth="2"
        strokeLinejoin="round"
        fill="#0A3C36"
        fillOpacity="0.06"
      />
      <rect x="19" y="31" width="10" height="10" rx="1.5"
        stroke="#0A3C36" strokeWidth="1.5" fill="#0A3C36" fillOpacity="0.12" />
      <circle cx="37" cy="11" r="4.5" fill="#E5BA73" />
    </svg>
  );
}
