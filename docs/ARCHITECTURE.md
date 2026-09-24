# Architecture

Step 1 establishes a client-only Vite + React + TypeScript shell. Screens compose the shell and shared UI; feature logic will be added one folder at a time in later build steps.

- `src/app/` owns routing and the persistent app shell.
- `src/components/` contains reusable UI and brand elements.
- `src/config/` is the single source for copy, asset paths, and business settings.
- `src/services/` will own browser APIs and persistence boundaries.
- `src/store/` will own profile/session state.
- `src/styles/` contains global tokens and base styles; component styles stay local.
