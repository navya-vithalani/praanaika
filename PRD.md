# Praanaika View: PRD for the demo build

**Version:** demo build v0.1 · **Builder:** one person, working alone
**This document = context for any AI coding assistant.** The build-specific decisions are in Sections 1–14. 

---

## 1. What we are building (and the priority order)

A **mobile-first Progressive Web App (PWA)** that demos "Praanaika View": a companion app that turns a person's check-ins, logs, and (in the demo) Hub and Gem sensor data into short, friendly, first-person insights from a mascot. It runs on **one clearly labelled synthetic demo profile** plus a **real, working "create your own profile"**, with **real local air quality** from a free API.

**Priority order (build in this order, and cut from the bottom if time runs out):**

1. **Beautiful UI that works on mobile** (tokens, shell, five tabs, install/PWA)
2. **Basic directly generated data + insights** (in-browser seeded generator, rule-based insights, hand-made insights as fallback)
3. **Dual profile:** one **Demo profile** and one **Create-your-own profile**
4. **Working Talk tab:** Feed (check-in, logs, insights) and Ask
5. **Design-your-own** with saved creations and the order flow
6. **About page** (judge-facing, animated) and **Wrapped** (demo only)

**Worst-case fallback:** a single hand-written falsified dataset plus a hand-written list of ~35 insight cards in the same schema (Section 8). The app must work with either.

---

## 2. Concept in brief

- **Name:** Praanaika (praan = breath/life + eka = one). **Tagline:** "One life. One breath. One view." **Brand line:** "Body, Environment, Baseline"
- **Idea:** personal baselines beat population thresholds. Watches know your body, room monitors know your room, nothing knows your day. Praanaika combines three channels (Body, Environment, Routine/symptoms) into one personal baseline and reports **what changed, and what else was different around then**.
- **Products:** **Hub** (a dreamcatcher-style decor ring that monitors the room), **Gem / Vayu** (a wearable choker or earring that senses chemical exposure and skin microclimate), and **View** (this app). The Gem and Hub use Bluetooth, which a PWA cannot do, so their live data is **simulated in this demo**. The production app is native.
- **Honest status (must appear on the About page):** Exposure tracking and room monitoring work today with off-the-shelf sensors. Personal-baseline insight is being validated. Metabolic and stress insights are hypotheses under test. Illness pattern-noticing is a long-term vision only, never a claim.

### 2.1 Language rules (apply everywhere, including AI-generated copy)
This is a **wellness insight tool, not a diagnostic device.**
- Never diagnose, name a condition, state a cause, or advise a dose, drug, or treatment. The doctor makes every decision.
- Allowed wording: "coincided with", "went together", "was different around that time", "unusual for you".
- Forbidden words (regex, enforced in dev by `lib/copyGuard.ts`): `caus(e|es|ed|ing)`, `diagnos\w*`, `cure[sd]?`, `treat(s|ed|ment)?`, `disease`, `disorder`, `prescri\w*`.
- Every insight card shows the disclaimer: **"Praanaika shares observations about your own patterns. It is not medical advice or a diagnosis. Your doctor makes every decision."**
- Synthetic banner in demo: **"Demo profile · synthetic data. Shows how the method works, not results from real people."**
- No location permission is ever requested; location comes from a chosen city or pincode.

---

## 3. Brand, logo, palette, mascot

### 3.1 Where the name and logo appear
- **Welcome screen** (first launch): large logomark + wordmark + tagline.
- **Install interstitial** and **splash/launch colour**: logomark on cream.
- **Today header** (top-left): small logomark + "Praanaika" wordmark. Other tabs use page titles only.
- **You → About Praanaika**, and the public **/about** page: hero lockup.
- **Home-screen icon, favicon, iOS icon:** the logomark (manifest `name` "Praanaika View", `short_name` "Praanaika").
- **Order screen, WhatsApp/email order text, Doctor summary print header, Wrapped final slide:** small wordmark/lockup.
- **Never** in the bottom nav.

### 3.2 Files (placeholders first, real files later with the SAME names)
`public/assets/brand/logomark.svg` (symbol only, square), `logo-wordmark.svg` (horizontal lockup), `logo-on-dark.svg` (for plum backgrounds), `favicon.svg`; `public/icons/icon-192.png`, `icon-512.png`, `maskable-512.png`, `public/apple-touch-icon.png` (180). All paths are referenced only from `src/config/assets.ts`. Keep `docs/ASSETS_TODO.md` listing every placeholder.

### 3.3 Palette: `src/styles/tokens.css` (copy exactly; this is the single place to change colours)
```css
:root {
  /* Surfaces */
  --color-bg: #F8F1E7;              /* warm cream */
  --color-surface: #FFFBF6;         /* cards */
  --color-surface-alt: #F2DDD6;     /* pale blush */
  --color-surface-lavender: #E9E2F0;
  --color-border: #E4D3CB;
  --color-overlay: rgba(43, 22, 49, 0.45);

  /* Ink */
  --color-ink: #2B1631;
  --color-ink-muted: #6B5670;
  --color-ink-faint: #9A8AA0;

  /* Brand */
  --color-primary: #4A2650;         /* deep plum */
  --color-primary-strong: #331A3B;
  --color-primary-soft: #E9E2F0;
  --color-on-primary: #FFFBF6;
  --color-lavender: #B7A8CC;        /* muted lavender: fills/tints only, never text */
  --color-lavender-deep: #8E7BA8;
  --color-accent: #B8684C;          /* muted terracotta (large text/graphics) */
  --color-accent-strong: #A9593E;   /* terracotta for buttons with light text */
  --color-accent-soft: #F0D6CA;

  /* Status: kept separate from brand so terracotta never reads as "danger" */
  --color-status-good: #5E9B7A;   --color-status-good-soft: #DDEFE5;
  --color-status-watch: #D9A03A;  --color-status-watch-soft: #F8EBCB;
  --color-status-alert: #BC4B47;  --color-status-alert-soft: #F6D9D6;
  --color-status-none: #B0A5B3;

  /* India AQI bands (CPCB order) */
  --aqi-good: #5AA576; --aqi-satisfactory: #A6C65B; --aqi-moderate: #E6C24A;
  --aqi-poor: #E48D42; --aqi-very-poor: #C9473F; --aqi-severe: #7F2A35;

  /* Charts */
  --chart-1: #4A2650; --chart-2: #B8684C; --chart-3: #3F8A8C; --chart-4: #C79A2E; --chart-5: #8E7BA8;
  --chart-grid: #E9DED6;

  /* Insight sources (drive card colour + icon) */
  --source-self: var(--color-accent);     /* your check-ins, logs, photos, voice, sleep/wake */
  --source-hub: var(--chart-3);           /* Hub data */
  --source-gem: var(--color-lavender-deep); /* Gem data */
  --glow-personal: 0 0 0 2px var(--color-surface), 0 0 18px 4px rgba(142, 123, 168, 0.55); /* "Just for you" glow */

  /* Log categories */
  --cat-illness: #B8684C; --cat-medication: #6D4C8F; --cat-sleep: #5B6FA6;
  --cat-exercise: #5E9B7A; --cat-food: #C79A2E; --cat-cycle: #B5637F;

  /* Typography (self-hosted via @fontsource-variable) */
  --font-display: 'Fraunces Variable', Georgia, serif;
  --font-body: 'DM Sans Variable', system-ui, -apple-system, sans-serif;
  --text-xs: 0.75rem; --text-sm: 0.875rem; --text-md: 1rem; --text-lg: 1.125rem;
  --text-xl: 1.375rem; --text-2xl: 1.75rem; --text-3xl: 2.25rem; --text-hero: 3.5rem;
  --weight-regular: 400; --weight-medium: 500; --weight-bold: 700;
  --leading-tight: 1.2; --leading-normal: 1.5;

  /* Space, shape, depth, layout, motion, layers */
  --space-1: 0.25rem; --space-2: 0.5rem; --space-3: 0.75rem; --space-4: 1rem;
  --space-5: 1.5rem; --space-6: 2rem; --space-7: 3rem; --space-8: 4rem;
  --radius-sm: 8px; --radius-md: 14px; --radius-lg: 22px; --radius-xl: 32px; --radius-pill: 999px;
  --shadow-sm: 0 1px 3px rgba(51, 26, 59, 0.08);
  --shadow-md: 0 6px 20px rgba(51, 26, 59, 0.10);
  --shadow-lg: 0 16px 40px rgba(51, 26, 59, 0.16);
  --nav-height: 64px; --content-max: 480px;
  --safe-top: env(safe-area-inset-top, 0px); --safe-bottom: env(safe-area-inset-bottom, 0px);
  --ease: cubic-bezier(0.22, 0.61, 0.36, 1); --dur-fast: 150ms; --dur: 250ms; --dur-slow: 500ms;
  --z-nav: 20; --z-banner: 30; --z-sheet: 40; --z-modal: 50; --z-toast: 60;
}
```
Contrast notes: plum on cream is about 12:1 (use for text and primary buttons). Lavender is for fills only. Terracotta text on cream is about 3.7:1 (large text only); buttons use `--color-accent-strong` with light text.

