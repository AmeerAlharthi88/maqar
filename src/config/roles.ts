export type AppRole = "guest" | "user" | "agent" | "agency_admin" | "admin" | "super_admin";

export const ROLE_LABELS_AR: Record<AppRole, string> = {
  guest:         "زائر",
  user:          "مستخدم",
  agent:         "وكيل عقاري",
  agency_admin:  "مدير وكالة",
  admin:         "مشرف",
  super_admin:   "مشرف عام",
};

export const ROLE_LABELS_EN: Record<AppRole, string> = {
  guest:         "Guest",
  user:          "User",
  agent:         "Agent",
  agency_admin:  "Agency Admin",
  admin:         "Admin",
  super_admin:   "Super Admin",
};

export const ROLE_HIERARCHY: Record<AppRole, number> = {
  guest:        0,
  user:         1,
  agent:        2,
  agency_admin: 3,
  admin:        4,
  super_admin:  5,
};

export function hasRole(userRole: AppRole, requiredRole: AppRole): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
}

export const ROUTE_ROLE_REQUIREMENTS: Record<string, AppRole> = {
  "/account":     "user",
  "/add-listing": "user",
  "/my-listings": "agent",
  "/agent":       "agent",
  "/agency":      "agency_admin",
  "/admin":       "admin",
};
