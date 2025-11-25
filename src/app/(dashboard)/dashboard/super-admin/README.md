# Interface de Gestion des Utilisateurs

## 📋 Vue d'ensemble

Cette interface permet au super-admin de gérer tous les utilisateurs de la plateforme Santaane, incluant la création, modification, suppression et administration des rôles.

## 🎯 Fonctionnalités principales

### ✅ Gestion des utilisateurs
- **Création** d'utilisateurs avec attribution de rôles
- **Modification** des informations utilisateur
- **Suppression** des comptes utilisateur
- **Activation/Désactivation** des comptes
- **Réinitialisation** des mots de passe

### ✅ Système de rôles
- **SUPER_ADMIN** : Administration complète de la plateforme
- **EDITOR** : Gestion des laboratoires et chercheurs
- **EVALUATOR** : Évaluation des manuscrits + fonctions MENTOR/AUTHOR
- **MENTOR** : Mentorat des auteurs + fonctions AUTHOR
- **AUTHOR** : Rédaction et soumission de manuscrits

### ✅ Filtres et recherche avancée
- **Recherche textuelle** : nom, prénom, email, téléphone
- **Filtres par rôle** : sélection multiple de rôles
- **Filtres par statut** : actif, inactif, en attente, suspendu
- **Filtres par laboratoire** et spécialité
- **Filtres par date** de création
- **Filtres par dernière connexion**

### ✅ Statistiques et analytics
- **Compteurs globaux** : total, actifs, inactifs, etc.
- **Répartition par rôles** avec pourcentages
- **Statistiques temporelles** : nouveaux ce mois, actifs cette semaine
- **Graphiques visuels** avec code couleur par rôle

### ✅ Actions en lot (Bulk Actions)
- **Activation/Désactivation** en masse
- **Suspension** d'utilisateurs multiples
- **Envoi d'emails** groupés
- **Export CSV** de la sélection ou de tous les utilisateurs
- **Protection** contre la suppression d'administrateurs

### ✅ Import/Export
- **Import CSV** avec validation des données
- **Template CSV** téléchargeable
- **Gestion des erreurs** d'import avec rapport détaillé
- **Export personnalisé** avec choix des colonnes

### ✅ Interface utilisateur
- **Design responsive** adapté mobile/desktop
- **Pagination avancée** avec choix du nombre d'éléments
- **Tri multi-colonnes** dans le tableau
- **Modals intuitives** pour création/édition
- **Notifications** de succès/erreur

## 🗂️ Structure des fichiers

```
super-admin/
├── page.tsx                           # Tableau de bord principal super-admin
│
├── components/                        # Composants partagés du dashboard
│   ├── AcceptanceRateChart.tsx       # Graphique taux d'acceptation
│   ├── ActivityFeed.tsx              # Flux d'activité récente
│   ├── SubmissionsChart.tsx          # Graphique des soumissions
│   └── UsersDistributionChart.tsx    # Répartition des utilisateurs
│
├── hooks/                             # Hooks partagés
│   └── useDashboardStatssuper-admin/
├── page.tsx                           # Tableau de bord principal super-admin
│
├── components/                        # Composants partagés du dashboard
│   ├── AcceptanceRateChart.tsx       # Graphique taux d'acceptation
│   ├── ActivityFeed.tsx              # Flux d'activité récente
│   ├── SubmissionsChart.tsx          # Graphique des soumissions
│   └── UsersDistributionChart.tsx    # Répartition des utilisateurs
│
├── hooks/                             # Hooks partagés
│   └── useDashboardStats.ts          # Statistiques globales
│
├── fetchers/                          # Récupération données partagées
│   └── data/
│       └── mockDashboard.ts          # Données de test dashboard
│
├── gestion-utilisateurs/              # Module: Gestion des utilisateurs
.ts          # Statistiques globales
│
├── fetchers/                          # Récupération données partagées
│   └── data/
│       └── mockDashboard.ts          # Données de test dashboard
│
├── gestion-utilisateurs/              # Module: Gestion des utilisateurs
│   ├── page.tsx                      # Page principale
│   ├── README.md                     # Documentation du module
│   ├── types/
│   │   └── index.ts                  # User, UserFilters, UserStats, etc.
│   ├── components/
│   │   ├── UserStats.tsx             # Cartes de statistiques
│   │   ├── UserFilters.tsx           # Barre de filtres avancés
│   │   ├── UserManagementTable.tsx   # Tableau avec tri et pagination
│   │   ├── CreateUserModal.tsx       # Modal de création
│   │   ├── EditUserModal.tsx         # Modal d'édition
│   │   ├── BulkActions.tsx           # Actions en lot
│   │   ├── UserImportModal.tsx       # Import CSV
│   │   └── GestionUtilisateursCard.tsx # Carte pour le dashboard
│   ├── hooks/
│   │   └── useUserManagement.ts      # Logique métier principale
│   ├── data/
│   │   └── mockUsers.ts              # Données de test
│   ├── fetchers/
│   │   ├── useFetchGestionUtilisateurs.ts
│   │   └── useCreateGestionUtilisateurs.ts
│   ├── checkers/
│   │   └── validators.ts             # Validations
│   ├── helpers/
│   │   └── formatters.ts             # Utilitaires formatage
│   └── utils/
│       └── index.ts                  # Fonctions utilitaires
│
├── gestion-volumes/                   # Module: Gestion des volumes
│   ├── page.tsx                      # Page principale
│   ├── components/
│   │   ├── VolumeList.tsx            # Liste des volumes
│   │   ├── VolumeDialog.tsx          # Création/Édition volume
│   │   ├── IssueListDialog.tsx       # Liste des numéros
│   │   ├── IssueDialog.tsx           # Gestion d'un numéro
│   │   └── GestionVolumesCard.tsx    # Carte pour le dashboard
│   ├── data/
│   │   └── mockVolumes.ts            # Données de test
│   ├── fetchers/
│   │   ├── useFetchGestionVolumes.ts
│   │   └── useCreateGestionVolumes.ts
│   ├── checkers/
│   │   └── validators.ts
│   └── helpers/
│       └── formatters.ts
│
└── parametrage-revue/                 # Module: Configuration de la revue
    ├── page.tsx                      # Page de paramétrage
    ├── types.ts                      # Types de configuration
    ├── components/
    │   └── ParametrageRevueCard.tsx  # Carte pour le dashboard
    ├── hooks/
    │   └── useJournalConfig.ts       # Logique de configuration
    ├── fetchers/
    │   ├── useFetchParametrageRevue.ts
    │   └── useCreateParametrageRevue.ts
    ├── checkers/
    │   └── validators.ts
    └── helpers/
        └── formatters.tss/
    │   └── ParametrageRevueCard.tsx  # Carte pour le dashboard
    ├── hooks/
    │   └── useJournalConfig.ts       # Logique de configuration
    ├── fetchers/
    │   ├── useFetchParametrageRevue.ts
    │   └── useCreateParametrageRevue.ts
    ├── checkers/
    │   └── validators.ts
    └── helpers/
        └── formatters.ts
```

