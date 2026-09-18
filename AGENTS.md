# Pawrise — Figma Make

Prototype React + Vite + Tailwind CSS de l’app mobile Pawrise, exécuté dans Figma Make et en local. Objectif : démonstration, prototype Figma, user stories. Pas de base de données.

## Serveur de développement

Un serveur Vite tourne déjà sur `$PORT` (8443 par défaut). Ne pas le relancer manuellement dans Figma Make.

- Preview : panneau de prévisualisation
- Hot reload : les fichiers `src/` se rechargent tout seuls

En local : `pnpm install` puis `pnpm dev`, ouvrir http://localhost:8443. Détail : `README.md`.

## Structure

Partir des fichiers utiles à la tâche. Suivre les imports seulement si besoin.

- `src/main.tsx` — point d’entrée, importe `src/index.css`, monte `src/App.tsx`
- `src/App.tsx` — coquille, onglets, état partagé
- `src/screens/` — Santé, Localisation, Chat, Rendez-vous, Paramètres
- `src/index.css` — Tailwind v4 et jetons
- `src/theme/tokens.json` — jetons pour Figma
- `docs/USER_STORIES.md` — user stories
- `package.json` / `vite.config.ts` — scripts et plugins Figma Make, alias `@` → `src/`

## Dépendances

React 19, Tailwind CSS v4 (`@tailwindcss/vite`), Vite 8, TypeScript 5.7, oxfmt.

## Qualité

- Copie UI en français, ton produit (voir `.cursor/rules/demonstration-copy.mdc`).
- Default exports. Apostrophes dans des doubles quotes. JSX fermé.
- Ne pas générer de tests.
