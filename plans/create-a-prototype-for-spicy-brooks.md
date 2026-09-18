# Pawrise Prototype — GPS Localization + AI Chat + Health Dashboard

> Brief initial. La copie produit actuelle ne qualifie pas l’expérience de fake ou de simulation. Le seul contrôle de démonstration est la bascule Tout va bien / Alerte sur l’écran Santé. Voir `README.md` et `docs/USER_STORIES.md`.


Three features in one native mobile app prototype, sharing the same design system, tokens, fonts, components, and bottom navigation:
- **Feature A — GPS Localization** (map, marker, safe zones)
- **Feature B — Chat IA** (in-app assistant, two interactive French flows)
- **Feature C — Health Dashboard** (wellbeing score → simple indicators → advanced charts → normal↔anomaly demo)

# Feature A — GPS Localization

## Context
Pawrise is a mobile app that pairs with a connected dog collar. This prototype delivers the **GPS Localization** screen: a full-screen map that shows the dog's live position, a status header (name, photo, collar/battery, last-update recency), controls to recenter and refresh, clear staleness signalling, and an entry point into Safe Zone management. The current project is an empty Vite + React 19 + Tailwind v4 scaffold (`src/App.tsx` is a stub), so we build fresh with no existing UI to preserve.

This is a **native mobile app** (iOS/Android), not a website. Design and build it as a single full-bleed mobile app screen — no desktop framing, no responsive multi-column reflow. Target a phone viewport, use native mobile patterns (status bar allowance / safe areas, a bottom tab navigation bar, bottom sheets, thumb-reachable floating controls, large touch targets).

Because no map API/key is available in a prototype and the focus is the *interface*, the map is a bespoke stylized SVG/CSS "map canvas" (streets, blocks, water, park) that is genuinely zoomable and pannable via React state — not a real tile provider. This keeps the prototype self-contained and offline-safe while feeling like a real map app.

## Aesthetic direction
- **Stance:** clean, modern, trustworthy **native mobile app** on a **deep-indigo dark canvas** (kinetic-leaning). The dark ground makes the lime accent and status colors pop, including on the map.
- **Fonts (Google, via `@import` at top of `src/index.css`):** `Bricolage Grotesque` for headings/name, `Inter` for body/UI, `DM Mono` for coordinates/timestamps/labels.
- **Brand palette (fixed, from the user — tokens in `src/index.css` `@theme`):**
  - `--background` **`#161349`** (deep indigo) — page/app ground and map base.
  - `--foreground` **`#f4f6ff`** (near-white) — default text.
  - `--primary` / `--accent` **`#d3fc72`** (lime) — dog marker, primary actions, active tab, owner chat bubbles, "healthy" emphasis. Text on lime is the dark indigo (`#161349`) for AA contrast. Used sparingly for emphasis.
  - Derived surfaces: lightened-indigo `--card`/`--secondary`/`--muted` panels (e.g. indigo raised ~6–12% or low-opacity white overlays) with `--border` as low-opacity near-white hairlines.
  - **Semantic status colors** (kept distinct from the lime brand accent so state reads unambiguously): **Tout va bien** = a calm green/teal, **À surveiller** = amber, **Alerte** = warm red. GPS staleness reuses amber/red. State always signals via icon + label + color, never color alone.
- Fills the phone viewport edge-to-edge; overlay UI (status card, controls, tab bar, chat header) floats above the content with mobile safe-area padding.

## Implementation

All work in a small component set under `src/`. Single full-screen mobile app screen, working React state — no router needed.

- `src/index.css` — Google Font `@import`s first, then `@import 'tailwindcss';`, then `@theme` token block (colors, radius) and base body font default. Lock body to full viewport, prevent overscroll/bounce, hide scrollbars — behave like an app shell, not a scrolling web page.
- `src/App.tsx` — full-viewport app shell that mounts `<GpsScreen/>` and the bottom `<TabBar/>`.
- `src/components/TabBar.tsx` — native-style bottom navigation bar (Home, Map/Localization active, Activity, Profile) with safe-area padding; establishes that GPS Localization is reached "via the main navigation bar" per the user story.
- `src/components/MapCanvas.tsx` — the stylized SVG map: streets/blocks/park/water, supports **pan** (pointer drag) and **zoom** (buttons + wheel) driven by `{x, y, scale}` state lifted to the screen. Renders children (marker, safe-zone overlays) in map-space.
- `src/components/DogMarker.tsx` — custom marker: dog photo in a coral ring + pulsing accuracy halo; halo turns muted/amber when position is stale.
- `src/components/StatusCard.tsx` — top card: dog photo, name, collar-connected chip, battery level, and **recency line** ("Nala — Located 30 seconds ago") that recomputes from a `lastUpdate` timestamp and shows a **stale/transmission-issue banner** when older than a threshold.
- `src/components/MapControls.tsx` — floating buttons: zoom +/−, **recenter** (resets pan/scale to dog), **refresh** (async spinner that updates `lastUpdate` and jitters position, with an occasional simulated "signal weak" outcome to exercise the stale state).
- `src/components/SafeZonesSheet.tsx` — bottom sheet opened from the screen: lists existing safe zones ("Home", "Dog Park") with in/out status, toggle alerts, and an "Add safe zone" affordance; selecting a zone draws its circle overlay on the map. Managed with local state (add/rename/remove, adjust radius via slider) — prototype-level, no persistence.
- `src/data/mock.ts` — realistic mock data: dog `Nala`, collar id, battery `72%`, coordinates, timestamp, seeded safe zones, and a short movement history (used for a subtle breadcrumb trail on the map).
- Dog photo from Unsplash (dog portrait), with bg color + alt text.

