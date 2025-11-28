# E‑Bloombilya — Virtual Lightstick

This small webpage turns your phone into a simple virtual K‑pop style lightstick that supports:

-   On / Off (white buttons)
-   10 preset colors (thumbnails)
-   Modes: Fixed, Random, Blink

How to use

1. Start a local server and open `index.html` in a mobile browser (service workers need HTTP or localhost).
2. Tap **On** to enable the light. 3. Choose a color thumbnail or tap a mode: `Fixed` (steady), `Random` (cycles), `Blink` (flashes). 4. Use `Off` to stop the light.

Files

-   `index.html` — page layout and controls
-   `styles.css` — visuals and glow styles
-   `script.js` — interactive behavior and modes
-   `manifest.json` — PWA manifest
-   `sw.js` — service worker for offline caching

PWA / Offline

-   This project includes a web app manifest (`manifest.json`) and a service worker (`sw.js`). You can install the app to your device and it will cache assets so it works offline.
-   To test locally, run:

```bash
cd /workspaces/e-bloombilya
python3 -m http.server 8000
```

Open `http://localhost:8000` in your browser. Use the browser menu (Add to Home screen / Install) to install. On iOS, use the Share menu -> "Add to Home Screen".

Notes

-   If you change assets, bump the cache name in `sw.js` to force an update.
-   Service worker caching behavior is conservative: it pre-caches the app shell and images and serves cached files when offline.

License

Use freely for personal/noncommercial purposes.

# E‑Bloombilya — Virtual Virtual Lightstick

This small webpage turns your phone into a simple virtual K‑pop style lightstick that supports:

-   On / Off (white buttons)
-   10 preset colors
-   Modes: Fixed, Random, Blink

How to use

1. Open `index.html` in a mobile browser (or desktop). 2. Tap **On** to enable the light. 3. Choose a color or tap a mode: `Fixed` (steady), `Random` (cycles colors), `Blink` (flashes). 4. Use the `Off` button to stop the light.

Notes

-   The page is intentionally simple and mobile friendly. For concerts, increase screen brightness and enable Do Not Disturb to avoid interruptions.
-   Colors and timings can be adjusted in `script.js` and `styles.css`.

Files

-   `index.html` — page layout and controls
-   `styles.css` — visuals and glow styles
-   `script.js` — interactive behavior and modes

License

Use freely for personal/noncommercial purposes.

# e-bloombilya
