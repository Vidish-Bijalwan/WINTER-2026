# Icon Generation

Place your app icons in this directory with the following naming convention:
- icon-72x72.png
- icon-96x96.png
- icon-128x128.png
- icon-144x144.png
- icon-152x152.png
- icon-192x192.png
- icon-384x384.png
- icon-512x512.png

You can use online tools like:
- https://realfavicongenerator.net/
- https://www.pwabuilder.com/imageGenerator
- https://favicon.io/

Or use pwa-asset-generator:
```bash
npx pwa-asset-generator logo.svg public/icons --icon-only --favicon
```

For now, the app will work without these icons, but they're required for a complete PWA experience.
