# 🎬 Video Setup - Quick Start Guide

## ✅ What I Just Built

I've implemented a **performance-optimized hero video system** for your Drive Exotiq homepage. Here's what's ready:

### New Components:
- ✅ `components/sections/HeroVideo.tsx` - Smart video player with fallbacks
- ✅ Updated `components/sections/Hero.tsx` - Now uses video background
- ✅ Connection-aware loading (only loads video on good connections)
- ✅ Reduced-motion support (respects user preferences)
- ✅ Auto-pause on scroll (saves bandwidth)
- ✅ Mobile/desktop detection (serves appropriate file sizes)
- ✅ Smooth fade transition from poster image to video

---

## 📍 WHERE TO SAVE YOUR VIDEO

### Step 1: Save Original Video
**Your file:** `Telluride-short.mp4`

**Save it here:**
```
/Users/g.r./.cursor/worktrees/driveexotiqweb-claude-build-drive-exotiq-website-019ZJQmUZm3CkAHaqJotGJ14/jcs/public/videos/Telluride-short.mp4
```

Or in short:
```
public/videos/Telluride-short.mp4
```

---

## 🚀 Quick Setup (3 Options)

### Option A: Just Drop and Test (Quick!)
If you want to test immediately without optimization:

1. Rename `Telluride-short.mp4` to `hero-desktop.mp4`
2. Copy it 4 times:
   - `hero-desktop.mp4`
   - `hero-desktop.webm` (rename from .mp4)
   - `hero-mobile.mp4`
   - `hero-mobile.webm` (rename from .mp4)
3. Place all in `public/videos/`
4. Run `npm run dev`

**Note:** This will work but files won't be optimized (slower loading).

---

### Option B: Optimize with FFmpeg (Best Performance) ⭐

**Install FFmpeg:**
```bash
brew install ffmpeg
```

**Navigate to videos folder:**
```bash
cd /Users/g.r./.cursor/worktrees/driveexotiqweb-claude-build-drive-exotiq-website-019ZJQmUZm3CkAHaqJotGJ14/jcs/public/videos
```

**Run optimization (copy/paste all at once):**
```bash
# Mobile MP4 (720p)
ffmpeg -i Telluride-short.mp4 -vf "scale=1280:720" -c:v libx264 -crf 28 -preset slow -an -movflags +faststart hero-mobile.mp4

# Mobile WebM (720p)
ffmpeg -i Telluride-short.mp4 -vf "scale=1280:720" -c:v libvpx-vp9 -crf 32 -b:v 0 -an hero-mobile.webm

# Desktop MP4 (1080p)
ffmpeg -i Telluride-short.mp4 -vf "scale=1920:1080" -c:v libx264 -crf 23 -preset slow -an -movflags +faststart hero-desktop.mp4

# Desktop WebM (1080p)
ffmpeg -i Telluride-short.mp4 -vf "scale=1920:1080" -c:v libvpx-vp9 -crf 30 -b:v 0 -an hero-desktop.webm
```

**This will create 4 optimized files** (~10 minutes processing time)

---

### Option C: Use Online Tool (No Install)

1. Go to https://www.freeconvert.com/video-compressor
2. Upload `Telluride-short.mp4`
3. Set resolution to 1920x1080
4. Select "Compress video"
5. Download as `hero-desktop.mp4`
6. Repeat with 1280x720 for `hero-mobile.mp4`
7. Copy the same files and rename to `.webm` (browser will fall back to MP4)

---

## ✅ Checklist

After adding videos, you should have:

```
public/videos/
├── hero-mobile.mp4    ✓ (Required)
├── hero-mobile.webm   ✓ (Required)
├── hero-desktop.mp4   ✓ (Required)
└── hero-desktop.webm  ✓ (Required)
```

---

## 🧪 Testing

1. **Start dev server:**
   ```bash
   npm run dev
   ```

2. **Open:** http://localhost:3000

3. **Check:**
   - [ ] Video loads and autoplays
   - [ ] Video loops seamlessly
   - [ ] No audio plays
   - [ ] Poster image shows first
   - [ ] Smooth transition to video
   - [ ] Video pauses when you scroll down

4. **Test on mobile:**
   - Open DevTools (F12)
   - Toggle device toolbar
   - Refresh page
   - Verify smaller video loads

---

## 🎯 What Happens Now

**With videos added:**
- Hero section will show smooth video background
- Mobile users get smaller file size (faster loading)
- Desktop users get higher quality
- Slow connections automatically fall back to static image
- Users with motion sensitivity preferences see static image

**Without videos (current state):**
- Fallback to beautiful Bugatti static image (what you have now)
- Everything still works perfectly
- No errors or broken functionality

---

## 📊 Performance Impact

| Metric | Before (Static) | After (Video) |
|--------|----------------|---------------|
| Initial Load | ~200KB | ~1-3MB |
| Mobile Data | 200KB | ~1MB (optimized) |
| Desktop Data | 200KB | ~3-5MB (optimized) |
| Load Time (4G) | <1s | ~2-3s |
| User Impact | ✅ Great | ✅ Premium |

The video adds ~2-3 seconds to initial load but creates a **significantly more premium experience**.

---

## 🔄 Rollback (If Needed)

If you want to revert to static image:

```tsx
// In components/sections/Hero.tsx, change:
import HeroVideo from '@/components/sections/HeroVideo';

// Back to:
import Image from 'next/image';
```

And restore the previous Image component code.

---

## 📞 Next Steps

1. **Drop your video** in `public/videos/Telluride-short.mp4`
2. **Choose optimization method** (A, B, or C above)
3. **Test it** with `npm run dev`
4. **Optional:** Adjust brightness/overlay in `HeroVideo.tsx` if needed

The system is **live and ready** - just add your optimized video files! 🚀

---

**Questions?** The detailed guide is in `public/videos/VIDEO_OPTIMIZATION_GUIDE.md`




