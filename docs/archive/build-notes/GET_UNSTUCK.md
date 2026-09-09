# 🚀 Get Unstuck - Quick Start Guide

## Step 1: Push Everything to Git (Already Done ✅)
All changes are already pushed to: `cursor/claude-s-booking-page-commit-4e8f`

---

## Step 2: Sync Your Local Code

**Copy and paste these commands one by one in Terminal:**

```bash
# Navigate to your project
cd "/Users/g.r./Documents/EXOTIQ/Drive Exotiq Web Build/driveexotiqweb-claude-build-drive-exotiq-website-019ZJQmUZm3CkAHaqJotGJ14"

# Check what branch you're on
git branch

# Fetch latest from GitHub
git fetch origin

# Switch to the booking branch (if not already on it)
git checkout cursor/claude-s-booking-page-commit-4e8f

# Pull latest changes
git pull origin cursor/claude-s-booking-page-commit-4e8f
```

---

## Step 3: Install Dependencies

```bash
# Make sure you're in the project folder
cd "/Users/g.r./Documents/EXOTIQ/Drive Exotiq Web Build/driveexotiqweb-claude-build-drive-exotiq-website-019ZJQmUZm3CkAHaqJotGJ14"

# Install all packages
npm install
```

**Wait for this to finish** - it may take 1-2 minutes.

---

## Step 4: Start the Dev Server

```bash
# Still in the project folder, run:
npm run dev
```

**You should see:**
```
▲ Next.js 14.2.33
- Local:        http://localhost:3000

✓ Ready in Xms
```

**If you see "Ready" - you're good!** ✅

---

## Step 5: Open in Browser

1. **Open your browser**
2. **Go to:** http://localhost:3000
3. **Test the pages:**
   - http://localhost:3000/booking
   - http://localhost:3000/booking/phoenix

---

## Common Issues & Quick Fixes

### ❌ "Port 3000 already in use"
```bash
# Kill whatever is using port 3000
lsof -ti:3000 | xargs kill -9

# Then try again
npm run dev
```

### ❌ "Command not found: npm"
You need Node.js installed. Download from: https://nodejs.org/

### ❌ "Module not found" errors
```bash
# Delete and reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### ❌ "Git branch not found"
```bash
# Fetch all branches first
git fetch origin

# Then checkout
git checkout cursor/claude-s-booking-page-commit-4e8f
```

### ❌ "Cannot connect to localhost:3000"
Make sure the dev server is running. Check Terminal for errors.

---

## What to Do Next

Once `npm run dev` is running:

1. ✅ **Keep Terminal open** (don't close it)
2. ✅ **Open your IDE** (VS Code/Cursor)
3. ✅ **Open the project folder** in IDE
4. ✅ **Edit files** - changes auto-reload in browser!
5. ✅ **No more terminal needed** (except to stop server: Ctrl+C)

---

## Stop the Server

When you're done:
- Press `Ctrl + C` in Terminal
- Or close the Terminal window

---

## Need Help?

If you're still stuck, tell me:
1. What error message you see
2. What step you're on
3. What command you just ran

I'll help you fix it! 🛠️
