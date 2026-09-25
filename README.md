# Praanaika View

A mobile-first PWA demo for personal baseline insights across body, environment, and routine.

## Start

```bash
npm install
npm run dev
```

Step 1 currently provides the token-driven shell, five-tab navigation, placeholder routes, mascot, demo banner, and asset map. See [`docs/ASSETS_TODO.md`](docs/ASSETS_TODO.md) for the files to replace with final brand assets.

The app is a PWA. Local desktop testing works at `localhost`; phone installation requires the deployed app to be served over HTTPS. A phone opened through a local network HTTP address can preview the app, but browsers will not expose the install prompt there.

This is a wellness insight tool, not a diagnostic device. Demo readings are synthetic.

## Gemini Ask setup

Ask Pran uses the server-side `/api/ask` function when deployed to Vercel. Copy `.env.example` to your local environment or add these variables in Vercel Project Settings:

```text
GEMINI_API_KEY=your_key_here
GEMINI_MODEL=the_exact_flash_model_enabled_for_your_account
```

Do not prefix these variables with `VITE_`; the key must never be bundled into the browser. Without the variables, Talk uses a safe offline abstention response. The model name is configurable because Google model identifiers can differ by account and API release.
