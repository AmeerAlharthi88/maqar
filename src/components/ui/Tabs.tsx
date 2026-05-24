"use client";

import { useRef } from "react";
import { cn } from "@/lib/utils";

interface Tab {
  id: string;
  labelAr: string;
  badge?: number;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (id: string) => void;
  variant?: "underline" | "pill";
  className?: string;
}

export function Tabs({ tabs, activeTab, onChange, variant = "underline", className }: TabsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  if (variant === "pill") {
    return (
      <div className={cn("flex gap-2 flex-wrap", className)}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={cn(
              "flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-150",
              activeTab === tab.id
                ? "bg-[#0A3C36] text-white"
                : "bg-[#F0F4F8] text-[#627D98] hover:bg-[#E6F0EF]"
            )}
          >
            {tab.labelAr}
            {tab.badge !== undefined && tab.badge > 0 && (
              <span className={cn(
                "text-xs px-1.5 py-0.5 rounded-full leading-none font-semibold",
                activeTab === tab.id ? "bg-white/25 text-white" : "bg-[#E2E8F0] text-[#627D98]"
              )}>
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div
      ref={scrollRef}
      className={cn(
        "flex overflow-x-auto scrollbar-hide border-b border-[#E2E8F0]",
        "[scrollbar-width:none] [-ms-overflow-style:none]",
        className
      )}
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={cn(
            "flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition-all duration-150 border-b-2 -mb-px",
            activeTab === tab.id
              ? "border-[#0A3C36] text-[#0A3C36]"
              : "border-transparent text-[#627D98] hover:text-[#102A43]"
          )}
        >
          {tab.labelAr}
          {tab.badge !== undefined && tab.badge > 0 && (
            <span className={cn(
              "text-xs px-1.5 rounded-full leading-none font-semibold py-0.5",
              activeTab === tab.id ? "bg-[#E6F0EF] text-[#0A3C36]" : "bg-[#F0F4F8] text-[#627D98]"
            )}>
              {tab.badge}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
