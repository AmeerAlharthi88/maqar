interface DashboardMetricCardProps {
  labelAr: string;
  value: string | number;
  subLabelAr?: string;
  icon?: React.ReactNode;
  trend?: { value: string; up: boolean } | null;
  accent?: boolean;
}

export function DashboardMetricCard({
  labelAr,
  value,
  subLabelAr,
  icon,
  trend,
  accent = false,
}: DashboardMetricCardProps) {
  return (
    <div
      className={[
        "rounded-2xl px-4 py-4 flex flex-col gap-1 border",
        accent
          ? "bg-[#C65D3B] border-transparent"
          : "bg-white border-[#F0EBE3]",
      ].join(" ")}
    >
      {icon && (
        <span className={accent ? "text-white/80" : "text-[#A89480]"}>
          {icon}
        </span>
      )}
      <p
        className={[
          "text-2xl font-bold leading-none",
          accent ? "text-white" : "text-[#1E1E1E]",
        ].join(" ")}
      >
        {value}
      </p>
      <p
        className={[
          "text-xs font-medium",
          accent ? "text-white/80" : "text-[#7A6B5E]",
        ].join(" ")}
      >
        {labelAr}
      </p>
      {subLabelAr && (
        <p className={["text-[10px]", accent ? "text-white/60" : "text-[#A89480]"].join(" ")}>
          {subLabelAr}
        </p>
      )}
      {trend && (
        <p
          className={[
            "text-[10px] font-semibold",
            trend.up ? "text-[#5B8C5A]" : "text-[#C65D3B]",
            accent ? "opacity-90" : "",
          ].join(" ")}
        >
          {trend.up ? "▲" : "▼"} {trend.value}
        </p>
      )}
    </div>
  );
}
