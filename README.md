# Free Medical Landing (demo)

This is a minimal React + Vite landing page scaffold inspired by a Figma design. It includes a header, hero, features grid and footer. Use it as a starting point to implement the full design.

Quick start (Windows PowerShell):

```powershell
# install dependencies
npm install

# start dev server
npm run dev
```

Routing and pages

This project now includes client-side routing (react-router-dom). Available pages:
- `/` Home (landing)
- `/articles` Articles listing
- `/community` Community

Replace placeholder assets in `src/assets/` with your exported Figma images. For best results, provide webp and png versions and name them consistently (e.g. `hero-illustration.webp` and `hero-illustration.png`) so `ImageOptimized` can use them.

To add exact fonts and color tokens from Figma, upload the font files or share token values (hex/RGB) and I will update `index.html` and `src/styles/global.css` accordingly.

Backend

This project now includes a simple Express backend in `server/index.js` with example API endpoints:
- `GET /api/articles` — list of articles
- `GET /api/articles/:id` — article details
- `GET /api/community` — community posts
- `POST /api/community` — create a community post (expects JSON { title, body })

Run the backend in a separate terminal (development):

```powershell
npm run server
```

When developing, the frontend uses `http://localhost:4000` as the API base. The backend enables CORS so the Vite dev server (different port) can access it.

For production, build the frontend (`npm run build`) and start the backend with `NODE_ENV=production npm run server` — the backend will serve the `dist/` static files and the API from the same origin.

What's included
- `index.html` - HTML entry
- `vite.config.js` - Vite config
- `src/main.jsx` - React entry
- `src/App.jsx` - App shell
- `src/components` - `Header.jsx`, `Hero.jsx`
- `src/styles/global.css` - base styles

Next steps
- Replace placeholder visuals with exported assets from Figma
- Fine-tune typography, spacings, and responsive breakpoints
- Add routing and real content for articles, community forum, and search

Auto-commit & push watcher
---------------------------------
This repository includes an optional watcher script that can automatically stage, commit, and push changes when files under `src/`, `server/`, or the top-level config files are modified.

Use with caution — automatic commits and pushes can create noisy history or unintentionally publish sensitive changes. The watcher is implemented in `scripts/auto-commit-push.js` and can be started with:

```powershell
npm run auto-push
```

If you don't want this behavior, don't run the script. You can remove the script or delete `scripts/auto-commit-push.js` from the repo.
