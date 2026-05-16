/**
 * Quiet hours: 11 PM – 7 AM Oman Standard Time (UTC+4).
 * During quiet hours, WhatsApp CTA shows a warning and push
 * notifications are suppressed.
 */
export const QUIET_HOURS = {
  startHour: 23,  // 11 PM
  endHour:   7,   // 7 AM
  timezone:  "Asia/Muscat",
  warningAr: "خارج ساعات العمل. سيتواصل معك الوكيل صباحاً.",
} as const;

export function isQuietHour(): boolean {
  const now = new Date();
  const omHour = new Date(
    now.toLocaleString("en-US", { timeZone: QUIET_HOURS.timezone })
  ).getHours();
  return omHour >= QUIET_HOURS.startHour || omHour < QUIET_HOURS.endHour;
}
