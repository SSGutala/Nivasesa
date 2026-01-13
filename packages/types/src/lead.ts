export type LeadStatus = 'NEW' | 'UNLOCKED' | 'CONTACTED' | 'CONVERTED' | 'LOST';

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  city: string;
  status: LeadStatus;
  createdAt: Date;
}

export interface RealtorProfile {
  userId: string;
  name: string;
  email: string;
  phone: string;
  languages: string[];
  cities: string[];
  verified: boolean;
  walletBalance: number;
}
