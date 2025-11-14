# Architecture de Sécurité - Santaane Platform

## 🔒 Système d'authentification sécurisé

### Architecture

```
Frontend (React) → Next.js API Routes → Backend API
                    ↑
                    (gère les cookies HTTP-Only)
```

### Flux d'authentification sécurisé

1. **Login** :
   - Frontend → `/api/auth/login` → Backend `/api/v1/auth/login`
   - Backend retourne le JWT
   - Next.js API route stocke le JWT dans un cookie **HTTP-Only**
   - Cookie inaccessible via JavaScript (`document.cookie`)

2. **Vérification** :
   - Frontend → `/api/auth/me`
   - Next.js lit le cookie HTTP-Only
   - Envoie le token au backend avec header `Authorization: Bearer {token}`
   - Retourne les données utilisateur (jamais stockées côté client)

3. **Logout** :
   - Frontend → `/api/auth/logout`
   - Next.js supprime le cookie HTTP-Only

## 🛡️ Mesures de sécurité implémentées

### 1. **HTTP-Only Cookies**
```typescript
// src/app/api/auth/login/route.ts
apiResponse.cookies.set('auth_token', access_token, {
  httpOnly: true,      // ✅ Inaccessible via JavaScript
  secure: true,        // ✅ HTTPS uniquement en production
  sameSite: 'lax',     // ✅ Protection CSRF
  maxAge: 604800,      // ✅ 7 jours
  path: '/',           // ✅ Disponible sur tout le site
});
```

**Protection contre :**
- ❌ XSS (Cross-Site Scripting) : Le token ne peut pas être volé via JavaScript
- ❌ Vol de token : `document.cookie` ne retourne rien

### 2. **Pas de stockage client-side**
```typescript
// ❌ AVANT (non sécurisé)
setUserData(JSON.stringify(user)); // Stocké dans cookies accessibles
localStorage.setItem('user', JSON.stringify(user)); // Modifiable

// ✅ MAINTENANT (sécurisé)
// Données utilisateur JAMAIS stockées côté client
// Toujours récupérées via /api/auth/me
```

**Protection contre :**
- ❌ Modification des rôles : Impossible de passer de `AUTHOR` à `SUPER_ADMIN`
- ❌ Manipulation de données : Les infos viennent toujours du serveur

### 3. **Validation serveur systématique**
```typescript
// Chaque requête protégée valide le token
const token = request.cookies.get('auth_token')?.value;
const response = await axios.get(`${API_URL}/api/v1/auth/me`, {
  headers: { Authorization: `Bearer ${token}` }
});
```

**Protection contre :**
- ❌ Token falsifié : Vérifié par le backend à chaque requête
- ❌ Token expiré : Détecté et cookie supprimé automatiquement

### 4. **CSRF Protection**
```typescript
sameSite: 'lax' // Le cookie n'est pas envoyé sur les requêtes cross-site
```

**Protection contre :**
- ❌ Attaques CSRF : Le navigateur refuse d'envoyer le cookie depuis un autre domaine

### 5. **HTTPS en production**
```typescript
secure: process.env.NODE_ENV === 'production'
```

**Protection contre :**
- ❌ Man-in-the-Middle : Le cookie n'est envoyé que via HTTPS en production

## 🔍 Comment vérifier la sécurité

### Test 1 : Cookie HTTP-Only
1. Ouvrez DevTools (F12)
2. Connectez-vous
3. Console : Tapez `document.cookie`
4. ✅ **Résultat attendu** : Le cookie `auth_token` n'apparaît PAS

### Test 2 : Cookies dans Application tab
1. DevTools → Application → Cookies → `http://localhost:3000`
2. ✅ **Vérifiez** :
   - `auth_token` existe
   - HttpOnly = ✅ (coché)
   - Secure = ✅ en production
   - SameSite = `Lax`

### Test 3 : Tentative de modification
1. Console : `document.cookie = "auth_token=fake_token"`
2. Rafraîchissez la page
3. ✅ **Résultat attendu** : Vous êtes redirigé vers `/login` (token invalide)

