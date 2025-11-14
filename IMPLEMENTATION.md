# Guide d'implémentation - Architecture Frontend Santaane

## 🎉 Implémentation terminée !

L'architecture complète a été mise en place avec succès. Voici ce qui a été créé :

## 📦 Structure du projet

```
src/
├── app/
│   ├── (public)/              # Routes publiques
│   │   ├── login/
│   │   │   └── page.tsx       # Page de connexion
│   │   ├── register/
│   │   │   └── page.tsx       # Page d'inscription
│   │   └── layout.tsx
│   ├── (dashboard)/           # Routes privées (dashboard)
│   │   ├── dashboard/
│   │   │   ├── page.tsx       # Redirection selon rôle
│   │   │   ├── author/
│   │   │   │   └── page.tsx   # Dashboard auteur
│   │   │   ├── editor/
│   │   │   │   └── page.tsx   # Dashboard éditeur
│   │   │   ├── admin/
│   │   │   │   └── page.tsx   # Dashboard admin
│   │   │   └── reviewer/
│   │   │       └── page.tsx   # Dashboard réviseur
│   │   └── layout.tsx         # Layout avec Sidebar
│   ├── layout.tsx             # Root layout avec MUI
│   ├── page.tsx               # Redirect vers /login
│   └── ThemeRegistry.tsx      # MUI Theme Provider
├── components/
│   ├── guards/
│   │   ├── AuthGuard.tsx      # Protection authentification
│   │   └── RoleGuard.tsx      # Protection par rôle
│   ├── forms/
│   │   ├── LoginForm.tsx      # Formulaire de connexion
│   │   └── RegisterForm.tsx   # Formulaire d'inscription
│   └── dashboard/
│       └── Sidebar.tsx        # Sidebar intelligent
├── lib/
│   ├── api/
│   │   └── client.ts          # Client Axios configuré
│   ├── theme.ts               # Thème MUI
│   └── cookies.ts             # Utilitaires cookies
├── services/
│   └── authService.ts         # Service d'authentification
├── stores/
│   └── authStore.ts           # Store Zustand
├── types/
│   └── auth.ts                # Types TypeScript
├── config/
│   ├── roles.ts               # Configuration des rôles et permissions
│   └── routes.ts              # Configuration des routes
└── middleware.ts              # Middleware de protection

```

## 🔐 Fonctionnalités implémentées

### 1. Authentification JWT
- ✅ Login avec email/password (format OAuth2)
- ✅ Registration avec validation
- ✅ Stockage sécurisé du token dans les cookies
- ✅ Logout
- ✅ Auto-refresh de l'état utilisateur

### 2. Gestion des rôles (RBAC)
- ✅ 4 rôles : AUTHOR, EDITOR, ADMIN, REVIEWER
- ✅ Permissions par rôle
- ✅ Routes spécifiques par rôle
- ✅ Redirection intelligente selon le rôle

### 3. Sidebar intelligente
- ✅ Menu dynamique basé sur le rôle utilisateur
- ✅ Affichage du profil utilisateur
- ✅ Navigation avec highlight de la page active
- ✅ Bouton de déconnexion

### 4. Protection des routes
- ✅ Middleware Next.js pour les routes protégées
- ✅ AuthGuard pour les pages privées
- ✅ RoleGuard pour les pages avec restrictions de rôle
- ✅ Redirection automatique si non authentifié

### 5. UI/UX avec Material-UI
- ✅ Thème personnalisé
- ✅ Formulaires avec validation
- ✅ Messages d'erreur
- ✅ États de chargement
- ✅ Design responsive

## 🚀 Comment démarrer

### 1. Installer les dépendances
```bash
pnpm install
```

