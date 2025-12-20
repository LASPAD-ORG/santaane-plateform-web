# Fonctionnalité d'envoi d'email lors de la création d'utilisateur

## Vue d'ensemble

Lorsqu'un Super Admin crée un nouvel utilisateur sur la plateforme Santaane, un email de bienvenue est automatiquement envoyé à l'utilisateur avec ses identifiants de connexion (email et mot de passe temporaire).

## Flux de travail

### 1. Création d'utilisateur par le Super Admin

Le Super Admin accède à la page de gestion des utilisateurs :
- **URL** : `/dashboard/super-admin/gestion-utilisateurs`
- Clique sur "Nouvel Utilisateur"
- Remplit le formulaire avec les informations de l'utilisateur
- Active l'option "Envoyer un email de bienvenue avec les instructions de connexion" (activée par défaut)
- Clique sur "Créer l'utilisateur"

### 2. Génération du mot de passe temporaire

Lors de la création, le système :
- Génère automatiquement un mot de passe temporaire sécurisé (12 caractères)
- Le mot de passe contient des lettres majuscules, minuscules, chiffres et caractères spéciaux
- Ce mot de passe est stocké de manière sécurisée dans la base de données

### 3. Envoi de l'email de bienvenue

Si l'option d'envoi d'email est activée :
- Un email HTML formaté est envoyé à l'adresse email de l'utilisateur
- L'email contient :
  - Un message de bienvenue personnalisé
  - L'email de connexion
  - Le mot de passe temporaire
  - Un lien direct vers la page de connexion
  - Des instructions pour changer le mot de passe

### 4. Première connexion de l'utilisateur

L'utilisateur reçoit l'email et :
1. Clique sur le lien de connexion ou se rend sur `/login`
2. Saisit son email et le mot de passe temporaire
3. Est automatiquement redirigé vers `/change-password`
4. Doit créer un nouveau mot de passe sécurisé
5. Est ensuite redirigé vers le dashboard

## Architecture technique

### Fichiers impliqués

#### Frontend

1. **Modal de création d'utilisateur**
   - Fichier : `src/app/(dashboard)/dashboard/super-admin/gestion-utilisateurs/components/CreateUserModal.tsx`
   - Contient l'option "Envoyer un email de bienvenue"

2. **Hook de création d'utilisateur**
   - Fichier : `src/app/(dashboard)/dashboard/super-admin/gestion-utilisateurs/fetchers/useCreateGestionUtilisateurs.ts`
   - Gère la logique de création et l'envoi d'email

3. **Formatter**
   - Fichier : `src/app/(dashboard)/dashboard/super-admin/gestion-utilisateurs/helpers/formatters.ts`
   - Génère le mot de passe temporaire
   - Fonction : `mapFrontendUserToBackendCreate()`

4. **Page de changement de mot de passe**
   - Fichier : `src/app/(dashboard)/change-password/page.tsx`
   - Interface pour changer le mot de passe temporaire

#### Backend (Routes API Next.js)

1. **Route d'envoi d'email**
   - Fichier : `src/app/api/users/send-welcome-email/route.ts`
   - Endpoint : `POST /api/users/send-welcome-email`
   - Génère et envoie l'email de bienvenue

2. **Route de changement de mot de passe**
   - Fichier : `src/app/api/users/change-password/route.ts`
   - Endpoint : `POST /api/users/change-password`
   - Permet à l'utilisateur de changer son mot de passe

#### Templates d'email

- Fichier : `src/lib/email/templates/welcome-email.ts`
- Contient les templates HTML et texte de l'email de bienvenue
- Fonctions :
  - `generateWelcomeEmailHTML()` : Template HTML responsive
  - `generateWelcomeEmailText()` : Template texte brut

## Configuration

### Variables d'environnement

Ajoutez ces variables dans votre fichier `.env.local` :

```env
# URL de l'application (pour les liens dans les emails)
NEXT_PUBLIC_APP_URL=http://localhost:3000

# URL de l'API backend
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Configuration du service d'email

**Mode actuel : Simulation**

Par défaut, le système simule l'envoi d'email et affiche le contenu dans les logs du serveur.

**Pour la production : Intégration d'un service d'email**

Pour envoyer de vrais emails, vous devez intégrer un service d'email comme :

1. **SendGrid**
2. **AWS SES (Simple Email Service)**
3. **Mailgun**
4. **Postmark**

#### Exemple d'intégration avec SendGrid

```typescript
// Dans src/app/api/users/send-welcome-email/route.ts

