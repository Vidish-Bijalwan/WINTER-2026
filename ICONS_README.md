# Icons Setup

To complete the PWA setup, you need to generate app icons. The manifest.json references icons in the `/public/icons/` directory.

## Required Icon Sizes

- 72x72
- 96x96
- 128x128
- 144x144
- 152x152
- 192x192
- 384x384
- 512x512

## Generating Icons

You can use online tools like:
- https://realfavicongenerator.net/
- https://www.pwabuilder.com/imageGenerator
- https://favicon.io/

Or use a tool like `pwa-asset-generator`:

```bash
npx pwa-asset-generator logo.svg public/icons --icon-only --favicon
```

Place all generated icons in the `public/icons/` directory with the naming convention:
- `icon-72x72.png`
- `icon-96x96.png`
- etc.

The icons should be PNG format with transparent backgrounds (for maskable icons).
