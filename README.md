# Drive Exotiq Website

**Where Precision Meets Passion**

The exotic car community built by enthusiasts, for enthusiasts. Vetted drivers. Curated experiences. Zero compromises.

---

## 🚀 Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Form Management:** React Hook Form + Zod
- **Database:** Supabase (PostgreSQL)
- **Deployment:** Vercel
- **Fonts:** Montserrat (Google Fonts)

---

## 🎨 Brand System

### Colors
- **Gulf Blue:** `#6EC1E4` - Primary accent, CTAs
- **Performance Orange:** `#F15A29` - Secondary accent
- **Deep Black:** `#000000` - Primary background
- **Jet Grey:** `#1B1B1B` - Secondary background
- **Metallic Silver:** `#C0C0C0` - Text, borders
- **Midnight Blue:** `#0A1929` - Alternative backgrounds

### Typography
- **Display/Headers:** Montserrat (fallback for Dfaalt)
- **Body:** Montserrat

---

## 📋 Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Supabase account (free tier works)

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd driveexotiqweb
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**

   Create a `.env.local` file in the root directory with the following:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   ADMIN_PASSWORD=your_secure_admin_password
   RESEND_API_KEY=your_resend_api_key
   ```

   **Get your credentials:**
   - **Supabase:** Go to your Supabase project → Settings → API
   - **Resend:** Sign up at [resend.com](https://resend.com) → API Keys → Create API Key
   - Set a secure password for admin dashboard access
   
   📄 See [`ENV_SETUP_INSTRUCTIONS.md`](ENV_SETUP_INSTRUCTIONS.md) for detailed setup guide
   📧 See [`EMAIL_AUTOMATION_SETUP.md`](EMAIL_AUTOMATION_SETUP.md) for email automation setup

4. **Set up Supabase database:**

   Run the SQL migration to create the applications table:
   - Go to your Supabase project → SQL Editor
   - Run the SQL script provided in [`DATABASE_SETUP_INSTRUCTIONS.md`](DATABASE_SETUP_INSTRUCTIONS.md)
   - Verify the table was created in Table Editor

   The migration creates:
   - Applications table with all required fields
   - Row Level Security (RLS) policies
   - Performance indexes
   - Status constraints

5. **Run the development server:**
   ```bash
   npm run dev
   ```

6. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## 🏗️ Project Structure

```
driveexotiqweb/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Homepage
│   ├── how-it-works/      # How It Works page
│   ├── events/            # Events page
│   ├── cities/            # Cities page
│   ├── apply/             # Application page
│   ├── thank-you/         # Thank you page
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
│
├── components/
│   ├── ui/                # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── Textarea.tsx
│   │   └── Badge.tsx
│   │
│   ├── layout/            # Layout components
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   │
│   ├── sections/          # Homepage sections
│   │   ├── Hero.tsx
│   │   ├── Problem.tsx
│   │   ├── Solution.tsx
│   │   ├── HowItWorks.tsx
│   │   ├── Events.tsx
│   │   ├── Cities.tsx
│   │   └── FinalCTA.tsx
│   │
│   └── forms/             # Form components
│       └── ApplicationForm.tsx
│
├── lib/                   # Utility functions
│   ├── utils.ts           # Helper functions
│   ├── supabase.ts        # Supabase client
│   └── validations.ts     # Zod schemas
│
├── types/                 # TypeScript types
│   └── index.ts
│
└── public/                # Static assets
    └── images/
