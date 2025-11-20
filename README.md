This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Le script pnpm create-page marche maintenant (-_-)

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
# Santaane Platform Web

Plateforme web développée avec Next.js et Material-UI pour le projet Santaane.

## Prérequis

Avant de commencer, assurez-vous d'avoir installé les éléments suivants sur votre machine :

- **Node.js** : `v24.11.0` (requis)
- **pnpm** : Gestionnaire de paquets utilisé pour ce projet

Pour vérifier votre version de Node.js :
```bash
node --version
```

Si vous n'avez pas la bonne version, nous recommandons d'utiliser [nvm](https://github.com/nvm-sh/nvm) pour gérer vos versions de Node.js :
```bash
nvm install 24.11.0
nvm use 24.11.0
```

Pour installer pnpm :
```bash
npm install -g pnpm
```

## Installation

1. Clonez le repository :
```bash
git clone <url-du-repo>
cd santaane-plateform-web
```

2. Installez les dépendances :
```bash
pnpm install
```

## Démarrage du projet

### Mode développement

Pour lancer le serveur de développement :
```bash
pnpm dev
```

L'application sera accessible sur [http://localhost:3000](http://localhost:3000)

### Mode production

Pour créer une version de production optimisée :
```bash
pnpm build
```

Pour démarrer le serveur de production :
```bash
pnpm start
```

### Linter

Pour exécuter ESLint :
```bash
pnpm lint
```

## Technologies et Librairies

### Framework Principal

| Librairie | Version | Description |
|-----------|---------|-------------|
| **Next.js** | `16.0.1` | Framework React avec rendu côté serveur et génération de sites statiques |
| **React** | `19.2.0` | Bibliothèque JavaScript pour la construction d'interfaces utilisateur |
| **React DOM** | `19.2.0` | Package React pour le DOM |

### Interface Utilisateur (UI)

| Librairie | Version | Description |
|-----------|---------|-------------|
| **@mui/material** | `^7.3.5` | Bibliothèque de composants Material-UI |
| **@mui/icons-material** | `^7.3.5` | Icônes Material Design pour React |
| **@mui/x-data-grid** | `^8.17.0` | Composant DataGrid avancé pour Material-UI |
| **@emotion/react** | `^11.14.0` | Bibliothèque CSS-in-JS pour le styling (requis par MUI) |
| **@emotion/styled** | `^11.14.1` | Styled components pour Emotion (requis par MUI) |

### Gestion d'État

| Librairie | Version | Description |
|-----------|---------|-------------|
| **zustand** | `^5.0.8` | Solution légère de gestion d'état pour React |

### Requêtes HTTP

| Librairie | Version | Description |
|-----------|---------|-------------|
| **axios** | `^1.13.2` | Client HTTP basé sur les promesses pour le navigateur et Node.js |

### Gestion des Cookies

| Librairie | Version | Description |
|-----------|---------|-------------|
| **cookies-next** | `^6.1.1` | Utilitaire simplifié pour gérer les cookies dans Next.js |
| **cookie** | `^1.0.2` | Parser et sérialiseur de cookies HTTP |

## Dépendances de Développement

| Librairie | Version | Description |
|-----------|---------|-------------|
| **TypeScript** | `^5` | Superset typé de JavaScript |
| **@types/node** | `^20` | Définitions TypeScript pour Node.js |
| **@types/react** | `^19` | Définitions TypeScript pour React |
| **@types/react-dom** | `^19` | Définitions TypeScript pour React DOM |
| **ESLint** | `^9` | Outil de linting pour identifier et corriger les problèmes dans le code JavaScript/TypeScript |
| **eslint-config-next** | `16.0.1` | Configuration ESLint pour Next.js |

## Structure du Projet

```
santaane-plateform-web/
├── src/
│   ├── app/                 # Dossier App Router de Next.js
│   │   ├── layout.tsx      # Layout principal de l'application
│   │   ├── page.tsx        # Page d'accueil
│   │   ├── globals.css     # Styles globaux
│   │   ├── page.module.css # Styles modulaires
│   │   └── favicon.ico     # Icône de l'application
│   ├── components/         # Composants React réutilisables (à créer)
│   ├── lib/                # Utilitaires et configurations (à créer)
│   ├── services/           # Logique métier et appels API (à créer)
│   └── stores/             # Stores Zustand (à créer)
├── public/                 # Fichiers statiques
├── package.json            # Dépendances et scripts npm
├── next.config.ts          # Configuration Next.js
├── tsconfig.json           # Configuration TypeScript
├── eslint.config.mjs       # Configuration ESLint
├── CLAUDE.md               # Guide pour Claude Code
└── README.md               # Ce fichier
```

## Configuration TypeScript

Le projet utilise TypeScript avec les configurations suivantes :
- **Target** : ES2017
- **Module** : ESNext avec résolution bundler
- **Mode strict** : Activé
- **Path aliases** : `@/*` pointe vers `src/*`

Exemple d'import avec alias :
```typescript
import { Component } from '@/components/Component'
```

## Scripts Disponibles

| Script | Commande | Description |
|--------|----------|-------------|
| **dev** | `pnpm dev` | Démarre le serveur de développement |
| **build** | `pnpm build` | Crée une version optimisée pour la production |
| **start** | `pnpm start` | Démarre le serveur de production |
| **lint** | `pnpm lint` | Execute ESLint pour vérifier le code |

## Variables d'Environnement

Pour configurer les variables d'environnement, créez un fichier `.env.local` à la racine du projet :

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

Les variables préfixées par `NEXT_PUBLIC_` sont accessibles côté client.

## Contribution

1. Créez une branche pour votre fonctionnalité (`git checkout -b feature/nom-fonctionnalite`)
2. Committez vos changements (`git commit -m 'Ajout de nouvelle fonctionnalité'`)
3. Poussez vers la branche (`git push origin feature/nom-fonctionnalite`)
4. Ouvrez une Pull Request

## Support

Pour toute question ou problème, veuillez ouvrir une issue sur le repository.

## Licence

Ce projet est privé et propriétaire.
