# Pawrise

Prototype interactif de l’application mobile Pawrise : collier connecté, tableau de santé, localisation, assistant, soins et rendez-vous vétérinaires.

Ce dépôt sert à **prototyper**, **présenter** et **démontrer** le produit, puis à en extraire un **prototype Figma** et des **user stories**. L’interface est conçue comme une app native (viewport téléphone). Les données restent dans le navigateur : **aucune base de données ni backend ne sera branché**.

## Qu’est-ce que Pawrise ?

Pawrise accompagne le propriétaire d’un chien au quotidien :

- **Santé** — score de bien-être, indicateurs (rythme cardiaque, fibrillation atriale, activité, sommeil, température) et graphiques par période.
- **Localisation** — carte, position du chien, trajet, zones de sécurité.
- **Chat IA** — assistant Pawrise, conversation propre à chaque chien, relais vers un vétérinaire.
- **Rendez-vous** — cliniques, filtres urgence, créneaux, confirmation et annulation.
- **Paramètres** — profil, invitations de copropriétaires, confidentialité.
- **Soins** — rappels (vaccin, traitement, autre) et notifications.

Le chien de référence de la démonstration est **Nala** (Golden Retriever). D’autres chiens peuvent être ajoutés.

## Contrôle de démonstration

Un **seul bouton** permet de passer de **Tout va bien** à **Alerte** (et l’inverse) :

1. Ouvrir l’onglet **Pawrise** (Santé).
2. Toucher l’icône d’alerte en haut à droite de la carte de bien-être.

En alerte : le score passe à 64/100, les indicateurs changent, une bannière apparaît sur la carte, et « Demander à Pawrise » ouvre le chat déjà contextualisé. Aucun autre contrôle ne déclenche un incident.

Les données, conversations et zones sont conservées par chien dans le navigateur (`localStorage`). Dans **Paramètres**, « Réinitialiser la démonstration » ramène l’app à l’état initial.

## Prérequis

- [Node.js](https://nodejs.org/) 22 ou plus
- [pnpm](https://pnpm.io/) 9 ou plus (`corepack enable` puis `corepack prepare pnpm@latest --activate`)
- Git
- Un accès réseau (polices Google Fonts et photos Unsplash)

## Récupérer et lancer

```bash
git clone https://github.com/Pawrise/pawrise-figma.git
cd pawrise-figma
pnpm install
pnpm dev
```

Ouvrir [http://localhost:8443](http://localhost:8443). Le serveur Vite écoute le port **8443**.

Si le dépôt est déjà cloné :

```bash
git pull origin master
pnpm install
pnpm dev
```

Autres commandes :

| Commande | Rôle |
| --- | --- |
| `pnpm build` | Build de production |
| `pnpm preview` | Prévisualiser le build |
| `pnpm typecheck` | Vérifier TypeScript |
| `pnpm format` | Formater avec oxfmt |

Cibler un téléphone : ouvrir les outils développeur et choisir un viewport mobile (environ 390×844).

## Organisation

| Chemin | Rôle |
| --- | --- |
| `src/App.tsx` | Coquille de l’app, navigation, état partagé |
| `src/screens/` | Santé, Localisation, Chat, Rendez-vous, Paramètres |
| `src/components/health/` | Score, cartes d’indicateurs, graphiques |
| `src/components/chat/` | Bulles, suggestions, champ de saisie |
| `src/components/care/` | Alertes, rappels, parcours vétérinaire |
| `src/dogs/` | Ajout d’un chien, photo, identité, association du collier |
| `src/data/` | Chiens, indicateurs, cliniques, validation |
| `src/state/` | Persistance locale, notifications, rendez-vous, rappels |
| `src/chat/` | Réponses de l’assistant et conversations par chien |
| `src/theme/tokens.json` | Jetons visuels pour le passage vers Figma |
| `docs/USER_STORIES.md` | User stories alignées sur les écrans |

## Parcours

- **Santé** — chien actif, score, indicateurs, détail + périodes, chat contextualisé.
- **Chiens** — ajout pas à pas, photo, identité, infos médicales, QR ou code `PW-ABC123`, sélection et édition.
- **Collier** — batterie, état de connexion, remplacement avec contrôle du code.
- **GPS** — carte déplaçable, zoom, recentrage, actualisation, trajet, zones (ajouter, renommer, redimensionner, supprimer).
- **Chat** — une conversation par chien, cohérente avec la Santé.
- **Alertes** — lecture / non-lecture, lien vers le chien et l’écran concernés.
- **Soins** — créer, modifier, effectuer, supprimer ; une échéance à moins de 24 h apparaît dans les alertes.
- **Vétérinaire** — liste, filtre urgence, tri distance ou prochain créneau, récapitulatif, confirmation, annulation.
- **Paramètres** — profil, préférences, invitations, documents, réinitialisation.

## User stories et Figma

Les user stories sont dans [`docs/USER_STORIES.md`](docs/USER_STORIES.md). Elles décrivent le produit tel qu’il se présente en démonstration, pour alimenter le prototype Figma.

Les couleurs, rayons et polices sont dans `src/index.css` (`@theme`) et `src/theme/tokens.json`. Conservez ces noms : ce sont le pont vers les variables Figma.

## Stack

React 19, TypeScript, Vite, Tailwind CSS v4. Projet issu de Figma Make ; un serveur de preview tourne déjà dans cet environnement sur `$PORT` (8443 par défaut).
