"use client";

import { MaqarLogo } from "@/components/brand/MaqarLogo";
import { SmartSearch } from "@/components/search/SmartSearch";
import { PropertyTypeChips } from "@/components/search/PropertyTypeChips";
import { APP_CONFIG } from "@/config/app";

export function HeroSearch() {
  return (
    <section className="bg-gradient-to-b from-[#FAF7F2] to-white px-4 pt-5 pb-6">
      {/* Logo + tagline */}
      <div className="mb-5">
        <MaqarLogo size="sm" />
        <p className="mt-1.5 text-xs text-[#A89480] font-medium">{APP_CONFIG.taglineAr}</p>
      </div>

      {/* Greeting */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-[#1E1E1E] leading-tight">
          ابحث عن مقرك
          <span className="text-[#C65D3B]"> في عُمان</span>
        </h1>
        <p className="text-sm text-[#7A6B5E] mt-1">
          آلاف العقارات في مسقط وصلالة وصحار وسائر المحافظات
        </p>
      </div>

      {/* Search */}
      <SmartSearch
        size="lg"
        placeholder="فيلا في بوشر، شقة في الخوير..."
        className="mb-4"
      />

      {/* Property type chips */}
      <PropertyTypeChips />
    </section>
  );
}
