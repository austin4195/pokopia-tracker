# Pokopia Tracker

A befriend / habitat / "what to do next" tracker for **Pokémon Pokopia**, as a
single self-contained web app. Log which Pokémon you've befriended, record what
you've built on your island (Not built / Empty / Occupied), and get ranked
suggestions for your next move. Your progress is saved in the browser
(`localStorage`) and, once hosted, the app also works offline.

> **Unofficial fan project.** Not affiliated with, endorsed by, or sponsored by
> Nintendo, Game Freak, Koei Tecmo, or The Pokémon Company. Pokémon names,
> sprites, and imagery belong to their respective owners. Keep it free and
> non-commercial. See the disclaimer in the app footer (add your contact email).

## Host it on GitHub Pages

1. Create a new GitHub repository (e.g. `pokopia-tracker`).
2. Add **all files in this folder** to the repo root (`index.html`, `sw.js`,
   `manifest.webmanifest`, the three `icon-*.png` / `apple-touch-icon.png`,
   `.nojekyll`, `LICENSE`, this `README.md`) and push to the `main` branch.
3. Repo → **Settings → Pages** → *Build and deployment* → **Deploy from a
   branch** → Branch: **main**, folder **/ (root)** → **Save**.
4. Wait ~1 minute. Your app is live at
   `https://<your-username>.github.io/<repo-name>/`.

Everything uses **relative paths**, so it works no matter what you name the repo.

### Before you publish
- Open `index.html` and replace `YOUR-EMAIL@example.com` (in the footer) with a
  real contact address for takedown requests.
- Keep it free — no ads, no paid features, no donations-for-features.

## Install / offline
- **iPhone / iPad:** open the Pages URL in Safari → **Share → Add to Home
  Screen**. It launches full-screen and persists your data reliably (a proper
  HTTPS origin, unlike opening a local file).
- **Android / desktop:** the browser will offer **Install** / *Add to Home
  screen* / *Create shortcut*.
- After the first online visit, a service worker caches the app so it opens
  **offline**. Sprites and habitat images are loaded from external hosts, so
  those only appear online (they hide gracefully offline).

## Data portability
Use **Export** to download your progress as JSON, and **Import** to load it on
another device or browser.

## Changing the image sources
Sprite and habitat-image URLs are compiled into `index.html`. Sprites load from
PokéAPI (reliable); habitat images load from a community host and may be blocked
by hotlink protection. To point them at images you host yourself, edit the
`SPRITE_BASE` / `IMG_BASE` constants in the app source and rebuild, or ask for a
build that reads them from a local `/images` folder.

## Notes on updates
When you change `index.html`, bump the `CACHE` name in `sw.js` (e.g.
`pokopia-shell-v2`) so returning visitors pick up the new version instead of the
cached one.
