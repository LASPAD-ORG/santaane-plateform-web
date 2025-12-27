# Docker Configuration Guide

Ce guide explique comment utiliser les configurations Docker pour le projet Santaane Platform Web.

## Architecture

- **Dockerfile** : Multi-stage (development + production)
- **Base Image** : node:24-alpine
- **Package Manager** : pnpm
- **Optimisations** : BuildKit cache, standalone mode, non-root user

## Prérequis

- Docker et Docker Compose installés
- Backend démarré (pour le développement)

## Développement

### Démarrage

```bash
# 1. Assurez-vous que le backend est démarré
cd ../santaane-plateform-api
./santaane dev

# 2. Retournez au frontend et démarrez
cd ../santaane-plateform-web
docker-compose -f docker-compose.dev.yml up
```

### Caractéristiques Dev

- ✅ Hot reload activé (modifications en temps réel)
- ✅ Volumes montés pour src/, public/, middleware.ts
- ✅ Port 3000 exposé
- ✅ Connecté au réseau backend (santaane-plateform-api_default)

### Rebuild

```bash
# Rebuild après modification des dépendances
docker-compose -f docker-compose.dev.yml build

# Rebuild sans cache
docker-compose -f docker-compose.dev.yml build --no-cache
```

### Arrêt

```bash
docker-compose -f docker-compose.dev.yml down
```

## Production

### Configuration

1. Créez `.env.production` à partir de `.env.production.example`
2. Configurez les variables :

```env
NEXT_PUBLIC_API_URL=https://app.santaane.com/api
NEXT_PUBLIC_BACKEND_URL=http://api:8000
```

### Build et Démarrage

```bash
# Build l'image production
docker-compose -f docker-compose.prod.yml build

# Démarrer en mode détaché
docker-compose -f docker-compose.prod.yml up -d

# Voir les logs
docker-compose -f docker-compose.prod.yml logs -f web
```

### Health Check

```bash
# Vérifier la santé du container
curl http://localhost:3000/api/health

# Réponse attendue
{
  "status": "healthy",
  "timestamp": "2025-12-26T...",
  "service": "santaane-web"
}
```

### Arrêt

```bash
docker-compose -f docker-compose.prod.yml down
```

## Optimisations

### Build Context

Le fichier `.dockerignore` réduit le contexte de build :
- **Avant** : ~2GB (avec node_modules, .git, etc.)
- **Après** : ~50MB (uniquement le code source)

### Image Size

- **Development** : ~2.5GB (avec dev dependencies)
- **Production** : ~300MB (standalone mode + prod deps seulement)

### Build Time

- **Premier build** : 3-5 minutes
- **Builds suivants** : 30s-1min (grâce au cache BuildKit)

## Réseau Docker

### Development

Le frontend se connecte au réseau backend :
- **Network** : `santaane-plateform-api_default` (créé par le backend)
- **Backend accessible via** : `http://api:8000` (container-to-container)

### Production

Réseau bridge indépendant :
- **Network** : `santaane_network`
- Pour déploiement avec backend, modifiez pour utiliser le même réseau

## Variables d'Environnement

### NEXT_PUBLIC_API_URL

URL utilisée par le browser pour appeler les API routes Next.js.

- **Dev** : `http://localhost:3000/api`
- **Prod** : `https://app.santaane.com/api`

### NEXT_PUBLIC_BACKEND_URL

URL backend pour les appels serveur-side.

- **Dev** : `http://localhost:8000` (host) ou `http://api:8000` (container)
- **Prod** : `http://api:8000` (même réseau Docker)

## Troubleshooting

### Hot reload ne fonctionne pas

Vérifiez que `WATCHPACK_POLLING=true` est défini dans docker-compose.dev.yml.

### Permission denied sur entrypoint.sh

```bash
chmod +x entrypoint.sh
```

### Cannot connect to backend

Assurez-vous que :
1. Le backend est démarré : `cd ../santaane-plateform-api && ./santaane status`
2. Le réseau existe : `docker network ls | grep santaane`

### Image trop volumineuse

Vérifiez que `.dockerignore` est présent et contient les exclusions nécessaires.

## Commandes Utiles

```bash
# Voir les containers en cours
docker ps

# Voir les logs en temps réel
docker-compose -f docker-compose.dev.yml logs -f

# Entrer dans le container
docker exec -it santaane_web_dev sh

# Voir l'utilisation des ressources
docker stats santaane_web_dev

# Nettoyer les images non utilisées
docker image prune -a

# Voir la taille des images
docker images | grep santaane
```

## Structure des Fichiers Docker

```
santaane-plateform-web/
├── Dockerfile                    # Multi-stage (dev + prod)
├── docker-compose.dev.yml        # Configuration développement
├── docker-compose.prod.yml       # Configuration production
├── .dockerignore                 # Exclusions build context
├── healthcheck.js                # Script health check
├── entrypoint.sh                 # Script démarrage production
├── .env.example                  # Template variables dev
└── .env.production.example       # Template variables prod
```

## Next Steps

Pour un déploiement complet avec backend + frontend + base de données, consultez la documentation du backend.
