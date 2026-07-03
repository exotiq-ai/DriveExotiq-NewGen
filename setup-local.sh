#!/bin/bash

# Quick Setup Script for Local Development
# Run this in your Terminal: bash setup-local.sh

echo "🚀 Setting up Drive Exotiq booking pages..."
echo ""

# Navigate to project (update path if needed)
PROJECT_PATH="/Users/g.r./Documents/EXOTIQ/Drive Exotiq Web Build/driveexotiqweb-claude-build-drive-exotiq-website-019ZJQmUZm3CkAHaqJotGJ14"

cd "$PROJECT_PATH" || {
    echo "❌ Error: Could not find project at $PROJECT_PATH"
    echo "Please update PROJECT_PATH in this script to match your project location"
    exit 1
}

echo "✅ Found project directory"
echo ""

# Check if git is available
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed. Please install Git first."
    exit 1
fi

echo "📥 Fetching latest code..."
git fetch origin

echo "🔄 Switching to booking branch..."
git checkout cursor/claude-s-booking-page-commit-4e8f

echo "⬇️  Pulling latest changes..."
git pull origin cursor/claude-s-booking-page-commit-4e8f

echo ""
echo "📦 Installing dependencies..."
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install Node.js from https://nodejs.org/"
    exit 1
fi

npm install

echo ""
echo "✅ Setup complete!"
echo ""
echo "🚀 Starting dev server..."
echo "   (Press Ctrl+C to stop)"
echo ""
echo "Opening http://localhost:3000 in 3 seconds..."
sleep 3

npm run dev
