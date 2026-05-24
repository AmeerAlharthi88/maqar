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
          ? "bg-[#0A3C36] border-transparent"
          : "bg-white border-[#E2E8F0]",
      ].join(" ")}
    >
      {icon && (
        <span className={accent ? "text-white/80" : "text-[#627D98]"}>
          {icon}
        </span>
      )}
      <p
        className={[
          "text-2xl font-bold leading-none",
          accent ? "text-white" : "text-[#102A43]",
        ].join(" ")}
      >
        {value}
      </p>
      <p
        className={[
          "text-xs font-medium",
          accent ? "text-white/80" : "text-[#627D98]",
        ].join(" ")}
      >
        {labelAr}
      </p>
      {subLabelAr && (
        <p className={["text-[10px]", accent ? "text-white/60" : "text-[#627D98]"].join(" ")}>
          {subLabelAr}
        </p>
      )}
      {trend && (
        <p
          className={[
            "text-[10px] font-semibold",
            trend.up ? "text-[#0A3C36]" : "text-[#C0392B]",
            accent ? "opacity-90" : "",
          ].join(" ")}
        >
          {trend.up ? "▲" : "▼"} {trend.value}
        </p>
      )}
    </div>
  );
}
