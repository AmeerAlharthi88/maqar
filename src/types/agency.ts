export interface AgencyStats {
  totalListings: number;
  activeListings: number;
  soldListings: number;
  totalAgents: number;
  rating: number;
  reviewCount: number;
  avgResponseTime: string;
}

export interface AgencyMember {
  id: string;
  nameAr: string;
  phone: string;
  email?: string;
  avatar?: string;
  role: "agency_admin" | "manager" | "agent" | "viewer";
  isVerified: boolean;
  activeListings: number;
  joinedAt: string;
}

export interface Agency {
  id: string;
  nameAr: string;
  nameEn?: string;
  logo?: string;
  phone: string;
  whatsapp: string;
  email?: string;
  website?: string;
  crNumber?: string;
  licenseNumber?: string;
  isVerified: boolean;
  location: {
    governorateAr: string;
    wilayatAr: string;
    addressAr: string;
  };
  specializationAr: string[];
  areasAr: string[];
  stats: AgencyStats;
  members?: AgencyMember[];
  foundedYear: number;
  descriptionAr?: string;
}
