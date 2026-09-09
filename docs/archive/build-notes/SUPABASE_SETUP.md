# Supabase Database Setup Guide

This guide will walk you through setting up the Supabase database for Drive Exotiq.

---

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign in or create a free account
3. Click **"New Project"**
4. Fill in the details:
   - **Name:** Drive Exotiq
   - **Database Password:** (choose a strong password)
   - **Region:** Select closest to your users
   - **Pricing Plan:** Free tier works great for launch
5. Click **"Create new project"**
6. Wait 2-3 minutes for setup to complete

---

## 2. Get Your API Credentials

1. In your Supabase project dashboard, click **Settings** (gear icon) in the left sidebar
2. Click **API** under Project Settings
3. You'll see:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon/public key** (looks like: `eyJhbGc...`)

4. Copy these to your `.env.local` file:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
   ```

---

## 3. Create the Applications Table

1. In Supabase dashboard, click **SQL Editor** in the left sidebar
2. Click **"New Query"**
3. Copy and paste this SQL:

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

4. Click **"Run"** (or press Cmd/Ctrl + Enter)
5. You should see: **"Success. No rows returned"**

---

## 4. Verify the Table

1. Click **Table Editor** in the left sidebar
2. You should see the `applications` table listed
3. Click on it to view the structure
4. Columns should be:
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

---

## 5. Test Form Submission

1. Run your Next.js dev server: `npm run dev`
2. Navigate to `/apply` page
3. Fill out the application form
4. Submit
5. Check Supabase Table Editor → `applications` table
6. Your test submission should appear!

---

## 6. View Submitted Applications

### Option A: Supabase Dashboard

1. Go to **Table Editor** → `applications`
2. View all submissions in a spreadsheet-like interface
3. Click any row to edit/view details
4. Filter by status, date, etc.

### Option B: SQL Queries

Run queries in SQL Editor:

```sql
-- View all applications
SELECT * FROM applications ORDER BY created_at DESC;

-- View pending applications only
SELECT * FROM applications WHERE status = 'pending' ORDER BY created_at DESC;

-- Count applications by city
SELECT city_of_interest, COUNT(*) as count
FROM applications
GROUP BY city_of_interest;

-- View recent applications (last 7 days)
SELECT * FROM applications
WHERE created_at >= NOW() - INTERVAL '7 days'
ORDER BY created_at DESC;
```

---

## 7. Update Application Status

To approve/reject applications manually:

```sql
-- Approve an application
UPDATE applications
SET status = 'approved', reviewed_at = NOW()
WHERE id = 'paste-application-id-here';

-- Reject an application
UPDATE applications
SET status = 'rejected', reviewed_at = NOW(), notes = 'Reason for rejection'
WHERE id = 'paste-application-id-here';
```

---

## 8. Set Up Email Notifications (Optional)

To auto-send confirmation emails when applications are submitted:

1. Go to **Database** → **Webhooks** in Supabase
2. Create a new webhook trigger on `applications` INSERT
3. Point it to your email service (Resend, SendGrid, etc.)
4. Or use Supabase Edge Functions (see below)

### Using Supabase Edge Functions:

```typescript
// supabase/functions/send-confirmation/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

serve(async (req) => {
  const { email, full_name } = await req.json();

  // Send email via your email service
  // Example with Resend:
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${Deno.env.get('RESEND_API_KEY')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Drive Exotiq <noreply@driveexotiq.com>',
      to: email,
      subject: 'Application Received - Drive Exotiq',
      html: `<p>Hi ${full_name},</p>
             <p>Thank you for applying to Drive Exotiq!</p>
             <p>We'll review your application within 24-48 hours.</p>`,
    }),
  });

  return new Response(JSON.stringify({ success: true }), {
    headers: { 'Content-Type': 'application/json' },
  });
});
```

---

## 9. Backup & Maintenance

### Automatic Backups (Pro Plan)
- Supabase Pro plan includes automatic daily backups
- Point-in-time recovery available

### Manual Export (Free Plan)
1. Go to **Database** → **Backups**
2. Click **"Create backup"**
3. Download as SQL dump or CSV

### Regular Maintenance:
```sql
-- View table stats
SELECT
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public';

-- Vacuum table (optimize)
VACUUM ANALYZE applications;
```

---

## 10. Security Best Practices

✅ **DO:**
- Keep your `SUPABASE_ANON_KEY` in `.env.local` (never commit to Git)
- Use Row Level Security (RLS) policies
- Regularly review submitted applications
- Monitor for spam/fake submissions

❌ **DON'T:**
- Share your Supabase service role key publicly
- Disable Row Level Security
- Store sensitive data unencrypted

---

## 11. Troubleshooting

### "Error: Failed to fetch"
- Check your `.env.local` has correct credentials
- Verify Supabase project is not paused (free tier pauses after inactivity)
- Check browser console for CORS errors

### "Row Level Security policy violation"
- RLS is enabled but no policy allows the operation
- Re-run the policy SQL from Step 3

### Form submits but no data in Supabase
- Check Network tab in browser DevTools
- Look for 400/500 errors
- Verify table name is exactly `applications` (lowercase)

### Can't view applications in dashboard
- You need to be authenticated as an admin
- Use SQL Editor to query directly: `SELECT * FROM applications;`

---

## 12. Next Steps

- Set up email notifications
- Create admin dashboard to review applications
- Add analytics tracking (Supabase has built-in analytics)
- Set up automated approval workflow

---

**Need Help?**

- Supabase Docs: [supabase.com/docs](https://supabase.com/docs)
- Drive Exotiq Support: support@driveexotiq.com

---

Happy building! 🚀
