# Quick Start Guide

Get Drive Exotiq up and running in 10 minutes!

---

## Step 1: Install Dependencies (1 min)

```bash
npm install
```

---

## Step 2: Set Up Supabase (3 min)

### Create Project
1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Name: `Drive Exotiq`
4. Choose password and region
5. Wait for setup (2-3 minutes)

### Get Credentials
1. Go to Settings → API
2. Copy these values:
   - Project URL
   - anon/public key
   - service_role key

---

## Step 3: Configure Environment (1 min)

Create `.env.local` in project root:

```env
NEXT_PUBLIC_SUPABASE_URL=paste_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=paste_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=paste_service_role_key_here
ADMIN_PASSWORD=your_secure_password_here
```

---

## Step 4: Create Database Table (2 min)

1. In Supabase dashboard, go to **SQL Editor**
2. Click "New Query"
3. Copy the entire SQL from [`DATABASE_SETUP_INSTRUCTIONS.md`](DATABASE_SETUP_INSTRUCTIONS.md)
4. Click "Run"
5. You should see: "Success. No rows returned"

---

## Step 5: Start Development Server (1 min)

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Step 6: Test It! (2 min)

### Test Form Submission:
1. Go to [http://localhost:3000/apply](http://localhost:3000/apply)
2. Fill out the form
3. Submit
4. Should redirect to thank you page ✅

### Test Admin Dashboard:
1. Go to [http://localhost:3000/admin](http://localhost:3000/admin)
2. Enter your admin password
3. You should see your test application ✅

---

## That's It! 🎉

Your Drive Exotiq website is now running!

### Next Steps:

- 📖 Read [`TESTING_GUIDE.md`](TESTING_GUIDE.md) for comprehensive testing
- 🚀 Deploy to Vercel (see [`README.md`](README.md))
- 🎨 Customize content and styling
- 📧 Set up email notifications (optional)

---

## Troubleshooting

**Form not submitting?**
- Check browser console for errors
- Verify `.env.local` credentials are correct
- Make sure Supabase project is active

**Can't login to admin?**
- Password is case-sensitive
- Check `ADMIN_PASSWORD` in `.env.local`
- Clear browser cache/session

**Need more help?**
- See [`README.md`](README.md) for full documentation
- Check [`TROUBLESHOOTING.md`](README.md#-troubleshooting) section

---

## Project Structure

```
driveexotiqweb/
├── app/                    # Next.js pages
│   ├── page.tsx           # Homepage
│   ├── apply/             # Application form
│   ├── admin/             # Admin dashboard
│   └── ...
├── components/
│   ├── forms/             # Application form
│   ├── admin/             # Admin components
│   └── ...
├── lib/
│   ├── supabase.ts        # Public Supabase client
│   └── supabase-admin.ts  # Admin Supabase client
└── .env.local             # Your credentials (DO NOT COMMIT)
```

---

**Ready to launch! 🚗💨**