```

---

## 📄 Pages

### Home (`/`)
- Hero section with brand tagline
- Problem statement (why Drive Exotiq exists)
- Solution showcase
- How it works overview
- Upcoming events preview
- Featured cities
- Final CTA

### How It Works (`/how-it-works`)
- Detailed step-by-step process
- Application flow explanation
- Vetting process details
- FAQs

### Events (`/events`)
- Denver launch event (featured)
- Scottsdale & Miami teasers
- Event registration

### Cities (`/cities`)
- Denver, Scottsdale, Miami details
- Fleet information
- Operator partnerships
- City-specific experiences
- Request your city form

### Apply (`/apply`)
- Application form with validation
- What to expect sidebar
- Trust signals
- Form submission to Supabase

### Thank You (`/thank-you`)
- Success confirmation
- Next steps
- Social media links

---

## 🎯 Key Features

### Form Validation
- React Hook Form with Zod schema validation
- Real-time error messages
- Required field validation
- Email and phone format validation

### Responsive Design
- Mobile-first approach
- Breakpoints: 640px (sm), 768px (md), 1024px (lg), 1280px (xl)
- Touch-friendly navigation
- Optimized for all screen sizes

### Performance
- Next.js Image optimization
- Font optimization with Google Fonts
- Code splitting with App Router
- Static generation where possible

### Accessibility
- Semantic HTML
- ARIA labels
- Keyboard navigation
- Color contrast compliance

---

## 🚢 Deployment

### Vercel (Recommended)

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add environment variables:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

3. **Deploy:**
   - Click "Deploy"
   - Your site will be live in ~2 minutes

### Custom Domain

1. Go to Vercel project settings → Domains
2. Add your custom domain (e.g., `driveexotiq.com`)
3. Update DNS records as instructed
4. SSL certificate auto-generated

---

## 🔧 Development

### Build for production:
```bash
npm run build
```

### Start production server:
```bash
npm start
```

### Lint code:
```bash
npm run lint
```

---

## 🔐 Admin Dashboard

Access the admin dashboard to manage applications:

1. **Navigate to:** `http://localhost:3000/admin` (or your deployed URL)
2. **Login with:** The password you set in `.env.local` (`ADMIN_PASSWORD`)
3. **Features:**
   - View all applications with sorting and filtering
   - Search by name, email, or phone
   - Filter by status (pending, approved, rejected) and city
   - View detailed application information
   - Approve or reject applications with notes
   - Real-time statistics dashboard

**Security:**
- Password protected with session-based authentication
- Uses Supabase service role key for secure admin operations
- Session expires when browser closes

## 📊 Supabase Dashboard

Access your Supabase dashboard to:
- View raw application data in Table Editor
- Run custom SQL queries
- Monitor database performance
- Set up database backups
- View API usage and logs

---

## 🎨 Design Tokens

All brand colors, typography, and spacing are defined in `tailwind.config.ts`. Update there to maintain consistency across the site.

---

## 📱 Social Media

- Instagram: [@driveexotiq](https://www.instagram.com/driveexotiq/)

---

## 📧 Support

For questions or issues:
- Email: support@driveexotiq.com
- Investor inquiries: investors@driveexotiq.com

---

## 🔧 Troubleshooting

### Application Form Issues

**"Failed to fetch" or Form Not Submitting:**
- Check `.env.local` has correct Supabase credentials
- Verify Supabase project is active (free tier pauses after inactivity)
- Check browser console for detailed error messages
- Ensure database table was created successfully

**"Row Level Security policy violation":**
- Re-run the RLS policy SQL from the setup instructions
- Verify the "Anyone can submit application" policy exists
- Check Supabase logs for detailed policy errors

### Admin Dashboard Issues

**Can't Login to Admin Dashboard:**
- Verify `ADMIN_PASSWORD` is set in `.env.local`
- Check that the password matches exactly (case-sensitive)
- Try logging out and back in
- Clear browser session storage

**Applications Not Loading:**
- Verify `SUPABASE_SERVICE_ROLE_KEY` is set correctly
- Check Supabase project is active
- View browser network tab for API errors
- Verify database table has data

**"Unauthorized" Errors:**
- Session may have expired - refresh and login again
- Service role key may be incorrect
- Check server logs for detailed errors

### General Issues

**Port Already in Use:**
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
# Or use a different port
npm run dev -- -p 3001
```

**Build Errors:**
```bash
# Clear Next.js cache
rm -rf .next
npm run build
```

**Environment Variables Not Loading:**
- Restart the dev server after changing `.env.local`
- Verify file is named exactly `.env.local` (not `.env.local.txt`)
- Check that variables start with `NEXT_PUBLIC_` for client-side access

For more help, check:
- [`ENV_SETUP_INSTRUCTIONS.md`](ENV_SETUP_INSTRUCTIONS.md)
- [`DATABASE_SETUP_INSTRUCTIONS.md`](DATABASE_SETUP_INSTRUCTIONS.md)
- [`SUPABASE_SETUP.md`](SUPABASE_SETUP.md)

---

## 📝 License

© 2025 Drive Exotiq. All rights reserved.

---

**Built with ❤️ for exotic car enthusiasts**
