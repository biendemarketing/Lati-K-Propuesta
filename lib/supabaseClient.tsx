import { createClient } from '@supabase/supabase-js';
import type { Json } from '@supabase/supabase-js';

// --- PROPOSAL DATA TYPES ---
interface HeroData {
  backgroundImageUrl: string;
  subtitle: string;
  title: string;
  description: string;
  clientLabel: string;
  clientName: string;
  activityLabel: string;
  activityName: string;
  themeLabel: string;
  themeName: string;
}

interface ProposalCard {
  title: string;
  description: string;
  imageUrl: string;
}

interface ProposalSectionData {
  title: string;
  cards: ProposalCard[];
}

interface ServiceCard {
  enabled: boolean;
  title:string;
  icon: string;
  items: string[];
  imageUrl: string;
}

interface ServicesSectionData {
  title: string;
  cards: ServiceCard[];
}

interface FeatureItem {
  reverse: boolean;
  title: string;
  icon: string;
  description: string;
  imageUrl: string;
}

interface FeaturesSectionData {
  title: string;
  items: FeatureItem[];
}

interface IncludedItem {
  icon: string;
  text: string;
}

interface IncludedSectionData {
  title: string;
  listTitle: string;
  items: IncludedItem[];
  costTitle: string;
  cost: string;
  costDescription: string;
  ctaButtonText: string;
}

interface FooterData {
  logoAlt: string;
  phoneLabel: string;
  phoneNumber: string;
  emailLabel: string;
  emailAddress: string;
  addressLabel: string;
  address: string;
  copyright: string;
}

export interface ProposalData {
  logoUrl: string;
  hero: HeroData;
  proposal: ProposalSectionData;
  services: ServicesSectionData;
  features: FeaturesSectionData;
  included: IncludedSectionData;
  footer: FooterData;
}


export interface Database {
  public: {
    Tables: {
      proposals: {
        Row: {
          id: number
          created_at: string
          slug: string
          data: Json
          updated_at: string | null
        }
        Insert: {
          id?: number
          created_at?: string
          slug: string
          data: Json
          updated_at?: string | null
        }
        Update: {
          id?: number
          created_at?: string
          slug?: string
          data?: Json
          updated_at?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

const supabaseUrl = 'https://rnqlkcapgzapcdzzwlpq.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJucWxrY2FwZ3phcGNkenp3bHBxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3NDQxMjUsImV4cCI6MjA3MTMyMDEyNX0.A6Ppoi8MP56rH4beeLXsioqp5zi5n2p79lZjBY9yHpA';

if (!supabaseUrl) {
  console.error("Supabase URL is not configured. Please add it to lib/supabaseClient.tsx");
}
if (!supabaseAnonKey) {
  console.error("Supabase Anon Key is not configured. Please add it to lib/supabaseClient.tsx");
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);