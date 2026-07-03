# Database Setup Instructions

## Step 1: Access Supabase SQL Editor

1. Go to your Supabase project dashboard
2. Click on **SQL Editor** in the left sidebar
3. Click **"New Query"**

## Step 2: Run the Migration SQL

Copy and paste the following SQL into the editor and click **"Run"**:

```sql
-- Create applications table
CREATE TABLE applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  current_city TEXT NOT NULL,
  city_of_interest TEXT NOT NULL,
  brief_intro TEXT NOT NULL,
  invite_code TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  notes TEXT
);

-- Create indexes for better performance
CREATE INDEX idx_applications_email ON applications(email);
CREATE INDEX idx_applications_created_at ON applications(created_at DESC);
CREATE INDEX idx_applications_status ON applications(status);

-- Enable Row Level Security
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Policy 1: Anyone can submit an application (INSERT)
CREATE POLICY "Anyone can submit application"
  ON applications
  FOR INSERT
  WITH CHECK (true);

-- Policy 2: Only authenticated users can view applications (SELECT)
CREATE POLICY "Authenticated users can view applications"
  ON applications
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Policy 3: Only authenticated users can update applications (UPDATE)
CREATE POLICY "Authenticated users can update applications"
  ON applications
  FOR UPDATE
  USING (auth.role() = 'authenticated');
```

## Step 3: Verify Success

After running the SQL, you should see: **"Success. No rows returned"**

## Step 4: Verify Table Creation

1. Click **Table Editor** in the left sidebar
2. You should see the `applications` table listed
3. Click on it to view the structure
4. Verify all columns are present:
   - `id` (uuid, primary key)
   - `full_name` (text)
   - `email` (text)
   - `phone` (text)
   - `current_city` (text)
   - `city_of_interest` (text)
   - `brief_intro` (text)
   - `invite_code` (text, nullable)
   - `created_at` (timestamptz)
   - `status` (text, default: 'pending')
   - `reviewed_at` (timestamptz, nullable)
   - `notes` (text, nullable)

## What This Setup Does

### Row Level Security (RLS)
- **Public Access**: Anyone can submit applications (no login required)
- **Admin Access**: Only authenticated users can view and update applications
- This protects sensitive applicant data while allowing public submissions

### Indexes
- Email index: Fast lookup and duplicate checking
- Created date index: Efficient sorting by submission date
- Status index: Quick filtering by application status

### Status Constraints
- Only allows: 'pending', 'approved', 'rejected'
- Prevents invalid status values

## Troubleshooting

### "Relation already exists" Error
The table already exists. You can either:
- Use the existing table (no action needed)
- Drop it first: `DROP TABLE applications CASCADE;` then re-run the script

### "Permission denied" Error
- Make sure you're using the correct database credentials
- Verify you have admin access to the Supabase project

### Can't see applications in dashboard
- Remember: You need to be authenticated to view applications
- Use SQL Editor to query directly: `SELECT * FROM applications;`

## Next Steps

After completing this setup:
1. Test form submission at `/apply`
2. Check that data appears in Supabase Table Editor
3. Access admin dashboard at `/admin` (after it's built)





