export interface AgentStats {
  totalListings: number;
  activeListings: number;
  soldListings: number;
  avgResponseTime: string;  // e.g. "30 دقيقة"
  rating: number;           // 1-5
  reviewCount: number;
}

export interface Agent {
  id: string;
  nameAr: string;
  nameEn?: string;
  phone: string;          // Oman: +968 XXXX XXXX
  whatsapp: string;
  email?: string;
  avatar?: string;
  agency?: {
    nameAr: string;
    nameEn?: string;
    logo?: string;
  };
  licenseNumber?: string;
  isVerified: boolean;
  specializationAr: string[];
  areasAr: string[];
  stats: AgentStats;
  joinedAt: string;
}
