# Schéma API Backend pour Annotations

## Vue d'ensemble

Ce document définit le contrat exact entre le frontend et le backend pour le système d'annotations de manuscrits.

---

## Types de Données

### BackendAnnotation

```typescript
interface BackendAnnotation {
  id: string;                    // ID unique (string pour flexibilité)
  manuscriptId: number;          // ID du manuscrit
  evaluatorId: number;           // ID de l'évaluateur
  evaluatorName: string;         // Nom complet de l'évaluateur

  // Type et position
  annotationType: 'text' | 'area' | 'freetext';
  pageNumber: number;            // Page (1-indexed)
  xPosition: number;             // Coord X (top-left du bounding box)
  yPosition: number;             // Coord Y (top-left du bounding box)

  // Données JSON sérialisées
  positionData: string;          // JSON: { boundingRect, rects, pageNumber }
  comment: string;               // Texte du commentaire
  contentData: string | null;    // JSON: { text?, image? } (optionnel)

  // Timestamps
  createdAt: string;             // ISO 8601 (ex: "2025-12-24T15:30:00.000Z")
  updatedAt: string;             // ISO 8601
}
```

### CreateAnnotationRequest

```typescript
interface CreateAnnotationRequest {
  annotationType: 'text' | 'area' | 'freetext';
  pageNumber: number;
  xPosition: number;
  yPosition: number;
  positionData: string;          // JSON stringifié
  comment: string;
  contentData?: string;          // JSON stringifié (optionnel)
}
```

### UpdateAnnotationRequest

```typescript
interface UpdateAnnotationRequest {
  comment: string;               // Seul champ modifiable
}
```

---

## Endpoints API

### 1. GET - Récupérer toutes les annotations d'un manuscrit

```http
GET /api/v1/manuscripts/{manuscriptId}/annotations
Authorization: Bearer {token}
```

**Paramètres URL:**
- `manuscriptId` (number): ID du manuscrit

**Réponse (200 OK):**
```json
[
  {
    "id": "123",
    "manuscriptId": 456,
    "evaluatorId": 789,
    "evaluatorName": "Jean Dupont",
    "annotationType": "text",
    "pageNumber": 1,
    "xPosition": 146.44,
    "yPosition": 402.74,
    "positionData": "{\"boundingRect\":{\"x1\":146.44,\"y1\":402.74,\"x2\":246.44,\"y2\":422.74,\"width\":100,\"height\":20,\"pageNumber\":1},\"rects\":[{\"x1\":146.44,\"y1\":402.74,\"x2\":246.44,\"y2\":422.74,\"pageNumber\":1}],\"pageNumber\":1}",
    "comment": "Ceci est un commentaire",
    "contentData": "{\"text\":\"Texte sélectionné dans le PDF...\"}",
    "createdAt": "2025-12-24T15:30:00.000Z",
    "updatedAt": "2025-12-24T15:30:00.000Z"
  },
  {
    "id": "124",
    "manuscriptId": 456,
    "evaluatorId": 789,
    "evaluatorName": "Jean Dupont",
    "annotationType": "area",
    "pageNumber": 2,
    "xPosition": 200.5,
    "yPosition": 500.0,
    "positionData": "{\"boundingRect\":{\"x1\":200.5,\"y1\":500.0,\"x2\":400.5,\"y2\":600.0,\"width\":200,\"height\":100,\"pageNumber\":2},\"rects\":[],\"pageNumber\":2}",
    "comment": "Zone à revoir",
    "contentData": null,
    "createdAt": "2025-12-24T15:35:00.000Z",
    "updatedAt": "2025-12-24T15:35:00.000Z"
  }
]
```

**Codes d'erreur:**
- `401 Unauthorized`: Token invalide ou manquant
- `404 Not Found`: Manuscrit inexistant
- `500 Internal Server Error`: Erreur serveur

---

### 2. POST - Créer une nouvelle annotation

```http
POST /api/v1/manuscripts/{manuscriptId}/annotations
Authorization: Bearer {token}
Content-Type: application/json
```