### 2. Configurer les variables d'environnement
Le fichier `.env.local` a déjà été créé avec :
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_APP_NAME=Santaane Platform
```

### 3. Lancer le serveur de développement
```bash
pnpm dev
```

L'application sera accessible sur http://localhost:3000

### 4. Tester l'application

#### Pages disponibles :
- `/` → Redirige vers `/login`
- `/login` → Page de connexion
- `/register` → Page d'inscription
- `/dashboard` → Redirige vers la page selon le rôle
- `/dashboard/author` → Dashboard auteur
- `/dashboard/editor` → Dashboard éditeur
- `/dashboard/admin` → Dashboard admin
- `/dashboard/reviewer` → Dashboard réviseur

## 🔌 Connexion à l'API

### Endpoints utilisés

#### 1. Login (POST /api/v1/auth/login)
Format OAuth2 (x-www-form-urlencoded) :
```
username: user@example.com
password: password123
grant_type: password
```

Réponse attendue :
```json
{
  "access_token": "eyJhbGc...",
  "tokenType": "bearer"
}
```

#### 2. Register (POST /api/v1/auth/register)
Format JSON :
```json
{
  "email": "user@example.com",
  "password": "password123",
  "fullName": "John Doe",
  "countryId": null,
  "cityId": null,
  "timezone": null,
  "profilePhoto": null,
  "orcidId": null
}
```

#### 3. Get Current User (GET /api/v1/auth/me)
Headers :
```
Authorization: Bearer {token}
```

Réponse attendue :
```json
{
  "id": "123",
  "email": "user@example.com",
  "fullName": "John Doe",
  "role": "AUTHOR"
}
```

## 📝 Configuration des rôles

### Menus par rôle

Les menus de la sidebar s'affichent automatiquement selon le rôle dans `src/config/roles.ts` :

- **AUTHOR** : Dashboard, Mes Articles, Créer un Article
- **EDITOR** : Dashboard, Mes Articles, Créer, Réviser, Édition, Analytique
- **ADMIN** : Tous les menus (accès complet)
- **REVIEWER** : Dashboard, Réviser

### Redirection par rôle

Après connexion, l'utilisateur est automatiquement redirigé vers :
- **AUTHOR** → `/dashboard/author`
- **EDITOR** → `/dashboard/editor`
- **ADMIN** → `/dashboard/admin`
- **REVIEWER** → `/dashboard/reviewer`

## 🛠️ Personnalisation

### Ajouter un nouveau rôle

1. Ajouter le rôle dans `src/types/auth.ts` :
```typescript
export enum UserRole {
  // ... rôles existants
  NEW_ROLE = 'NEW_ROLE',
}
```

2. Configurer le rôle dans `src/config/roles.ts` :
```typescript
export const ROLE_CONFIGS: Record<UserRole, RoleConfig> = {
  // ... configs existantes
  [UserRole.NEW_ROLE]: {
    role: UserRole.NEW_ROLE,
    label: 'Nouveau Rôle',
    defaultRoute: '/dashboard/new-role',
    permissions: ['permission1', 'permission2'],
  },
};
```

3. Ajouter les menus pour ce rôle dans `MENU_ITEMS`

4. Créer la page dashboard : `src/app/(dashboard)/dashboard/new-role/page.tsx`

### Modifier le thème

Éditer `src/lib/theme.ts` pour personnaliser les couleurs, typographie, etc.

## 🔒 Sécurité

- ✅ Tokens JWT stockés dans des cookies
- ✅ Validation côté client et serveur
- ✅ Middleware Next.js pour la protection des routes
- ✅ Guards React pour la protection des composants
- ✅ Intercepteurs Axios pour gérer l'expiration des tokens
- ✅ Redirection automatique en cas de 401

## 📚 Technologies utilisées

- **Next.js 16** (App Router)
- **React 19**
- **TypeScript 5**
- **Material-UI v7**
- **Zustand** (state management)
- **Axios** (HTTP client)
- **cookies-next** (cookie management)

## 🐛 Debugging

### Vérifier l'état d'authentification
Dans les DevTools du navigateur :
```javascript
// Voir le store Zustand
window.zustandStore = useAuthStore.getState()

// Voir les cookies
document.cookie
```

### Logs API
Tous les appels API et erreurs sont loggés dans la console du navigateur.

## 📖 Prochaines étapes

Voici les fonctionnalités que vous pourriez ajouter :

1. **Pages fonctionnelles** :
   - Liste des articles
   - Création/édition d'articles
   - Interface de révision
   - Gestion des utilisateurs (admin)

2. **Amélirations UX** :
   - Notifications toast
   - Confirmations de suppression
   - Upload de fichiers
   - Recherche et filtres

3. **Sécurité** :
   - Refresh token
   - Rate limiting
   - CSRF protection

4. **Performance** :
   - Pagination
   - Lazy loading
   - Optimistic updates

## ✅ Checklist de déploiement

Avant de déployer en production :

- [ ] Changer `NEXT_PUBLIC_API_URL` vers l'URL de production
- [ ] Activer HTTPS (secure cookies)
- [ ] Configurer les variables d'environnement sur la plateforme
- [ ] Tester tous les rôles et permissions
- [ ] Vérifier la gestion des erreurs
- [ ] Optimiser les images
- [ ] Run `pnpm build` pour vérifier la compilation

---

**L'architecture est prête à l'emploi ! Vous pouvez maintenant tester la connexion avec votre API backend.** 🚀
