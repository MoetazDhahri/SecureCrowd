/*
  # SecureCrowd Tunisia - Initial Database Schema

  ## Overview
  Creates the core database structure for the SecureCrowd investment platform, 
  including user profiles, investment projects, portfolios, capital calls, alerts, 
  and risk assessments.

  ## New Tables

  ### 1. `profiles`
  User profile and KYC information
  - `id` (uuid, references auth.users)
  - `full_name` (text)
  - `risk_profile` (text) - Conservative, Balanced, Aggressive
  - `kyc_verified` (boolean)
  - `investment_limit` (numeric)
  - `total_aum` (numeric) - Assets Under Management
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 2. `projects`
  Investment opportunities (startups, crypto, green initiatives)
  - `id` (uuid, primary key)
  - `name` (text)
  - `description` (text)
  - `category` (text) - startup, crypto, green, real_estate
  - `target_amount` (numeric)
  - `current_amount` (numeric)
  - `min_investment` (numeric)
  - `expected_roi` (numeric)
  - `financial_risk_score` (numeric) - 0-100
  - `cyber_risk_score` (numeric) - 0-100
  - `status` (text) - active, funded, closed
  - `image_url` (text)
  - `created_at` (timestamptz)

  ### 3. `project_security`
  Cybersecurity verification for projects
  - `id` (uuid, primary key)
  - `project_id` (uuid, references projects)
  - `smart_contract_audit` (boolean)
  - `kyc_verified` (boolean)
  - `domain_verified` (boolean)
  - `ssl_verified` (boolean)
  - `audit_report_url` (text)
  - `last_security_check` (timestamptz)

  ### 4. `portfolios`
  User investment portfolios
  - `id` (uuid, primary key)
  - `user_id` (uuid, references profiles)
  - `project_id` (uuid, references projects)
  - `amount_invested` (numeric)
  - `current_value` (numeric)
  - `roi_percentage` (numeric)
  - `invested_at` (timestamptz)

  ### 5. `capital_calls`
  Capital call requests from projects
  - `id` (uuid, primary key)
  - `project_id` (uuid, references projects)
  - `user_id` (uuid, references profiles)
  - `amount_requested` (numeric)
  - `deadline` (timestamptz)
  - `status` (text) - pending, approved, declined
  - `ai_recommendation` (text)
  - `blockchain_tx_hash` (text)
  - `created_at` (timestamptz)

  ### 6. `alerts`
  Security and investment alerts
  - `id` (uuid, primary key)
  - `user_id` (uuid, references profiles)
  - `project_id` (uuid, references projects, nullable)
  - `type` (text) - security, market, project_update, rug_pull, phishing
  - `severity` (text) - low, medium, high, critical
  - `title` (text)
  - `message` (text)
  - `is_read` (boolean)
  - `action_taken` (text) - freeze, dismiss, null
  - `created_at` (timestamptz)

  ### 7. `ai_recommendations`
  AI-generated investment recommendations
  - `id` (uuid, primary key)
  - `user_id` (uuid, references profiles)
  - `project_id` (uuid, references projects)
  - `recommendation` (text) - invest, caution, avoid
  - `allocation_percentage` (numeric)
  - `rationale` (text)
  - `confidence_score` (numeric)
  - `created_at` (timestamptz)

  ## Security
  - RLS enabled on all tables
  - Users can only access their own data
  - Public read access for projects and project_security
  - Authenticated users can insert portfolios and respond to capital calls
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  full_name text,
  risk_profile text DEFAULT 'balanced',
  kyc_verified boolean DEFAULT false,
  investment_limit numeric DEFAULT 10000,
  total_aum numeric DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  category text NOT NULL,
  target_amount numeric NOT NULL,
  current_amount numeric DEFAULT 0,
  min_investment numeric DEFAULT 100,
  expected_roi numeric DEFAULT 0,
  financial_risk_score numeric DEFAULT 50,
  cyber_risk_score numeric DEFAULT 50,
  status text DEFAULT 'active',
  image_url text,
  created_at timestamptz DEFAULT now()
);

-- Create project_security table
CREATE TABLE IF NOT EXISTS project_security (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects ON DELETE CASCADE NOT NULL,
  smart_contract_audit boolean DEFAULT false,
  kyc_verified boolean DEFAULT false,
  domain_verified boolean DEFAULT false,
  ssl_verified boolean DEFAULT false,
  audit_report_url text,
  last_security_check timestamptz DEFAULT now()
);

-- Create portfolios table
CREATE TABLE IF NOT EXISTS portfolios (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles ON DELETE CASCADE NOT NULL,
  project_id uuid REFERENCES projects ON DELETE CASCADE NOT NULL,
  amount_invested numeric NOT NULL,
  current_value numeric NOT NULL,
  roi_percentage numeric DEFAULT 0,
  invested_at timestamptz DEFAULT now()
);

-- Create capital_calls table
CREATE TABLE IF NOT EXISTS capital_calls (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES profiles ON DELETE CASCADE NOT NULL,
  amount_requested numeric NOT NULL,
  deadline timestamptz NOT NULL,
  status text DEFAULT 'pending',
  ai_recommendation text,
  blockchain_tx_hash text,
  created_at timestamptz DEFAULT now()
);

-- Create alerts table
CREATE TABLE IF NOT EXISTS alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles ON DELETE CASCADE NOT NULL,
  project_id uuid REFERENCES projects ON DELETE SET NULL,
  type text NOT NULL,
  severity text NOT NULL,
  title text NOT NULL,
  message text,
  is_read boolean DEFAULT false,
  action_taken text,
  created_at timestamptz DEFAULT now()
);

-- Create ai_recommendations table
CREATE TABLE IF NOT EXISTS ai_recommendations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles ON DELETE CASCADE NOT NULL,
  project_id uuid REFERENCES projects ON DELETE CASCADE NOT NULL,
  recommendation text NOT NULL,
  allocation_percentage numeric,
  rationale text,
  confidence_score numeric DEFAULT 75,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_security ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE capital_calls ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_recommendations ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Projects policies (public read)
CREATE POLICY "Anyone can view projects"
  ON projects FOR SELECT
  TO authenticated
  USING (true);

-- Project security policies (public read)
CREATE POLICY "Anyone can view project security"
  ON project_security FOR SELECT
  TO authenticated
  USING (true);

-- Portfolios policies
CREATE POLICY "Users can view own portfolios"
  ON portfolios FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own portfolios"
  ON portfolios FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own portfolios"
  ON portfolios FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Capital calls policies
CREATE POLICY "Users can view own capital calls"
  ON capital_calls FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own capital calls"
  ON capital_calls FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Alerts policies
CREATE POLICY "Users can view own alerts"
  ON alerts FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own alerts"
  ON alerts FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- AI recommendations policies
CREATE POLICY "Users can view own recommendations"
  ON ai_recommendations FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);