# Running Drive Exotiq Locally

## Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

## Quick Start

1. **Navigate to the project directory:**
   ```bash
   cd /path/to/driveexotiqweb
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   - Main site: http://localhost:3000
   - Booking page: http://localhost:3000/booking
   - Phoenix booking: http://localhost:3000/booking/phoenix

## Available Scripts

- `npm run dev` - Start development server (port 3000)
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Environment Variables

If you need environment variables (for Supabase, etc.), create a `.env.local` file:
```bash
cp .env.local.example .env.local
# Then edit .env.local with your values
```

## Troubleshooting

### Port 3000 already in use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use a different port
PORT=3001 npm run dev
```

### Dependencies issues
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Build errors
```bash
# Clear Next.js cache
rm -rf .next
npm run build
```
