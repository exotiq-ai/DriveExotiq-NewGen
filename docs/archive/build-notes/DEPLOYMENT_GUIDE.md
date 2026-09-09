# Drive Exotiq - Deployment Guide

This guide covers deploying the Drive Exotiq website to Netlify (both auto-deploy via GitHub and manual local deploys).

## Prerequisites

- Node.js 20.x or higher
- npm or yarn
- Supabase project (already configured)
- GitHub account (for auto-deploys)
- Netlify account

---

## Option 1: GitHub Auto-Deploy (Recommended)

### Step 1: Push to GitHub

1. **Initialize Git** (if not already done):
```bash
git init
git add .
git commit -m "Initial commit: Drive Exotiq website"
```

2. **Create a new GitHub repository**:
   - Go to [GitHub](https://github.com/new)
   - Create a new repository (e.g., `driveexotiq-website`)
   - Don't initialize with README (you already have one)

3. **Push your code**:
```bash
git remote add origin https://github.com/YOUR_USERNAME/driveexotiq-website.git
git branch -M main
git push -u origin main
```

### Step 2: Connect to Netlify

1. **Log in to Netlify**: [app.netlify.com](https://app.netlify.com)

2. **Import from GitHub**:
   - Click "Add new site" → "Import an existing project"
   - Choose GitHub as your provider
   - Authorize Netlify to access your repositories
   - Select your `driveexotiq-website` repository

3. **Configure Build Settings**:
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`
   - **Base directory**: (leave empty)

4. **Add Environment Variables**:
   Go to "Site settings" → "Environment variables" and add:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://mlfzduuclgdscdlztzdi.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1sZnpkdXVjbGdkc2NkbHp0emRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIyMTI3NzUsImV4cCI6MjA2Nzc4ODc3NX0.MYMwtO6wgDEqaECwFypS2OZtKY0mnUdh2wAPeiM6w5E
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1sZnpkdXVjbGdkc2NkbHp0emRpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjIxMjc3NSwiZXhwIjoyMDY3Nzg4Nzc1fQ.p3enwiLo_xCEzRQvd7GE_esMxDaIO3zxvko5KHxamBw
   ADMIN_PASSWORD=ExotiqAdmin2025!
   ```

5. **Deploy**:
   - Click "Deploy site"
   - Netlify will build and deploy automatically
   - Future pushes to `main` branch will auto-deploy

### Step 3: Configure Domain (Optional)

1. Go to "Domain settings" in Netlify
2. Add your custom domain (e.g., `driveexotiq.com`)
3. Follow DNS configuration instructions
4. Enable HTTPS (automatic with Netlify)

---

## Option 2: Manual Local Deploy to Netlify

### Step 1: Install Netlify CLI

```bash
npm install -g netlify-cli
```

### Step 2: Login to Netlify

```bash
netlify login
```
This opens a browser for authentication.

### Step 3: Build Locally

```bash
npm run build
```

### Step 4: Deploy

**For first-time deployment**:
```bash
netlify deploy
```
- Choose "Create & configure a new site"
- Select your team
- Enter a site name (e.g., `driveexotiq`)
- Specify publish directory: `.next`

**For production deployment**:
```bash
netlify deploy --prod
```

### Step 5: Set Environment Variables

```bash
netlify env:set NEXT_PUBLIC_SUPABASE_URL "https://mlfzduuclgdscdlztzdi.supabase.co"
netlify env:set NEXT_PUBLIC_SUPABASE_ANON_KEY "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1sZnpkdXVjbGdkc2NkbHp0emRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIyMTI3NzUsImV4cCI6MjA2Nzc4ODc3NX0.MYMwtO6wgDEqaECwFypS2OZtKY0mnUdh2wAPeiM6w5E"
netlify env:set SUPABASE_SERVICE_ROLE_KEY "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1sZnpkdXVjbGdkc2NkbHp0emRpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjIxMjc3NSwiZXhwIjoyMDY3Nzg4Nzc1fQ.p3enwiLo_xCEzRQvd7GE_esMxDaIO3zxvko5KHxamBw"
netlify env:set ADMIN_PASSWORD "ExotiqAdmin2025!"
```

---

## Verifying Deployment

After deployment, test these critical paths:

1. **Homepage**: `https://your-site.netlify.app`
2. **Application Form**: `https://your-site.netlify.app/apply`
3. **Admin Dashboard**: `https://your-site.netlify.app/admin`
4. **Investor Page**: `https://your-site.netlify.app/investors`
5. **All other pages**: Events, Cities, How It Works

### Key Checks:
- ✅ Forms submit successfully to Supabase
- ✅ Admin dashboard loads and shows applications
- ✅ Images load correctly
- ✅ Mobile menu works smoothly
- ✅ All buttons and links function properly

---

## Troubleshooting

### Build Fails

**Check environment variables**:
- Ensure all required env vars are set in Netlify
- Verify Supabase keys are correct

**Check build logs**:
```bash
netlify logs
```

### Forms Not Working

- Verify `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set
- Check Supabase RLS policies are configured
- Verify the `applications` table exists

### Admin Dashboard Not Loading

- Verify `SUPABASE_SERVICE_ROLE_KEY` is set
- Verify `ADMIN_PASSWORD` is set
- Check browser console for errors

### Images Not Loading

- Verify `next.config.js` includes `images.unsplash.com` in allowed domains
- Check image URLs are valid

---

## Updating the Site

### With GitHub Auto-Deploy:
```bash
git add .
git commit -m "Your update message"
git push origin main
```
Netlify will automatically rebuild and deploy.

### With Manual Deploy:
```bash
npm run build
netlify deploy --prod
```

---

## Performance Tips

1. **Use Netlify Edge Functions** for better performance (already configured)
2. **Enable Asset Optimization** in Netlify settings
3. **Monitor Core Web Vitals** in Netlify Analytics
4. **Set up branch deploys** for testing before production

---

## Security Checklist

- ✅ Environment variables stored securely in Netlify
- ✅ `.env.local` files ignored by Git
- ✅ Service role key never exposed to client
- ✅ Admin dashboard password-protected
- ✅ HTTPS enabled (automatic with Netlify)
- ✅ Security headers configured in `netlify.toml`

---

## Support

For deployment issues:
- **Netlify Docs**: [docs.netlify.com](https://docs.netlify.com)
- **Next.js on Netlify**: [docs.netlify.com/frameworks/next-js](https://docs.netlify.com/frameworks/next-js/)
- **Supabase Docs**: [supabase.com/docs](https://supabase.com/docs)

Need help? Contact the development team.





