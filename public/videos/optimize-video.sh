#!/bin/bash

# Drive Exotiq - Hero Video Optimization Script
# This script optimizes your video for web use
# Usage: ./optimize-video.sh Telluride-short.mp4

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔═══════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  Drive Exotiq Video Optimizer        ║${NC}"
echo -e "${BLUE}╚═══════════════════════════════════════╝${NC}"
echo ""

# Check if FFmpeg is installed
if ! command -v ffmpeg &> /dev/null; then
    echo -e "${YELLOW}⚠️  FFmpeg is not installed!${NC}"
    echo ""
    echo "Install it with:"
    echo "  Mac:     brew install ffmpeg"
    echo "  Linux:   sudo apt-get install ffmpeg"
    echo "  Windows: Download from https://ffmpeg.org/download.html"
    exit 1
fi

# Check if input file is provided
if [ -z "$1" ]; then
    echo -e "${YELLOW}⚠️  Please provide a video file!${NC}"
    echo ""
    echo "Usage: ./optimize-video.sh Telluride-short.mp4"
    exit 1
fi

INPUT_FILE="$1"

# Check if input file exists
if [ ! -f "$INPUT_FILE" ]; then
    echo -e "${YELLOW}⚠️  File not found: $INPUT_FILE${NC}"
    exit 1
fi

echo -e "${GREEN}✓${NC} Found input file: $INPUT_FILE"
echo ""
echo "Creating optimized versions..."
echo ""

# Mobile MP4 (720p)
echo -e "${BLUE}[1/4]${NC} Creating hero-mobile.mp4 (720p)..."
ffmpeg -i "$INPUT_FILE" -vf "scale=1280:720" -c:v libx264 -crf 28 -preset slow -an -movflags +faststart hero-mobile.mp4 -y -loglevel error
if [ $? -eq 0 ]; then
    SIZE=$(du -h hero-mobile.mp4 | cut -f1)
    echo -e "      ${GREEN}✓${NC} Done! Size: $SIZE"
else
    echo -e "      ${YELLOW}✗${NC} Failed"
fi
echo ""

# Mobile WebM (720p)
echo -e "${BLUE}[2/4]${NC} Creating hero-mobile.webm (720p)..."
ffmpeg -i "$INPUT_FILE" -vf "scale=1280:720" -c:v libvpx-vp9 -crf 32 -b:v 0 -an hero-mobile.webm -y -loglevel error
if [ $? -eq 0 ]; then
    SIZE=$(du -h hero-mobile.webm | cut -f1)
    echo -e "      ${GREEN}✓${NC} Done! Size: $SIZE"
else
    echo -e "      ${YELLOW}✗${NC} Failed"
fi
echo ""

# Desktop MP4 (1080p)
echo -e "${BLUE}[3/4]${NC} Creating hero-desktop.mp4 (1080p)..."
ffmpeg -i "$INPUT_FILE" -vf "scale=1920:1080" -c:v libx264 -crf 23 -preset slow -an -movflags +faststart hero-desktop.mp4 -y -loglevel error
if [ $? -eq 0 ]; then
    SIZE=$(du -h hero-desktop.mp4 | cut -f1)
    echo -e "      ${GREEN}✓${NC} Done! Size: $SIZE"
else
    echo -e "      ${YELLOW}✗${NC} Failed"
fi
echo ""

# Desktop WebM (1080p)
echo -e "${BLUE}[4/4]${NC} Creating hero-desktop.webm (1080p)..."
ffmpeg -i "$INPUT_FILE" -vf "scale=1920:1080" -c:v libvpx-vp9 -crf 30 -b:v 0 -an hero-desktop.webm -y -loglevel error
if [ $? -eq 0 ]; then
    SIZE=$(du -h hero-desktop.webm | cut -f1)
    echo -e "      ${GREEN}✓${NC} Done! Size: $SIZE"
else
    echo -e "      ${YELLOW}✗${NC} Failed"
fi
echo ""

echo -e "${GREEN}═══════════════════════════════════════${NC}"
echo -e "${GREEN}🎉 Optimization Complete!${NC}"
echo -e "${GREEN}═══════════════════════════════════════${NC}"
echo ""
echo "Files created:"
ls -lh hero-*.mp4 hero-*.webm 2>/dev/null | awk '{print "  • " $9 " (" $5 ")"}'
echo ""
echo -e "${BLUE}Next steps:${NC}"
echo "  1. Run: npm run dev"
echo "  2. Open: http://localhost:3000"
echo "  3. Check that video plays smoothly"
echo ""




