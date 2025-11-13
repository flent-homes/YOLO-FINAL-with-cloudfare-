# YOLO Rewards Deployment Guide

## Overview
This guide explains how to deploy the YOLO Rewards React app to Cloudflare Workers, making it accessible at `flent.in/yolo` while preserving your existing Webflow site on `flent.in`.

## Architecture
- **React SPA**: Served on `/yolo/*` paths via Cloudflare Workers
- **Webflow Site**: All other paths proxy through to your Webflow origin
- **Worker**: Handles routing logic to serve React app or proxy to Webflow

## Prerequisites
1. Cloudflare account with access to `flent.in` zone
2. Node.js and npm installed
3. Wrangler CLI (Cloudflare's deployment tool)

## Setup Steps

### 1. Fix NPM Cache (if needed)
If you encounter npm cache permission errors, run:
```bash
sudo chown -R $(id -u):$(id -g) "$HOME/.npm"
npm cache clean --force
```

### 2. Install Wrangler
```bash
npm install -D wrangler
```

Or install globally:
```bash
npm install -g wrangler
```

### 3. Login to Cloudflare
```bash
npx wrangler login
```

This will open a browser window for authentication.

### 4. Build the Application
```bash
CF_PAGES=true npm run build
rm -rf dist-deploy && cp -r dist dist-deploy
```

### 5. Deploy to Cloudflare Workers
```bash
npx wrangler deploy
```

### 6. Configure DNS and Routes

#### Option A: Via Cloudflare Dashboard
1. Go to the Cloudflare dashboard
2. Select your `flent.in` zone
3. Navigate to **DNS** > **Records**
4. Ensure you have a DNS record for `flent.in` (should already exist for Webflow)
   - If using Webflow, you should have an A or CNAME record pointing to Webflow
   - Make sure it's **proxied** (orange cloud)

5. Navigate to **Workers & Pages** > **yolo-rewards** > **Settings** > **Triggers**
6. Click **Add route**
7. Add the following route:
   - **Route**: `flent.in/yolo/*`
   - **Zone**: `flent.in`
   - Click **Save**

#### Option B: Via Wrangler (Alternative)
Uncomment the routes section in `wrangler.toml` and add:
```toml
[[routes]]
pattern = "flent.in/yolo/*"
zone_name = "flent.in"
```

Then deploy again:
```bash
npx wrangler deploy
```

## How It Works

### Worker Routing Logic
The Worker ([worker/index.js](worker/index.js)) implements the following logic:

1. **Requests to `/yolo` or `/yolo/*`**:
   - Stripped of the `/yolo` prefix
   - Served from the React SPA static assets
   - 404s fallback to `index.html` for client-side routing

2. **All other requests**:
   - Proxied directly to `https://flent.webflow.io`
   - Headers and body are preserved
   - Your Webflow site continues to work normally

### Build Configuration
The Vite config ([vite.config.ts:9](vite.config.ts#L9)) automatically sets the base path to `/yolo/` when `CF_PAGES=true` is set, ensuring all asset URLs are correct.

## Verification

After deployment, test the following:

1. **YOLO App**: Visit `https://flent.in/yolo` - should load your React app
2. **YOLO Routes**: Navigate within the app - routing should work
3. **Webflow Site**: Visit `https://flent.in` - should show your normal Webflow site
4. **Webflow Pages**: Visit any Webflow page - should work as before

## Troubleshooting

### Assets not loading
- Check that asset URLs in the build start with `/yolo/`
- Verify the build was run with `CF_PAGES=true`

### Webflow site not working
- Verify the Webflow origin URL in `worker/index.js` is correct
- Check that the Worker route is configured for `/yolo/*` only

### 404 errors on refresh
- Ensure `not_found_handling = "single-page-application"` is set in `wrangler.toml`
- The Worker should serve `index.html` for navigation requests

## Updating the Deployment

To update the deployment after making changes:

1. Make your code changes
2. Build: `CF_PAGES=true npm run build && rm -rf dist-deploy && cp -r dist dist-deploy`
3. Deploy: `npx wrangler deploy`

## Notes

- The Worker is named `yolo-rewards` (already exists in your Cloudflare account)
- Static assets are served from the `dist-deploy` directory
- The SPA router handles client-side navigation
- The Webflow site remains completely unaffected by this deployment

## Support

For issues with:
- **Cloudflare Workers**: Check the [Cloudflare Workers docs](https://developers.cloudflare.com/workers/)
- **Wrangler CLI**: See [Wrangler documentation](https://developers.cloudflare.com/workers/wrangler/)
- **This deployment**: Review `worker/index.js` and `wrangler.toml`
