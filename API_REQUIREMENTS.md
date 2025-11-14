# API Requirements - Santaane Platform

Ce document décrit les endpoints API requis pour que l'application frontend fonctionne correctement.

## Base URL

```
http://localhost:8000
```

## Endpoints requis

### 1. Login

**Endpoint:** `POST /api/v1/auth/login`

**Content-Type:** `application/x-www-form-urlencoded`

**Body (form-urlencoded):**
```
username=user@example.com
password=password123
grant_type=password
```

**Réponse attendue (200 OK):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "tokenType": "bearer",
  "user": {
    "id": "user-123",
    "email": "user@example.com",
    "fullName": "John Doe",
    "roles": ["AUTHOR", "EDITOR"],
    "countryId": null,
    "cityId": null,
    "timezone": "UTC",
    "profilePhoto": null,
    "orcidId": null
  }
}
```

**⚠️ Important :** Le champ `roles` est un **tableau** de rôles, pas une chaîne unique.

**Note:** Le champ `user` est optionnel dans la réponse. S'il n'est pas fourni, le frontend fera un appel à `/api/v1/auth/me` pour récupérer les données utilisateur.

**Erreurs possibles:**
- `401 Unauthorized` : Identifiants incorrects
- `422 Unprocessable Entity` : Validation échouée

---

### 2. Register

**Endpoint:** `POST /api/v1/auth/register`

**Content-Type:** `application/json`

**Body:**
```json
{
  "email": "newuser@example.com",
  "password": "securePassword123",
  "fullName": "Jane Smith",
  "countryId": 1,
  "cityId": 10,
  "timezone": "Europe/Paris",
  "profilePhoto": "https://example.com/photo.jpg",
  "orcidId": "0000-0001-2345-6789"
}
```

**Champs obligatoires:**
- `email` (string, format email)
- `password` (string, minimum 6 caractères recommandé)
- `fullName` (string)

**Champs optionnels:**
- `countryId` (number | null)
- `cityId` (number | null)
- `timezone` (string | null)
- `profilePhoto` (string | null, URL)
- `orcidId` (string | null)

**Réponse attendue (201 Created):**
```json
{
  "id": "user-456",
  "email": "newuser@example.com",
  "fullName": "Jane Smith",
  "roles": ["AUTHOR"],
  "countryId": 1,
  "cityId": 10,
  "timezone": "Europe/Paris",
  "profilePhoto": "https://example.com/photo.jpg",
  "orcidId": "0000-0001-2345-6789",
  "createdAt": "2025-11-13T10:00:00Z",
  "updatedAt": "2025-11-13T10:00:00Z"
}
```

**⚠️ Important :** Le champ `roles` est un **tableau** de rôles. Rôle par défaut : `["AUTHOR"]`

**Note:** Après l'inscription, le frontend effectue automatiquement une connexion avec les identifiants fournis.

**Erreurs possibles:**
- `400 Bad Request` : Email déjà utilisé
- `422 Unprocessable Entity` : Validation échouée

---

### 3. Get Current User

**Endpoint:** `GET /api/v1/auth/me`

**Headers:**
```
Authorization: Bearer {access_token}
```

**Réponse attendue (200 OK):**
```json
{
  "id": "user-123",
  "email": "user@example.com",
  "fullName": "John Doe",
  "roles": ["AUTHOR", "REVIEWER"],
  "countryId": null,
  "cityId": null,
  "timezone": "UTC",
  "profilePhoto": null,
  "orcidId": null,
  "createdAt": "2025-11-01T10:00:00Z",
  "updatedAt": "2025-11-13T10:00:00Z"
}
```

**⚠️ Important :** Le champ `roles` est un **tableau** de rôles. Un utilisateur peut avoir plusieurs rôles.

**Erreurs possibles:**
- `401 Unauthorized` : Token invalide ou expiré

---

## Rôles utilisateur

L'API doit retourner un **tableau** de rôles dans le champ `roles` :

- `AUTHOR` : Auteur (peut créer et modifier ses propres contenus)
- `EDITOR` : Éditeur (peut éditer et publier les contenus des autres)
- `ADMIN` : Administrateur (accès complet)
- `REVIEWER` : Réviseur (peut réviser et commenter les contenus)

**Important :**
- Le champ `roles` est un **tableau** (array) de chaînes
- Un utilisateur peut avoir **plusieurs rôles** : `["AUTHOR", "EDITOR", "REVIEWER"]`
- Minimum un rôle par utilisateur
- Les valeurs doivent être en MAJUSCULES

**Exemples de combinaisons :**
```json
["AUTHOR"]                          // Auteur seulement
["AUTHOR", "EDITOR"]                // Auteur + Éditeur
["EDITOR", "REVIEWER"]              // Éditeur + Réviseur
["ADMIN"]                           // Admin (accès complet)
["AUTHOR", "EDITOR", "ADMIN", "REVIEWER"]  // Tous les rôles
```

---

## Authentification JWT

### Format du token

Le token JWT doit contenir au minimum :
```json
{
  "sub": "user-123",
  "email": "user@example.com",
  "roles": ["AUTHOR", "EDITOR"],
  "exp": 1699876543
}
```

**Note :** Le champ `roles` dans le JWT est également un tableau.

### Headers

Le frontend envoie le token dans le header `Authorization` :
```
Authorization: Bearer {access_token}
```

### Expiration

Lorsque le token expire, l'API doit retourner un statut `401 Unauthorized`. Le frontend :
1. Supprime automatiquement le token et les données utilisateur
2. Redirige l'utilisateur vers la page de connexion

---

## CORS Configuration

L'API doit autoriser les requêtes depuis :
```
http://localhost:3000
```

Headers CORS requis :
```
Access-Control-Allow-Origin: http://localhost:3000
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Allow-Credentials: true
```

---

## Gestion des erreurs

### Format des erreurs

Toutes les erreurs doivent suivre ce format :
```json
{
  "detail": "Message d'erreur descriptif",
  "message": "Message alternatif (optionnel)"
}
```

Ou pour FastAPI :
```json
{
  "detail": "Email already exists"
}
```

### Codes HTTP

- `200 OK` : Succès
- `201 Created` : Ressource créée (register)
- `400 Bad Request` : Erreur client (email déjà utilisé, etc.)
- `401 Unauthorized` : Non authentifié ou token invalide
- `403 Forbidden` : Authentifié mais pas autorisé
- `422 Unprocessable Entity` : Validation échouée
- `500 Internal Server Error` : Erreur serveur

---

## Exemple d'implémentation FastAPI

```python
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel, EmailStr

