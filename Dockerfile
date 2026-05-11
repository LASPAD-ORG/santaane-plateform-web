# =============================================================================
# Multi-Stage Dockerfile for Santaane Platform Web (Next.js 16)
# =============================================================================

# =============================================================================
# STAGE 1: Base - Common foundation for all stages
# =============================================================================
FROM node:24-alpine AS base

# Install pnpm via corepack (built into Node 24)
RUN corepack enable && corepack prepare pnpm@latest --activate

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs

WORKDIR /app

# =============================================================================
# STAGE 2: Dependencies - Install all dependencies
# =============================================================================
FROM base AS dependencies

# Copy dependency files
COPY package.json pnpm-lock.yaml ./

# Install dependencies with cache mount for faster builds
RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile

# =============================================================================
# STAGE 3: Builder - Build Next.js application
# =============================================================================
FROM base AS builder

# Copy dependencies from previous stage
COPY --from=dependencies /app/node_modules ./node_modules

# Copy source code
COPY . .

# Build arguments for environment variables
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_BACKEND_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
ENV NEXT_PUBLIC_BACKEND_URL=${NEXT_PUBLIC_BACKEND_URL}

# Disable telemetry during build
ENV NEXT_TELEMETRY_DISABLED=1

# Build application
RUN pnpm build

# =============================================================================
# STAGE 4a: Development - Hot reload environment
# =============================================================================
FROM base AS development

# Copy dependencies
COPY --from=dependencies /app/node_modules ./node_modules

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Copy source code (will be overridden by volume mount)
COPY . .

# Change ownership to non-root user
RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

ENV NODE_ENV=development
ENV NEXT_TELEMETRY_DISABLED=1

# Development server with hot reload
CMD ["pnpm", "dev"]

# =============================================================================
# STAGE 4b: Production - Optimized runtime
# =============================================================================
FROM base AS production

# Install only production dependencies
COPY package.json pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile

# Copy built application from builder
# Note: Next.js standalone mode outputs to .next/standalone
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Copy health check script
COPY --chown=nextjs:nodejs healthcheck.js ./

# Copy entrypoint script
COPY --chown=nextjs:nodejs entrypoint.sh ./
RUN chmod +x entrypoint.sh

USER nextjs

EXPOSE 3000

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD node healthcheck.js || exit 1

ENTRYPOINT ["/app/entrypoint.sh"]
