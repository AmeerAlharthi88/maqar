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
                ? "bg-[#C65D3B] text-white"
                : "bg-[#F5F0EA] text-[#7A6B5E] hover:bg-[#EBE3D8]"
            )}
          >
            {tab.labelAr}
            {tab.badge !== undefined && tab.badge > 0 && (
              <span className={cn(
                "text-xs px-1.5 py-0.5 rounded-full leading-none font-semibold",
                activeTab === tab.id ? "bg-white/25 text-white" : "bg-[#E8DDD0] text-[#7A6B5E]"
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
        "flex overflow-x-auto scrollbar-hide border-b border-[#E8DDD0]",
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
              ? "border-[#C65D3B] text-[#C65D3B]"
              : "border-transparent text-[#7A6B5E] hover:text-[#1E1E1E]"
          )}
        >
          {tab.labelAr}
          {tab.badge !== undefined && tab.badge > 0 && (
            <span className={cn(
              "text-xs px-1.5 rounded-full leading-none font-semibold py-0.5",
              activeTab === tab.id ? "bg-[#FBF0EB] text-[#C65D3B]" : "bg-[#F5F0EA] text-[#7A6B5E]"
            )}>
              {tab.badge}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