**Paramètres URL:**
- `manuscriptId` (number): ID du manuscrit

**Body:**
```json
{
  "annotationType": "text",
  "pageNumber": 1,
  "xPosition": 146.44,
  "yPosition": 402.74,
  "positionData": "{\"boundingRect\":{\"x1\":146.44,\"y1\":402.74,\"x2\":246.44,\"y2\":422.74,\"width\":100,\"height\":20,\"pageNumber\":1},\"rects\":[{\"x1\":146.44,\"y1\":402.74,\"x2\":246.44,\"y2\":422.74,\"pageNumber\":1}],\"pageNumber\":1}",
  "comment": "Ceci est un commentaire",
  "contentData": "{\"text\":\"Texte sélectionné...\"}"
}
```

**Réponse (201 Created):**
```json
{
  "id": "123",
  "manuscriptId": 456,
  "evaluatorId": 789,
  "evaluatorName": "Jean Dupont",
  "annotationType": "text",
  "pageNumber": 1,
  "xPosition": 146.44,
  "yPosition": 402.74,
  "positionData": "{\"boundingRect\":{\"x1\":146.44,\"y1\":402.74,\"x2\":246.44,\"y2\":422.74,\"width\":100,\"height\":20,\"pageNumber\":1},\"rects\":[{\"x1\":146.44,\"y1\":402.74,\"x2\":246.44,\"y2\":422.74,\"pageNumber\":1}],\"pageNumber\":1}",
  "comment": "Ceci est un commentaire",
  "contentData": "{\"text\":\"Texte sélectionné...\"}",
  "createdAt": "2025-12-24T15:30:00.000Z",
  "updatedAt": "2025-12-24T15:30:00.000Z"
}
```

**Notes importantes:**
- Le backend DOIT retourner l'objet complet avec l'`id` généré
- Le backend récupère `evaluatorId` depuis le token JWT
- Le backend ajoute automatiquement `evaluatorName`, `createdAt`, `updatedAt`

**Codes d'erreur:**
- `400 Bad Request`: Données invalides
- `401 Unauthorized`: Token invalide ou manquant
- `404 Not Found`: Manuscrit inexistant
- `422 Unprocessable Entity`: Validation échouée
- `500 Internal Server Error`: Erreur serveur

---

### 3. PUT - Modifier une annotation

```http
PUT /api/v1/manuscripts/annotations/{annotationId}
Authorization: Bearer {token}
Content-Type: application/json
```

