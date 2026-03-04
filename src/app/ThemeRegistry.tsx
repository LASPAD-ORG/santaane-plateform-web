'use client';

import { ReactNode, useMemo } from 'react';
import { CacheProvider } from '@emotion/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import GlobalAlert from '@/components/ui/GlobalAlert';
import { createEmotionCache } from '@/lib/createEmotionCache';

// ─── Global Africa Journal design tokens ───
const GOLD = '#b8953a';
const BLACK = '#0a0a0a';
const OFF_WHITE = '#f5f4f0';
const GRAY_300 = '#d4d2cc';
const GRAY_500 = '#8a887f';

const santaaneTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: BLACK,
      contrastText: '#ffffff',
    },
    secondary: {
      main: GOLD,
      contrastText: BLACK,
    },
    background: {
      default: OFF_WHITE,
      paper: '#ffffff',
    },
    text: {
      primary: BLACK,
      secondary: GRAY_500,
      disabled: GRAY_300,
    },
    divider: GRAY_300,
  },
  typography: {
    fontFamily: '"Noto Sans", var(--font-noto-sans), sans-serif',
    h1: { fontWeight: 800, letterSpacing: '-0.03em' },
    h2: { fontWeight: 800, letterSpacing: '-0.03em' },
    h3: { fontWeight: 700, letterSpacing: '-0.02em' },
    h4: { fontWeight: 700, letterSpacing: '-0.02em' },
    h5: { fontWeight: 700, letterSpacing: '-0.01em' },
    h6: { fontWeight: 600, letterSpacing: '-0.01em' },
    body1: { lineHeight: 1.75 },
    body2: { lineHeight: 1.65 },
    caption: { fontSize: '0.75rem', letterSpacing: '0.01em' },
    button: {
      fontWeight: 700,
      letterSpacing: '0.04em',
    },
  },
  shape: {
    borderRadius: 6,
  },
  shadows: [
    'none',
    '0 1px 3px rgba(0,0,0,0.06)',
    '0 2px 6px rgba(0,0,0,0.06)',
    '0 4px 12px rgba(0,0,0,0.07)',
    '0 6px 16px rgba(0,0,0,0.07)',
    '0 8px 24px rgba(0,0,0,0.08)',
    '0 10px 28px rgba(0,0,0,0.08)',
    '0 12px 32px rgba(0,0,0,0.09)',
    '0 14px 36px rgba(0,0,0,0.09)',
    '0 16px 40px rgba(0,0,0,0.10)',
    '0 18px 44px rgba(0,0,0,0.10)',
    '0 20px 48px rgba(0,0,0,0.11)',
    '0 22px 52px rgba(0,0,0,0.11)',
    '0 24px 56px rgba(0,0,0,0.12)',
    '0 26px 60px rgba(0,0,0,0.12)',
    '0 28px 64px rgba(0,0,0,0.13)',
    '0 30px 68px rgba(0,0,0,0.13)',
    '0 32px 72px rgba(0,0,0,0.14)',
    '0 34px 76px rgba(0,0,0,0.14)',
    '0 36px 80px rgba(0,0,0,0.15)',
    '0 38px 84px rgba(0,0,0,0.15)',
    '0 40px 88px rgba(0,0,0,0.16)',
    '0 42px 92px rgba(0,0,0,0.16)',
    '0 44px 96px rgba(0,0,0,0.17)',
    '0 46px 100px rgba(0,0,0,0.17)',
  ],
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        '*, *::before, *::after': { boxSizing: 'border-box' },
        body: {
          fontFamily: '"Noto Sans", var(--font-noto-sans), sans-serif',
          backgroundColor: OFF_WHITE,
          color: BLACK,
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
        },
        '::selection': {
          backgroundColor: `${GOLD}33`,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          fontFamily: '"Noto Sans", var(--font-noto-sans), sans-serif',
          borderRadius: 4,
          textTransform: 'none',
          boxShadow: 'none',
          '&:hover': { boxShadow: 'none' },
        },
      },
      defaultProps: {
        disableElevation: true,
      },
    },
    MuiPaper: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontFamily: '"Noto Sans", var(--font-noto-sans), sans-serif',
          fontWeight: 500,
        },
      },
    },
    MuiTextField: {
      defaultProps: { variant: 'outlined' },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          fontFamily: '"Noto Sans", var(--font-noto-sans), sans-serif',
          borderRadius: 4,
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontFamily: '"Noto Sans", var(--font-noto-sans), sans-serif',
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontFamily: '"Noto Sans", var(--font-noto-sans), sans-serif',
          fontSize: '0.875rem',
        },
      },
    },
    MuiTypography: {
      defaultProps: { variantMapping: { body1: 'p', body2: 'p' } },
    },
    MuiDivider: {
      styleOverrides: {
        root: { borderColor: GRAY_300 },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundImage: 'none',
        },
      },
    },
    MuiAccordion: {
      defaultProps: { elevation: 0, disableGutters: true },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          fontFamily: '"Noto Sans", var(--font-noto-sans), sans-serif',
          borderRadius: 4,
        },
      },
    },
    MuiSkeleton: {
      styleOverrides: {
        root: { bgcolor: GRAY_300 },
      },
    },
  },
});

interface ThemeRegistryProps {
  children: ReactNode;
}

export default function ThemeRegistry({ children }: ThemeRegistryProps) {
  const cache = useMemo(() => createEmotionCache(), []);

  return (
    <CacheProvider value={cache}>
      <ThemeProvider theme={santaaneTheme}>
        <CssBaseline />
        {children}
        <GlobalAlert />
      </ThemeProvider>
    </CacheProvider>
  );
}