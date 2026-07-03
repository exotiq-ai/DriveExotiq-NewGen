# Hero Video Optimization Guide

## 📁 Where to Save Your Video

**Original File:** `Telluride-short.mp4`

**Save the original here:**
```
public/videos/Telluride-short.mp4
```

---

## 🎬 Required Optimized Versions

You need to create **4 optimized versions** from your source video:

1. `hero-mobile.mp4` (720p, highly compressed)
2. `hero-mobile.webm` (720p, WebM format)
3. `hero-desktop.mp4` (1080p, good quality)
4. `hero-desktop.webm` (1080p, WebM format)

---

## 🛠️ Option 1: Using FFmpeg (Recommended)

### Install FFmpeg

**Mac:**
```bash
brew install ffmpeg
```

**Windows:**
Download from https://ffmpeg.org/download.html

**Linux:**
```bash
sudo apt-get install ffmpeg
```

### Optimization Commands

Run these commands from the `public/videos/` directory:

```bash
# 1. Mobile MP4 (720p, target ~1-2MB)
ffmpeg -i Telluride-short.mp4 -vf "scale=1280:720" -c:v libx264 -crf 28 -preset slow -an -movflags +faststart hero-mobile.mp4

# 2. Mobile WebM (720p, better compression)
ffmpeg -i Telluride-short.mp4 -vf "scale=1280:720" -c:v libvpx-vp9 -crf 32 -b:v 0 -an hero-mobile.webm

# 3. Desktop MP4 (1080p, target ~3-5MB)
ffmpeg -i Telluride-short.mp4 -vf "scale=1920:1080" -c:v libx264 -crf 23 -preset slow -an -movflags +faststart hero-desktop.mp4

# 4. Desktop WebM (1080p, better compression)
ffmpeg -i Telluride-short.mp4 -vf "scale=1920:1080" -c:v libvpx-vp9 -crf 30 -b:v 0 -an hero-desktop.webm
```

**Explanation of flags:**
- `-vf "scale=WIDTHxHEIGHT"` - Resize video
- `-c:v libx264` - H.264 codec (MP4)
- `-c:v libvpx-vp9` - VP9 codec (WebM)
- `-crf 23-32` - Quality (lower = better, 23 is high quality, 32 is more compressed)
- `-preset slow` - Better compression (slower encoding)
- `-an` - Remove audio (not needed for background video)
- `-movflags +faststart` - Optimize for web streaming (MP4 only)

---

## 🎨 Option 2: Using HandBrake (GUI Tool)

If you prefer a graphical interface:

1. Download HandBrake: https://handbrake.fr/
2. Open `Telluride-short.mp4`
3. For Mobile version:
   - Preset: "Fast 720p30"
   - Dimensions: Width 1280
   - Audio: Remove all audio tracks
   - Save as `hero-mobile.mp4`
4. For Desktop version:
   - Preset: "Fast 1080p30"
   - Dimensions: Width 1920
   - Audio: Remove all audio tracks
   - Save as `hero-desktop.mp4`

**Note:** HandBrake doesn't create WebM files. You'll still need FFmpeg for those, or you can skip WebM for now (MP4 will work fine).

---

## 🌐 Option 3: Online Video Converter (Quick & Easy)

If you don't want to install anything:

1. Go to https://www.freeconvert.com/video-compressor
2. Upload `Telluride-short.mp4`
3. Settings for Mobile:
   - Resolution: 1280x720
   - Compression: Medium
   - Remove audio
   - Download as `hero-mobile.mp4`
4. Repeat for Desktop (1920x1080)

**Note:** Online tools may not give optimal compression, but will work for testing.

---

## ✅ Final File Structure

After optimization, your directory should look like:

```
public/videos/
  ├── Telluride-short.mp4          (original - can keep or delete)
  ├── hero-mobile.mp4               (REQUIRED - 720p, 1-2MB)
  ├── hero-mobile.webm              (REQUIRED - 720p, 800KB-1.5MB)
  ├── hero-desktop.mp4              (REQUIRED - 1080p, 3-5MB)
  ├── hero-desktop.webm             (REQUIRED - 1080p, 2-3MB)
  └── VIDEO_OPTIMIZATION_GUIDE.md   (this file)
```

---

## 🎯 Target File Sizes

| File | Target Size | Max Size |
|------|-------------|----------|
| `hero-mobile.mp4` | 1-2MB | 3MB |
| `hero-mobile.webm` | 800KB-1.5MB | 2MB |
| `hero-desktop.mp4` | 3-5MB | 7MB |
| `hero-desktop.webm` | 2-3MB | 5MB |

If your files are larger, increase the `-crf` value (more compression).

---

## 🚀 Testing

Once you've created the optimized files:

1. Start your dev server: `npm run dev`
2. Open http://localhost:3000
3. Check that:
   - Video loads and plays automatically
   - Video loops seamlessly
   - No audio plays
   - Static image shows first, then transitions to video
   - On mobile, smaller version loads

---

## 🔧 Advanced Tips

### If video is too large:
```bash
# Increase compression (higher CRF = smaller file)
ffmpeg -i Telluride-short.mp4 -vf "scale=1920:1080" -c:v libx264 -crf 28 -preset slow -an -movflags +faststart hero-desktop.mp4
```

### If video looks pixelated:
```bash
# Decrease compression (lower CRF = better quality)
ffmpeg -i Telluride-short.mp4 -vf "scale=1920:1080" -c:v libx264 -crf 20 -preset slow -an -movflags +faststart hero-desktop.mp4
```

### To trim video length (first 10 seconds):
```bash
ffmpeg -i Telluride-short.mp4 -t 10 -vf "scale=1920:1080" -c:v libx264 -crf 23 -preset slow -an -movflags +faststart hero-desktop.mp4
```

### To create a perfect loop:
```bash
# Add fade in/out for seamless loop
ffmpeg -i Telluride-short.mp4 -vf "scale=1920:1080,fade=t=in:st=0:d=1,fade=t=out:st=9:d=1" -c:v libx264 -crf 23 -preset slow -an -movflags +faststart hero-desktop.mp4
```

---

## 🎬 Video Best Practices

✅ **DO:**
- Keep video 10-20 seconds max
- Remove all audio
- Use smooth, slow motion shots
- Test on slow connections
- Use high-quality source footage

❌ **DON'T:**
- Use shaky/jerky footage
- Include text in video (use HTML overlay instead)
- Make video too long (increases file size)
- Forget to test on mobile devices

---

## 📞 Need Help?

If you run into issues:
1. Check file sizes with `ls -lh` in the videos directory
2. Test video playback locally with VLC or QuickTime
3. Verify files are in the correct format (MP4/WebM)
4. Check browser console for loading errors

---

**Status:** ⏳ Waiting for optimized video files to be added
**Current:** Fallback image is showing (Bugatti from Unsplash)
**Next:** Add optimized videos and test!




