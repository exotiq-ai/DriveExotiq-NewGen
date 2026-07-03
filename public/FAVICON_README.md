# Favicon Assets

This directory should contain the following favicon files for proper browser and device support:

## Required Files

1. **favicon.ico** - Multi-size ICO file (16x16, 32x32)
2. **favicon-16x16.png** - 16x16 PNG
3. **favicon-32x32.png** - 32x32 PNG
4. **apple-touch-icon.png** - 180x180 PNG (for iOS home screen)
5. **android-chrome-192x192.png** - 192x192 PNG
6. **android-chrome-512x512.png** - 512x512 PNG

## Source Image

Use the Drive Exotiq "D" logo icon from brand guidelines:
- The speed-line D symbol in Gulf Blue
- Transparent or dark background
- High resolution source (at least 512x512px)

## Generation Tool

Use https://realfavicongenerator.net/ to generate all required sizes from your source logo image.

1. Upload your source logo image
2. Configure settings (colors, background, etc.)
3. Download the generated package
4. Extract files to `/public/` directory

## Metadata

The favicon metadata has already been configured in `app/layout.tsx`. Once you add these files, they will automatically be used by browsers and devices.

