# Architecture Modulaire Feature-Based

## 🎯 Philosophie

Cette architecture suit le principe **"Feature-First"** : chaque feature/page contient **tout** ce dont elle a besoin pour fonctionner de manière autonome.

### Avantages

- ✅ **Modulaire** : Chaque feature est isolée et autonome
- ✅ **Scalable** : Facile d'ajouter de nouvelles features
- ✅ **Maintenable** : Tout est regroupé par contexte métier
- ✅ **DRY** : Les composants vraiment réutilisables sont dans `components/`
- ✅ **Prévisible** : Structure cohérente pour toutes les features

---

## 📁 Structure Globale

```
src/
├── components/              # Composants RÉUTILISABLES uniquement
│   ├── ui/                 # Composants UI de base
│   ├── guards/             # AuthGuard, RoleGuard
│   └── layouts/            # Layouts réutilisables (Sidebar, Header)
│
├── stores/                 # Stores Zustand globaux
│   ├── authStore.ts       # Authentification
│   └── alertStore.ts      # Système d'alertes global
│
├── lib/                    # Utilitaires globaux
│   ├── api/client.ts      # Client Axios
│   ├── theme.ts           # Thème MUI
│   └── cookies.ts         # Gestion cookies
│
└── app/                    # Pages et features
    ├── (public)/          # Routes publiques
    │   ├── login/
    │   └── register/
    └── (dashboard)/       # Routes privées
        ├── articles/      # Feature "Articles"
        ├── users/         # Feature "Users"
        └── dashboard/     # Dashboards par rôle
```

---

## 📦 Structure d'une Feature

Chaque feature suit cette structure :

```
app/(dashboard)/articles/
├── page.tsx                    # Page principale
├── [id]/                       # Routes dynamiques
│   ├── page.tsx               # Détail article
│   └── edit/
│       └── page.tsx           # Édition article
├── create/
│   └── page.tsx               # Création article
│
├── components/                 # Composants spécifiques à cette feature
│   ├── ArticleCard.tsx
│   ├── ArticleFilters.tsx
│   └── ArticleEditor.tsx
│
├── fetchers/                   # Hooks pour les appels API
│   ├── useFetchArticles.ts    # GET /articles
│   ├── useFetchArticle.ts     # GET /articles/:id
│   ├── useCreateArticle.ts    # POST /articles
│   ├── useUpdateArticle.ts    # PUT /articles/:id
│   └── useDeleteArticle.ts    # DELETE /articles/:id
│
├── helpers/                    # Fonctions utilitaires
│   ├── formatters.ts          # formatDate, calculateReadTime
│   ├── sorters.ts             # sortByDate, sortByAuthor
│   └── transformers.ts        # articleToForm, formToArticle
│
└── checkers/                   # Validations et vérifications
    ├── validators.ts          # validateArticleData
    └── permissions.ts         # canEditArticle, canPublish
```

---

## 🔌 Patterns d'Utilisation

### 1. **Fetchers** - Hooks pour les API

Les fetchers sont des hooks React qui :
- Gèrent automatiquement le state `loading`
- Affichent automatiquement les alertes en cas d'erreur
- Retournent les données directement

**Exemple : `fetchers/useFetchArticles.ts`**

```typescript
import { useState } from 'react';
import apiClient from '@/lib/api/client';
import { useAlertStore } from '@/stores/alertStore';

export function useFetchArticles() {
  const [data, setData] = useState<Article[] | null>(null);
  const [loading, setLoading] = useState(false);
  const { showError } = useAlertStore();

  const fetch = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get('/api/v1/articles');
      setData(response.data);
      return response.data; // Return data only
    } catch (error) {
      showError('Erreur', 'Impossible de charger les articles');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, fetch };
}
```

**Utilisation dans une page :**

```typescript
'use client';

import { useEffect } from 'react';
import { useFetchArticles } from './fetchers/useFetchArticles';

export default function ArticlesPage() {
  const { data, loading, fetch } = useFetchArticles();

  useEffect(() => {
    fetch(); // Charger au montage
  }, []);

  if (loading) return <CircularProgress />;

  return (
    <div>
      {data?.map(article => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </div>
  );
}
```

---

### 2. **Helpers** - Fonctions utilitaires

Les helpers sont des fonctions pures pour manipuler les données.

**Exemple : `helpers/formatters.ts`**

```typescript
export function formatArticleDate(date: string): string {
  return new Date(date).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function calculateReadTime(content: string): string {
  const wordsPerMinute = 200;
  const words = content.split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min de lecture`;
}
```

**Utilisation :**

```typescript
import { formatArticleDate, calculateReadTime } from './helpers/formatters';

<Typography>
  {formatArticleDate(article.createdAt)} • {calculateReadTime(article.content)}
</Typography>
```

---

### 3. **Checkers** - Validations

Les checkers valident les données et vérifient les permissions.

**Exemple : `checkers/validators.ts`**

```typescript
export function validateArticle(data: ArticlePayload): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!data.title || data.title.length < 5) {
    errors.push({ field: 'title', message: 'Le titre doit contenir au moins 5 caractères' });
  }

  if (!data.content || data.content.length < 50) {
    errors.push({ field: 'content', message: 'Le contenu doit contenir au moins 50 caractères' });
  }

  return errors;
}

