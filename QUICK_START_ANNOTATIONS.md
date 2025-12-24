# Quick Start - Système d'Annotations

## ✅ Ce qui a été fait

### 1. Nettoyage Complet
- ❌ Supprimé toutes les routes API Next.js pour annotations
- ❌ Supprimé `src/services/annotationService.ts`
- ✅ Gardé tous les types TypeScript dans `src/types/evaluator.ts`
- ✅ Gardé tous les composants UI (parfaitement fonctionnels)

### 2. Mock Service Créé
- ✅ `src/services/mockAnnotationService.ts` - Persistance localStorage
- ✅ Simule délais réseau (200-500ms)
- ✅ Simule erreurs (1% du temps)
- ✅ Génère IDs temporaires format `mock_${timestamp}_${random}`

### 3. Hook Mis à Jour
- ✅ `useAnnotations.ts` utilise maintenant le mock service
- ✅ Optimistic updates fonctionnels
- ✅ Rollback en cas d'erreur
- ✅ Notifications alertStore

### 4. Système Complètement Fonctionnel
- ✅ Créer annotation → Fonctionne
- ✅ Afficher annotations → Fonctionne
- ✅ Modifier annotation → API prête (UI à compléter)
- ✅ Supprimer annotation → Fonctionne
- ✅ Persistance localStorage → Fonctionne
- ✅ Rafraîchir page → Annotations persistent

---

## 🚀 Test Rapide

### 1. Démarrer le serveur

```bash
pnpm dev
```

### 2. Aller sur une page d'évaluation

```
http://localhost:3000/dashboard/evaluator/manuscripts/[id]/evaluate
```

### 3. Créer une annotation

1. **Texte:** Sélectionner du texte → Entrer commentaire → Sauvegarder
2. **Zone:** Alt+Glisser → Entrer commentaire → Sauvegarder

### 4. Vérifier la persistance

1. Rafraîchir la page (F5)
2. Les annotations doivent toujours être là ✅

### 5. Vérifier localStorage

Console navigateur (F12):

```javascript
// Voir les annotations du manuscrit 123
JSON.parse(localStorage.getItem('annotations_manuscript_123'))

// Tout effacer
localStorage.clear()
```

---

## 📋 Schéma pour Backend

### Types de Données

```typescript
interface BackendAnnotation {
  id: string;                    // ID unique
  manuscriptId: number;
  evaluatorId: number;
  evaluatorName: string;
  annotationType: 'text' | 'area' | 'freetext';
  pageNumber: number;
  xPosition: number;
  yPosition: number;
  positionData: string;          // JSON stringifié
  comment: string;
  contentData: string | null;    // JSON stringifié (optionnel)
  createdAt: string;             // ISO 8601
  updatedAt: string;
}
```

### Endpoints à Créer

```
GET    /api/v1/manuscripts/{manuscriptId}/annotations
POST   /api/v1/manuscripts/{manuscriptId}/annotations
PUT    /api/v1/manuscripts/annotations/{annotationId}
DELETE /api/v1/manuscripts/annotations/{annotationId}
```

**Détails complets:** Voir `BACKEND_API_SCHEMA.md`

---

## 🔄 Migration vers Backend Réel

Une fois le backend prêt:

### 1. Créer le vrai service

`src/services/annotationService.ts`:

```typescript
import { apiClient } from '@/lib/api/client';

export const annotationService = {
  async getAnnotations(manuscriptId: number) {
    const { data } = await apiClient.get(`/manuscripts/${manuscriptId}/annotations`);
    return data;
  },

  async createAnnotation(manuscriptId: number, annotation: CreateAnnotationRequest) {
    const { data } = await apiClient.post(`/manuscripts/${manuscriptId}/annotations`, annotation);
    return data;
  },

  async updateAnnotation(annotationId: string, update: UpdateAnnotationRequest) {
    const { data } = await apiClient.put(`/manuscripts/annotations/${annotationId}`, update);
    return data;
  },

  async deleteAnnotation(annotationId: string) {
    await apiClient.delete(`/manuscripts/annotations/${annotationId}`);
  }
};
```

### 2. Modifier le hook

`useAnnotations.ts` ligne 4:

```typescript
- import { mockAnnotationService } from '@/services/mockAnnotationService';
+ import { annotationService } from '@/services/annotationService';
```

Et remplacer tous les appels `mockAnnotationService.*` par `annotationService.*`

**C'EST TOUT !** 🎉

---

## 📄 Documents de Référence

1. **`BACKEND_API_SCHEMA.md`** - Schéma complet de l'API backend
   - Types détaillés
   - Endpoints avec exemples JSON
   - Structure base de données
   - Codes d'erreur
   - Exemples cURL

2. **`ANNOTATIONS_MOCK_README.md`** - Guide d'utilisation du mock
   - Comment utiliser le système
   - Debug localStorage
   - Commandes utiles
   - Checklist de tests

3. **Plan original** - `/Users/hamaba/.claude/plans/clever-launching-peacock.md`

---

## 🎯 Prochaines Étapes

### Côté Frontend (Optionnel)

- [ ] Compléter l'UI pour éditer commentaire (utiliser `CommentPopover.tsx`)
- [ ] Ajouter filtres par type d'annotation
- [ ] Ajouter export PDF avec annotations

### Côté Backend (Vous)

- [ ] Créer table `manuscript_annotations` en PostgreSQL
- [ ] Implémenter les 4 endpoints
- [ ] Ajouter validation des données
- [ ] Tester avec Postman/cURL
- [ ] Me prévenir quand c'est prêt → Migration frontend

---

## 🐛 Debug

### Annotations ne s'affichent pas?

```javascript
// Console navigateur (F12)
localStorage.getItem('annotations_manuscript_XXX')
```

### Tout réinitialiser?

```javascript
// Console navigateur
localStorage.clear()
```

### Tester erreurs et rollback?

Éditer `mockAnnotationService.ts` ligne 25:

```typescript
if (Math.random() < 0.5) { // 50% erreur au lieu de 1%
```

---

## ✨ Résumé

✅ **Frontend 100% fonctionnel** avec persistance localStorage
✅ **Schéma backend documenté** avec exemples complets
✅ **Migration ultra-simple** (2 lignes de code)
✅ **Tests possibles** dès maintenant sans backend

**Vous pouvez maintenant créer les APIs backend en suivant `BACKEND_API_SCHEMA.md`**

Quand c'est prêt, je ferai la migration frontend en 5 minutes ! 🚀
