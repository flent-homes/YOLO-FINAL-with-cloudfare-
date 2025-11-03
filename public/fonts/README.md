# Font Files

Place your font files in this directory. Both Plus Jakarta Sans and Zin Display Condensed fonts should be placed here.

## Plus Jakarta Sans Font Files

### Regular Weight (400):
- `PlusJakartaSans-Regular.woff2` (preferred)
- `PlusJakartaSans-Regular.woff` (fallback)
- `PlusJakartaSans-Regular.ttf` (fallback)

### Medium Weight (500):
- `PlusJakartaSans-Medium.woff2` (preferred)
- `PlusJakartaSans-Medium.woff` (fallback)
- `PlusJakartaSans-Medium.ttf` (fallback)

### SemiBold Weight (600):
- `PlusJakartaSans-SemiBold.woff2` (preferred)
- `PlusJakartaSans-SemiBold.woff` (fallback)
- `PlusJakartaSans-SemiBold.ttf` (fallback)

### Bold Weight (700):
- `PlusJakartaSans-Bold.woff2` (preferred)
- `PlusJakartaSans-Bold.woff` (fallback)
- `PlusJakartaSans-Bold.ttf` (fallback)

## Zin Display Condensed Font Files

### Regular Weight (400):
- `ZinDisplayCondensed-Regular.woff2` (preferred)
- `ZinDisplayCondensed-Regular.woff` (fallback)
- `ZinDisplayCondensed-Regular.ttf` (fallback)

### Bold Weight (700):
- `ZinDisplayCondensed-Bold.woff2` (preferred)
- `ZinDisplayCondensed-Bold.woff` (fallback)
- `ZinDisplayCondensed-Bold.ttf` (fallback)

## File Format Priority:
1. **WOFF2** - Best compression and browser support (recommended)
2. **WOFF** - Good compression and broad support
3. **TTF** - Universal fallback

## Alternative Naming:
If your font files have different names, you can either:
1. Rename them to match the expected names above, OR
2. Update the `@font-face` declarations in `src/index.css` to match your file names

The font files will be served from `/fonts/` and loaded automatically when placed in this directory.

