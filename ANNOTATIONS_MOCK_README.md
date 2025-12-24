# Système d'Annotations Mock - Guide d'Utilisation

## Vue d'ensemble

Le système d'annotations utilise actuellement un **mock service** qui stocke les données en **localStorage** pour permettre le développement frontend sans dépendre du backend.

## Architecture Actuelle

```
Frontend (React)
    ↓
useAnnotations hook
    ↓
mockAnnotationService (localStorage)
    ↓
localStorage du navigateur
```

## Fichiers Importants

### Service Mock
- **`src/services/mockAnnotationService.ts`** - Service de persistance mock avec localStorage

### Hook Principal
- **`src/app/(dashboard)/dashboard/evaluator/manuscripts/[id]/evaluate/hooks/useAnnotations.ts`** - Logique de gestion des annotations

### Types
- **`src/types/evaluator.ts`** - Types TypeScript pour annotations

### Composants UI
- **`src/app/(dashboard)/dashboard/evaluator/manuscripts/[id]/evaluate/components/PdfAnnotator.tsx`** - Composant principal
- **`src/app/(dashboard)/dashboard/evaluator/manuscripts/[id]/evaluate/components/CommentsSidebar.tsx`** - Sidebar des commentaires
- **`src/app/(dashboard)/dashboard/evaluator/manuscripts/[id]/evaluate/components/SelectionTip.tsx`** - Popup pour ajouter commentaire
- **`src/app/(dashboard)/dashboard/evaluator/manuscripts/[id]/evaluate/components/HighlightTooltip.tsx`** - Tooltip au survol

## Comment Utiliser

### 1. Démarrer le Serveur de Développement

```bash
pnpm dev
```

### 2. Naviguer vers une Page d'Évaluation

```
http://localhost:3000/dashboard/evaluator/manuscripts/[id]/evaluate
```

Remplacer `[id]` par l'ID d'un manuscrit existant.

### 3. Créer une Annotation

**Annotation de texte:**
1. Sélectionner du texte dans le PDF
2. Un popup jaune apparaît
3. Taper votre commentaire
4. Cliquer "Sauvegarder"

**Annotation de zone:**
1. Maintenir Alt (ou Option sur Mac)
2. Cliquer-glisser pour dessiner une zone
3. Entrer votre commentaire
4. Cliquer "Sauvegarder"

### 4. Voir les Annotations

- Les annotations apparaissent en jaune sur le PDF
- La sidebar de droite liste toutes les annotations
- Cliquer sur une annotation dans la sidebar pour scroller vers elle

### 5. Modifier une Annotation