### Test 4 : Pas de user_data stocké
1. DevTools → Application → Cookies
2. ✅ **Vérifiez** : Aucun cookie `user_data`
3. Console : `localStorage.getItem('user')` → `null`

## 🚨 Ce qui est impossible maintenant

### ❌ Un attaquant NE PEUT PAS :

1. **Voler le token via XSS**
   ```javascript
   console.log(document.cookie); // ❌ Token invisible
   ```

2. **Modifier ses rôles**
   ```javascript
   // ❌ Impossible, user_data n'existe plus côté client
   localStorage.setItem('user', JSON.stringify({
     roles: ['SUPER_ADMIN']
   }));
   ```

3. **Falsifier un token**
   - Le token est validé par le backend via signature JWT
   - Même avec accès au cookie (impossible), il est cryptographiquement vérifié

4. **Utiliser un token volé depuis un autre site**
   - `sameSite: 'lax'` empêche l'envoi du cookie cross-origin

## 📊 Comparaison Avant / Après

| Aspect | ❌ Avant | ✅ Maintenant |
|--------|---------|--------------|
| Stockage token | Cookie accessible JS | Cookie HTTP-Only |
| Données utilisateur | Stockées en cookies | Jamais stockées client |
| Accessible via console | ✅ Oui | ❌ Non |
| Modifiable par attaquant | ✅ Oui | ❌ Non |
| Protection XSS | ❌ Non | ✅ Oui |
| Protection CSRF | ⚠️ Partielle | ✅ Complète |
| Validation token | Client | Serveur |

## 🔧 Architecture technique

### API Routes créées

```
/api/auth/
├── login/route.ts      - POST : Login avec cookie HTTP-Only
├── register/route.ts   - POST : Inscription + auto-login
├── me/route.ts        - GET  : Récupérer user actuel
└── logout/route.ts    - POST : Supprimer cookie
```

### Flux de données

```
┌─────────────┐
│   Browser   │
│  (Frontend) │
└──────┬──────┘
       │ POST /api/auth/login
       │ { email, password }
       ↓
┌─────────────────────┐
│  Next.js API Route  │
│  (Proxy sécurisé)   │
└──────┬──────────────┘
       │ POST /api/v1/auth/login
       │ FormData (OAuth2)
       ↓
┌─────────────────────┐
│   Backend FastAPI   │
│   (Votre API)       │
└──────┬──────────────┘
       │ { access_token: "eyJ..." }
       ↓
┌─────────────────────┐
│  Next.js API Route  │
│  Set HTTP-Only      │
│  Cookie             │
└──────┬──────────────┘
       │ { success: true }
       │ Set-Cookie: auth_token=...; HttpOnly; Secure; SameSite=Lax
       ↓
┌─────────────┐
│   Browser   │
│  (Cookie     │
│   stocké)    │
└─────────────┘
```

## 🎯 Bonnes pratiques

### ✅ À FAIRE :

1. Toujours utiliser `/api/auth` pour l'authentification
2. Vérifier `httpOnly=true` dans les cookies en production
3. Activer HTTPS en production (`secure=true`)
4. Ne jamais stocker de données sensibles côté client
5. Toujours récupérer les données utilisateur via `/api/auth/me`

### ❌ À NE PAS FAIRE :

1. ~~Stocker le token dans `localStorage`~~
2. ~~Stocker les données utilisateur en cookies~~
3. ~~Accéder directement au backend depuis le frontend~~
4. ~~Faire confiance aux données côté client~~
5. ~~Utiliser `httpOnly: false` en production~~

## 📝 En résumé

Cette architecture garantit que :

1. ✅ Le token JWT est **inaccessible** depuis JavaScript
2. ✅ Les données utilisateur ne sont **jamais modifiables** côté client
3. ✅ Chaque requête est **validée par le serveur**
4. ✅ Protection contre **XSS, CSRF, et vol de token**
5. ✅ Conformité aux **meilleures pratiques de sécurité web**

**Votre application est maintenant sécurisée ! 🔒**
