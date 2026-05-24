-- ── Tables ────────────────────────────────────────────────────────────────────

CREATE TABLE profiles (
  id uuid REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  username text UNIQUE NOT NULL,
  full_name text,
  tagline text,
  roles text[],
  narrative text,
  avatar_url text,
  is_public boolean DEFAULT false,
  plan text DEFAULT 'free' CHECK (plan IN ('free', 'pro')),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  description text,
  status text DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'launched')),
  url text,
  display_order int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE updates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  project_id uuid REFERENCES projects(id) ON DELETE SET NULL,
  content text NOT NULL,
  image_url text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE github_connections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL UNIQUE,
  github_username text NOT NULL,
  access_token text NOT NULL,
  repos_to_show text[] DEFAULT '{}',
  last_synced_at timestamptz
);

CREATE TABLE github_activity (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  repo_name text NOT NULL,
  commit_message text NOT NULL,
  commit_sha text NOT NULL UNIQUE,
  committed_at timestamptz NOT NULL
);

-- ── Row Level Security ────────────────────────────────────────────────────────

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE github_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE github_activity ENABLE ROW LEVEL SECURITY;

-- profiles
CREATE POLICY "profiles_select" ON profiles FOR SELECT
  USING (is_public = true OR auth.uid() = id);
CREATE POLICY "profiles_insert" ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update" ON profiles FOR UPDATE
  USING (auth.uid() = id);
CREATE POLICY "profiles_delete" ON profiles FOR DELETE
  USING (auth.uid() = id);

-- projects
CREATE POLICY "projects_select" ON projects FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM profiles WHERE id = projects.user_id
    AND (is_public = true OR auth.uid() = id)
  ));
CREATE POLICY "projects_all_owner" ON projects FOR ALL
  USING (auth.uid() = user_id);

-- updates
CREATE POLICY "updates_select" ON updates FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM profiles WHERE id = updates.user_id
    AND (is_public = true OR auth.uid() = id)
  ));
CREATE POLICY "updates_all_owner" ON updates FOR ALL
  USING (auth.uid() = user_id);

-- github_connections (owner only — never public)
CREATE POLICY "github_connections_owner" ON github_connections FOR ALL
  USING (auth.uid() = user_id);

-- github_activity
CREATE POLICY "github_activity_select" ON github_activity FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM profiles WHERE id = github_activity.user_id
    AND (is_public = true OR auth.uid() = id)
  ));
CREATE POLICY "github_activity_owner" ON github_activity FOR ALL
  USING (auth.uid() = user_id);

-- ── Storage Policies ──────────────────────────────────────────────────────────
-- Run these AFTER creating the buckets manually in the Supabase dashboard.

-- avatars bucket
CREATE POLICY "Avatar images are publicly accessible"
  ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
CREATE POLICY "Users can upload their own avatar"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can update their own avatar"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- update-images bucket
CREATE POLICY "Update images are publicly accessible"
  ON storage.objects FOR SELECT USING (bucket_id = 'update-images');
CREATE POLICY "Users can upload update images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'update-images' AND auth.uid() IS NOT NULL);
