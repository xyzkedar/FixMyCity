-- Allow anyone to create reports (for civic reporting)
DROP POLICY IF EXISTS "Authenticated users can create reports" ON reports;

CREATE POLICY "Anyone can create reports" ON reports
  FOR INSERT WITH CHECK (true);

-- Update existing view policy
DROP POLICY IF EXISTS "Anyone can view reports" ON reports;
CREATE POLICY "Anyone can view reports" ON reports
  FOR SELECT USING (true);