**Paramètres URL:**
- `annotationId` (string): ID de l'annotation

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
  "evaluatorName": "Jean Dupont",
  "annotationType": "text",
  "pageNumber": 1,
  "xPosition": 146.44,
  "yPosition": 402.74,
  "positionData": "{\"boundingRect\":{\"x1\":146.44,\"y1\":402.74,\"x2\":246.44,\"y2\":422.74,\"width\":100,\"height\":20,\"pageNumber\":1},\"rects\":[{\"x1\":146.44,\"y1\":402.74,\"x2\":246.44,\"y2\":422.74,\"pageNumber\":1}],\"pageNumber\":1}",
  "comment": "Commentaire modifié",
  "contentData": "{\"text\":\"Texte sélectionné...\"}",
  "createdAt": "2025-12-24T15:30:00.000Z",
  "updatedAt": "2025-12-24T15:40:00.000Z"
}
```

**Règles de sécurité:**
- Vérifier que `evaluatorId` de l'annotation === `userId` du token
- Retourner 403 Forbidden si pas le propriétaire
- Seul le champ `comment` peut être modifié

**Codes d'erreur:**
- `400 Bad Request`: Données invalides
- `401 Unauthorized`: Token invalide ou manquant
- `403 Forbidden`: Pas le propriétaire de l'annotation
- `404 Not Found`: Annotation inexistante
- `422 Unprocessable Entity`: Validation échouée
- `500 Internal Server Error`: Erreur serveur

---

### 4. DELETE - Supprimer une annotation

```http
DELETE /api/v1/manuscripts/annotations/{annotationId}
Authorization: Bearer {token}
```

**Paramètres URL:**
- `annotationId` (string): ID de l'annotation

**Réponse (204 No Content):**
```
(Corps vide)
```

**Règles de sécurité:**
- Vérifier que `evaluatorId` de l'annotation === `userId` du token
- Retourner 403 Forbidden si pas le propriétaire
- Retourner 404 Not Found si annotation inexistante

**Codes d'erreur:**
- `401 Unauthorized`: Token invalide ou manquant
- `403 Forbidden`: Pas le propriétaire de l'annotation
- `404 Not Found`: Annotation inexistante
- `500 Internal Server Error`: Erreur serveur

---

## Détails des Champs JSON

### positionData (Structure complète)

Le champ `positionData` est une **string JSON** qui contient les coordonnées complètes de l'annotation dans le PDF :

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

**Explication des champs:**
- `boundingRect`: Rectangle englobant de l'annotation
  - `x1`, `y1`: Coordonnées du coin supérieur gauche
  - `x2`, `y2`: Coordonnées du coin inférieur droit
  - `width`, `height`: Dimensions du rectangle
  - `pageNumber`: Numéro de page (1-indexed)
- `rects`: Liste des rectangles individuels (pour annotations multi-lignes)
- `pageNumber`: Numéro de page (redondant avec boundingRect mais utilisé)

**Note:** Stocker en TEXT dans PostgreSQL (pas de limite de taille). Ne PAS utiliser VARCHAR avec limite.

---

### contentData (Structure)

Le champ `contentData` (optionnel) est une **string JSON** qui contient le contenu associé à l'annotation :

**Pour annotations de texte:**
```json
{
  "text": "Texte sélectionné dans le PDF..."
}
```

**Pour annotations d'image:**
```json
{
  "image": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."
}
```

**Note:** Peut être `null` pour les annotations de type `area` ou `freetext`.

---

## Validation des Données

### Champs obligatoires (POST)

- `annotationType`: Doit être l'une des valeurs: `'text'`, `'area'`, `'freetext'`
- `pageNumber`: Entier >= 1
- `xPosition`: Nombre (float)
- `yPosition`: Nombre (float)
- `positionData`: String JSON valide
- `comment`: String non vide (min: 1, max: 5000 caractères recommandé)
- `contentData`: String JSON valide ou absent (optionnel)

### Champs obligatoires (PUT)

- `comment`: String non vide (min: 1, max: 5000 caractères recommandé)

---

## Recommandations Base de Données

### Structure de Table PostgreSQL

```sql
CREATE TABLE manuscript_annotations (
    id VARCHAR(255) PRIMARY KEY,
    manuscript_id INTEGER NOT NULL REFERENCES manuscripts(id),
    evaluator_id INTEGER NOT NULL REFERENCES users(id),

    -- Type et position
    annotation_type VARCHAR(20) NOT NULL CHECK (annotation_type IN ('text', 'area', 'freetext')),
    page_number INTEGER NOT NULL CHECK (page_number >= 1),
    x_position DOUBLE PRECISION NOT NULL,
    y_position DOUBLE PRECISION NOT NULL,

    -- Données JSON (TEXT pour pas de limite)
    position_data TEXT NOT NULL,
    comment TEXT NOT NULL,
    content_data TEXT,

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

    -- Index pour performance
    INDEX idx_manuscript_annotations_manuscript (manuscript_id),
    INDEX idx_manuscript_annotations_evaluator (evaluator_id)
);
```

### Triggers pour updated_at

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_manuscript_annotations_updated_at
    BEFORE UPDATE ON manuscript_annotations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
```

---

## Gestion des Erreurs

### Format de Réponse d'Erreur

Toutes les erreurs doivent retourner un objet JSON avec ce format :

```json
{
  "error": {
    "message": "Description de l'erreur",
    "code": "ERROR_CODE",
    "details": {}  // Optionnel
  }
}
```

