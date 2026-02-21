
-- Migration: Add resolution tracking for leaderboard
-- Run this in your Supabase SQL Editor

-- 1. Add resolved_by column to reports table
ALTER TABLE reports ADD COLUMN IF NOT EXISTS resolved_by UUID REFERENCES profiles(id);

-- 2. Create index for performance
CREATE INDEX IF NOT EXISTS reports_resolved_by_idx ON reports(resolved_by);

-- 3. Update Policy to allow authorities to update the resolved_by field
-- (Assuming authorities have a way to update any report)
-- Re-applying a broader update policy for authorities if needed
CREATE POLICY "Authorities can update any report" ON reports
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND user_type = 'authority'
    )
  );
