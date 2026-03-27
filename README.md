# Altitude + Astro Starter Kit: Basics

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```
/
├── public/
│   └── favicon.svg
├── src/
│   ├── assets/
│   │   └── background.svg
│   ├── components/
│   │   ├── Card.astro
│   │   └── Welcome.astro
│   ├── layouts/
│   │   └── Layout.astro
│   ├── pages/
│   │   ├── [...https].astro
│   │   ├── 404.astro
│   │   └── index.astro
│   └── styles/
│       └── global.css
└── package.json
```

Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.

There's nothing special about `src/components/`, but that's where we like to put any Astro/React/Vue/Svelte/Preact components.

Any static assets, like images, can be placed in the `public/` directory.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                                        |
| :------------------------ | :------------------------------------------------------------ |
| `npm install`             | Installs dependencies                                         |
| `npm run dev`             | Starts local dev server at `localhost:3000`                   |
| `npm run build`           | Build your production site to `./dist/`                       |
| `npm run preview`         | Preview your build locally, before deploying using wrangler   |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check`              |
| `npm run astro -- --help` | Get help using the Astro CLI                                  |
| `npm run wrangler:dev`    | Build your production site and preview locally using wrangler |