### Exemples de Codes d'Erreur

- `UNAUTHORIZED`: Token manquant ou invalide
- `FORBIDDEN`: Action non autorisée (pas le propriétaire)
- `NOT_FOUND`: Ressource inexistante
- `VALIDATION_ERROR`: Données invalides
- `INTERNAL_ERROR`: Erreur serveur

---

## Migration du Frontend

Une fois le backend implémenté, la migration sera très simple :

### 1. Créer le vrai service

Fichier: `src/services/annotationService.ts`

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

### 2. Mettre à jour le hook

Fichier: `src/app/(dashboard)/dashboard/evaluator/manuscripts/[id]/evaluate/hooks/useAnnotations.ts`

```typescript
// Ligne 4 - Changer ceci:
- import { mockAnnotationService } from '@/services/mockAnnotationService';

// En cela:
+ import { annotationService } from '@/services/annotationService';

// Ensuite remplacer tous les appels:
- mockAnnotationService.getAnnotations(...)
+ annotationService.getAnnotations(...)

// etc.
```

**C'EST TOUT !** Migration en 2 lignes de code.

---

## Exemples de Requêtes cURL

### GET - Récupérer annotations

```bash
curl -X GET \
  'https://api.example.com/api/v1/manuscripts/456/annotations' \
  -H 'Authorization: Bearer YOUR_JWT_TOKEN'
```

### POST - Créer annotation

```bash
curl -X POST \
  'https://api.example.com/api/v1/manuscripts/456/annotations' \
  -H 'Authorization: Bearer YOUR_JWT_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
    "annotationType": "text",
    "pageNumber": 1,
    "xPosition": 146.44,
    "yPosition": 402.74,
    "positionData": "{\"boundingRect\":{\"x1\":146.44,\"y1\":402.74,\"x2\":246.44,\"y2\":422.74,\"width\":100,\"height\":20,\"pageNumber\":1},\"rects\":[{\"x1\":146.44,\"y1\":402.74,\"x2\":246.44,\"y2\":422.74,\"pageNumber\":1}],\"pageNumber\":1}",
    "comment": "Ceci est un commentaire",
    "contentData": "{\"text\":\"Texte sélectionné...\"}"
  }'
```

### PUT - Modifier annotation

```bash
curl -X PUT \
  'https://api.example.com/api/v1/manuscripts/annotations/123' \
  -H 'Authorization: Bearer YOUR_JWT_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
    "comment": "Commentaire modifié"
  }'
```

### DELETE - Supprimer annotation

```bash
curl -X DELETE \
  'https://api.example.com/api/v1/manuscripts/annotations/123' \
  -H 'Authorization: Bearer YOUR_JWT_TOKEN'
```

---

## Checklist d'Implémentation Backend

- [ ] Créer la table `manuscript_annotations`
- [ ] Ajouter les index sur `manuscript_id` et `evaluator_id`
- [ ] Créer le trigger pour `updated_at`
- [ ] Implémenter GET `/api/v1/manuscripts/{manuscriptId}/annotations`
- [ ] Implémenter POST `/api/v1/manuscripts/{manuscriptId}/annotations`
- [ ] Implémenter PUT `/api/v1/manuscripts/annotations/{annotationId}`
- [ ] Implémenter DELETE `/api/v1/manuscripts/annotations/{annotationId}`
- [ ] Ajouter validation des données (annotationType, pageNumber, comment)
- [ ] Ajouter vérification de propriété pour PUT/DELETE
- [ ] Extraire `evaluatorId` du token JWT
- [ ] Joindre avec table `users` pour récupérer `evaluatorName`
- [ ] Tester toutes les routes avec Postman/cURL
- [ ] Gérer les erreurs (404, 403, 400, etc.)
- [ ] Tester avec le frontend mock d'abord
- [ ] Migrer le frontend vers le vrai service

---

## Contact & Questions

Si vous avez des questions sur le schéma ou besoin de clarifications, n'hésitez pas !
