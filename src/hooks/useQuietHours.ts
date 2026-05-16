"use client";

import { useState, useEffect } from "react";
import { isQuietHour, QUIET_HOURS } from "@/config/quiet-hours";

export function useQuietHours() {
  const [quiet, setQuiet] = useState(() => isQuietHour());

  useEffect(() => {
    // Re-check every 5 minutes
    const t = setInterval(() => setQuiet(isQuietHour()), 5 * 60 * 1000);
    return () => clearInterval(t);
  }, []);

  return { isQuietHour: quiet, warningAr: QUIET_HOURS.warningAr };
}
