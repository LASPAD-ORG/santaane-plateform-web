'use client';

import { ReactNode, useMemo } from 'react';
import { CacheProvider } from '@emotion/react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { theme } from '@/lib/theme';
import GlobalAlert from '@/components/ui/GlobalAlert';
import { createEmotionCache } from '@/lib/createEmotionCache';

interface ThemeRegistryProps {
  children: ReactNode;
}

export default function ThemeRegistry({ children }: ThemeRegistryProps) {
  const cache = useMemo(() => createEmotionCache(), []);

  return (
    <CacheProvider value={cache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
        <GlobalAlert />
      </ThemeProvider>
    </CacheProvider>
  );
}
