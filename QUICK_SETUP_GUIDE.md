# Quick Setup: Social Sharing & Favicons

## 🚀 Fast Track (15 minutes)

### Step 1: Create OG Image (5 min)

**Easiest Method - Use Canva:**

1. Go to [Canva.com](https://canva.com)
2. Click "Custom Size" → 1200 x 630 px
3. Upload your R8 Telluride image: `public/images/events/denver-event.jpg`
4. Add it as background
5. Add text overlay:
   - Top: "DRIVE EXOTIQ" (large, white, bold)
   - Bottom: "Where Precision Meets Passion" (smaller, white)
6. Download as JPG
7. **Save to**: `public/og-image.jpg`

**Alternative - Use our R8 image directly:**
```bash
# Simple option: Just copy the R8 image as OG image (temporary)
cp public/images/events/denver-event.jpg public/og-image.jpg
```
(Not ideal size, but will work until you make a proper one)

---

### Step 2: Generate Favicons (5 min)

**Use RealFaviconGenerator (Recommended):**

1. **Go to**: https://realfavicongenerator.net/

2. **Upload**: `public/images/logos/drive-exotiq-logo.png`

3. **Click**: "Generate your Favicons and HTML code"

4. **Download** the zip file

5. **Extract all PNG/ICO files** to `/public/` folder:
   ```
   favicon.ico
   favicon-16x16.png
   favicon-32x32.png
   apple-touch-icon.png
   android-chrome-192x192.png
   android-chrome-512x512.png
   ```

6. **Delete** the `site.webmanifest` and HTML code (we already have the config!)

**That's it!** The code is already set up to use these files.

---

### Step 3: Verify (5 min)

1. **Run dev server**: `npm run dev`

2. **Check browser tab** - Should show favicon

3. **Test social share**:
   - https://developers.facebook.com/tools/debug/
   - Paste: `http://localhost:3000`
   - Should show OG image preview

---

## 📋 What's Already Done

✅ Metadata configured in `app/layout.tsx`  
✅ All OG tags (Facebook, LinkedIn)  
✅ Twitter Card tags  
✅ Favicon metadata  

## 🎯 What You Need to Add

⏳ `/public/og-image.jpg` - 1200x630px  
⏳ `/public/favicon.ico` + 5 other sizes  

**Time estimate**: 15 minutes total

---

## 🎨 Pro Tips

### For OG Image:
- Use the R8 image (it's already stunning!)
- Add Drive Exotiq logo overlay (white, top left)
- Add tagline (white, bottom center)
- Dark overlay helps text readability

### For Favicons:
- The D logo works great as a favicon
- Gulf Blue background looks sharp
- Keep it simple - will be 16x16px tiny!

---

## 🐛 Troubleshooting

**Favicon not showing?**
- Hard refresh: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)
- Clear browser cache
- Check file is actually in `/public/`

**OG image not showing?**
- Use Facebook Debugger to scrape: https://developers.facebook.com/tools/debug/
- Make sure file is under 1MB
- Check file path is `/public/og-image.jpg` (not in subdirectory)

---

See `SOCIAL_SHARING_SETUP.md` for detailed guide.




