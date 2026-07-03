# Sync Local Code & Deploy Guide

## Step 1: Sync Your Local Code with Remote

### Option A: If you already have the repo cloned locally

1. **Open Terminal** and navigate to your project:
   ```bash
   cd "/Users/g.r./Documents/EXOTIQ/Drive Exotiq Web Build/driveexotiqweb-claude-build-drive-exotiq-website-019ZJQmUZm3CkAHaqJotGJ14"
   ```

2. **Check current branch:**
   ```bash
   git branch
   ```

3. **Fetch latest changes:**
   ```bash
   git fetch origin
   ```

4. **Switch to the booking page branch:**
   ```bash
   git checkout cursor/claude-s-booking-page-commit-4e8f
   ```

5. **Pull latest changes:**
   ```bash
   git pull origin cursor/claude-s-booking-page-commit-4e8f
   ```

### Option B: If you need to clone fresh

1. **Navigate to where you want the project:**
   ```bash
   cd "/Users/g.r./Documents/EXOTIQ/Drive Exotiq Web Build/"
   ```

2. **Clone the repository:**
   ```bash
   git clone https://github.com/exotiq-ai/driveexotiqweb.git
   cd driveexotiqweb
   ```

3. **Checkout the booking branch:**
   ```bash
   git checkout cursor/claude-s-booking-page-commit-4e8f
   ```

---

## Step 2: Install Dependencies (First Time Only)

```bash
npm install
```

This installs all required packages including:
- Next.js
- React
- Tailwind CSS
- iframe-resizer (for Wheelbase integration)
- All other dependencies

---

## Step 3: Build Locally in Your IDE

### Using VS Code / Cursor:

1. **Open the project folder** in your IDE
2. **Open Terminal in IDE** (View → Terminal or `Ctrl+`` `)
3. **Run the dev server:**
   ```bash
   npm run dev
   ```

4. **The server will start** and you'll see:
   ```
   ▲ Next.js 14.2.33
   - Local:        http://localhost:3000
   ✓ Ready in Xms
   ```

5. **Open your browser** to http://localhost:3000

### View Your Pages:
- Main site: http://localhost:3000
- Booking: http://localhost:3000/booking
- Phoenix: http://localhost:3000/booking/phoenix

---

## Step 4: Make Changes Locally

Now you can:
- ✅ Edit files in your IDE
- ✅ See changes instantly (hot reload)
- ✅ Test in browser
- ✅ No terminal needed after initial setup!

### Common Workflow:
1. Make changes in IDE
2. Save files (auto-reloads in browser)
3. Test locally
4. When ready, commit and push

---

## Step 5: Deploy Options

### Option A: Deploy to Netlify (Recommended)

#### First Time Setup:
1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Go to Netlify:**
   - Visit https://app.netlify.com
   - Sign in with GitHub

3. **Add new site:**
   - Click "Add new site" → "Import an existing project"
   - Connect to GitHub
   - Select `exotiq-ai/driveexotiqweb` repository
   - Select branch: `cursor/claude-s-booking-page-commit-4e8f`

4. **Configure build settings:**
   - Build command: `npm run build`
   - Publish directory: `.next`
   - (Actually, for Next.js, Netlify auto-detects this)

5. **Deploy!**
   - Netlify will build and deploy automatically

#### Ongoing Deploys:
- **Automatic:** Every push to the branch triggers a new deploy
- **Manual:** Push to git, Netlify auto-deploys
- **Or:** Use Netlify CLI: `netlify deploy --prod`

### Option B: Deploy via Git Push

1. **Make your changes** in your IDE

2. **Commit changes:**
   ```bash
   git add .
   git commit -m "Your commit message"
   ```

3. **Push to GitHub:**
   ```bash
   git push origin cursor/claude-s-booking-page-commit-4e8f
   ```

4. **If using Netlify:** It will auto-deploy
5. **If deploying manually:** Follow your deployment process

---

## Step 6: Add the Roamly Logo

Once you have the code synced locally:

1. **Copy the logo file:**
   ```bash
   cp "/Users/g.r./Documents/EXOTIQ/Partners/Roamly_Logo.jpg" public/images/partners/Roamly_Logo.jpg
   ```

2. **Or drag and drop** in your IDE:
   - Source: `/Users/g.r./Documents/EXOTIQ/Partners/Roamly_Logo.jpg`
   - Destination: `public/images/partners/Roamly_Logo.jpg`

3. **The logo will appear** on the booking pages automatically

---

## Quick Reference Commands

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Run production build locally
npm run start

# Check for linting errors
npm run lint

# Git workflow
git status                    # Check what changed
git add .                     # Stage all changes
git commit -m "message"       # Commit changes
git push                      # Push to remote
```

---

## Troubleshooting

### Port 3000 in use:
```bash
lsof -ti:3000 | xargs kill -9
npm run dev
```

### Dependencies issues:
```bash
rm -rf node_modules package-lock.json
npm install
```

### Build errors:
```bash
rm -rf .next
npm run build
```

---

## Recommended Workflow

1. **Sync code** (Step 1) - One time
2. **Install dependencies** (Step 2) - One time
3. **Start dev server** (Step 3) - Each session
4. **Make changes** in IDE - Ongoing
5. **Test locally** - Ongoing
6. **Commit & push** when ready - When done
7. **Netlify auto-deploys** - Automatic

You're all set! 🚀
