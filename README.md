# DUCK - Musical Producer Website

## Deploy Options (all free, no limits)

### Cloudflare Pages (Recommended)
1. Go to https://dash.cloudflare.com/sign-up
2. Create free account
3. Go to Workers & Pages → Create
4. Connect GitHub repo: `belentani7/heyduck`
5. Deploy automatically
6. Free subdomain: `heyduck.pages.dev`

### Netlify (Alternative)
1. Go to https://app.netlify.com
2. Sign up with GitHub
3. Import project from GitHub
4. Select repo: `heyduck`
5. Deploy
6. Free subdomain: `heyduck.netlify.app`

### GitHub Pages (Current)
- URL: https://belentani7.github.io/heyduck/
- No custom domain with HTTPS on .dpdns.org

## Project Structure
```
heyduck/
├── .github/workflows/deploy.yml
├── .gitignore
├── .nojekyll
├── index.html          ← Main page
├── data.js             ← All data (tracks, bio, i18n)
├── 1526ad0b-...jpg     ← Logo/favicon
└── images/
    ├── covers/         ← Album covers
    ├── studio/         ← Studio photos
    ├── capa-*.jpg      ← Cover arts
    └── logo-*.png      ← Logos
```

## No Limits
- Cloudflare: Unlimited bandwidth, free forever
- Netlify: 100GB bandwidth/month (enough for millions of visits)
- GitHub Pages: 100GB bandwidth/month