## 🔧 Utilisation

### Navigation
Accessible via : `/dashboard/super-admin/gestion-utilisateurs`

### Actions principales

1. **Créer un utilisateur**
   - Cliquer sur "Nouvel Utilisateur"
   - Remplir le formulaire avec les informations requises
   - Sélectionner les rôles appropriés
   - Choisir d'envoyer ou non l'email de bienvenue

2. **Modifier un utilisateur**
   - Cliquer sur le menu actions (⋮) dans le tableau
   - Sélectionner "Modifier"
   - Ajuster les informations nécessaires
   - Sauvegarder les modifications

3. **Filtrer les utilisateurs**
   - Utiliser la barre de recherche pour une recherche textuelle
   - Déployer les "Filtres avancés" pour des critères spécifiques
   - Les filtres actifs s'affichent sous forme de chips

4. **Actions en lot**
   - Sélectionner plusieurs utilisateurs avec les checkboxes
   - Une barre d'actions apparaît en bas de l'écran
   - Choisir l'action désirée (activer, désactiver, exporter, etc.)

5. **Import d'utilisateurs**
   - Cliquer sur "Import" dans le menu principal
   - Télécharger le template CSV si nécessaire
   - Glisser-déposer ou sélectionner le fichier CSV
   - Valider l'aperçu avant import final

## 📊 Types de données

### Utilisateur (User)
```typescript
interface User {
  id: string;
  email: string;
  prenom: string;
  nom: string;
  roles: UserRole[];
  status: UserStatus;
  laboratoire?: string;
  specialite?: string;
  telephone?: string;
  dateCreation: string;
  derniereConnexion?: string;
  emailVerifie: boolean;
  avatar?: string;
  isActive: boolean;
}
```

### Filtres
```typescript
interface UserFilters {
  search: string;
  roles: UserRole[];
  status: UserStatus | '';
  laboratoire: string;
  specialite: string;
  dateCreationDebut: string;
  dateCreationFin: string;
  derniereConnexion: string;
}
```

## 🔒 Sécurité

### Protections en place
- **Validation des rôles** : vérification des permissions avant action
- **Protection des admins** : impossible de supprimer les SUPER_ADMIN
- **Confirmation des actions** : double vérification pour suppressions
- **Validation des emails** : format vérifié côté client et serveur
- **Logs d'audit** : traçabilité des modifications importantes

### Bonnes pratiques
- Ne jamais supprimer le dernier SUPER_ADMIN
- Vérifier l'identité avant attribution de rôles élevés
- Utiliser la suspension plutôt que la suppression quand possible
- Documenter les modifications importantes dans les commentaires

## 🚀 Évolutions possibles

### Fonctionnalités futures
- [ ] **Historique des modifications** par utilisateur
- [ ] **Système de notifications** en temps réel
- [ ] **Dashboard analytics** avancé
- [ ] **Import depuis LDAP/Active Directory**
- [ ] **Gestion des groupes** d'utilisateurs
- [ ] **Templates de rôles** personnalisés
- [ ] **Workflow d'approbation** pour nouveaux comptes
- [ ] **Intégration SSO** (Single Sign-On)

### Améliorations techniques
- [ ] **Mise en cache** des données fréquentes
- [ ] **Lazy loading** pour les grandes listes
- [ ] **WebSocket** pour les mises à jour en temps réel
- [ ] **Tests automatisés** complets
- [ ] **API GraphQL** pour requêtes optimisées

## 🐛 Dépannage

### Problèmes courants

1. **Import CSV échoue**
   - Vérifier le format des données (email valide, rôles existants)
   - S'assurer que l'encodage est UTF-8
   - Respecter la structure du template fourni

2. **Filtres ne fonctionnent pas**
   - Vider le cache du navigateur
   - Vérifier que les données sont chargées
   - Recharger la page si nécessaire

3. **Performance lente**
   - Activer la pagination avec moins d'éléments par page
   - Utiliser les filtres pour réduire le dataset
   - Contacter l'administrateur si le problème persiste

### Support
Pour toute question ou problème, contacter l'équipe de développement via les canaux habituels.