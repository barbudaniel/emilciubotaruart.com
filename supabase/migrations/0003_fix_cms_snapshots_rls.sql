-- Enable RLS on cms_snapshots table
ALTER TABLE cms_snapshots ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Enable read for all" ON cms_snapshots;
DROP POLICY IF EXISTS "Owner writes" ON cms_snapshots;

-- Create new policies with correct authentication checks
-- Allow everyone to read CMS data
CREATE POLICY "cms_snapshots_read_all" 
  ON cms_snapshots 
  FOR SELECT 
  USING (true);

-- Allow authenticated users to insert/update/delete
CREATE POLICY "cms_snapshots_write_authenticated" 
  ON cms_snapshots 
  FOR ALL 
  TO authenticated
  USING (true)
  WITH CHECK (true);


