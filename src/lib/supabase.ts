import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Profile = {
  id: string;
  full_name: string | null;
  risk_profile: string;
  kyc_verified: boolean;
  investment_limit: number;
  total_aum: number;
  created_at: string;
  updated_at: string;
};

export type Project = {
  id: string;
  name: string;
  description: string | null;
  category: string;
  target_amount: number;
  current_amount: number;
  min_investment: number;
  expected_roi: number;
  financial_risk_score: number;
  cyber_risk_score: number;
  status: string;
  image_url: string | null;
  created_at: string;
};

export type ProjectSecurity = {
  id: string;
  project_id: string;
  smart_contract_audit: boolean;
  kyc_verified: boolean;
  domain_verified: boolean;
  ssl_verified: boolean;
  audit_report_url: string | null;
  last_security_check: string;
};

export type Portfolio = {
  id: string;
  user_id: string;
  project_id: string;
  amount_invested: number;
  current_value: number;
  roi_percentage: number;
  invested_at: string;
};

export type CapitalCall = {
  id: string;
  project_id: string;
  user_id: string;
  amount_requested: number;
  deadline: string;
  status: string;
  ai_recommendation: string | null;
  blockchain_tx_hash: string | null;
  created_at: string;
};

export type Alert = {
  id: string;
  user_id: string;
  project_id: string | null;
  type: string;
  severity: string;
  title: string;
  message: string | null;
  is_read: boolean;
  action_taken: string | null;
  created_at: string;
};

export type AIRecommendation = {
  id: string;
  user_id: string;
  project_id: string;
  recommendation: string;
  allocation_percentage: number | null;
  rationale: string | null;
  confidence_score: number;
  created_at: string;
};
