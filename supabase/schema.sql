/*
  # Zakovat LRC Studio Database Schema

  Complete database schema for Zakovat intellectual games management system.

  Tables:
  1. teams - Teams participating in tournaments
  2. tournaments - Tournaments/competitions
  3. games - Individual games within tournaments
  4. game_results - Results of games for each team
  5. questions - Questions used in games
  6. gallery_items - Photos/videos from events
  7. hall_of_fame - Historical champions and records

  Security:
  - RLS enabled on all tables
  - Public read access for all tables
  - Admin write access controlled by email

  IMPORTANT: Replace 'YOUR_ADMIN_EMAIL_HERE' with actual admin email throughout
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- TABLE: teams
-- ============================================================

CREATE TABLE IF NOT EXISTS teams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  division text NOT NULL,
  grade_group text,
  captain text,
  players jsonb DEFAULT '[]'::jsonb,
  photo_url text,
  games_played integer DEFAULT 0,
  cups integer DEFAULT 0,
  gold integer DEFAULT 0,
  silver integer DEFAULT 0,
  bronze integer DEFAULT 0,
  correct_answers integer DEFAULT 0,
  win_rate numeric DEFAULT 0,
  best_result text,
  season text,
  tournament_types jsonb DEFAULT '[]'::jsonb,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE teams ENABLE ROW LEVEL SECURITY;

CREATE POLICY "teams_read_public" ON teams
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "teams_write_admin" ON teams
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.email() = 'YOUR_ADMIN_EMAIL_HERE');

CREATE POLICY "teams_update_admin" ON teams
  FOR UPDATE
  TO authenticated
  USING (auth.email() = 'YOUR_ADMIN_EMAIL_HERE')
  WITH CHECK (auth.email() = 'YOUR_ADMIN_EMAIL_HERE');

CREATE POLICY "teams_delete_admin" ON teams
  FOR DELETE
  TO authenticated
  USING (auth.email() = 'YOUR_ADMIN_EMAIL_HERE');

-- ============================================================
-- TABLE: tournaments
-- ============================================================

CREATE TABLE IF NOT EXISTS tournaments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  type text NOT NULL,
  date date,
  status text,
  winner text,
  teams_count integer DEFAULT 0,
  season text,
  division text,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE tournaments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "tournaments_read_public" ON tournaments
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "tournaments_write_admin" ON tournaments
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.email() = 'YOUR_ADMIN_EMAIL_HERE');

CREATE POLICY "tournaments_update_admin" ON tournaments
  FOR UPDATE
  TO authenticated
  USING (auth.email() = 'YOUR_ADMIN_EMAIL_HERE')
  WITH CHECK (auth.email() = 'YOUR_ADMIN_EMAIL_HERE');

CREATE POLICY "tournaments_delete_admin" ON tournaments
  FOR DELETE
  TO authenticated
  USING (auth.email() = 'YOUR_ADMIN_EMAIL_HERE');

-- ============================================================
-- TABLE: games
-- ============================================================

CREATE TABLE IF NOT EXISTS games (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  tournament_id uuid REFERENCES tournaments(id) ON DELETE SET NULL,
  tournament_title text,
  date date,
  season text,
  round text,
  status text,
  participating_teams jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE games ENABLE ROW LEVEL SECURITY;

CREATE POLICY "games_read_public" ON games
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "games_write_admin" ON games
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.email() = 'YOUR_ADMIN_EMAIL_HERE');

CREATE POLICY "games_update_admin" ON games
  FOR UPDATE
  TO authenticated
  USING (auth.email() = 'YOUR_ADMIN_EMAIL_HERE')
  WITH CHECK (auth.email() = 'YOUR_ADMIN_EMAIL_HERE');

CREATE POLICY "games_delete_admin" ON games
  FOR DELETE
  TO authenticated
  USING (auth.email() = 'YOUR_ADMIN_EMAIL_HERE');

-- ============================================================
-- TABLE: game_results
-- ============================================================

CREATE TABLE IF NOT EXISTS game_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id uuid REFERENCES games(id) ON DELETE CASCADE,
  tournament_id uuid REFERENCES tournaments(id) ON DELETE SET NULL,
  team_id uuid REFERENCES teams(id) ON DELETE CASCADE,
  team_name text,
  date date,
  season text,
  tournament_type text,
  division text,
  place integer,
  cups integer DEFAULT 0,
  gold integer DEFAULT 0,
  silver integer DEFAULT 0,
  bronze integer DEFAULT 0,
  correct_answers integer DEFAULT 0,
  tie_breaker_result text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE game_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "game_results_read_public" ON game_results
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "game_results_write_admin" ON game_results
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.email() = 'YOUR_ADMIN_EMAIL_HERE');

CREATE POLICY "game_results_update_admin" ON game_results
  FOR UPDATE
  TO authenticated
  USING (auth.email() = 'YOUR_ADMIN_EMAIL_HERE')
  WITH CHECK (auth.email() = 'YOUR_ADMIN_EMAIL_HERE');

CREATE POLICY "game_results_delete_admin" ON game_results
  FOR DELETE
  TO authenticated
  USING (auth.email() = 'YOUR_ADMIN_EMAIL_HERE');

-- ============================================================
-- TABLE: questions
-- ============================================================

CREATE TABLE IF NOT EXISTS questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  number integer,
  text text NOT NULL,
  answer text NOT NULL,
  topic text,
  difficulty integer,
  tournament text,
  tournament_type text,
  game text,
  season text,
  date date,
  image_url text,
  explanation text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "questions_read_public" ON questions
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "questions_write_admin" ON questions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.email() = 'YOUR_ADMIN_EMAIL_HERE');

CREATE POLICY "questions_update_admin" ON questions
  FOR UPDATE
  TO authenticated
  USING (auth.email() = 'YOUR_ADMIN_EMAIL_HERE')
  WITH CHECK (auth.email() = 'YOUR_ADMIN_EMAIL_HERE');

CREATE POLICY "questions_delete_admin" ON questions
  FOR DELETE
  TO authenticated
  USING (auth.email() = 'YOUR_ADMIN_EMAIL_HERE');

-- ============================================================
-- TABLE: gallery_items
-- ============================================================

CREATE TABLE IF NOT EXISTS gallery_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  image_url text,
  media_type text,
  date date,
  season text,
  tournament text,
  tournament_type text,
  game text,
  team text,
  caption text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE gallery_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "gallery_items_read_public" ON gallery_items
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "gallery_items_write_admin" ON gallery_items
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.email() = 'YOUR_ADMIN_EMAIL_HERE');

CREATE POLICY "gallery_items_update_admin" ON gallery_items
  FOR UPDATE
  TO authenticated
  USING (auth.email() = 'YOUR_ADMIN_EMAIL_HERE')
  WITH CHECK (auth.email() = 'YOUR_ADMIN_EMAIL_HERE');

CREATE POLICY "gallery_items_delete_admin" ON gallery_items
  FOR DELETE
  TO authenticated
  USING (auth.email() = 'YOUR_ADMIN_EMAIL_HERE');

-- ============================================================
-- TABLE: hall_of_fame
-- ============================================================

CREATE TABLE IF NOT EXISTS hall_of_fame (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  year integer,
  season text,
  champion_team text,
  team_photo text,
  captain text,
  players jsonb DEFAULT '[]'::jsonb,
  cups integer DEFAULT 0,
  gold integer DEFAULT 0,
  silver integer DEFAULT 0,
  bronze integer DEFAULT 0,
  best_result text,
  description text,
  achievements jsonb DEFAULT '[]'::jsonb,
  record_type text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE hall_of_fame ENABLE ROW LEVEL SECURITY;

CREATE POLICY "hall_of_fame_read_public" ON hall_of_fame
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "hall_of_fame_write_admin" ON hall_of_fame
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.email() = 'YOUR_ADMIN_EMAIL_HERE');

CREATE POLICY "hall_of_fame_update_admin" ON hall_of_fame
  FOR UPDATE
  TO authenticated
  USING (auth.email() = 'YOUR_ADMIN_EMAIL_HERE')
  WITH CHECK (auth.email() = 'YOUR_ADMIN_EMAIL_HERE');

CREATE POLICY "hall_of_fame_delete_admin" ON hall_of_fame
  FOR DELETE
  TO authenticated
  USING (auth.email() = 'YOUR_ADMIN_EMAIL_HERE');

-- ============================================================
-- INDEXES
-- ============================================================

CREATE INDEX idx_teams_division ON teams(division);
CREATE INDEX idx_teams_season ON teams(season);
CREATE INDEX idx_tournaments_season ON tournaments(season);
CREATE INDEX idx_tournaments_type ON tournaments(type);
CREATE INDEX idx_games_tournament_id ON games(tournament_id);
CREATE INDEX idx_game_results_team_id ON game_results(team_id);
CREATE INDEX idx_game_results_tournament_id ON game_results(tournament_id);
CREATE INDEX idx_questions_season ON questions(season);
CREATE INDEX idx_gallery_season ON gallery_items(season);
CREATE INDEX idx_hall_of_fame_year ON hall_of_fame(year);
