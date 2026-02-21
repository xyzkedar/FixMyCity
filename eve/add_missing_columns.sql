-- SQL for adding missing columns to the profiles table
-- Run this in your Supabase SQL Editor

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='bio') THEN
        ALTER TABLE profiles ADD COLUMN bio TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='phone') THEN
        ALTER TABLE profiles ADD COLUMN phone TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='location') THEN
        ALTER TABLE profiles ADD COLUMN location TEXT;
    END IF;
END $$;

-- Specifically for the 'location' column error
-- Ensure it exists
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS location TEXT;

-- Reload Supabase Schema Cache (Internal)
-- Note: Adding columns via the SQL editor usually handles this automatically.
-- If the error persists, you can try:
-- NOTIFY pgrst, 'reload schema';
