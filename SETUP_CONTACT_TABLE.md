# Setup Contact Form Table in Supabase

## ⚠️ IMPORTANT: Run this SQL manually in Supabase Dashboard

The automated script reported success but the table doesn't exist. Please follow these steps:

### Step 1: Open Supabase SQL Editor

1. Go to https://supabase.com/dashboard
2. Select your project: `jirdqjpfmtdwdoqxojok`
3. Click on "SQL Editor" in the left sidebar
4. Click "New Query"

### Step 2: Copy and Run This SQL

```sql
-- Create the contact_submissions table
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

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_contact_submissions_status 
  ON public.contact_submissions(status);

CREATE INDEX IF NOT EXISTS idx_contact_submissions_created_at 
  ON public.contact_submissions(created_at DESC);

-- Create trigger function for updating updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS update_contact_submissions_updated_at ON public.contact_submissions;
CREATE TRIGGER update_contact_submissions_updated_at
  BEFORE UPDATE ON public.contact_submissions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow anonymous insert" ON public.contact_submissions;
DROP POLICY IF EXISTS "Allow authenticated read" ON public.contact_submissions;
DROP POLICY IF EXISTS "Allow authenticated update" ON public.contact_submissions;

-- Create RLS policies
-- Allow anyone (anonymous) to insert contact form submissions
CREATE POLICY "Allow anonymous insert"
  ON public.contact_submissions
  FOR INSERT
  WITH CHECK (true);

-- Allow authenticated users (admins) to read all submissions
CREATE POLICY "Allow authenticated read"
  ON public.contact_submissions
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow authenticated users (admins) to update submissions
CREATE POLICY "Allow authenticated update"
  ON public.contact_submissions
  FOR UPDATE
  TO authenticated
  USING (true);
```

### Step 3: Verify the Table Was Created

Run this query to confirm:

```sql
SELECT * FROM public.contact_submissions LIMIT 1;
```

You should see a result (even if empty) with the column names.

### Step 4: Test Manual Insert

Try inserting a test record:

```sql
INSERT INTO public.contact_submissions (name, email, regarding, message)
VALUES ('Test User', 'test@example.com', 'Test', 'This is a test message from SQL');

SELECT * FROM public.contact_submissions;
```

### Step 5: Return to the Application

Once the table is created, the contact form should work automatically!

## Troubleshooting

If you get any errors:

1. **"relation already exists"**: The table was partially created. Run the DROP policies commands first, then try again.
2. **"permission denied"**: Make sure you're logged in as the project owner.
3. **"function does not exist"**: The trigger function creation failed. Run just that section again.

## After Setup

The application will now:
- ✅ Accept contact form submissions from anonymous users
- ✅ Store them in Supabase
- ✅ Show them in the admin panel at `/admin/contact-submissions`
- ✅ Allow admins to update status and add notes