router = APIRouter(prefix="/api/v1/auth", tags=["auth"])

class RegisterRequest(BaseModel):
    email: EmailStr
    password: str
    fullName: str
    countryId: int | None = None
    cityId: int | None = None
    timezone: str | None = None
    profilePhoto: str | None = None
    orcidId: str | None = None

class AuthResponse(BaseModel):
    access_token: str
    tokenType: str = "bearer"
    user: dict | None = None

class UserResponse(BaseModel):
    id: str
    email: str
    fullName: str
    role: str
    countryId: int | None
    cityId: int | None
    timezone: str | None
    profilePhoto: str | None
    orcidId: str | None

@router.post("/login", response_model=AuthResponse)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    # Votre logique de login
    # form_data.username contient l'email
    # form_data.password contient le mot de passe
    pass

@router.post("/register", response_model=UserResponse, status_code=201)
async def register(data: RegisterRequest):
    # Votre logique d'inscription
    pass

@router.get("/me", response_model=UserResponse)
async def get_current_user(token: str = Depends(oauth2_scheme)):
    # Votre logique pour récupérer l'utilisateur courant
    pass
```

---

## Test avec curl

### Login
```bash
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=user@example.com&password=password123&grant_type=password"
```

### Register
```bash
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@example.com",
    "password": "password123",
    "fullName": "New User"
  }'
```

### Get Current User
```bash
curl -X GET http://localhost:8000/api/v1/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Notes importantes

1. **OAuth2 Password Flow** : Le login utilise le format OAuth2 standard (x-www-form-urlencoded) pour être compatible avec Swagger UI et autres outils.

2. **Champ username** : Dans le formulaire de login, le champ s'appelle `username` mais contient l'email de l'utilisateur.

3. **Token expiration** : Le frontend ne gère pas actuellement le refresh token. Assurez-vous que les tokens ont une durée de vie suffisante (recommandé : 7 jours).

4. **Rôles par défaut** : Si non spécifié, le rôle par défaut devrait être `["AUTHOR"]` (tableau avec un seul élément).

5. **Validation** : L'API doit valider tous les champs et retourner des messages d'erreur clairs en français de préférence.
