# 📋 Contrat API Backend - Système d'Évaluation de Manuscrits

**Date:** 2025-12-24
**Version:** v1.0
**Backend:** FastAPI + SQLModel + PostgreSQL
**Frontend:** Next.js 16 + React + TypeScript

---

## Table des Matières

1. [Vue d'ensemble](#vue-densemble)
2. [Authentification](#authentification)
3. [Annotations de Manuscrits](#annotations-de-manuscrits)
4. [Grille d'Évaluation](#grille-dévaluation)
5. [Format de Données](#format-de-données)
6. [Codes d'Erreur](#codes-derreur)

---

## Vue d'ensemble

Le système d'évaluation comprend deux composants principaux:

1. **Annotations PDF** - Commentaires inline sur le PDF (highlights)
2. **Grille d'Évaluation** - Formulaire structuré avec 8 critères

**URLs de base:**
- Développement: `http://localhost:8000`
- Production: `https://api.santaane.com` (à définir)

---

## Authentification

### Token JWT Bearer

Toutes les requêtes nécessitent un header Authorization:

```http
Authorization: Bearer YOUR_JWT_TOKEN
```

**Rôle requis:** `EVALUATOR`

**Vérifications de sécurité:**
- L'évaluateur doit être assigné au manuscrit
- L'assignation doit être acceptée (`status = 'accepted'`)
- Un évaluateur ne peut voir/modifier que ses propres données

---

## Annotations de Manuscrits

### 1. GET - Récupérer toutes les annotations

```http
GET /api/v1/manuscripts/{manuscript_id}/annotations
Authorization: Bearer {token}
```

**Paramètres:**
- `manuscript_id` (path, integer) - ID du manuscrit

**Réponse (200 OK):**
```json
[
  {
    "id": "123",
    "manuscriptId": 456,
    "evaluatorId": 789,
    "evaluatorName": "Dr. Jean Dupont",
    "annotationType": "text",
    "pageNumber": 1,
    "xPosition": 146.44,
    "yPosition": 402.74,
    "positionData": "{\"boundingRect\":{\"x1\":146.44,\"y1\":402.74,\"x2\":246.44,\"y2\":422.74,\"width\":100,\"height\":20,\"pageNumber\":1},\"rects\":[{\"x1\":146.44,\"y1\":402.74,\"x2\":246.44,\"y2\":422.74,\"pageNumber\":1}],\"pageNumber\":1}",
    "comment": "Excellent point à développer",
    "contentData": "{\"text\":\"Texte sélectionné dans le PDF\"}",
    "createdAt": "2025-12-24T15:30:00.000Z",
    "updatedAt": "2025-12-24T15:30:00.000Z"
  }
]
```

**Important:**
- Retourner **uniquement** les annotations de l'évaluateur authentifié
- Joindre `users.name` pour obtenir `evaluatorName`
- `positionData` et `contentData` sont des **strings JSON**

---

### 2. POST - Créer une annotation

```http
POST /api/v1/manuscripts/{manuscript_id}/annotations
Authorization: Bearer {token}
Content-Type: application/json
```

**Body:**
```json
{
  "annotationType": "text",
  "pageNumber": 1,
  "xPosition": 146.44,
  "yPosition": 402.74,
  "positionData": "{\"boundingRect\":{\"x1\":146.44,\"y1\":402.74,\"x2\":246.44,\"y2\":422.74,\"width\":100,\"height\":20,\"pageNumber\":1},\"rects\":[{\"x1\":146.44,\"y1\":402.74,\"x2\":246.44,\"y2\":422.74,\"pageNumber\":1}],\"pageNumber\":1}",
  "comment": "Excellent point à développer",
  "contentData": "{\"text\":\"Texte sélectionné dans le PDF\"}"
}
```

**Validation:**
- `annotationType`: enum ('text', 'area', 'freetext')
- `pageNumber`: integer >= 1
- `comment`: requis, max 5000 caractères
- `positionData`: requis, JSON valide stringifié
- `contentData`: optionnel, JSON valide stringifié

**Réponse (201 Created):**
```json
{
  "id": "123",
  "manuscriptId": 456,
  "evaluatorId": 789,
  "evaluatorName": "Dr. Jean Dupont",
  "annotationType": "text",
  "pageNumber": 1,
  "xPosition": 146.44,
  "yPosition": 402.74,
  "positionData": "{...}",
  "comment": "Excellent point à développer",
  "contentData": "{\"text\":\"Texte sélectionné dans le PDF\"}",
  "createdAt": "2025-12-24T15:30:00.000Z",
  "updatedAt": "2025-12-24T15:30:00.000Z"
}
```

**Important:**
- Générer un ID unique (string ou integer converti en string)
- Extraire `evaluator_id` du token JWT
- Ajouter `created_at` et `updated_at` automatiquement

---

### 3. PUT - Modifier une annotation

```http
PUT /api/v1/manuscripts/annotations/{annotation_id}
Authorization: Bearer {token}
Content-Type: application/json
```

**Body:**
```json
{
  "comment": "Commentaire modifié"
}
```

**Réponse (200 OK):**
```json
{
  "id": "123",
  "manuscriptId": 456,
  "evaluatorId": 789,
  "evaluatorName": "Dr. Jean Dupont",
  "annotationType": "text",
  "pageNumber": 1,
  "xPosition": 146.44,
  "yPosition": 402.74,
  "positionData": "{...}",
  "comment": "Commentaire modifié",
  "contentData": "{...}",
  "createdAt": "2025-12-24T15:30:00.000Z",
  "updatedAt": "2025-12-24T15:35:00.000Z"
}
```

**Important:**
- **Seul** le champ `comment` est modifiable
- Vérifier que `annotation.evaluator_id === user_id` (403 sinon)
- Mettre à jour `updated_at` automatiquement

---

### 4. DELETE - Supprimer une annotation

```http
DELETE /api/v1/manuscripts/annotations/{annotation_id}
Authorization: Bearer {token}
```

**Réponse (204 No Content):**
```
(Corps vide)
```

**Important:**
- Vérifier que `annotation.evaluator_id === user_id` (403 sinon)
- Suppression physique (hard delete)

---

## Grille d'Évaluation

### 1. GET - Récupérer la grille

```http
GET /api/v1/manuscripts/{manuscript_id}/evaluation-grid
Authorization: Bearer {token}
```

**Réponse (200 OK):**
```json
{
  "id": 123,
  "manuscriptId": 456,
  "evaluatorId": 789,
  "articleTitle": "L'Impact du Changement Climatique sur la Biodiversité",
  "evaluatorName": "Dr. Jean Dupont",
  "originalityOfIdeas": "L'article présente une approche novatrice...",
  "methodologyRigor": "La méthodologie employée est rigoureuse...",
  "theoreticalApproach": "Le cadre théorique s'appuie solidement...",
  "presentationClarity": "La structure du texte est claire...",
  "strengths": "- Originalité de l'approche\n- Robustesse des données...",
  "weaknesses": "- Certaines références manquantes\n- Figures peu lisibles...",
  "suggestions": "1. Ajouter une section sur les limites\n2. Améliorer les figures...",
  "recommendation": "accepted_with_validation",
  "createdAt": "2025-12-24T20:30:00.000Z",
  "updatedAt": "2025-12-24T20:35:00.000Z",
  "submittedAt": null
}
```

**Réponse (404 Not Found):**
```json
{
  "detail": "Grille d'évaluation non trouvée"
}
```

**Important:**
- Filtrer par `(manuscript_id, evaluator_id)` du token
- Joindre `manuscripts.title` → `articleTitle`
- Joindre `users.name` → `evaluatorName`

---

### 2. PUT - Sauvegarder la grille (UPSERT)

```http
PUT /api/v1/manuscripts/{manuscript_id}/evaluation-grid
Authorization: Bearer {token}
Content-Type: application/json
```

**Body:**
```json
{
  "originalityOfIdeas": "L'article présente une approche novatrice...",
  "methodologyRigor": "La méthodologie employée est rigoureuse...",
  "theoreticalApproach": "Le cadre théorique s'appuie solidement...",
  "presentationClarity": "La structure du texte est claire...",
  "strengths": "- Originalité de l'approche\n- Robustesse des données...",
  "weaknesses": "- Certaines références manquantes\n- Figures peu lisibles...",
  "suggestions": "1. Ajouter une section sur les limites\n2. Améliorer les figures...",
  "recommendation": "accepted_with_validation"
}
```

**Validation des champs:**

| Champ | Requis | Type | Longueur | Valeurs |
|-------|--------|------|----------|---------|
| originalityOfIdeas | ✅ | string | 1-5000 | Texte libre |
| methodologyRigor | ✅ | string | 1-5000 | Texte libre |
| theoreticalApproach | ✅ | string | 1-5000 | Texte libre |
| presentationClarity | ✅ | string | 1-5000 | Texte libre |
| strengths | ✅ | string | 1-5000 | Texte libre |
| weaknesses | ✅ | string | 1-5000 | Texte libre |
| suggestions | ⚪ | string | 0-5000 | Texte libre (optionnel) |
| recommendation | ✅ | enum | - | "accepted_with_validation", "resubmission_required", "rejected" |

**Réponse (200 OK ou 201 Created):**
```json
{
  "id": 123,
  "manuscriptId": 456,
  "evaluatorId": 789,
  "articleTitle": "L'Impact du Changement Climatique...",
  "evaluatorName": "Dr. Jean Dupont",
  "originalityOfIdeas": "L'article présente une approche novatrice...",
  "methodologyRigor": "La méthodologie employée est rigoureuse...",
  "theoreticalApproach": "Le cadre théorique s'appuie solidement...",
  "presentationClarity": "La structure du texte est claire...",
  "strengths": "- Originalité de l'approche\n- Robustesse des données...",
  "weaknesses": "- Certaines références manquantes\n- Figures peu lisibles...",
  "suggestions": "1. Ajouter une section sur les limites...",
  "recommendation": "accepted_with_validation",
  "createdAt": "2025-12-24T20:30:00.000Z",
  "updatedAt": "2025-12-24T20:40:00.000Z",
  "submittedAt": null
}
```

**Comportement UPSERT:**
1. Si grille n'existe pas → **CREATE** (201 Created)
2. Si grille existe ET `submitted_at IS NULL` → **UPDATE** (200 OK)
3. Si grille existe ET `submitted_at IS NOT NULL` → **403 Forbidden** (déjà soumise)

**Important:**
- Extraire `evaluator_id` du token JWT
- Mettre à jour `updated_at` automatiquement
- NE PAS modifier `submitted_at` (géré par l'endpoint de soumission)
- Contrainte unique: `(manuscript_id, evaluator_id)`

---

### 3. POST - Soumettre l'évaluation finale

```http
POST /api/v1/manuscripts/{manuscript_id}/submit-evaluation
Authorization: Bearer {token}
```

**Pas de corps de requête** - La grille doit déjà exister.

**Réponse (200 OK):**
```json
{
  "message": "Évaluation soumise avec succès",
  "manuscriptId": 456,
  "evaluatorId": 789,
  "submittedAt": "2025-12-24T22:30:00.000Z",
  "annotationsCount": 15,
  "evaluationGrid": {
    "id": 123,
    "originalityOfIdeas": "L'article présente une approche novatrice...",
    "methodologyRigor": "La méthodologie employée est rigoureuse...",
    "theoreticalApproach": "Le cadre théorique s'appuie solidement...",
    "presentationClarity": "La structure du texte est claire...",
    "strengths": "- Originalité de l'approche...",
    "weaknesses": "- Certaines références manquantes...",
    "suggestions": "1. Ajouter une section sur les limites...",
    "recommendation": "accepted_with_validation",
    "submittedAt": "2025-12-24T22:30:00.000Z"
  }
}
```

**Réponse (400 Bad Request):**
```json
{
  "detail": "La grille d'évaluation doit être complétée avant soumission"
}
```

**Logique de soumission:**
1. Vérifier que la grille existe (404 si non)
2. Vérifier que tous les champs requis sont remplis (400 si non)
3. **Marquer `submitted_at = NOW()`**
4. Compter le nombre d'annotations (`annotationsCount`)
5. Optionnel: Changer le statut du manuscrit (ex: "EVALUATED")
6. Optionnel: Envoyer notification au comité de rédaction
7. Retourner résumé complet

**Important:**
- Une fois soumise, la grille est **verrouillée** (non modifiable)
- Toute tentative de PUT après soumission → 403 Forbidden

---

## Format de Données

### Mapping Frontend ↔ Backend

#### Annotations

**Frontend (camelCase) → Backend (snake_case):**

```typescript
// Frontend envoie (camelCase)
{
  annotationType: "text",
  pageNumber: 1,
  xPosition: 146.44,
  yPosition: 402.74,
  positionData: "{...}",
  comment: "...",
  contentData: "{...}"
}

// Backend stocke (snake_case)
{
  annotation_type: "text",
  page_number: 1,
  x_position: 146.44,
  y_position: 402.74,
  position_data: "{...}",
  comment: "...",
  content_data: "{...}"
}

// Backend retourne (camelCase via alias)
{
  annotationType: "text",
  pageNumber: 1,
  xPosition: 146.44,
  yPosition: 402.74,
  positionData: "{...}",
  comment: "...",
  contentData: "{...}"
}
```

#### Grille d'Évaluation

**Frontend (camelCase) → Backend (snake_case):**

```typescript
// Frontend envoie
{
  originalityOfIdeas: "...",
  methodologyRigor: "...",
  theoreticalApproach: "...",
  presentationClarity: "...",
  strengths: "...",
  weaknesses: "...",
  suggestions: "...",
  recommendation: "accepted_with_validation"
}

// Backend stocke
{
  originality_of_ideas: "...",
  methodology_rigor: "...",
  theoretical_approach: "...",
  presentation_clarity: "...",
  strengths: "...",
  weaknesses: "...",
  suggestions: "...",
  recommendation: "accepted_with_validation"
}

// Backend retourne (camelCase via alias)
{
  originalityOfIdeas: "...",
  methodologyRigor: "...",
  theoreticalApproach: "...",
  presentationClarity: "...",
  strengths: "...",
  weaknesses: "...",
  suggestions: "...",
  recommendation: "accepted_with_validation"
}
```

### Enum: recommendation

| Valeur | Frontend | Backend | Signification |
|--------|----------|---------|---------------|
| 1 | `accepted_with_validation` | `accepted_with_validation` | Accepté sous réserve de validation |
| 2 | `resubmission_required` | `resubmission_required` | Nouvelle version requise |
| 3 | `rejected` | `rejected` | Rejeté |

---

## Codes d'Erreur

### 200 OK
✅ Requête réussie - Mise à jour effectuée

### 201 Created
✅ Ressource créée avec succès

### 204 No Content
✅ Suppression réussie

### 400 Bad Request
❌ Grille incomplète lors de la soumission
```json
{
  "detail": "La grille d'évaluation doit être complétée avant soumission"
}
```

### 401 Unauthorized
❌ Token JWT manquant ou invalide
```json
{
  "detail": "Non authentifié"
}
```

### 403 Forbidden
❌ Évaluateur non assigné au manuscrit
```json
{
  "detail": "Vous n'êtes pas assigné à ce manuscrit"
}
```

❌ Assignation non acceptée
```json
{
  "detail": "Vous devez accepter l'assignation avant de pouvoir évaluer"
}
```

❌ Grille déjà soumise
```json
{
  "detail": "La grille a déjà été soumise et ne peut plus être modifiée"
}
```

❌ Annotation appartient à un autre évaluateur
```json
{
  "detail": "Vous n'êtes pas autorisé à modifier cette annotation"
}
```

### 404 Not Found
❌ Ressource non trouvée
```json
{
  "detail": "Grille d'évaluation non trouvée"
}
```

```json
{
  "detail": "Annotation non trouvée"
}
```

### 422 Unprocessable Entity
❌ Erreur de validation Pydantic
```json
{
  "detail": [
    {
      "type": "literal_error",
      "loc": ["body", "recommendation"],
      "msg": "Input should be 'accepted_with_validation', 'resubmission_required' or 'rejected'"
    }
  ]
}
```

### 500 Internal Server Error
❌ Erreur serveur
```json
{
  "detail": "Erreur serveur interne"
}
```

---

## Workflow Frontend Complet

### 1. Chargement Initial

```typescript
// 1. Charger les annotations
const annotations = await fetch(`/api/manuscripts/${manuscriptId}/annotations`);

// 2. Charger la grille (peut retourner 404 si première fois)
try {
  const grid = await fetch(`/api/manuscripts/${manuscriptId}/evaluation-grid`);
} catch (error) {
  if (error.status === 404) {
    // Première évaluation, formulaire vide
  }
}
```

### 2. Ajout d'annotation

```typescript
// Optimistic update (afficher immédiatement)
setAnnotations([...annotations, newAnnotation]);

// Appel API
const created = await fetch(`/api/manuscripts/${manuscriptId}/annotations`, {
  method: 'POST',
  body: JSON.stringify(annotationData)
});

// Remplacer l'ID temporaire par l'ID backend
setAnnotations(prev => prev.map(a =>
  a.id === tempId ? { ...a, id: created.id } : a
));
```

### 3. Sauvegarde de la grille

```typescript
// Auto-save toutes les 30 secondes
const debouncedSave = debounce(async (formData) => {
  await fetch(`/api/manuscripts/${manuscriptId}/evaluation-grid`, {
    method: 'PUT',
    body: JSON.stringify(formData)
  });
}, 30000);
```

### 4. Soumission finale

```typescript
const submit = async () => {
  // 1. Sauvegarder la grille une dernière fois
  await fetch(`/api/manuscripts/${manuscriptId}/evaluation-grid`, {
    method: 'PUT',
    body: JSON.stringify(formData)
  });

  // 2. Soumettre l'évaluation
  const result = await fetch(`/api/manuscripts/${manuscriptId}/submit-evaluation`, {
    method: 'POST'
  });

  // 3. Rediriger
  router.push('/dashboard/evaluator/manuscripts');
};
```

---

## Checklist d'Implémentation Backend

### Modèles (SQLModel)
- [ ] Table `manuscript_annotations` avec tous les champs
- [ ] Table `manuscript_evaluation_grids` avec tous les champs
- [ ] Contrainte unique `(manuscript_id, evaluator_id)` sur grilles
- [ ] Index sur `manuscript_id` et `evaluator_id`
- [ ] Trigger `updated_at` automatique

### Endpoints
- [ ] `GET /api/v1/manuscripts/{id}/annotations`
- [ ] `POST /api/v1/manuscripts/{id}/annotations`
- [ ] `PUT /api/v1/manuscripts/annotations/{id}`
- [ ] `DELETE /api/v1/manuscripts/annotations/{id}`
- [ ] `GET /api/v1/manuscripts/{id}/evaluation-grid`
- [ ] `PUT /api/v1/manuscripts/{id}/evaluation-grid` (UPSERT)
- [ ] `POST /api/v1/manuscripts/{id}/submit-evaluation`

### Sécurité
- [ ] Vérification JWT sur toutes les routes
- [ ] Vérification assignation évaluateur ↔ manuscrit
- [ ] Vérification propriété des annotations (evaluator_id)
- [ ] Blocage modification grille si `submitted_at IS NOT NULL`

### Validation
- [ ] Validation Pydantic complète sur tous les champs
- [ ] Validation enum `recommendation`
- [ ] Validation enum `annotationType`
- [ ] Validation longueurs max (5000 caractères)
- [ ] Validation JSON pour `positionData` et `contentData`

### Réponses
- [ ] Alias camelCase pour tous les champs (ex: `manuscript_id` → `manuscriptId`)
- [ ] Jointures pour `evaluatorName` et `articleTitle`
- [ ] Format ISO 8601 pour dates (`createdAt`, `updatedAt`, `submittedAt`)
- [ ] Codes HTTP corrects (200, 201, 204, 400, 403, 404, 422, 500)

---

## Support

**Documentation:**
- Ce fichier: `API_CONTRACT.md`
- Plan frontend: `/Users/hamaba/.claude/plans/clever-launching-peacock.md`

**Commandes utiles:**
```bash
# Logs backend
./santaane logs

# Migration actuelle
./santaane migration-current

# Rollback si problème
./santaane rollback
```

**Contact:**
- Backend: Vous
- Frontend: Claude Code (moi!)

---

**Fin du contrat API** 🎉

Ce document est la source de vérité unique pour l'implémentation backend.
Le frontend est 100% prêt et attend ces endpoints! 🚀
