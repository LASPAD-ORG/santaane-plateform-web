# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Santaane Platform Web** - A Next.js 16 application with multi-role authentication, Material-UI components, Zustand state management, and HTTP-Only cookie security. Manages researchers, content creation, mentoring, and evaluation workflows.

## Prerequisites

- **Node.js**: v24.11.0 (required)
- **Package Manager**: pnpm (install globally with `npm install -g pnpm`)

## Common Development Commands

```bash
# Development
pnpm dev             # Start development server at http://localhost:3000
pnpm install         # Install dependencies
pnpm create-page     # Interactive CLI to generate new pages

# Production
pnpm build           # Create optimized production build
pnpm start           # Run production server

# Code Quality
pnpm lint            # Run ESLint
```

## Architecture

### Framework: Next.js 16 App Router

- **Default to Server Components**: Components are server components by default
- **Client Components**: Add `'use client'` directive when using hooks, state, or browser APIs
- **Route Groups**: `(public)` for login/register, `(dashboard)` for protected routes
- **API Routes**: Proxy endpoints in `src/app/api/` that forward to backend

### Authentication Architecture (HTTP-Only Cookies)

**Security Model**: Tokens stored as HTTP-Only cookies (inaccessible to JavaScript), user data in Zustand memory store.

**Flow**:
1. Login request → `/api/auth/login` (Next.js API route)
2. API route calls backend → stores token as HTTP-Only cookie
3. Frontend calls `/api/auth/me` → gets user data
4. User stored in `authStore` (memory only)
5. Middleware redirects unauthenticated users

**Key Files**:
- `middleware.ts` - Route protection, checks `auth_token` cookie
- `src/components/guards/AuthGuard.tsx` - Component-level auth protection
- `src/components/guards/RoleGuard.tsx` - Role-based access control
- `src/stores/authStore.ts` - Authentication state (user, isAuthenticated, login/logout)

### Role-Based Access Control (RBAC)

Five roles with hierarchical permissions defined in `src/config/roles.ts`:

```typescript
enum UserRole {
  SUPER_ADMIN,  // Platform administration
  EDITOR,       // Laboratory/researcher management
  EVALUATOR,    // Article evaluation (includes MENTOR + AUTHOR)
  MENTOR,       // Mentoring researchers (includes AUTHOR)
  AUTHOR        // Create and manage articles (base role)
}
```

Users can have multiple roles. Use `getMenuItemsForRoles()` and `canAccessRoute()` for access control.

### Path Aliases

The project uses TypeScript path mapping:
- `@/*` → `src/*` (e.g., `import { Component } from '@/components/ComponentName'`)

### State Management (Zustand)

Create stores in `src/stores/` following this pattern:

```typescript
// src/stores/exampleStore.ts
import { create } from 'zustand';

interface ExampleState {
  value: string;
  setValue: (value: string) => void;
}

export const useExampleStore = create<ExampleState>((set) => ({
  value: '',
  setValue: (value) => set({ value }),
}));
```

**Usage**: Import stores in client components only (those with `'use client'` directive).

### API Integration (Axios)

HTTP client configured in `src/lib/api/client.ts`:
- Base URL: `/api` (uses Next.js API routes as proxy to backend)
- Automatically includes HTTP-Only cookies (`withCredentials: true`)
- 401 response interceptor redirects to login

Organize API calls in `src/services/` by domain (e.g., `authService.ts`, `userService.ts`).

### UI Components (Material-UI v7)

**Theme** (defined in `src/lib/theme.ts`):
- Primary: Orange (#ff9c00)
- Secondary: Teal (#59a498)
- Font: Geist family

**Component Pattern**:

```typescript
'use client'; // Required for MUI components

import { Button, Stack, Card } from '@mui/material';

export function ExampleComponent() {
  return (
    <Card>
      <Stack spacing={2} padding={2}>
        <Button variant="contained">Action</Button>
      </Stack>
    </Card>
  );
}
```

**Organization**: Components in `src/components/` by category:
- `guards/` - AuthGuard, RoleGuard
- `layouts/` - Sidebar, navigation
- `ui/` - GlobalAlert, reusable UI

### Cookie Management

**Important**: Auth tokens are HTTP-Only cookies managed exclusively by API routes. Client code cannot access them directly.

For non-sensitive cookies:
- **Server Components**: Use `cookies()` from `next/headers`
- **Client Components**: Use `getCookie()` from `cookies-next`
- **API Routes**: Access via `request.cookies` or set via `NextResponse.cookies`

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (dashboard)/       # Protected routes (requires auth)
│   │   └── dashboard/     # Dashboard pages by role
│   ├── (public)/          # Public routes (login, register)
│   ├── api/auth/          # Auth API routes (login, register, me, logout)
│   └── layout.tsx         # Root layout with ThemeRegistry
├── components/
│   ├── guards/            # AuthGuard, RoleGuard
│   ├── layouts/           # Sidebar
│   └── ui/                # GlobalAlert
├── config/                # Configuration constants
│   ├── roles.ts           # RBAC definitions, menu items
│   └── routes.ts          # Route definitions
├── lib/
│   ├── api/client.ts      # Axios HTTP client
│   └── theme.ts           # MUI theme configuration
├── services/              # API calls (authService.ts)
├── stores/                # Zustand stores (authStore, alertStore)
└── types/                 # TypeScript types (auth.ts)
```

## TypeScript Configuration

- **Target**: ES2017
- **Module**: ESNext with bundler resolution
- **Strict Mode**: Enabled
- **JSX**: react-jsx (no need to import React)
- **Path Aliases**: Configured in tsconfig.json

## Environment Variables

Create a `.env.local` file at the project root for environment configuration:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

Variables prefixed with `NEXT_PUBLIC_` are accessible on the client side.

## Key Technical Decisions

1. **HTTP-Only Cookies**: Auth tokens stored server-side only, prevents XSS token theft
2. **API Routes as Proxy**: Backend isolation, centralized auth handling
3. **Middleware for Route Protection**: Server-side auth checks before rendering
4. **Multi-Role Support**: Users can have multiple roles with hierarchical permissions
5. **Zustand over Context**: Lightweight state management for complex state
6. **pnpm**: Faster installs and better disk space efficiency
