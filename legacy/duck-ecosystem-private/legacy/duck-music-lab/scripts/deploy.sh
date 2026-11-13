#!/bin/bash
# Deploy script - Automatic deployment to all platforms

set -e

echo "🚀 DUCK Music Lab - Deploy Pipeline"
echo "===================================="

# Build
echo "1️⃣ Building..."
npm ci
npm run build

# Deploy to Vercel
echo "2️⃣ Deploying to Vercel..."
npx vercel --prod --token=$VERCEL_TOKEN || echo "⚠️ Vercel deploy skipped (no token)"

# Deploy to Netlify
echo "3️⃣ Deploying to Netlify..."
netlify deploy --prod --dir=dist --auth=$NETLIFY_AUTH_TOKEN --site=$NETLIFY_SITE_ID || echo "⚠️ Netlify deploy skipped"

# Deploy to GitHub Pages
echo "4️⃣ Pushing to GitHub Pages..."
git add dist/
git commit -m "chore: update dist for GitHub Pages" || true
git push origin main

echo ""
echo "✅ Deploy complete!"
echo ""
echo "Live URLs:"
echo "  • Vercel: https://duck-music-lab-belentani.vercel.app"
echo "  • Netlify: https://duck-music-lab-belentani.netlify.app"
echo "  • GitHub Pages: https://belentani7.github.io/duck-music-lab"
