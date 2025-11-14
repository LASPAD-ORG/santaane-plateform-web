# Guide - Support des Rôles Multiples

## ✅ Modification Complétée

L'architecture a été **mise à jour avec succès** pour supporter les **utilisateurs avec plusieurs rôles**.

---

## 🔄 Changements Apportés

### 1. **Type User modifié**

**Avant :**
```typescript
interface User {
  role: UserRole; // Un seul rôle
}
```

**Après :**
```typescript
interface User {
  roles: UserRole[]; // Tableau de rôles
}
```

---

### 2. **Format API attendu**

Votre API doit maintenant retourner un **tableau de rôles** :

```json
{
  "id": "user-123",
  "email": "user@example.com",
  "fullName": "John Doe",
  "roles": ["AUTHOR", "EDITOR"],  // ← Tableau au lieu d'une chaîne
  "countryId": null,
  "cityId": null
}
```

#### Exemples de combinaisons de rôles :

- **Auteur seulement** : `["AUTHOR"]`
- **Auteur + Éditeur** : `["AUTHOR", "EDITOR"]`
- **Éditeur + Réviseur** : `["EDITOR", "REVIEWER"]`
- **Admin** : `["ADMIN"]` (accès complet à tout)
- **Tous les rôles** : `["AUTHOR", "EDITOR", "ADMIN", "REVIEWER"]`

---

## 🎯 Fonctionnement

### **Sidebar intelligente**

La sidebar affiche maintenant **tous les menus** accessibles par **tous les rôles** de l'utilisateur :

- Si utilisateur a `["AUTHOR", "EDITOR"]`
  - Il voit les menus de l'auteur ET les menus de l'éditeur
  - Les menus sont **dédupliqués** automatiquement

**Affichage des rôles** :
```
John Doe
Auteur, Éditeur  ← Tous les rôles affichés
```

---

### **Protection des pages (RoleGuard)**

`RoleGuard` vérifie si l'utilisateur a **au moins un** des rôles autorisés :

```typescript
<RoleGuard allowedRoles={[UserRole.EDITOR, UserRole.ADMIN]}>
  <EditorDashboard />
</RoleGuard>
```

- Utilisateur avec `["AUTHOR"]` → ❌ Accès refusé
- Utilisateur avec `["EDITOR"]` → ✅ Accès autorisé
- Utilisateur avec `["AUTHOR", "EDITOR"]` → ✅ Accès autorisé
- Utilisateur avec `["ADMIN"]` → ✅ Accès autorisé

---

### **Redirection après connexion**

Par défaut, redirige vers la page du **premier rôle** :

```typescript
// Si roles = ["EDITOR", "AUTHOR"]
// → Redirige vers /dashboard/editor

// Si roles = ["AUTHOR", "REVIEWER"]
// → Redirige vers /dashboard/author
```

**Personnalisation** : Vous pouvez modifier la logique de priorité dans :
- `src/components/forms/LoginForm.tsx`
- `src/components/forms/RegisterForm.tsx`
- `src/app/(dashboard)/dashboard/page.tsx`

---

## 📋 Nouvelles Fonctions Utilitaires

### **getMenuItemsForRoles()**

Récupère tous les menus pour plusieurs rôles :

```typescript
import { getMenuItemsForRoles } from '@/config/roles';

const userRoles = [UserRole.AUTHOR, UserRole.EDITOR];
const menus = getMenuItemsForRoles(userRoles);
// Retourne tous les menus uniques accessibles par ces rôles
```

---

### **hasPermissionWithRoles()**

Vérifie si l'utilisateur a une permission (avec plusieurs rôles) :

```typescript
import { hasPermissionWithRoles } from '@/config/roles';

const userRoles = [UserRole.AUTHOR, UserRole.REVIEWER];
const canEdit = hasPermissionWithRoles(userRoles, 'edit.all');
// true si au moins un rôle a la permission
```

---

### **canAccessRouteWithRoles()**

Vérifie l'accès à une route :

```typescript
import { canAccessRouteWithRoles } from '@/config/roles';

const userRoles = [UserRole.AUTHOR];
const canAccess = canAccessRouteWithRoles(userRoles, '/dashboard/editor');
// false (AUTHOR n'a pas accès à /dashboard/editor)
```

---

## 🔧 Migration de votre API Backend

### Étape 1 : Modifier le modèle User

**SQLAlchemy (Python) :**
```python
from sqlalchemy import Column, String, ARRAY

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True)
    email = Column(String, unique=True, nullable=False)
    full_name = Column(String, nullable=False)
    roles = Column(ARRAY(String), nullable=False, default=["AUTHOR"])  # ← Changement
```

