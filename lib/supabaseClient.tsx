import { createClient } from '@supabase/supabase-js';

// The 'Json' type is not exported from the root of '@supabase/supabase-js'.
// This is a compatible definition for JSONB columns.
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

// --- PROPOSAL DATA TYPES ---

interface ThemeData {
  name: string;
  primary: string;
  primaryGradientFrom: string;
  primaryGradientTo: string;
}

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
  template: string;
  theme: ThemeData;
  logoUrl: string;
  hero: HeroData;
  proposal: ProposalSectionData;
  services: ServicesSectionData;
  features: FeaturesSectionData;
  included: IncludedSectionData;
  footer: FooterData;
  status: 'Draft' | 'Sent' | 'Accepted' | 'Changes Requested' | null;
}

export type ProposalComment = {
  id: number;
  created_at: string;
  proposal_slug: string;
  author_name: string;
  comment_text: string;
};

export interface Database {
  public: {
    Tables: {
      proposals: {
        Row: {
          id: number
          created_at: string
          slug: string
          data: ProposalData
          updated_at: string
        }
        Insert: {
          id?: number
          created_at?: string
          slug: string
          data: ProposalData
          updated_at?: string
        }
        Update: {
          id?: number
          created_at?: string
          slug?: string
          data?: ProposalData
          updated_at?: string
        }
        Relationships: []
      }
      proposal_views: {
        Row: {
          id: number
          created_at: string
          proposal_slug: string
        }
        Insert: {
          id?: number
          created_at?: string
          proposal_slug: string
        }
        Update: {
          id?: number
          created_at?: string
          proposal_slug?: string
        }
        Relationships: [
          {
            foreignKeyName: 'proposal_views_proposal_slug_fkey'
            columns: ['proposal_slug']
            referencedRelation: 'proposals'
            referencedColumns: ['slug']
          }
        ]
      }
      proposal_comments: {
        Row: ProposalComment
        Insert: {
          id?: number
          created_at?: string
          proposal_slug: string
          author_name: string
          comment_text: string
        }
        Update: {
          id?: number
          created_at?: string
          proposal_slug?: string
          author_name?: string
          comment_text?: string
        }
        Relationships: [
          {
            foreignKeyName: 'proposal_comments_proposal_slug_fkey'
            columns: ['proposal_slug']
            referencedRelation: 'proposals'
            referencedColumns: ['slug']
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
       get_proposals_with_view_counts: {
        Args: {}
        Returns: {
          slug: string
          created_at: string
          view_count: number
          last_viewed: string | null
        }[]
      }
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