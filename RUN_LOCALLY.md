# How to Run Drive Exotiq Locally on Your Machine

## The Issue
You're seeing error -102 because your browser is trying to connect to `localhost:3000` on your local machine, but the server is running in a remote cloud environment.

## Solution: Run the Server Locally

### Step 1: Make sure you have the code locally
If you haven't already, clone or pull the repository:
```bash
cd /path/to/your/project
git pull origin cursor/claude-s-booking-page-commit-4e8f
```

### Step 2: Install dependencies
```bash
npm install
```

### Step 3: Start the development server
```bash
npm run dev
```

You should see:
```
▲ Next.js 14.2.33
- Local:        http://localhost:3000

✓ Ready in Xms
```

### Step 4: Open in your browser
- **Main site:** http://localhost:3000
- **Booking page:** http://localhost:3000/booking
- **Phoenix booking:** http://localhost:3000/booking/phoenix

## Troubleshooting

### Port 3000 already in use
```bash
# Find what's using port 3000
lsof -i :3000

# Kill it (replace PID with the process ID)
kill -9 <PID>

# Or use a different port
PORT=3001 npm run dev
```

### Module not found errors
```bash
# Clear and reinstall
rm -rf node_modules package-lock.json .next
npm install
npm run dev
```

### Build errors
```bash
# Clear Next.js cache
rm -rf .next
npm run dev
```

## Quick Check
After running `npm run dev`, you should be able to access:
- ✅ http://localhost:3000 (should work)
- ✅ http://localhost:3000/booking (should work)
- ✅ http://localhost:3000/booking/phoenix (should work)

If you still get errors, check the terminal output for specific error messages.