**Prisma (Node.js) :**
```prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  fullName  String
  roles     String[]  // ← Changement
}
```

---

### Étape 2 : Mettre à jour les réponses API

**Endpoint `/api/v1/auth/me` :**
```python
@router.get("/me")
def get_current_user(current_user: User = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "email": current_user.email,
        "fullName": current_user.full_name,
        "roles": current_user.roles,  # ← Retourner un tableau
        # ...
    }
```

**Endpoint `/api/v1/auth/login` :**
```python
@router.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = authenticate_user(form_data.username, form_data.password)
    token = create_access_token(user.id)

    return {
        "access_token": token,
        "tokenType": "bearer",
        "user": {
            "id": user.id,
            "email": user.email,
            "fullName": user.full_name,
            "roles": user.roles,  # ← Retourner un tableau
        }
    }
```

---

### Étape 3 : Assigner des rôles par défaut

Lors de l'inscription, assignez un rôle par défaut :

```python
@router.post("/register")
def register(data: RegisterRequest):
    new_user = User(
        email=data.email,
        full_name=data.fullName,
        roles=["AUTHOR"],  # ← Rôle par défaut
        # ...
    )
    db.add(new_user)
    db.commit()
    return new_user
```

---

## 🧪 Exemples de Tests

### Test avec un utilisateur ayant plusieurs rôles

```json
{
  "id": "user-456",
  "email": "editor@example.com",
  "fullName": "Jane Smith",
  "roles": ["AUTHOR", "EDITOR", "REVIEWER"]
}
```

**Résultat attendu** :
- ✅ Accès à `/dashboard/author`
- ✅ Accès à `/dashboard/editor`
- ✅ Accès à `/dashboard/reviewer`
- ❌ Accès à `/dashboard/admin` (pas le rôle ADMIN)
- ✅ Sidebar affiche tous les menus (Mes Articles, Créer, Réviser, Édition, Analytique)

---

## 📝 Cas d'Usage Courants

### 1. **Utilisateur promotionné**

Ajoutez simplement le nouveau rôle :

```python
# Promouvoir un auteur en éditeur
user.roles = ["AUTHOR", "EDITOR"]
```

### 2. **Retrait d'un rôle**

```python
# Retirer le rôle EDITOR
user.roles = [r for r in user.roles if r != "EDITOR"]
```

### 3. **Admin avec accès complet**

```python
# Admin a accès à tout
user.roles = ["ADMIN"]
```

---

## ⚠️ Points Importants

### 1. **Ordre des rôles**

Le **premier rôle** dans le tableau est utilisé pour la redirection par défaut :

```json
"roles": ["EDITOR", "AUTHOR"]  → Redirige vers /dashboard/editor
"roles": ["AUTHOR", "EDITOR"]  → Redirige vers /dashboard/author
```

### 2. **Toujours un tableau**

Même avec un seul rôle, utilisez un tableau :

```json
✅ "roles": ["AUTHOR"]
❌ "roles": "AUTHOR"
```

### 3. **Tableau vide**

Si `roles: []`, l'utilisateur sera redirigé vers `/dashboard` puis vers `/login`.

---

## 🎨 Personnalisation

### Changer la logique de priorité

Éditez `src/app/(dashboard)/dashboard/page.tsx` :

```typescript
// Exemple : Prioriser ADMIN > EDITOR > AUTHOR > REVIEWER
const rolePriority: UserRole[] = [
  UserRole.ADMIN,
  UserRole.EDITOR,
  UserRole.AUTHOR,
  UserRole.REVIEWER,
];

const primaryRole = rolePriority.find(role => user.roles.includes(role));
const defaultRoute = getDefaultRouteForRole(primaryRole || user.roles[0]);
```

---

## ✅ Checklist de Migration

- [ ] Modifier le modèle User dans la base de données (role → roles)
- [ ] Mettre à jour les endpoints API pour retourner un tableau
- [ ] Migrer les données existantes (convertir role en [role])
- [ ] Tester la connexion avec plusieurs rôles
- [ ] Vérifier l'affichage de la sidebar
- [ ] Tester l'accès aux pages selon les rôles
- [ ] Vérifier la redirection après login

---

## 📚 Documentation

Voir aussi :
- `API_REQUIREMENTS.md` - Spécifications API mises à jour
- `IMPLEMENTATION.md` - Guide complet de l'implémentation
- `src/types/auth.ts` - Types TypeScript
- `src/config/roles.ts` - Configuration et helpers des rôles

---

**✨ L'architecture supporte maintenant les utilisateurs avec plusieurs rôles !**
