# CLI de Génération de Pages Dashboard

## Description

Ce CLI vous permet de créer rapidement une nouvelle page complète pour le dashboard avec toute la structure nécessaire.

## Utilisation

```bash
pnpm create-page
```

## Ce que le CLI fait

Le CLI crée automatiquement :

1. **Structure de dossiers** :
   ```
   src/app/(dashboard)/[nom-page]/
   ├── page.tsx                          # Page principale
   ├── checkers/
   │   └── validators.ts                 # Logique de validation
   ├── components/
   │   └── [Feature]Card.tsx            # Composant de carte
   ├── fetchers/
   │   ├── useFetch[Feature].ts         # Hooks GET
   │   └── useCreate[Feature].ts        # Hooks POST/PUT/DELETE
   └── helpers/
       └── formatters.ts                 # Utilitaires de formatage
   ```

2. **Configuration automatique** :
   - Ajoute la page au menu de navigation (`src/config/roles.ts`)
   - Importe l'icône Material-UI sélectionnée
   - Configure les rôles autorisés

## Questions posées par le CLI

1. **Nom de la page** (kebab-case)
   - Exemple : `my-feature`, `user-management`, `reports`
   - Utilisé pour le nom du dossier et la route

2. **Nom d'affichage**
   - Exemple : `Ma Fonctionnalité`, `Gestion des utilisateurs`
   - Affiché dans le menu et comme titre de page

3. **Icône Material-UI**
   - Sélection parmi 40+ icônes courantes
   - Utilisée dans le menu et sur la page

4. **Route**
   - Exemple : `/dashboard/my-feature`
   - Route d'accès à la page

5. **Rôles autorisés** (multi-sélection)
   - SUPER_ADMIN
   - EDITOR
   - EVALUATOR
   - MENTOR
   - AUTHOR

## Exemple d'utilisation

```bash
$ pnpm create-page

🚀 Création d'une nouvelle page Dashboard

? Nom de la page (kebab-case, ex: my-feature): projects
? Nom d'affichage (ex: Ma Fonctionnalité): Projets
? Icône Material-UI: Folder
? Route (ex: /dashboard/my-feature): /dashboard/projects
? Rôles autorisés (sélection multiple): AUTHOR, MENTOR, EVALUATOR

📝 Création des fichiers...

  ✓ projects/page.tsx
  ✓ projects/checkers/validators.ts
  ✓ projects/fetchers/useFetchProjects.ts
  ✓ projects/fetchers/useCreateProjects.ts
  ✓ projects/components/ProjectsCard.tsx
  ✓ projects/helpers/formatters.ts

🔧 Mise à jour de la configuration...

✅ Menu mis à jour dans roles.ts

✨ Page créée avec succès!

📂 Emplacement: /Users/.../src/app/(dashboard)/projects
🔗 Route: /dashboard/projects
👥 Rôles autorisés: AUTHOR, MENTOR, EVALUATOR

💡 Prochaines étapes:
  1. Adapter les endpoints API dans les fetchers
  2. Personnaliser les champs dans validators.ts
  3. Ajuster le composant Card selon vos besoins
  4. Tester la page: /dashboard/projects
```

## Fichiers générés

### 1. `page.tsx`
Page principale avec :
- Import et utilisation du fetcher
- État de chargement avec CircularProgress
- État vide avec message et bouton
- Grille de cartes avec les données
- Navigation vers création/détails

### 2. `checkers/validators.ts`
Validation et permissions avec :
- Interface `ValidationError`
- Interface `[Feature]Payload`
- Fonctions de validation par champ
- Fonction de validation complète
- Fonctions de vérification des permissions (canEdit, canDelete, canView)

### 3. `fetchers/useFetch[Feature].ts`
Hooks pour récupérer les données :
- `useFetch[Feature]()` - Liste complète
- `useFetch[Feature]ById()` - Item unique par ID
- Gestion des états loading/error
- Utilisation de l'AlertStore pour les erreurs

### 4. `fetchers/useCreate[Feature].ts`
Hooks pour modifier les données :
- `useCreate[Feature]()` - Créer un nouvel item
- `useUpdate[Feature]()` - Modifier un item existant
- `useDelete[Feature]()` - Supprimer un item
- Messages de succès/erreur automatiques

### 5. `components/[Feature]Card.tsx`
Composant de carte avec :
- Affichage des données formatées
- Chip de statut coloré
- Actions (Voir, Modifier, Supprimer)
- Animation au survol
- Utilisation des formatters

### 6. `helpers/formatters.ts`
Utilitaires de formatage :
- `format[Feature]Date()` - Formatage des dates en français
- `getStatusLabel()` - Labels de statut traduits
- `getStatusColor()` - Couleurs MUI pour les statuts
- `truncateContent()` - Troncature de texte
- Autres utilitaires (auteur, initiales, taille fichier, temps de lecture)

## Prochaines étapes après génération

1. **Adapter les endpoints API** :
   - Modifier `/api/v1/[feature]` dans les fetchers
   - Ajuster selon votre backend

2. **Personnaliser les champs** :
   - Ajouter les champs spécifiques dans les interfaces
   - Mettre à jour les validations

3. **Adapter le composant Card** :
   - Afficher vos champs personnalisés
   - Ajuster le design selon vos besoins

4. **Créer les routes de détail/création** (optionnel) :
   - `src/app/(dashboard)/[feature]/new/page.tsx`
   - `src/app/(dashboard)/[feature]/[id]/page.tsx`

5. **Tester la page** :
   - Lancer `pnpm dev`
   - Accéder à la route configurée
   - Vérifier les permissions par rôle

## Notes

- Tous les templates suivent les patterns du projet
- Le code est prêt à l'emploi, il faut juste adapter les endpoints API
- La protection par rôles est automatiquement configurée
- Les messages sont en français
- Utilise Material-UI v7 et les conventions du projet