import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

const msg = {
  to: email,
  from: process.env.SENDGRID_FROM_EMAIL!,
  subject: 'Bienvenue sur Santaane',
  text: textContent,
  html: htmlContent,
};

await sgMail.send(msg);
```

Variables d'environnement nécessaires :
```env
SENDGRID_API_KEY=your_sendgrid_api_key
SENDGRID_FROM_EMAIL=noreply@santaane.com
```

## Sécurité

### Génération du mot de passe temporaire

- **Longueur** : 12 caractères minimum
- **Complexité** : Majuscules, minuscules, chiffres, caractères spéciaux
- **Aléatoire** : Utilise `Math.random()` (à remplacer par `crypto.randomBytes()` en production)

### Validation du nouveau mot de passe

Le nouveau mot de passe doit respecter les critères suivants :
- Au moins 8 caractères
- Au moins une majuscule
- Au moins une minuscule
- Au moins un chiffre
- Au moins un caractère spécial (!@#$%^&*)

### Recommandations de sécurité

1. **Expiration du mot de passe temporaire**
   - Implémenter une date d'expiration (ex: 24h ou 7 jours)
   - Forcer le changement à la première connexion

2. **Limitation des tentatives**
   - Limiter le nombre de tentatives de connexion
   - Bloquer temporairement après plusieurs échecs

3. **Audit**
   - Logger les créations d'utilisateurs
   - Logger les changements de mot de passe
   - Notifier l'admin en cas d'activité suspecte

## Tests

### Test manuel

1. **Créer un utilisateur**
   ```
   - Se connecter en tant que Super Admin
   - Aller sur /dashboard/super-admin/gestion-utilisateurs
   - Cliquer sur "Nouvel Utilisateur"
   - Remplir le formulaire
   - S'assurer que "Envoyer un email de bienvenue" est coché
   - Cliquer sur "Créer l'utilisateur"
   ```

2. **Vérifier l'email**
   ```
   - Vérifier les logs du serveur
   - L'email devrait être affiché dans la console
   - Copier le mot de passe temporaire
   ```

3. **Tester la connexion**
   ```
   - Se déconnecter
   - Aller sur /login
   - Utiliser l'email et le mot de passe temporaire
   - Vérifier la redirection vers /change-password
   ```

4. **Changer le mot de passe**
   ```
   - Saisir le mot de passe temporaire
   - Créer un nouveau mot de passe sécurisé
   - Vérifier la redirection vers /dashboard
   ```

### Test avec import CSV

L'import CSV supporte également l'envoi d'email :
- Chaque utilisateur importé reçoit un email de bienvenue
- Le mot de passe temporaire est généré automatiquement pour chaque utilisateur

## Dépannage

### L'email n'est pas envoyé

1. Vérifier les logs du serveur pour les erreurs
2. Vérifier que `NEXT_PUBLIC_APP_URL` est défini
3. Vérifier que le service d'email est correctement configuré (en production)

### L'utilisateur ne peut pas se connecter

1. Vérifier que le mot de passe temporaire est correct
2. Vérifier que le compte est actif
3. Vérifier les logs d'authentification

### La page de changement de mot de passe ne s'affiche pas

1. Vérifier que la route `/change-password` est accessible
2. Vérifier que l'utilisateur est authentifié
3. Vérifier les erreurs dans la console du navigateur

## Améliorations futures

1. **Système de notification**
   - Notifications in-app pour les nouveaux utilisateurs
   - Notifications par SMS en option

2. **Personnalisation des emails**
   - Templates d'email personnalisables par l'admin
   - Support multilingue

3. **Gestion avancée des mots de passe**
   - Politique de mot de passe configurable
   - Historique des mots de passe
   - Rotation obligatoire des mots de passe

4. **Authentification à deux facteurs (2FA)**
   - Support de l'authentification à deux facteurs
   - QR code pour les applications d'authentification

## Support

Pour toute question ou problème, contactez l'équipe de développement.
