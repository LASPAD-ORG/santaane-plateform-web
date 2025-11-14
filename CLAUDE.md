# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Santaane Platform Web** - A Next.js 16 application using the App Router architecture with Material-UI, Zustand for state management, and Axios for API communication.

## Prerequisites

- **Node.js**: v24.11.0 (required)
- **Package Manager**: pnpm (install globally with `npm install -g pnpm`)

## Common Development Commands

```bash
# Development
pnpm dev             # Start development server at http://localhost:3000
pnpm install         # Install dependencies

# Production
pnpm build           # Create optimized production build
pnpm start           # Run production server

# Code Quality
pnpm lint            # Run ESLint (currently basic setup)
```

## Architecture

### Framework: Next.js 16 App Router

- **Default to Server Components**: Components are server components by default
- **Client Components**: Add `'use client'` directive when using hooks, state, or browser APIs
- **File-based Routing**: Routes defined in `src/app/` directory structure
- **API Routes**: Create API endpoints in `src/app/api/` directory

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

Centralize Axios configuration in `src/lib/api/`:

```typescript
// src/lib/api/client.ts - Create this for API calls
import axios from 'axios';
import { getCookie } from 'cookies-next';

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
});

// Add auth token to requests
apiClient.interceptors.request.use((config) => {
  const token = getCookie('auth_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
```

Organize API calls in `src/services/` by domain (e.g., `authService.ts`, `userService.ts`).

### UI Components (Material-UI v7)

**Dependencies**:
- `@mui/material` - Core components
- `@mui/icons-material` - Icon library
- `@mui/x-data-grid` - Advanced data grid
- `@emotion/react` & `@emotion/styled` - CSS-in-JS styling

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

**Organization**: Place reusable components in `src/components/` organized by category:
- `common/` - Shared UI components
- `forms/` - Form components
- `features/` - Feature-specific components

### Cookie Management (cookies-next)

Use `cookies-next` for cookie operations. Pattern for authentication cookies:

```typescript
// src/lib/cookies.ts
import { getCookie, setCookie, deleteCookie } from 'cookies-next';

export function setAuthToken(token: string) {
  setCookie('auth_token', token, {
    maxAge: 60 * 60 * 24 * 7, // 7 days
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  });
}
```

Access cookies in:
- **Server Components**: Use `cookies()` from `next/headers`
- **Client Components**: Use `getCookie()` from `cookies-next`
- **API Routes**: Access via request headers

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
├── lib/                   # Utilities & configurations
│   ├── api/              # Axios client & API utilities
│   └── cookies.ts        # Cookie management utilities
├── services/             # Business logic & API calls
└── stores/               # Zustand state stores
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

1. **App Router over Pages Router**: Leverages React Server Components for better performance
2. **Material-UI v7**: Component library with Emotion styling
3. **Zustand**: Lightweight state management (prefer over Context API for complex state)
4. **Axios over Fetch**: Centralized HTTP client with interceptors for auth/error handling
5. **cookies-next**: Simplified cookie API compatible with both server and client components
6. **pnpm**: Chosen as package manager for faster installs and better disk space efficiency
