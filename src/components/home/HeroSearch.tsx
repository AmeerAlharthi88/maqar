"use client";

import { MaqarLogo } from "@/components/brand/MaqarLogo";
import { SmartSearch } from "@/components/search/SmartSearch";
import { PropertyTypeChips } from "@/components/search/PropertyTypeChips";
import { APP_CONFIG } from "@/config/app";

export function HeroSearch() {
  return (
    <section className="bg-gradient-to-b from-[#FAF7F2] to-white px-4 pt-4 pb-5 lg:pt-6 lg:pb-6 lg:max-w-3xl lg:mx-auto">
      {/* Logo + tagline — hidden on desktop since header provides branding */}
      <div className="mb-4 lg:hidden">
        <MaqarLogo size="sm" />
        <p className="mt-1.5 text-xs text-[#A89480] font-medium">{APP_CONFIG.taglineAr}</p>
      </div>

      {/* Greeting */}
      <div className="mb-3 lg:mb-4 lg:text-center">
        <h1 className="text-2xl lg:text-3xl font-bold text-[#1E1E1E] leading-tight">
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
        className="mb-3"
      />

      {/* Property type chips */}
      <PropertyTypeChips />
    </section>
  );
}
