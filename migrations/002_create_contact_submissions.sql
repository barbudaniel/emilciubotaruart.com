-- Create contact_submissions table
CREATE TABLE IF NOT EXISTS public.contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  regarding TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'replied', 'archived')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_contact_submissions_status ON public.contact_submissions(status);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_created_at ON public.contact_submissions(created_at DESC);

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_contact_submissions_updated_at
  BEFORE UPDATE ON public.contact_submissions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Grant necessary permissions (adjust based on your RLS policies)
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- Allow anonymous users to insert (submit forms)
CREATE POLICY "Allow anonymous users to submit contact forms"
  ON public.contact_submissions
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow authenticated users (admins) to read all submissions
CREATE POLICY "Allow authenticated users to read all contact submissions"
  ON public.contact_submissions
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow authenticated users (admins) to update submissions
CREATE POLICY "Allow authenticated users to update contact submissions"
  ON public.contact_submissions
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

