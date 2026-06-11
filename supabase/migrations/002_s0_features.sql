-- ── S0 features: links, contact email, project cover image ──────────────────────

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS links jsonb NOT NULL DEFAULT '[]'::jsonb;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS contact_email text;

ALTER TABLE projects ADD COLUMN IF NOT EXISTS cover_image_url text;

-- ── Storage policies for the project-images bucket ──────────────────────────────
-- Run AFTER creating the public bucket "project-images" in the Supabase dashboard.

CREATE POLICY "Project images are publicly accessible"
  ON storage.objects FOR SELECT USING (bucket_id = 'project-images');

CREATE POLICY "Users can upload their own project images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'project-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own project images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'project-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own project images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'project-images' AND auth.uid()::text = (storage.foldername(name))[1]);