### Key interactions (all real state)
- Recenter, zoom, pan, refresh (async + occasional weak-signal → stale styling), open/close safe-zones sheet, add/edit/remove zone + toggle alerts, show/hide zone overlay, live-updating "x seconds ago" via an interval.

---

# Feature B — Chat IA (added to the existing Pawrise prototype)

## Context
A second, fully-integrated feature: an in-app **AI Chat** ("Chat IA") where the owner talks to Pawrise about Nala. It must feel **native to Pawrise**, not a bolted-on chatbot. It **reuses the exact same design system, tokens, fonts, components, spacing, radii, and UX** built for GPS — no new visual language, no separate app, and **the existing GPS screens are not modified** beyond wiring the shared navigation and the alert entry point. All chat copy is in **French**, matching the brief. Mobile-first, simple, warm, reassuring.

## Navigation & shared state
- The Chat IA is a **new tab in the existing bottom `TabBar`** (replacing/relabelling one of the placeholder tabs, e.g. "Chat"). No new nav paradigm.
- Lift `activeTab` state to `src/App.tsx`, which renders either `<GpsScreen/>` or `<ChatScreen/>` above the shared `<TabBar/>`. The user never leaves Pawrise.
- A small chat state store (a `useChat` hook or lightweight context in `src/chat/`) holds the message list and an optional `pendingContext` so the alert flow can seed the conversation before the tab switches.

## New files (reusing existing components/tokens)
- `src/screens/ChatScreen.tsx` — messaging screen: sticky header with **Nala's photo + name** (reuses the avatar/photo treatment from `StatusCard`) and a "connecté au collier" subtitle; scrollable message history; bottom composer.
- `src/components/chat/MessageBubble.tsx` — owner bubbles (coral/primary, right-aligned) vs Pawrise bubbles (card surface, left-aligned with a small Pawrise mark). Same radii/typography as the rest of the app.
- `src/components/chat/QuickReplies.tsx` — horizontal row of tappable chips (reuses the chip styling from safe-zones/status). Used for both the opening suggestions and the contextual alert replies.
- `src/components/chat/Composer.tsx` — bottom free-text input + send button, safe-area padding, mirrors app control styling. Sending a typed message appends it and triggers a canned Pawrise reply.
- `src/components/chat/TypingIndicator.tsx` — brief animated "Pawrise écrit…" before each Pawrise reply so responses feel generated, not instant.
- `src/chat/useChat.ts` + `src/chat/scripts.ts` — chat state (append user/assistant messages, async reply with typing delay) and the scripted French responses/quick-reply sets.

## Flow A — suggested question (main navigation)
1. Opening the Chat tab with an empty history shows a warm greeting from Pawrise and **quick suggestions**: « Comment va Nala aujourd'hui ? », « Est-ce qu'elle a bien dormi ? », « Quelque chose d'inhabituel aujourd'hui ? ».
2. Tapping « Comment va Nala aujourd'hui ? » appends it as an owner message, shows the typing indicator, then a Pawrise reply summarizing **Nala's current state** (drawn from `mock.ts`: activity, battery, safe-zone status, last GPS update — reusing the same data as GPS for consistency).
3. The composer stays active; the user continues freely (typed messages get contextual canned replies).

## Flow B — collar alert → contextualized chat
1. Simulate a collar alert surfaced in the app — an **alert banner/toast** « Une variation inhabituelle a été détectée chez Nala. » (shown on the GPS screen and/or as a top notification; component `src/components/AlertBanner.tsx`).
2. Tapping the alert **switches directly to the Chat tab** and seeds the conversation via `pendingContext` — no explanation needed from the user. Pawrise immediately posts: « J'ai détecté une variation inhabituelle chez Nala aujourd'hui. Veux-tu que je t'explique ? »
3. **Quick replies:** « Oui, explique-moi », « Voir les données », « Est-ce inquiétant ? ».
4. Tapping « Oui, explique-moi » continues with a **simple, reassuring explanation** of what was observed; « Voir les données » shows a compact data summary, « Est-ce inquiétant ? » gives a calm risk read. Afterward the user keeps chatting in the same screen.