### 3.4 Fonts: "self-hosting"
Fonts ship inside the app so they work offline. `npm i @fontsource-variable/fraunces @fontsource-variable/dm-sans`, then `import '@fontsource-variable/fraunces'` and `import '@fontsource-variable/dm-sans'` in `main.tsx`. No Google Fonts `<link>` tags.

### 3.5 Mascot
A small, soft "breath-spirit" drawn as inline SVG (plum body, lavender glow, two dot eyes), component `components/mascot/Mascot.tsx` with prop `mood: 'curious' | 'happy' | 'sleepy' | 'thinking'` and `size`. Placeholder name: **Pran** (kept in `config/copy.ts` as `MASCOT_NAME`; easy to rename). Appears on: Today insight box header, empty states, intro/outro cards, Wrapped slides, About hero. Gentle idle animation (slow float), disabled under `prefers-reduced-motion`.

---

## 4. Tech decisions and rules (non-negotiable)

- **Stack:** Vite + React + TypeScript. Client-side only. **No backend, no auth, no database, no Next.js.** A single optional serverless function for the cloud log parser is allowed **later** (Section 14).
- **Allowed dependencies only:** react, react-dom, react-router-dom, zustand, recharts, lucide-react, date-fns, qrcode, vite-plugin-pwa, @fontsource-variable/fraunces, @fontsource-variable/dm-sans. Anything else requires asking first; write small helpers instead.
- **No Tailwind, no shadcn/ui, no CSS framework.** Plain CSS: `styles/tokens.css` (above) + `reset.css`, `base.css`, `utilities.css`, imported in that order from `global.css`; **one CSS Module per component** (`Component.module.css`). Component CSS uses only `var(--…)` tokens for colour, font, size, spacing, radius, shadow, z-index, motion. No hard-coded hex outside `tokens.css` and product swatch data. No inline `style` except dynamic geometry. Charts read colours via `lib/cssVar.ts`.
- **Modular:** one feature per folder, files under ~180 lines, no cross-feature internal imports (only via each feature's `index.ts`), screens compose small components, logic lives in hooks/services.
- **Mobile-first:** design at 390px; centre the app at `max-width: var(--content-max)` on wide screens; respect safe areas; tap targets ≥ 44px.
- **Folder map:**
```
docs/ (PRD.md, ARCHITECTURE.md, ASSETS_TODO.md)
public/ assets/{brand,avatars,about}/  icons/  data/ (optional JSON later)
src/
  app/ (App, routes, Providers, shell/{AppShell,BottomNav,DemoBanner,InstallBanner})
  features/ onboarding today talk gem hub you design order wrapped about
  components/ ui/ charts/ insights/ mascot/
  data/ types.ts  generator/ (seeded demo dataset)  insightsEngine/ (rules)  handmade/ (fallback)  hooks/
  services/ storage.ts airQuality.ts parser/ speech.ts pwa.ts
  store/ sessionStore.ts ownDataStore.ts demoOverlayStore.ts activeData.ts
  config/ business.ts pricing.ts thresholds.ts copy.ts assets.ts featureFlags.ts
  lib/ time.ts cssVar.ts id.ts aqi.ts downsample.ts copyGuard.ts
  styles/ tokens.css reset.css base.css utilities.css global.css
```
- **Data access rule:** screens read and write app data only through `store/activeData.ts` and `data/hooks/*`, which hide whether the data is demo or own.
- **UI kit (`components/ui/`):** Button, IconButton, Card, Chip, Sheet (bottom sheet), Modal, Segmented, Toggle, TextField, SelectField, NumberField, Toast, Skeleton, EmptyState, StatTile, ProgressRing, DisclaimerNote, SyntheticTag, StatusDot, PageHeader. Charts: TimeSeriesChart, Sparkline, BarList (Recharts wrappers, auto-downsample to about 300 points).

---

## 5. Profiles, storage, and persistence

**Two modes** (stored in `sessionStore.mode`: `'none' | 'demo' | 'own'`):

### 5.1 Demo profile (exactly one persona)
- **One** all-rounded synthetic person: default **Meera, 29, Bengaluru** (placeholder, easy to rename in one config).
- About **8 weeks (56 days)** of data, a Hub and a Gem connected, all screens live. Dates are computed relative to today (the last day = today) so the demo never looks stale; planted events are defined by **day index**.
- **Demo clock:** `demoDay` 1–56 (default 56); "now" = 20:00 IST on that day. A small controls sheet (tap the DemoBanner) has the day slider ("Day 9 / Day 24 / Day 56" quick buttons), "Simulate live Gem stream" toggle, "Reset my demo edits", "Exit demo".
- User edits in demo mode (added check-ins/logs, renamed sessions, tagged spikes, saved creations, orders) go to an **overlay** in localStorage; base data is never mutated.

### 5.2 Own profile (real, empty, local)
- Starts with **zero data**. Onboarding is 4 short steps (Section 7.1). Everything the user adds is stored **on the device**.
- **Gem and Hub tabs**: they show the Design-your-own gallery (Section 7.5).
- Insights come from what the user gives (check-ins, logs, photos, voice notes, sleep/wake times) via on-device rules (Section 8).

### 5.3 How long data lives
Stored in **browser localStorage** (no login). Closing tabs, killing the app, or restarting the phone does **not** erase it. Always tell users to add to the home screen first, then create the profile. Provide **Export my data** (JSON download) as a backup and **Delete my data** (type DELETE). `services/storage.ts` wraps localStorage (prefix `pra.`, try/catch, `schemaVersion`). Keys: `pra.session.v1`, `pra.own.v1`, `pra.demoOverlay.v1`.

---

## 6. Navigation

Bottom nav, left to right: **Talk · Gem · Today (centre, raised circle) · Hub · You.** lucide icons: MessagesSquare, Gem, Wind, CircleDashed, UserRound. Full-screen routes without nav: `/welcome`, `/design/...`, `/order`, `/wrapped`, `/about`. Route guard: if `mode === 'none'`, redirect to `/welcome` **except `/about`, which is public** (so a QR can open it directly).

---

## 7. Screens

### 7.1 First open and onboarding (`/welcome`)
1. **Install interstitial** (phones/tablets only, not standalone, not dismissed in the last 7 days): "Add Praanaika to your home screen". Android/Chromium: **Install app** button (captured `beforeinstallprompt`). iOS Safari: 3 illustrated steps (Share → Add to Home Screen → Add). "Continue in browser" secondary. Also a slim dismissible InstallBanner in the shell.
2. **Choice modal** over the branded backdrop: **"Explore the demo profile"** (Synthetic tag) or **"Set up my own profile."** A small "What is Praanaika?" link opens `/about`.
3. **Demo path:** straight to `/today` (single persona, no picker).
4. **Own path (4 steps, progress bar):**
   1. Welcome + what Praanaika does (3 honest points + disclaimer).
   2. Consent: per-purpose toggles (air & exposure default ON; body signals, health logs, voice memos, food photos, Pioneer research default OFF) with one-line explanations; required checkboxes "I am 18 or older" and "I have read the privacy policy"; the no-location note. Health logs are never sent to an AI provider that retains or trains on them.
   3. About you: name, age (≥18 else friendly block), sex, height, weight, sensitivities chips.
   4. City or pincode (real search, Section 7.2) + avatar pick → "You're set" → `/today`.

### 7.2 Today
Top to bottom:
1. **Header:** logomark + wordmark, greeting, **location chip** (opens a City|Pincode search sheet), "Updated hh:mm".
2. **Pran's insight box** (Section 9): the hero of the screen.
3. **Wrapped tile** (demo: opens `/wrapped`; own: teaser "Your first Wrapped unlocks after a week of check-ins", no logic).
4. **Real environment cards** (both modes): AQI hero, pollutants, weather & UV, next-24h curve + "Cleanest window".
5. **Owner cards (demo only):** "Your room right now" (Hub tiles), indoor vs outdoor, exposure today, last night's sleep.

**Air-quality service (real, free, no key):** city geocoding `https://geocoding-api.open-meteo.com/v1/search?name={q}&count=6&language=en&country_code=IN`; pincode `https://api.postalpincode.in/pincode/{pin}` (take first PostOffice → "Name, District" → geocode the District; on failure say "Couldn't find that pincode. Try your city name."); air `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=..&longitude=..&hourly=pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone,dust,uv_index&past_days=1&forecast_days=2&timezone=Asia%2FKolkata`; weather `https://api.open-meteo.com/v1/forecast?latitude=..&longitude=..&current=temperature_2m,apparent_temperature,relative_humidity_2m,surface_pressure,wind_speed_10m&timezone=Asia%2FKolkata`. Cache the last good payload in localStorage and show it with "Last updated hh:mm · offline" when the network fails.
**India CPCB AQI** (not US AQI): sub-index by linear interpolation. PM2.5 (µg/m³): 0–30→0–50; 31–60→51–100; 61–90→101–200; 91–120→201–300; 121–250→301–400; 251+→401–500. PM10: 0–50→0–50; 51–100→51–100; 101–250→101–200; 251–350→201–300; 351–430→301–400; 431+→401–500. AQI = max of the two sub-indices using the **rolling 24-hour average** up to the current hour. Bands: 0–50 Good, 51–100 Satisfactory, 101–200 Moderate, 201–300 Poor, 301–400 Very Poor, 401+ Severe. Footnote: "India CPCB scale from modelled data (CAMS via Open-Meteo). May differ from ground stations." The forecast curve uses instant estimates and is labelled "estimate". "Cleanest window" = the best contiguous 2 hours between 05:00 and 21:00.

### 7.3 Talk = **Feed | Ask** (segmented control)
**Feed**: one time-ordered stream (newest first, grouped by day) mixing:
- **Pran's insights**: every insight ever, colour-coded by source (Section 9); expandable.
- **Your entries**: check-ins (small orb + feel/energy chips) and structured log cards.
A **filter chip row** (All · Mine · Hub · Gem · Just for you). A **bottom dock** above the nav: a compact "Tell Pran something…" bar with a round **check-in orb button** and six small category icons; expanding opens the composer Sheet.

**Check-in orb pad:** a 5×5 grid (feel vertical, energy horizontal) with a glowing orb that moves to the tapped cell (colour interpolates from `--color-accent` at low feel to `--color-primary` at high feel via `color-mix`). Corner labels: top-left "Calm & content", top-right "Bright & energised", bottom-left "Low & drained", bottom-right "Tense & wired". Cells are buttons with aria-labels. Optional tag chips (Headache, Tired, Stuffy room, Smelly air, Anxious, Focused). Save → toast + orb pulse.

**Six log categories** (fixed, never a free-form "log anything"): illness/symptoms, medication, sleep & wake, exercise, food & drink, cycle (optional). Category colours from `--cat-*`.
**Composer Sheet per category:** "Say it however you like" text area, mic (Web Speech API `en-IN` / `hi-IN`, shown only if supported), camera for food (`<input type=file accept=image/* capture>`; the photo is read then **discarded**, `photoDiscarded: true`, never stored), category quick chips, and time pickers for sleep. **"Understand it"** → parse preview (raw text quote + editable structured fields + confidence + any clarifying question). **Medication always requires an explicit confirm** ("You took Paracetamol 500 mg at 2:10 pm. Is that right?" Yes, save / Edit), with the line "This is a record for you and your doctor. Praanaika never suggests doses or medicines." Other categories: one "Looks right" tap.
**What "Feed" means for logs:** the user's words on the left, the structured record (what the insight engine can use) beside it, a status pill (Confirmed / Needs confirm / Corrected / Flagged), and a **"Not right?"** action that lets the user fix a field. The correction is stored as an example and **reused offline by the parser** for that phrase (it does not retrain an LLM). A status bar shows "N corrections saved · Parsed right first time X%" (after 5+ entries).

**Parser (`services/parser/`):** `parseLog({text, category, nowISO, userExamples, photo?}) → ParseResult`. Uses `VITE_PARSER_URL` (cloud) when set, else the **offline rule-based mock** (works with no network; also the fallback if the cloud call fails or takes >6s). Mock rules: keyword category detection; medicine list (crocin, paracetamol, dolo, cetirizine, ibuprofen, combiflam, pantoprazole, vitamin d, iron, metformin, thyroxine) + dose regex `(\d+(\.\d+)?)\s*(mg|ml|mcg|g|tablet|tab|pill)` + time phrases (after lunch→14:00, morning→08:00, night→21:30, "at 8", "8pm"); Hinglish dictionary (sar dard/sir dard→headache, bukhaar→fever, khansi→cough, gala kharab→sore throat, thakaan→fatigue, ulti→nausea, pet dard→stomach ache; chai, roti, dal, chawal, upvas/roza→fast_start); severity words (bahut/very/severe→4, thoda/mild→2, default 3); exercise activity/duration/intensity; sleep "slept at 11 woke at 6:30"; photo (food) returns a low-confidence placeholder item with the question "What was in it?". `needsConfirm` is always true for medication.

**Ask:** suggested-question chips → answer cards (one or two sentences, a chart, "what else was different" list, "an observation, not a cause" note, disclaimer, thumbs up/down, a "Replay" link if Replay exists). Includes one abstain card ("I'm not sure yet, and here's what's missing"). Free text is matched offline by keyword overlap; a low score returns "I can only answer from what your data supports. Try one of these:" plus chips. **Demo:** 8 answers precomputed from the demo data. **Own:** computed from check-ins/logs (averages, best and worst day, common tags); says so when there isn't enough data. Never invent numbers.

### 7.4 Gem tab and Hub tab
**Demo mode = full dashboards + a "Design your own" button on each.** **Own mode = the Design gallery (7.5) as the tab's main content**, with a small note: "Have a Gem/Hub? Live pairing works in the native app."

**Gem (demo):** wearer chips (with "Add wearer": person or pet; pets are exposure-only); device card (battery, "Connected via Bluetooth", note that the live link is simulated); **live card** at the demo clock (VOC delta gauge, skin temp/humidity, noise, motion; **heart rate,HRV,SpO₂,exposure, skin microclimate only when worn at the ear; UV,exposure,skin microclimate only when worn at the collar**; caption "Your Gem picks the reading that's reliable at this spot automatically"; if `liveSimulation` is on, jitter values gently every 2 s without writing data); **first-wear walkthrough** (cut-list item: 4 steps, scripted 8-second VOC spike animation, `navigator.vibrate([60,40,60])` where supported, then tag chips saving a spike); **sessions list** with filters (All / Anomalies / Collar / Ear / by tag / by place) and search, session cards with **inline-editable name**, place and tag chips, spike count, flags; **session detail sheet** with a VOC-delta chart (spikes marked, unworn gaps shaded), and per-spike chip groups **"Where were you?"** (Home, Kitchen, Bedroom, Office, Commute, Outdoors, Gym, Other) and **"What did you use or encounter?"** (Cooking, Incense or smoke, Perfume, Cleaning products, Sanitiser, Traffic, Paint or new items, Other); edits saved to the overlay; Gem-related insights; "Design your own" button.
**Hub (demo):** status LEDs per fitted sensor (StatusDot; red blinks unless reduced motion); **live room tiles** for temp, humidity, VOC, NOx, light, PM2.5, CO₂, noise, pressure with sparklines and reference-band colours (labelled "reference bands", not personal); **history chart** with metric chips and range (24h | 7d | 8 weeks); "Ideal conditions for you" card (from personal insights, or "Still learning"); **recalibration log** (date, which Gem, socket 1–4, duration, "confirmed by the droplet's magnet sensor", a missed-week reminder state); **carbon-liner health** bar with a **Reorder liners** button → `/order`; Hub-related insights; "Design your own" button.

### 7.5 Design your own (`/design/:kind`, `kind` = hub | gem) and saved creations
- **Gallery (the landing view):** "My creations" (saved designs with thumbnails, tap to reopen/edit, delete), a **"Create new"** tile, and a **presets** row. In own mode this gallery is the Gem/Hub tab content; in demo mode it opens from the "Design your own" button.
- **Configurator** (`/design/:kind/new` or `/design/:kind/:creationId`), full screen, no nav: live **layered 2D SVG preview** pinned in the top ~45%; presets carousel; scrollable option steps; sticky bottom bar with live price, **Save to My creations** (name prompt), and **Buy this for ₹X**. Config is mirrored in the URL query so a design is linkable. A quiet "Feels like too much? Join Pioneer" link → `/you`.
- **Hub options:** ring size (25 | 30 cm), band colour, yarn colour, yarn style (plain | two_tone | ombre), web (spiral | star | lotus | none), hangings (feathers | beads | tassels | none), optional sensors (dust, CO₂, noise, pressure) as toggles with price add-ons and one-line "what it adds" ("Dust: PM2.5 you can see and act on"; "CO₂: how stale your room's air is"; "Noise: sound level only, no audio recorded"; "Pressure: weather-linked changes"). Fixed on every Hub: VOC/NOx, temperature, humidity, light. Optional sensors OFF show a plain decorative cap so the unit always looks finished.
- **Gem options:** housing (choker | earring), shape (round | teardrop | hex | oval), finish (brass | silver | rose_gold | matte_black), band colour, charm (none | moon | leaf | eye | lotus).
- **Swatches** (`features/design/swatches.ts`, product data so hex is allowed there): sage, sand, natural, ink, deep_teal, terracotta, ochre, blush, plum, sky. Comment: natural, pre-washed yarn is required in real products; dyed options are simulated.
- **SVG art, modular files, each under ~150 lines.** Hub (viewBox `0 0 400 520`): `HubCord` (braided hanging line), `HubRing` (band; outer radius scaled 0.88 for 25 cm), `HubYarn` (procedural diagonal strokes around the ring; plain/two_tone/ombre), `HubWeb` (pure function `generateWebPaths(style, pegCount=16, radius)`: spiral = shrinking concentric polygons, star = star polygon connecting every k-th peg, lotus = petal curves, none = only pegs), `HubWindows` (3 always-present sensor windows with green LED + 4 optional ones active with glowing LED or capped), `HubHangings` + `HubDroplets` (five hangings alternating with four droplet covers). Gem (viewBox `0 0 320 320`): `GemBand`, `GemCore` (shape + finish gradient from one `Defs.tsx`), `GemCharm`.
- **Presets:** 3 Hub ("Sage & Sand": 25 cm, sage band, natural yarn, plain, spiral, feathers, no optional sensors · "Midnight Loom": 30 cm, deep_teal band, ink yarn, ombre, star, beads, all 4 sensors · "Terracotta Bloom": 30 cm, terracotta band, ochre yarn, two_tone, lotus, tassels, dust + CO₂) and 3 Gem ("Moon Choker": choker, round, silver, ink band, moon · "Leaf Drops": earring, teardrop, brass, sage band, leaf · "Rose Lotus": choker, hex, rose_gold, terracotta band, lotus). Preset price is computed by the price functions, never hard-coded.
- **Pricing (`config/pricing.ts`, INR, placeholders excluding GST):** `HUB_BASE 6999`, `HUB_DUST 3499`, `HUB_CO2 3999`, `HUB_NOISE 499`, `HUB_PRESSURE 499` (fully loaded Hub = ₹15,495); `GEM_BASE 6499`, finish premium `{brass:0, silver:0, rose_gold:500, matte_black:500}`; `LINER_REFILL_PACK 799`. `hubPrice(config)`, `gemPrice(config)` pure functions. Format with `Intl.NumberFormat('en-IN')`. Show "Estimated, excl. GST. Placeholder pricing under test."

### 7.6 Order flow (`/order`)
Order summary (lines with qty ±, creation thumbnail reusing the SVG art, subtotal, "Excludes GST and shipping. Confirmed by the founder manually."), customer name, 10-digit Indian mobile, city. Generate an order code `PRA-` + 6 unambiguous uppercase alphanumerics. **UPI QR** via `qrcode`: `upi://pay?pa=${UPI_ID}&pn=${UPI_PAYEE_NAME}&am=${total}&cu=INR&tn=${code}` with Copy UPI ID / Copy order code, and a warning that `UPI_ID` in `config/business.ts` is a placeholder. **Send on WhatsApp** (`https://wa.me/${WHATSAPP_NUMBER}?text=` with code, customer, human-readable config, total) and **Send by email** (`mailto:`). Either saves the order (`status: 'sent'`) and shows a confirmation with the code. Liner reorder reuses this flow. `config/business.ts`: `SUPPORT_EMAIL "hello@example.com"`, `WHATSAPP_NUMBER "910000000000"`, `UPI_ID "PLACEHOLDER@upi"`, `UPI_PAYEE_NAME "Praanaika"`, `POLICY_VERSION "0.1-demo"`, `APP_VERSION "0.1.0"` (all placeholders).

### 7.7 You
Profile card (avatar from 8 placeholder avatars, name, age, sex, height, weight, city/pincode, sensitivities, optional ethnicity; **editable in own, read-only with Synthetic tag in demo**); wearer profiles; **Connect wearables** (Apple Health, Google Health Connect, Fitbit, Garmin, Whoop: simulated toggle + toast "In the native app this reads your watch data. Simulated here."); **consent toggles** (the six from onboarding); **Pioneer program** card + Join sheet (sets `pioneer = true`, opens a prefilled WhatsApp/email); **My products and creations** (saved designs and orders); **Doctor summary** (printable page: date range, symptoms logged, medication taken "as logged", sleep, and exposure/room observations worded as "was recorded", never "caused"; `window.print()` with a print stylesheet; cut-list item); **Your data** (Export JSON, Delete with type-DELETE confirm, Switch profile); **About & contact** (About Praanaika → `/about`, email/WhatsApp links, app version, disclaimer); the row "Your data lives only on this device until you delete it or clear site data"; `/you/privacy` (readable **draft** privacy policy for the demo, explicitly "not legal advice", DPDP rights: access, correction, deletion, withdrawing consent; 18+ only; no location permission; health-log consent separate; photo discarded after reading).

### 7.8 Wrapped (`/wrapped`, demo only)
Full-screen, Spotify-style story: tap right/left to move, progress bars at the top, auto-advance every ~6 s, hold to pause, close button, gradient backgrounds built from palette tokens, count-up numbers, a Pran mood per slide. **Slides (compute from the demo dataset for the last 7 days):** (1) title "Your week in air" + date range; (2) **clean-air share**: % of hours the Hub PM2.5 stayed in the good band; (3) **noise**: loudest hour and average dB (sound level only); (4) **exposure**: number of spikes and your top source tag (e.g. "Cooking"); (5) **stuffiest night**: date and CO₂ peak; (6) **check-ins**: count, most common feel, best and lowest day, top tag; (7) closing fun title (e.g. "The Early Air-Out") with the wordmark and a Share button (`navigator.share` with a text summary if available). **No health claims.** Own profile: only the teaser tile. Cut-list: reduce to slides 1, 3, 4, 6.

### 7.9 About page (`/about`, public, judge-facing)
A scroll-storytelling page, **content adapted from Appendix A**, using only CSS scroll-triggered reveal animations (a tiny `useReveal` hook with IntersectionObserver, no animation library) and inline-SVG animations. Sections: **Hero** (logo lockup, tagline, floating mascot) · **The problem** (watch knows your body, monitor knows your room, nothing knows your day) · **How it works** (an animated SVG flow: Body / Environment / Routine → your baseline → Pran's insights) · **The three pieces** (Hub, Gem, View cards reusing the design-your-own SVG art with a gentle float) · **Meet Pran's colours** (the source legend) · **Honest status ladder** (Section 2) · **Built on evidence** (3 stat cards with count-up numbers taken from Appendix A: personal baselines beat population thresholds, 77.3% within people vs 65.3% on unseen people; bedroom CO₂/temperature and sleep) · **How we test** (split by person and forward in time, planted ground truth, abstention, parser tested separately) · **Roadmap** (animated timeline) · **Contact + disclaimer**. Optional "Download overview (PDF)" button if `public/assets/about/praanaika-overview.pdf` exists. Photo slots use placeholder files in `public/assets/about/` named in `config/assets.ts` (the AI cannot supply real photos). The welcome screen's "What is Praanaika?" links here.

---

## 8. Insight system

### 8.1 Rules
- **Voice:** Pran speaks in the **first person**, warmly and briefly. Example: "I noticed your bedroom air got stuffy between 2 and 5 am. Your sleep looked lighter on nights like that. I can't say why, just that they went together." Still obeys Section 2.1 (no causes, no diagnoses, no advice).
- **Every insight has `sources`** (1–3 of `self`, `hub`, `gem`) which drive its colour (Section 9).
- **Two tiers:**
  - **Direct**: plain readings of the data ("You were exposed to elevated VOCs between 6:30 and 7:15 pm", "3 evenings in a row with similar exposure at similar times", "You averaged 6h 40m of sleep this week"). Available from **day 1**, so **there is no cold start**.
  - **Personal** (`tier: 'personal'`): uses the person's own baseline and patterns ("unusual for *you*"). Appears once enough of their own data exists (about 21 days). Shown with a **glowing border and a "Just for you" badge**.
- **24-hour window:** each insight has `createdAt` and `expiresAt = createdAt + 24 h`. **Today** shows only insights where `createdAt ≤ now < expiresAt`. **Talk → Feed** shows **all** of them forever.
- **Evidence:** every insight carries `evidence: EvidenceRef[]`, the actual inputs the engine used ("Your check-in Tue 9:10 (felt low)", "Hub CO₂ peaked at 1,420 ppm, 2–5 am", "3 nights: 4, 9, 11 Sep"). Expanding a card shows these as a "Why I'm saying this" list. Each item is tappable (mini chart via `ChartSpec`, or jumps to the entry). **This is not an LLM chain of thought; it is the data references attached when the insight is created, so it is genuinely traceable.**
- Optional `factors` ("what else was different", ranked by how unusual each factor was and how often it coincided before) and a `chart`.
- **Abstain cards** are allowed and on-brand ("I'm not sure yet: I need a few more late-dinner nights to say anything").
- **Sensor-issue cards** say "sensor issue", never "your body changed".

### 8.2 Who generates them
- **Demo:** the in-browser generator (`data/generator/`) builds the 56-day dataset; `data/insightsEngine/` runs simple rule functions **per day** over the data up to that day and emits `InsightCard[]` with correct `createdAt` times (simulating "the pipeline ran that morning and after events"). Example rules:
  - Hub, direct: stuffy night (CO₂ > 1,200 for ≥ 3 h overnight), dusty evening (PM2.5 > 60 for ≥ 1 h), hot night, noisy stretch (> 65 dB for ≥ 2 h), "3 similar evenings".
  - Gem, direct: VOC-spike windows with tags, repeated exposure at similar times.
  - Self, direct: average sleep length, lowest-energy time of day, most common tag, meal-timing pattern.
  - **Blended:** Hub+Self ("On the 14 nights CO₂ went over 1,300, my sleep numbers averaged 79% vs 88% on other nights (14 vs 42 nights). Went together, not necessarily why."), Gem+Hub (a kitchen VOC spike on the Gem followed by a Hub VOC rise 20 minutes later), Hub+Gem+Self (dusty evening + Gem spike + a "headache" tag).
  - **Personal tier:** the same relationships expressed as deviations from the person's own median/MAD baseline once 21 days exist.
  - Plus one abstain card and one sensor-issue card.
- **Worst-case fallback:** `data/handmade/insights.ts` with ~35 hand-written `InsightCard`s in the same schema and same `createdAt` logic. The app must not care which one is used.
- **Own profile:** `features/talk/ownRules.ts` runs **live on device** whenever a check-in or log is saved, producing **self-source** direct insights only (e.g. average feel by time of day, typical sleep length, most frequent tag, meal timing, "you felt lowest on days you slept under 6 h"). Personal-tier own insights appear after ~21 days of check-ins. Generated cards are stored in `ownDataStore`.

---

## 9. The insight box (Today) and colours

- **Container:** a horizontally swipeable card carousel titled "Pran says" with the mascot on the left and a chip "**Day N of getting to know you**" on the right. N = days since the first check-in (own) or the current `demoDay` (demo). It never blocks anything; there is no cold-start wall.
- **Own, day 0:** exactly one card, **intro**: "Hey, I don't know you yet. Can we get to know each other?" with a **"Say hi"** button → opens the check-in composer in Talk. Mascot mood: curious.
- **Last card, always:** **outro**: "That's all I know for now. Want to share something else?" → `/talk`. This replaces any separate "+" quick-log button. Intro and outro are constructed in the UI, not stored.
- **Card colouring** (colour is never the only cue; each source also has an icon: notebook/heart = Self, ring = Hub, gem = Gem):
  - **Self-reported** (check-ins, logs, photos, voice, wake/sleep times): left border and tint `--source-self` (terracotta).
  - **Hub**: `--source-hub` (teal).
  - **Gem**: `--source-gem` (lavender-deep).
  - **Blended (2 or 3 sources):** a `linear-gradient(135deg, …)` of the involved source colours as the border/tint (e.g. `linear-gradient(135deg, var(--source-hub), var(--source-gem))`).
  - **Personal tier:** additionally `box-shadow: var(--glow-personal)` and a "Just for you" badge.
  - A small **"What do the colours mean?"** legend (Sheet).
- **Tap to expand** (accordion inside the card): "Why I'm saying this" (evidence list), optional chart, optional "what else was different" factors, `copy.observationNote`, disclaimer, and a "Replay" link only if that feature exists.
- Empty state for demo (e.g. at demo day 1): the intro-style card with Pran; at any other time, a direct insight exists by design.

---

## 10. Data contract: `src/data/types.ts` (create exactly; a later Python pipeline will output data in this shape)

```ts
export type ISODateTime = string; // always with IST offset, e.g. "2026-09-23T07:15:00+05:30"
export type ISODate = string;     // "YYYY-MM-DD"

/* ---------- Profile ---------- */
export type Sex = 'female' | 'male' | 'other' | 'prefer_not_to_say';
export type HubSensorKey = 'voc_nox' | 'temp_rh' | 'light' | 'dust' | 'co2' | 'noise' | 'pressure';
export interface Wearer { id: string; name: string; kind: 'person' | 'pet'; avatarKey: string; }
export interface GemDevice { id: string; name: string; housing: 'choker' | 'earring'; batteryPct: number; connected: boolean; lastSyncAt: ISODateTime | null; firmware: string; }
export interface HubDevice { id: string; name: string; room: string; sensorsFitted: HubSensorKey[]; linerHealthPct: number; sockets: 4; }
export interface ConsentState {
  airExposure: boolean; bodySignals: boolean; healthLogs: boolean; voiceMemos: boolean; photoFood: boolean; pioneerResearch: boolean;
  acknowledged18Plus: boolean; acceptedPolicyVersion: string; timestamp: ISODateTime | null;
}
export interface Profile {
  id: string; isDemo: boolean; displayName: string; avatarKey: string; age: number; sex: Sex;
  heightCm: number | null; weightKg: number | null; ethnicity: string | null; sensitivities: string[];
  city: string; pincode: string | null; lat: number; lon: number;
  wearers: Wearer[]; gem: GemDevice | null; hub: HubDevice | null;
  consents: ConsentState; pioneer: boolean; createdAt: ISODateTime;
}

/* ---------- Demo dataset (one persona) ---------- */
export interface DatasetMeta { personaName: string; startDate: ISODate; endDate: ISODate; days: number; intervalMinutes: 15 | 30 | 60; timezone: 'Asia/Kolkata'; isSynthetic: true; generatorVersion: string; note: string; }

// COLUMNAR streams: row i is at start + i*intervalMinutes; null = no data / not worn / sensor not fitted.
export interface GemStream {
  start: ISODateTime; intervalMinutes: 15 | 30 | 60; length: number;
  columns: {
    voc_out: (number | null)[]; voc_skin: (number | null)[]; voc_delta: (number | null)[]; nox_out: (number | null)[];
    skin_temp_c: (number | null)[]; skin_rh: (number | null)[];
    uv_index: (number | null)[];   // only when attachment === 'collar'
    noise_db: (number | null)[];
    hr_bpm: (number | null)[]; hrv_ms: (number | null)[]; spo2_pct: (number | null)[]; // only when attachment === 'ear'
    motion: (number | null)[]; worn: (0 | 1)[]; attachment: ('collar' | 'ear' | null)[];
  };
}
export interface HubStream {
  start: ISODateTime; intervalMinutes: 15 | 30 | 60; length: number;
  columns: {
    temp_c: (number | null)[]; rh_pct: (number | null)[]; voc_index: (number | null)[]; nox_index: (number | null)[];
    light_lux: (number | null)[]; pm25: (number | null)[]; co2_ppm: (number | null)[]; noise_db: (number | null)[]; pressure_hpa: (number | null)[];
  };
}
export interface Night { date: ISODate; sleepStart: ISODateTime; sleepEnd: ISODateTime; minutesAsleep: number; sleepEfficiencyPct: number; restingHrBpm: number | null; hrvMs: number | null; source: 'gem' | 'hub_inferred' | 'manual' | 'watch'; confirmed: boolean; }

/* ---------- Entries ---------- */
export interface CheckIn { id: string; t: ISODateTime; feel: 1 | 2 | 3 | 4 | 5; energy: 1 | 2 | 3 | 4 | 5; tags: string[]; note: string | null; }
export type LogCategory = 'illness' | 'medication' | 'sleep' | 'exercise' | 'food' | 'cycle';
export type ParsedPayload =
  | { category: 'illness'; symptoms: string[]; severity: 1 | 2 | 3 | 4 | 5 | null; onset: ISODateTime | null; durationHours: number | null }
  | { category: 'medication'; name: string; dose: number | null; unit: string | null; takenAt: ISODateTime | null; reason: string | null }
  | { category: 'sleep'; sleepAt: ISODateTime | null; wakeAt: ISODateTime | null; quality: 1 | 2 | 3 | 4 | 5 | null }
  | { category: 'exercise'; activity: string; durationMin: number | null; intensity: 'light' | 'moderate' | 'hard' | null; startAt: ISODateTime | null }
  | { category: 'food'; mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'drink' | 'fast_start' | 'fast_end'; items: string[]; carbHeavy: boolean | null }
  | { category: 'cycle'; phase: 'menstrual' | 'follicular' | 'ovulation' | 'luteal' | null; flow: 'light' | 'medium' | 'heavy' | null; dayOfCycle: number | null };
export type LogStatus = 'needs_confirm' | 'confirmed' | 'corrected' | 'flagged_wrong';
export interface LogEntry {
  id: string; t: ISODateTime; category: LogCategory; inputMode: 'text' | 'voice' | 'photo' | 'tap' | 'passive';
  rawText: string | null; photoDiscarded: boolean; parsed: ParsedPayload; parserConfidence: number; // 0-1
  status: LogStatus; correction?: { fixed: ParsedPayload; note: string | null; at: ISODateTime };
}
export interface ParserCorrection { id: string; at: ISODateTime; rawText: string; before: ParsedPayload; fixed: ParsedPayload; note: string | null; }

/* ---------- Gem sessions, spikes, Hub recalibration ---------- */
export interface WearSession { id: string; wearerId: string; start: ISODateTime; end: ISODateTime; name: string; place: string | null; attachment: 'collar' | 'ear'; tags: string[]; notes: string; unwornGapMin: number; spikeIds: string[]; flags: ('anomaly' | 'sensor_issue')[]; }
export interface ExposureSpike { id: string; t: ISODateTime; durationMin: number; peakVocDelta: number; source: 'gem' | 'hub'; sessionId: string | null; place: string | null; tag: string | null; tagSource: 'user' | 'none'; hapticFired: boolean; }
export interface Recalibration { id: string; t: ISODateTime; gemId: string; hubId: string; socket: 1 | 2 | 3 | 4; durationMin: number; confirmedByHallSensor: boolean; linerHealthPctAfter: number; }

/* ---------- Insights ---------- */
export type InsightSource = 'self' | 'hub' | 'gem';
export type InsightTier = 'direct' | 'personal';
export type InsightKind = 'observation' | 'pattern' | 'sleep' | 'exposure' | 'abstain' | 'sensor_issue';
export interface FactorRow { label: string; channel: 'body' | 'environment' | 'chemistry' | 'routine'; direction: 'higher' | 'lower' | 'later' | 'earlier' | 'present'; magnitudeText: string; unusualnessZ: number; coincidedBefore: { count: number; outOf: number }; }
export type ChartSpec =
  | { type: 'line'; stream: 'hub' | 'gem' | 'nights'; column: string; from: ISODateTime; to: ISODateTime; unit: string; label: string; highlight?: { from: ISODateTime; to: ISODateTime }; referenceLine?: { value: number; label: string } }
  | { type: 'compare_bars'; unit: string; label: string; items: { label: string; value: number }[] };
export type EvidenceRef =
  | { kind: 'checkin'; id: string; label: string }
  | { kind: 'log'; id: string; label: string }
  | { kind: 'night'; date: ISODate; label: string }
  | { kind: 'spike'; id: string; label: string }
  | { kind: 'session'; id: string; label: string }
  | { kind: 'range'; stream: 'hub' | 'gem'; column: string; from: ISODateTime; to: ISODateTime; unit: string; label: string; referenceLine?: { value: number; label: string } };
export interface InsightCard {
  id: string; createdAt: ISODateTime; expiresAt: ISODateTime;   // expiresAt = createdAt + 24h (Today window only)
  sources: InsightSource[];                                     // 1-3; drives colour/icon
  tier: InsightTier; kind: InsightKind;
  headline: string; body: string;                               // first person, Pran's voice, language rules apply
  whyIntro: string;                                             // e.g. "Here's what I looked at:"
  evidence: EvidenceRef[]; factors: FactorRow[]; chart: ChartSpec | null;
  confidence: 'low' | 'medium' | 'high' | null; relatedDates: ISODate[];
}
export interface TalkAnswer { id: string; question: string; keywords: string[]; answerText: string; chart: ChartSpec | null; factors: FactorRow[]; relatedDates: ISODate[]; abstain: boolean; }

/* ---------- Wrapped (demo) ---------- */
export type WrappedSlide =
  | { kind: 'title'; title: string; subtitle: string; mood: 'happy' | 'curious' }
  | { kind: 'stat'; label: string; value: number; unit: string; caption: string; mood: 'happy' | 'curious' | 'sleepy' | 'thinking' }
  | { kind: 'ranking'; label: string; items: { name: string; value: number; unit: string }[]; caption: string }
  | { kind: 'closing'; title: string; caption: string };
export interface WrappedData { from: ISODate; to: ISODate; slides: WrappedSlide[]; }

/* ---------- Design & orders ---------- */
export interface HubConfig { ringSizeCm: 25 | 30; bandColorKey: string; yarnColorKey: string; yarnStyle: 'plain' | 'two_tone' | 'ombre'; webStyle: 'spiral' | 'star' | 'lotus' | 'none'; hangings: 'feathers' | 'beads' | 'tassels' | 'none'; sensors: { dust: boolean; co2: boolean; noise: boolean; pressure: boolean }; }
export interface GemConfig { housing: 'choker' | 'earring'; shape: 'round' | 'teardrop' | 'hex' | 'oval'; finish: 'brass' | 'silver' | 'rose_gold' | 'matte_black'; bandColorKey: string; charm: 'none' | 'moon' | 'leaf' | 'eye' | 'lotus'; }
export interface DesignCreation { id: string; kind: 'hub' | 'gem'; name: string; createdAt: ISODateTime; isPreset: boolean; config: HubConfig | GemConfig; priceInr: number; }
export interface OrderLine { label: string; qty: number; unitPriceInr: number; creationId?: string; }
export interface Order { code: string; createdAt: ISODateTime; lines: OrderLine[]; totalInr: number; customerName: string; customerPhone: string; status: 'draft' | 'sent'; }

/* ---------- Aggregates ---------- */
export interface DemoDataset {
  meta: DatasetMeta; profile: Profile; gem: GemStream; hub: HubStream; nights: Night[]; checkins: CheckIn[]; logs: LogEntry[];
  sessions: WearSession[]; spikes: ExposureSpike[]; recalibrations: Recalibration[]; insights: InsightCard[]; talkAnswers: TalkAnswer[];
}
export interface UserData { // what a user (or the demo overlay) adds/edits
  checkins: CheckIn[]; logs: LogEntry[]; creations: DesignCreation[]; orders: Order[]; corrections: ParserCorrection[];
  generatedInsights: InsightCard[];                     // own-profile rule insights
  sessionEdits: Record<string, Partial<Pick<WearSession, 'name' | 'place' | 'tags' | 'notes' | 'wearerId'>>>;
  spikeTags: Record<string, { place?: string | null; tag?: string | null }>;
  answerFeedback: Record<string, 'up' | 'down'>;
}
```

---

## 11. Demo dataset: Meera's storyline (one all-rounded persona, 56 days, hourly rows)

Generated by a **seeded, deterministic TypeScript generator** (`data/generator/`; same seed = same data). Hourly rows (1,344 per stream). **Planted, so the insights are real for this data:**
- **Stuffy bedroom nights:** bedroom CO₂ rises overnight (about 500 → 900 ppm normally). On about **14 of 56 nights** (windows closed, AC on) it exceeds **1,300 ppm**; sleep efficiency on those nights is about **78–80% vs 88–90%** otherwise, and next-day energy check-ins are lower (about 2.5 vs 3.6).
- **Dusty evenings:** about 6 evenings with Hub PM2.5 above 70; **4 of them** are followed within 6 hours by a "Headache" tag/log, **2 are not**, so it is not deterministic.
- **Cooking and incense:** daily kitchen VOC spikes around 8–9 am and 7–9 pm (about 70% tagged "Cooking" on the Gem); incense on about 5 Thursday evenings.
- **Noise:** a construction stretch in weeks 5–6 (9 am–1 pm, 65–75 dB) coinciding with lower afternoon check-ins.
- **A short unwell episode** (about days 33–36): sore throat and tiredness logged, paracetamol logged (with confirm), resting heart rate up and HRV down, **room readings normal**. The system must **not** attribute it to the room.
- **Cycle:** two 28-day cycles with luteal-phase skin temperature about +0.4 °C and resting HR about +2 bpm.
- **Wear gaps:** Gem off overnight (on Hub charging) and some unworn daytime hours; collar by day, ear by evening.
- **Recalibrations:** weekly Sunday sessions on the Hub (about 7–8), one **missed**; liner health declining from about 100% to about 45%.
- **One abstain pattern:** late dinners vs next-morning energy with too few nights to say anything.
- **One sensor-issue event:** Hub VOC flat-lines for about 6 hours around day 40.
- **Volumes:** about 80 check-ins (~1.5/day), about 140 logs across all six categories (sleep ≈ 56, food ≈ 45, exercise ≈ 20, illness ≈ 10, medication ≈ 8, cycle ≈ 6), including **Hinglish** entries, one entry the parser marks low-confidence, a few `corrected` entries, about 20 sessions, about 25 spikes, and about **35–45 insights** across days (so about 0.7/day), covering **every source colour, blended gradients, both tiers, an abstain card and a sensor-issue card**.
- **Ask answers (8):** e.g. "Why was Tuesday rough?", "How did I sleep on stuffy nights?", "When is my air cleanest?", "What did I use most?", "Do dusty evenings match my headaches?", plus one abstain answer.
Profile: Meera, 29, Bengaluru (lat 12.9716, lon 77.5946), Gem (choker), Hub in the bedroom with all four optional sensors fitted, `isDemo: true`.

---

## 12. PWA, offline, deploy

- **vite-plugin-pwa:** `registerType: 'autoUpdate'`; manifest `name "Praanaika View"`, `short_name "Praanaika"`, `start_url "/"`, `scope "/"`, `display "standalone"`, `orientation "portrait"`, `background_color #F8F1E7`, `theme_color #4A2650` (literals in `vite.config.ts` with a comment "keep in sync with tokens.css"), icons 192/512/maskable-512, shortcuts to Today and Talk. Workbox precaches all built assets and any `public/**/*.json`; `navigateFallback: '/index.html'`; runtime caching **NetworkFirst** with a 3 s timeout for Open-Meteo and postalpincode hosts; never cache POST.
- **`index.html`:** viewport with `viewport-fit=cover`, `theme-color`, `apple-mobile-web-app-capable`, `apple-touch-icon`, favicon.
- **Install UX:** `services/pwa.ts` (`isStandalone`, `isIOS`, `useInstallPrompt`), interstitial + banner as in 7.1. When standalone, hide all install UI.
- **Offline:** after the first load everything (demo data, assets) works without network; air quality falls back to the cached payload with a note; an offline chip appears in the header. Show a Toast "Update ready. Tap to refresh" when a new version is cached.
- **Vercel:** `vercel.json` = `{ "rewrites": [ { "source": "/((?!api/).*)", "destination": "/index.html" } ] }`, preset Vite, build `npm run build`, output `dist`. **Test the PWA on the deployed HTTPS URL on a real phone**, not in a preview window (service workers don't run in most preview iframes). Make a QR code of the URL for the demo.

---

## 13. Build steps (one at a time; commit after each)

| Step | Build | Done when | Est. |
|---|---|---|---|
| **1. Shell** | Vite project, tokens/reset/base, fonts, UI kit, 5-tab nav, DemoBanner, routes with placeholders, Mascot, config files, `types.ts`, storage/stores | App runs; nav order correct; changing `--color-primary` recolours everything; no Tailwind anywhere | 45 min |
| **2. PWA + deploy** | Manifest, service worker, icons, install flows, Vercel | Installs on Android/iOS; works offline after first load | 30 min |
| **3. Data + insights** | Seeded generator (Section 11), `useDataset` hooks, insight rules (or handmade fallback), demo clock | Console/debug shows counts; insights list has all colours/tiers/abstain/sensor issue with correct `createdAt`; day slider changes counts | 45 min |
| **4. Profiles + Today** | `/welcome` (install interstitial + choice), own 4-step onboarding, demo controls, Today with real AQI, location sheet, the insight box (intro/outro, colours, expand-with-evidence, day chip), owner cards | Both modes reach Today; real AQI for the city and a pincode; own day 0 shows exactly the intro card + outro; demo shows colour-coded, expandable cards | 1 h |
| **5. Talk** | Feed (mixed stream, filters, dock), orb pad, six composers, offline parser + confirm, corrections, Ask | A check-in and a "took a crocin 500 after lunch" log save; medication forces confirm; own insights appear after entries; Ask answers a chip and abstains on an unknown question | 1 h |
| **6. Gem/Hub + Design + Order** | Gem and Hub demo dashboards, design gallery (own tab content), configurator SVG art, presets, price, My creations, `/order` with UPI QR + WhatsApp/email | Own Gem/Hub tabs show the gallery; toggling options updates SVG and price (fully loaded Hub = ₹15,495); saved creations persist after reload; QR renders | 1 h 45 min |
| **7. You + About + Wrapped** | You sections, privacy draft, `/about` with reveal animations, `/wrapped` | Export/Delete work; `/about` opens without a profile; Wrapped plays through | 1 h 15 min |


---