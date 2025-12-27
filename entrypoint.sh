#!/bin/sh
# entrypoint.sh - Production startup script for Santaane Web
set -e

echo "========================================="
echo "Starting Santaane Web in PRODUCTION mode"
echo "========================================="
echo "Environment: ${NODE_ENV:-production}"
echo "API URL: ${NEXT_PUBLIC_API_URL}"
echo "Backend URL: ${NEXT_PUBLIC_BACKEND_URL}"
echo "========================================="

# Validate required environment variables
if [ -z "$NEXT_PUBLIC_API_URL" ]; then
  echo "ERROR: NEXT_PUBLIC_API_URL is not set"
  exit 1
fi

if [ -z "$NEXT_PUBLIC_BACKEND_URL" ]; then
  echo "WARNING: NEXT_PUBLIC_BACKEND_URL is not set"
fi

# Start production server
echo "Starting Next.js production server..."
exec pnpm start