---

# Feature C — Health Dashboard (Tableau de bord de santé)

## Context
The dog's **health dashboard** — the third feature, and the natural "home" screen for Nala. It gives two reading levels: *"I just want to know if my dog is OK"* (glanceable score + simple indicator cards) and *"I want to understand the data"* (advanced views with charts). It reuses the same tokens, fonts, cards, chips, and status colors (green = Tout va bien, amber = À surveiller, red = Alerte) already used across GPS and Chat. All copy in **French**. It also closes the loop with Chat IA: from an anomaly, "Demander à Pawrise" opens the already-designed contextual chat flow. Charts use **`recharts`** (new dependency) styled per the `dataviz` skill (read before writing any chart).

## Navigation
- New/primary tab in the shared `TabBar` — "Santé" (this becomes the dashboard the user "arrives on"). Reached via the same bottom nav; no new paradigm.
- The dashboard is a **vertically scrolling** screen (the one screen allowed to scroll), inside the app shell.

## New files
- `src/screens/HealthScreen.tsx` — scroll container: `WellbeingScore` pinned at top, then the indicator list.
- `src/components/health/WellbeingScore.tsx` — big **global score** ("Nala — 87/100") + state label/message, no chart needed to read it. Three visual states driven by score/status: **Tout va bien** (green), **À surveiller** (amber), **Alerte** (red) — color, icon, and copy all change, not color alone.
- `src/components/health/IndicatorCard.tsx` — **simple view** of one indicator: title, state chip, plain-language message, and a « Voir les détails » action. Two designed states minimum per indicator: normal and alerte. Examples: Rythme cardiaque / Tout va bien / « …dans ses valeurs habituelles. » vs À surveiller / « …inhabituellement élevé depuis 45 minutes. »
- `src/components/health/IndicatorDetail.tsx` — **advanced view** (bottom sheet or pushed sub-screen) with the chart + more detail and a period switcher **Aujourd'hui / 7 jours / 30 jours** where relevant. Includes the two actions on an anomaly: **"Voir le graphique avancé"** and **"Demander à Pawrise"** (→ switches to Chat tab, seeds the anomaly context reusing Feature B's `pendingContext`).
- `src/components/health/charts/` — per-indicator recharts visuals:
  - Rythme cardiaque → line/area curve (bpm over time)
  - Fibrillation atriale → dedicated schematic/representation of associated data (e.g. rhythm strip / segmented status timeline rather than a generic line)
  - Activité → activity evolution (bar/area)
  - Sommeil → sleep periods & duration (stacked/segmented bars)
  - Température → temperature curve
- `src/data/health.ts` — the 5 MVP indicators with `normal` and `alerte` states (state, message, and time-series for each period), plus a derived global score. Nala's identity/data stays consistent with `mock.ts`.

## Feature — normal → anomalie demo (must be shown)
- A prototype toggle (a small "Simuler une anomalie" control on the dashboard, and/or reuse the collar `AlertBanner`) flips the dashboard state: global score **87 → 64**, and Rythme cardiaque card goes **Tout va bien / « Les valeurs sont habituelles. » → À surveiller / « Une variation inhabituelle du rythme cardiaque a été détectée. »** with a smooth transition.
- In the anomaly state the user can **open the advanced chart** or **Demander à Pawrise** → lands in the contextual Chat IA (same seed as Feature B's collar-alert flow). This unifies all three features.

## Verification (Health)
- Switching to the Santé tab shows the global score + state at the top without scrolling; scrolling reveals the 5 simple indicator cards.
- « Voir les détails » opens the advanced view with a recharts chart and, where relevant, a working Aujourd'hui/7j/30j period switch.
- The "Simuler une anomalie" toggle flips score 87→64 and the Rythme cardiaque card to À surveiller with the new message; « Demander à Pawrise » opens the Chat tab pre-seeded with the anomaly context.
- Visual language matches GPS/Chat (same fonts, tokens, radii, chips, status colors).

---

## Verification
- Dev server auto-runs on `$PORT`; open the preview and view at a phone viewport.
- **GPS (unchanged):** map pans/zooms, recenter resets to dog, refresh updates recency and can trigger the stale banner, safe-zone sheet opens and a selected zone draws on the map, bottom tab bar renders, and the screen fills the viewport edge-to-edge (no scroll/bounce).
- **Chat IA:** switching to the Chat tab shows Nala's header + suggestions; Flow A (suggested question → Pawrise state summary → free continuation) works; tapping the collar alert auto-opens the Chat tab pre-seeded, shows the contextual message + quick replies, and « Oui, explique-moi » continues with a reassuring explanation; the composer sends typed messages; visual language is identical to GPS (same fonts, tokens, radii, chips, avatar).
- Optionally run `pnpm build` to confirm the Tailwind v4 + font `@import` ordering compiles.