*(Non implémenté dans l'UI actuellement, mais la fonction existe dans le hook)*

```typescript
updateAnnotation(annotationId, "Nouveau commentaire")
```

### 6. Supprimer une Annotation

1. Cliquer sur l'icône de corbeille dans la sidebar
2. Confirmer la suppression dans le dialog

## Persistance des Données

### Stockage

Les annotations sont stockées dans **localStorage** avec la clé:
```
annotations_manuscript_${manuscriptId}
```

### Vérifier les Données Stockées

Ouvrir la console du navigateur (F12) et taper:

```javascript
// Voir toutes les annotations du manuscrit 123
JSON.parse(localStorage.getItem('annotations_manuscript_123'))

// Voir toutes les clés d'annotations
Object.keys(localStorage).filter(k => k.startsWith('annotations_manuscript_'))

// Supprimer toutes les annotations du manuscrit 123
localStorage.removeItem('annotations_manuscript_123')

// Tout effacer
localStorage.clear()
```

### Persistance Entre Rafraîchissements

✅ **Les annotations persistent** quand vous rafraîchissez la page (F5)
✅ **Les annotations persistent** entre les sessions de navigation
❌ **Les annotations sont perdues** si vous nettoyez le cache du navigateur

## Fonctionnalités Mock

### ✅ Implémenté

- [x] Créer annotation
- [x] Lire annotations
- [x] Modifier annotation (API prête, UI à compléter)
- [x] Supprimer annotation
- [x] Persistance localStorage
- [x] Simulation délai réseau (200-500ms)
- [x] Simulation erreurs (1% du temps)
- [x] Optimistic updates
- [x] Rollback en cas d'erreur
- [x] Notifications succès/erreur
- [x] Groupement par page
- [x] Recherche dans commentaires
- [x] Scroll vers annotation

### ⚠️ Limitations du Mock

- **Pas de vérification de permissions** - Tout le monde peut modifier/supprimer
- **Pas de synchronisation multi-utilisateurs** - Données locales uniquement
- **Pas de backup** - Données perdues si localStorage nettoyé
- **Un seul évaluateur** - Toutes les annotations ont le même `evaluatorName: "Utilisateur Test"`
- **IDs temporaires** - Format `mock_${timestamp}_${random}`

## Simulation Réseau

Le mock service simule un vrai backend avec:

### Délai Réseau
Chaque requête prend **200-500ms** aléatoire pour simuler la latence réseau.

### Erreurs Aléatoires
**1% des requêtes échouent** avec l'erreur "Erreur réseau simulée" pour tester la gestion d'erreurs.

### Désactiver les Simulations

Éditer `src/services/mockAnnotationService.ts`:

```typescript
// Désactiver les délais
const simulateNetworkDelay = (): Promise<void> => {
  return Promise.resolve(); // Pas de délai
};

// Désactiver les erreurs
const simulateNetworkError = (): void => {
  // Commentez le contenu de la fonction
};
```

## Debug

### Activer les Logs

Ouvrir la console du navigateur (F12). Les logs apparaissent automatiquement:

```
Erreur chargement annotations: [Error object]
Erreur création annotation: [Error object]
Erreur modification annotation: [Error object]
Erreur suppression annotation: [Error object]
```

### Tester les Rollbacks

Pour tester que les optimistic updates s'annulent correctement en cas d'erreur:

1. Éditer `mockAnnotationService.ts`
2. Augmenter le taux d'erreur à 50%:

```typescript
const simulateNetworkError = (): void => {
  if (Math.random() < 0.5) { // 50% erreur
    throw new Error('Erreur réseau simulée');
  }
};
```

3. Créer/modifier/supprimer des annotations
4. Observer que l'UI se rollback quand l'erreur survient

## Format des Données

### Exemple d'Annotation Stockée

```json
{
  "id": "mock_1703426400000_abc123",
  "manuscriptId": 456,
  "evaluatorId": 999,
  "evaluatorName": "Utilisateur Test",
  "annotationType": "text",
  "pageNumber": 1,
  "xPosition": 146.44,
  "yPosition": 402.74,
  "positionData": "{\"boundingRect\":{\"x1\":146.44,\"y1\":402.74,\"x2\":246.44,\"y2\":422.74,\"width\":100,\"height\":20,\"pageNumber\":1},\"rects\":[{\"x1\":146.44,\"y1\":402.74,\"x2\":246.44,\"y2\":422.74,\"pageNumber\":1}],\"pageNumber\":1}",
  "comment": "Ceci est un commentaire",
  "contentData": "{\"text\":\"Texte sélectionné dans le PDF...\"}",
  "createdAt": "2025-12-24T15:30:00.000Z",
  "updatedAt": "2025-12-24T15:30:00.000Z"
}
```

### positionData (Décodé)

```json
{
  "boundingRect": {
    "x1": 146.44,
    "y1": 402.74,
    "x2": 246.44,
    "y2": 422.74,
    "width": 100,
    "height": 20,
    "pageNumber": 1
  },
  "rects": [
    {
      "x1": 146.44,
      "y1": 402.74,
      "x2": 246.44,
      "y2": 422.74,
      "pageNumber": 1
    }
  ],
  "pageNumber": 1
}
```

### contentData (Décodé)

```json
{
  "text": "Texte sélectionné dans le PDF..."
}
```

## Migration vers le Backend Réel

Une fois le backend implémenté (voir `BACKEND_API_SCHEMA.md`):

### Étape 1: Créer le Vrai Service

Créer `src/services/annotationService.ts`:

```typescript
import { apiClient } from '@/lib/api/client';
import type {
  BackendAnnotation,
  CreateAnnotationRequest,
  UpdateAnnotationRequest
} from '@/types/evaluator';

export const annotationService = {
  async getAnnotations(manuscriptId: number): Promise<BackendAnnotation[]> {
    const { data } = await apiClient.get(`/manuscripts/${manuscriptId}/annotations`);
    return data;
  },

  async createAnnotation(
    manuscriptId: number,
    annotation: CreateAnnotationRequest
  ): Promise<BackendAnnotation> {
    const { data } = await apiClient.post(
      `/manuscripts/${manuscriptId}/annotations`,
      annotation
    );
    return data;
  },

  async updateAnnotation(
    annotationId: string,
    update: UpdateAnnotationRequest
  ): Promise<BackendAnnotation> {
    const { data } = await apiClient.put(
      `/manuscripts/annotations/${annotationId}`,
      update
    );
    return data;
  },

  async deleteAnnotation(annotationId: string): Promise<void> {
    await apiClient.delete(`/manuscripts/annotations/${annotationId}`);
  }
};
```

### Étape 2: Mettre à Jour le Hook

Éditer `src/app/(dashboard)/dashboard/evaluator/manuscripts/[id]/evaluate/hooks/useAnnotations.ts`:

```typescript
// Ligne 4 - Remplacer:
- import { mockAnnotationService } from '@/services/mockAnnotationService';
+ import { annotationService } from '@/services/annotationService';

// Puis remplacer tous les appels:
- mockAnnotationService.getAnnotations(...)
+ annotationService.getAnnotations(...)

- mockAnnotationService.createAnnotation(...)
+ annotationService.createAnnotation(...)

- mockAnnotationService.updateAnnotation(...)
+ annotationService.updateAnnotation(...)

- mockAnnotationService.deleteAnnotation(...)
+ annotationService.deleteAnnotation(...)
```

### Étape 3: Tester

1. Supprimer les données localStorage: `localStorage.clear()`
2. Redémarrer le serveur: `pnpm dev`
3. Tester toutes les fonctionnalités
4. Vérifier que les données persistent côté backend

**C'EST TOUT !** 🎉

## Dépannage

### Problème: Annotations ne s'affichent pas

**Solution:**
1. Vérifier la console pour erreurs
2. Vérifier localStorage: `localStorage.getItem('annotations_manuscript_XXX')`
3. Vérifier que le manuscriptId est correct
4. Rafraîchir la page (F5)

### Problème: Annotations ne persistent pas

**Solution:**
1. Vérifier que localStorage n'est pas désactivé
2. Vérifier que vous n'êtes pas en navigation privée
3. Vérifier le quota localStorage (limite ~5-10MB selon navigateur)

### Problème: Erreur "Annotation non trouvée"

**Solution:**
1. L'ID de l'annotation n'existe pas en localStorage
2. Supprimer localStorage et recréer: `localStorage.clear()`

### Problème: Trop de délai/erreurs

**Solution:**
Réduire les simulations dans `mockAnnotationService.ts` (voir section "Désactiver les Simulations")

## Commandes Utiles

### Console Navigateur (F12)

```javascript
// Voir toutes les annotations
Object.keys(localStorage)
  .filter(k => k.startsWith('annotations_manuscript_'))
  .forEach(k => console.log(k, JSON.parse(localStorage.getItem(k))));

// Compter les annotations par manuscrit
Object.keys(localStorage)
  .filter(k => k.startsWith('annotations_manuscript_'))
  .forEach(k => {
    const count = JSON.parse(localStorage.getItem(k)).length;
    console.log(`${k}: ${count} annotations`);
  });

// Exporter toutes les annotations
const exports = {};
Object.keys(localStorage)
  .filter(k => k.startsWith('annotations_manuscript_'))
  .forEach(k => {
    exports[k] = JSON.parse(localStorage.getItem(k));
  });
console.log(JSON.stringify(exports, null, 2));

// Importer des annotations
const data = { /* coller ici */ };
Object.keys(data).forEach(k => {
  localStorage.setItem(k, JSON.stringify(data[k]));
});
```

## Tests Manuels Recommandés

### Checklist Complète

- [ ] Créer annotation texte → Apparaît immédiatement
- [ ] Créer annotation area (Alt+drag) → Apparaît immédiatement
- [ ] Sidebar affiche toutes les annotations
- [ ] Recherche dans sidebar fonctionne
- [ ] Groupement par page fonctionne
- [ ] Clic sur annotation dans sidebar → Scroll vers highlight
- [ ] Hover sur highlight → Tooltip jaune s'affiche
- [ ] Supprimer annotation → Disparaît immédiatement
- [ ] Dialog de confirmation s'affiche
- [ ] Rafraîchir page (F5) → Annotations persistent
- [ ] Fermer/rouvrir navigateur → Annotations persistent
- [ ] Créer 10+ annotations → Sidebar scrollable
- [ ] Tester sur différentes pages du PDF
- [ ] Vérifier localStorage après chaque action
- [ ] Tester rollback: Augmenter taux erreur à 50% et vérifier que l'UI revient en arrière

## Ressources

- **Documentation react-pdf-highlighter-plus**: [GitHub](https://github.com/your-repo/react-pdf-highlighter-plus)
- **Schéma API Backend**: Voir `BACKEND_API_SCHEMA.md`
- **Types TypeScript**: `src/types/evaluator.ts`

## Contact

Pour toute question ou bug, créer une issue sur le repo GitHub.
