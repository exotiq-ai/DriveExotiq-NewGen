# Environment Setup Instructions

## Step 1: Create .env.local File

Create a file named `.env.local` in the root of your project with the following content:

```env
# Supabase Configuration
# Get these from: https://supabase.com/dashboard/project/YOUR_PROJECT/settings/api

# Your Supabase project URL
NEXT_PUBLIC_SUPABASE_URL=

# Your Supabase anonymous/public key (safe to expose in browser)
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# Supabase service role key (KEEP SECRET - only for server-side/admin operations)
SUPABASE_SERVICE_ROLE_KEY=

# Admin Dashboard Password (simple protection)
ADMIN_PASSWORD=driveexotiq2025
```

## Step 2: Get Your Supabase Credentials

1. Go to your Supabase project dashboard
2. Click on **Settings** (gear icon) in the left sidebar
3. Click on **API** under Project Settings
4. Copy the following values:
   - **Project URL** → paste into `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key** → paste into `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role key** → paste into `SUPABASE_SERVICE_ROLE_KEY`

## Step 3: Set Admin Password

Change the `ADMIN_PASSWORD` value to something secure. This will be used to access the admin dashboard at `/admin`.

## Important Notes

- ⚠️ Never commit `.env.local` to Git
- ✅ The `.env.local.example` file is for documentation only
- 🔒 Keep your service role key secret - it has full database access
- 🌐 The anon key is safe to expose in the browser





