# Quick Start - Deploy YOLO Rewards to flent.in/yolo

## Prerequisites
First, fix npm cache permissions if needed:
```bash
sudo chown -R $(id -u):$(id -g) "$HOME/.npm"
npm cache clean --force
```

## Install Wrangler
```bash
npm install -D wrangler
# OR globally
npm install -g wrangler
```

## Deploy in 3 Steps

### 1. Login to Cloudflare
```bash
npx wrangler login
```

### 2. Build and Deploy
```bash
npm run deploy
```

That's it! The `deploy` script will:
- Build with the correct base path (`/yolo/`)
- Copy assets to the deployment directory
- Deploy to Cloudflare Workers

### 3. Configure Route in Cloudflare Dashboard

After deployment, you need to configure the route **once**:

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Select your **Flent** account
3. Go to **Workers & Pages**
4. Click on **yolo-rewards**
5. Go to **Settings** > **Triggers**
6. Click **Add route**
7. Configure:
   - **Route**: `flent.in/yolo/*`
   - **Zone**: Select `flent.in`
8. Click **Save**

## Verify Deployment

Test these URLs:
- ✅ `https://flent.in/yolo` - Should show YOLO Rewards app
- ✅ `https://flent.in` - Should show Webflow site (unchanged)
- ✅ Navigate within YOLO app - Client-side routing should work

## Future Updates

After making changes, just run:
```bash
npm run deploy
```

No need to reconfigure routes!

## Troubleshooting

### npm cache errors
Run: `sudo chown -R $(id -u):$(id -g) "$HOME/.npm"`

### Assets not loading
Verify the build output at `dist/index.html` - asset paths should start with `/yolo/`

### Webflow site affected
Check the Worker route is configured for `/yolo/*` only (not `/*`)

## Files Created

- [`wrangler.toml`](wrangler.toml) - Cloudflare Workers configuration
- [`worker/index.js`](worker/index.js) - Worker routing logic
- [`DEPLOYMENT.md`](DEPLOYMENT.md) - Detailed deployment guide

## Need Help?

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions and architecture overview.
