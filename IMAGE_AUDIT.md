# Drive Exotiq Image Audit

## Denver Event / R8 Telluride Photo

### Image Details
- **Source**: Professional Sony ILCE-7M3 camera
- **Dimensions**: 1920x1280 pixels (3:2 aspect ratio)
- **Format**: JPEG
- **Size**: ~2.4MB each
- **Processing**: Adobe Photoshop Lightroom Classic 14.5.1

### File Locations & Usage

#### 1. Events Section (`components/sections/Events.tsx`)
```
Path: /images/events/denver-event.jpg
Used for: Featured Denver Launch event card on homepage
Status: ✅ CORRECT
```

#### 2. Events Page (`app/events/page.tsx`)
```
Path: /images/events/denver-event.jpg
Used for: Detailed Denver event page
Status: ✅ CORRECT
Image: <Image unoptimized />
```

#### 3. Cities Page (`app/cities/page.tsx`)
```
Path: /images/cars/R8-telluride.jpg
Used for: Denver city card background
Status: ✅ CORRECT
Image: <Image unoptimized />
```

### Physical Files

✅ **`public/images/events/denver-event.jpg`**
- Size: 2.4MB
- Permissions: -rwxr--r--@
- Purpose: Denver launch event imagery

✅ **`public/images/cars/R8-telluride.jpg`**
- Size: 2.4MB
- Permissions: -rwxr--r--@
- Purpose: Denver city/car showcase

### Notes
- Both files are the SAME image (Audi R8 in Telluride)
- This is intentional - shows the car AND the event location
- Using `unoptimized` flag to prevent Next.js image optimization issues
- All references are correct and working

### All Images Verified ✅
- Logo: `public/images/logos/drive-exotiq-logo.png`
- Denver Event: `public/images/events/denver-event.jpg`
- Denver City: `public/images/cars/R8-telluride.jpg`
- Team headshots: All in `public/images/team/`

**Status**: All images are in the correct locations with proper naming! 🎯