export function canEditArticle(article: Article, user: User): boolean {
  if (user.roles.includes('ADMIN')) return true;
  if (user.roles.includes('EDITOR')) return true;
  return article.authorId === user.id;
}
```

**Utilisation :**

```typescript
import { validateArticle, canEditArticle } from './checkers/validators';

const errors = validateArticle(formData);
if (errors.length > 0) {
  // Afficher les erreurs
}

const canEdit = canEditArticle(article, currentUser);
if (!canEdit) {
  // Bloquer l'édition
}
```

---

### 4. **Components** - Composants spécifiques

Les composants de la feature sont dans `components/`.

**Exemple : `components/ArticleCard.tsx`**

```typescript
import { formatArticleDate } from '../helpers/formatters';

export default function ArticleCard({ article }: { article: Article }) {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6">{article.title}</Typography>
        <Typography variant="caption">
          {formatArticleDate(article.createdAt)}
        </Typography>
      </CardContent>
    </Card>
  );
}
```

---

## 🌍 Système d'Alertes Global

### Store d'Alertes (`stores/alertStore.ts`)

Gère toutes les alertes de l'application avec Zustand.

```typescript
import { useAlertStore } from '@/stores/alertStore';

const { showSuccess, showError, showWarning, showConfirm } = useAlertStore();

// Alerte de succès
showSuccess('Succès', 'Article créé avec succès');

// Alerte d'erreur
showError('Erreur', 'Impossible de supprimer l\'article');

// Alerte de confirmation
showConfirm(
  'Supprimer l\'article ?',
  'Cette action est irréversible',
  () => deleteArticle(id),  // onConfirm
  () => console.log('Annulé') // onCancel
);
```

### Composant GlobalAlert

Le composant `GlobalAlert` est automatiquement inclus dans le layout root et affiche les alertes sous forme de Modal Dialog MUI.

---

## 🎨 Composants Réutilisables

Seuls les composants **vraiment réutilisables** vont dans `src/components/` :

```
src/components/
├── ui/                     # Composants UI de base
│   ├── Button.tsx         # Si vous personnalisez MUI Button
│   ├── GlobalAlert.tsx    # Système d'alertes
│   └── LoadingSpinner.tsx
│
├── guards/                 # Protection des routes
│   ├── AuthGuard.tsx
│   └── RoleGuard.tsx
│
└── layouts/                # Layouts réutilisables
    ├── Sidebar.tsx
    └── Header.tsx
```

**Règle** : Si un composant n'est utilisé que dans une feature, il reste dans `app/(dashboard)/feature/components/`.

---

## 📝 Guide Pratique

### Créer une nouvelle feature

1. **Créer la structure**

```bash
mkdir -p src/app/\(dashboard\)/ma-feature/{components,fetchers,helpers,checkers}
touch src/app/\(dashboard\)/ma-feature/page.tsx
```

2. **Créer les fetchers**

```typescript
// fetchers/useFetchData.ts
export function useFetchData() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const { showError } = useAlertStore();

  const fetch = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get('/api/data');
      setData(response.data);
      return response.data;
    } catch (error) {
      showError('Erreur', 'Impossible de charger les données');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, fetch };
}
```

3. **Créer les helpers**

```typescript
// helpers/formatters.ts
export function formatData(data: any) {
  // Logique de formatage
}
```

4. **Créer les checkers**

```typescript
// checkers/validators.ts
export function validateData(data: any) {
  const errors = [];
  // Validation
  return errors;
}
```

5. **Créer la page**

```typescript
'use client';

import { useEffect } from 'react';
import { useFetchData } from './fetchers/useFetchData';

export default function MaFeaturePage() {
  const { data, loading, fetch } = useFetchData();

  useEffect(() => {
    fetch();
  }, []);

  return <div>{/* UI */}</div>;
}
```

---

## ✅ Checklist

Pour chaque nouvelle feature :

- [ ] Créer la structure (components/, fetchers/, helpers/, checkers/)
- [ ] Créer les fetchers avec gestion d'erreur automatique
- [ ] Créer les helpers pour les utilitaires
- [ ] Créer les checkers pour les validations
- [ ] Créer les composants spécifiques à la feature
- [ ] Utiliser le store d'alertes pour les notifications

---

## 🚀 Exemple Complet : Feature "Articles"

Voir `src/app/(dashboard)/articles/` pour un exemple complet avec :

- ✅ Page liste des articles
- ✅ Fetcher `useFetchArticles` avec auto-loading et error handling
- ✅ Helpers `formatters.ts` (dates, temps de lecture, statuts)
- ✅ Checkers `validators.ts` (validation formulaire, permissions)
- ✅ Composant `ArticleCard.tsx` spécifique aux articles

---

**Cette architecture vous permet de créer des features autonomes, maintenables et scalables !** 🎉
