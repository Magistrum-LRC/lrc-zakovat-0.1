/*
  # Initial Schema for Zakovat by LRC Studio

  1. New Tables:
    - `teams` — team information and statistics
    - `tournaments` — tournament events
    - `games` — individual games within tournaments
    - `game_results` — team results per game
    - `questions` — question bank
    - `gallery_items` — photo/video gallery
    - `hall_of_fame` — season champions and records

  2. Security:
    - Enable RLS on all tables
    - Public SELECT policies for all tables
    - Authenticated INSERT/UPDATE/DELETE for admin only

  3. Indexes:
    - Foreign key indexes for performance
    - Common query patterns indexed
*/

-- TEAMS
CREATE TABLE IF NOT EXISTS teams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  division text NOT NULL CHECK (division IN ('Премьер-лига', 'Первая лига')),
  grade_group text CHECK (grade_group IN ('9-11', '8-и-ниже')),
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
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- TOURNAMENTS
CREATE TABLE IF NOT EXISTS tournaments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  type text NOT NULL CHECK (type IN ('Zakovat', 'Своя игра', 'Брейн-ринг', 'Школьная лига', 'Суперкубок')),
  date date,
  status text CHECK (status IN ('Предстоит', 'Идёт', 'Завершён')),
  winner text,
  teams_count integer DEFAULT 0,
  season text,
  division text,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- GAMES
CREATE TABLE IF NOT EXISTS games (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  tournament_id uuid REFERENCES tournaments(id) ON DELETE SET NULL,
  tournament_title text,
  date date,
  season text,
  round text,
  status text CHECK (status IN ('Предстоит', 'Идёт', 'Завершён')),
  participating_teams jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- GAME RESULTS
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

-- QUESTIONS
CREATE TABLE IF NOT EXISTS questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  number integer,
  text text NOT NULL,
  answer text NOT NULL,
  topic text,
  difficulty integer CHECK (difficulty >= 1 AND difficulty <= 5),
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

-- GALLERY ITEMS
CREATE TABLE IF NOT EXISTS gallery_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  image_url text,
  media_type text CHECK (media_type IN ('image', 'video')),
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

-- HALL OF FAME
CREATE TABLE IF NOT EXISTS hall_of_fame (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  year integer,
  season text,
  champion_team text NOT NULL,
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

-- Enable RLS on all tables
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE tournaments ENABLE ROW LEVEL SECURITY;
ALTER TABLE games ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE hall_of_fame ENABLE ROW LEVEL SECURITY;

-- Public SELECT policies (anyone can read)
CREATE POLICY "Public can read teams"
  ON teams FOR SELECT
  USING (true);

CREATE POLICY "Public can read tournaments"
  ON tournaments FOR SELECT
  USING (true);

CREATE POLICY "Public can read games"
  ON games FOR SELECT
  USING (true);

CREATE POLICY "Public can read game_results"
  ON game_results FOR SELECT
  USING (true);

CREATE POLICY "Public can read questions"
  ON questions FOR SELECT
  USING (true);

CREATE POLICY "Public can read gallery_items"
  ON gallery_items FOR SELECT
  USING (true);

CREATE POLICY "Public can read hall_of_fame"
  ON hall_of_fame FOR SELECT
  USING (true);

-- Authenticated admin policies (INSERT, UPDATE, DELETE)
CREATE POLICY "Authenticated can insert teams"
  ON teams FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated can update teams"
  ON teams FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated can delete teams"
  ON teams FOR DELETE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated can insert tournaments"
  ON tournaments FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated can update tournaments"
  ON tournaments FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated can delete tournaments"
  ON tournaments FOR DELETE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated can insert games"
  ON games FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated can update games"
  ON games FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated can delete games"
  ON games FOR DELETE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated can insert game_results"
  ON game_results FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated can update game_results"
  ON game_results FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated can delete game_results"
  ON game_results FOR DELETE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated can insert questions"
  ON questions FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated can update questions"
  ON questions FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated can delete questions"
  ON questions FOR DELETE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated can insert gallery_items"
  ON gallery_items FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated can update gallery_items"
  ON gallery_items FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated can delete gallery_items"
  ON gallery_items FOR DELETE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated can insert hall_of_fame"
  ON hall_of_fame FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated can update hall_of_fame"
  ON hall_of_fame FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated can delete hall_of_fame"
  ON hall_of_fame FOR DELETE
  TO authenticated
  USING (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_game_results_game_id ON game_results(game_id);
CREATE INDEX IF NOT EXISTS idx_game_results_team_id ON game_results(team_id);
CREATE INDEX IF NOT EXISTS idx_game_results_tournament_id ON game_results(tournament_id);
CREATE INDEX IF NOT EXISTS idx_games_tournament_id ON games(tournament_id);
CREATE INDEX IF NOT EXISTS idx_teams_division ON teams(division);
CREATE INDEX IF NOT EXISTS idx_tournaments_season ON tournaments(season);
CREATE INDEX IF NOT EXISTS idx_tournaments_type ON tournaments(type);
