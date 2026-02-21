
-- Migration: Secure Authority Access
-- Run this in your Supabase SQL Editor

-- 1. Add approval status to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_approved BOOLEAN DEFAULT false;

-- 2. Update the signup trigger to be more secure
-- We will still allow the user_type to be passed (for the UI to know intent)
-- but is_approved will always start as FALSE for authorities.
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, user_type, is_approved)
  VALUES (
    NEW.id, 
    NEW.email, 
    COALESCE(NEW.raw_user_meta_data->>'user_type', 'citizen'),
    CASE 
      WHEN COALESCE(NEW.raw_user_meta_data->>'user_type', 'citizen') = 'authority' THEN false
      ELSE true -- Citizens are approved by default
    END
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Update RLS for reports to strictly check for approval
DROP POLICY IF EXISTS "Authorities can update any report" ON reports;
CREATE POLICY "Approved authorities can update any report" ON reports
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND user_type = 'authority' AND is_approved = true
    )
  );

-- 4. HELPER: SQL to approve an authority (Use this manually in SQL Editor)
-- UPDATE profiles SET is_approved = true WHERE email = 'official@example.com';
