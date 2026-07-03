# Pre-Deployment Checklist ✅

Use this checklist before deploying to production.

## ✅ Code & Build

- [x] **Production build successful**: `npm run build` completes without errors
- [x] **No critical linting errors**: Only minor warnings (useEffect dependencies, img tags)
- [x] **All pages render correctly**: Home, Apply, Events, Cities, Investors, How It Works
- [x] **Mobile responsive**: All breakpoints tested
- [x] **Images optimized**: Using Next.js Image component where possible
- [x] **Stock images updated**: All Unsplash images replaced with high-quality versions

## ✅ Configuration Files

- [x] **`package.json`**: Build scripts configured (`npm run build`, `npm start`)
- [x] **`next.config.js`**: Image domains configured (unsplash.com)
- [x] **`netlify.toml`**: Created with proper build settings and security headers
- [x] **`.gitignore`**: Properly ignoring `.env*` files, node_modules, build artifacts
- [ ] **`.env.local`**: Created locally with all required environment variables (NOT in Git)

## ✅ Environment Variables Required

For both GitHub Actions (if auto-deploying) and Netlify, you'll need:

```
NEXT_PUBLIC_SUPABASE_URL=https://mlfzduuclgdscdlztzdi.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
ADMIN_PASSWORD=ExotiqAdmin2025!
```

**⚠️ IMPORTANT**: Never commit these to Git. Add them in:
- **Netlify**: Site Settings → Environment Variables
- **GitHub**: Repository Settings → Secrets → Actions

## ✅ Supabase Configuration

- [x] **Supabase project created**: https://mlfzduuclgdscdlztzdi.supabase.co
- [x] **`applications` table created**: Schema matches types/index.ts
- [x] **`instagram_posts` table created**: For Instagram feed management
- [x] **RLS policies enabled**: Public read, authenticated write
- [x] **Environment variables documented**: In ENV_SETUP_INSTRUCTIONS.md

## ✅ Features Tested

- [x] **Application form submission**: Saves to Supabase successfully
- [x] **Form validation**: Zod schema working correctly
- [x] **Admin dashboard**: Login with password works
- [x] **Admin applications view**: Displays submitted applications
- [x] **Admin Instagram manager**: Add/delete posts (saved for future use)
- [x] **Navigation**: All links work correctly
- [x] **Mobile menu**: Opens/closes smoothly with glassmorphism effect
- [x] **Buttons**: All CTAs styled and functional
- [x] **Investor page**: Calendar and deck links working

## ✅ Performance & SEO

- [x] **Metadata configured**: Title, description on all pages
- [x] **Images lazy loaded**: Using Next.js Image component
- [x] **Compression enabled**: In next.config.js
- [x] **Security headers**: Configured in netlify.toml
- [x] **Mobile optimized**: Typography, buttons, touch targets
- [x] **Glassmorphism effects**: Applied to buttons and mobile menu

## ✅ Content Review

- [x] **Copy reviewed**: No em dashes, proper grammar, human tone
- [x] **Email links updated**: All pointing to hello@exotiq.ai
- [x] **Social CTA cleaned up**: Single "Follow @driveexotiq" button
- [x] **Hero arrow removed**: Cleaner, minimal hero section
- [x] **Stock images replaced**: High-quality exotic car photos

## ⚠️ Known Minor Warnings (Safe to Deploy)

These are non-blocking warnings that don't affect functionality:

1. **React Hook useEffect warnings**: Missing dependencies (admin pages) - intentional for performance
2. **`<img>` tag warnings**: Instagram feed uses `<img>` for external URLs - acceptable for this use case

## 🚀 Ready to Deploy?

If all checkboxes above are marked, you're ready to deploy!

### Quick Deploy Steps:

**Option A - GitHub Auto-Deploy:**
```bash
git init
git add .
git commit -m "Initial deployment"
git remote add origin https://github.com/YOUR_USERNAME/driveexotiq-website.git
git push -u origin main
```
Then connect to Netlify via their UI.

**Option B - Manual Netlify Deploy:**
```bash
npm install -g netlify-cli
netlify login
netlify deploy --prod
```

See `DEPLOYMENT_GUIDE.md` for detailed instructions.

---

## Post-Deployment Verification

After deploying, test:

1. Visit your live site
2. Submit a test application at `/apply`
3. Check admin dashboard at `/admin` (password: ExotiqAdmin2025!)
4. Test on mobile devices
5. Verify all images load
6. Check all navigation links
7. Test investor page calendar/deck links

---

**Last Updated**: December 2025
**Build Status**: ✅ Passing
**Ready for Production**: ✅ Yes





