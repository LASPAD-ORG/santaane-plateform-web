import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#0a0a0a',
      light: '#3d3c38',
      dark: '#000000',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#b8953a',
      light: '#c9a440',
      dark: '#8a6e2a',
      contrastText: '#0a0a0a',
    },
    error: {
      main: '#d32f2f',
    },
    warning: {
      main: '#b8953a',
    },
    info: {
      main: '#3d3c38',
    },
    success: {
      main: '#2e7d32',
    },
    background: {
      default: '#f5f4f0',
      paper: '#ffffff',
    },
    text: {
      primary: '#0a0a0a',
      secondary: '#8a887f',
      disabled: '#d4d2cc',
    },
    divider: '#d4d2cc',
  },
  typography: {
    fontFamily: '"Noto Sans", var(--font-noto-sans), -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    h1: { fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.03em' },
    h2: { fontSize: '2rem',   fontWeight: 800, letterSpacing: '-0.03em' },
    h3: { fontSize: '1.75rem',fontWeight: 700, letterSpacing: '-0.02em' },
    h4: { fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.02em' },
    h5: { fontSize: '1.25rem',fontWeight: 700, letterSpacing: '-0.01em' },
    h6: { fontSize: '1rem',   fontWeight: 600, letterSpacing: '-0.01em' },
    body1: { lineHeight: 1.75 },
    body2: { lineHeight: 1.65 },
    button: { fontWeight: 700, letterSpacing: '0.04em' },
    caption: { fontSize: '0.75rem', letterSpacing: '0.01em' },
    overline: { fontWeight: 700, letterSpacing: '0.1em' },
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
        body: {
          fontFamily: '"Noto Sans", var(--font-noto-sans), sans-serif',
          backgroundColor: '#f5f4f0',
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
        },
        '::selection': {
          backgroundColor: 'rgba(184,149,58,0.18)',
        },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 700,
          borderRadius: 4,
          boxShadow: 'none',
          '&:hover': { boxShadow: 'none' },
        },
      },
    },
    MuiCard: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          border: '1px solid #d4d2cc',
          boxShadow: 'none',
          backgroundImage: 'none',
        },
      },
    },
    MuiPaper: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: { backgroundImage: 'none' },
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
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#d4d2cc',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#3d3c38',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#0a0a0a',
            borderWidth: 1.5,
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontFamily: '"Noto Sans", var(--font-noto-sans), sans-serif',
          color: '#8a887f',
          '&.Mui-focused': { color: '#0a0a0a' },
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
    MuiAppBar: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          borderBottom: '1px solid #d4d2cc',
        },
        colorPrimary: {
          backgroundColor: '#ffffff',
          color: '#0a0a0a',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: { backgroundImage: 'none' },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: { borderColor: '#d4d2cc' },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          fontFamily: '"Noto Sans", var(--font-noto-sans), sans-serif',
          borderRadius: 4,
        },
      },
    },
    MuiAccordion: {
      defaultProps: { elevation: 0, disableGutters: true },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          fontFamily: '"Noto Sans", var(--font-noto-sans), sans-serif',
          fontSize: '0.75rem',
          bgcolor: '#0a0a0a',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          fontFamily: '"Noto Sans", var(--font-noto-sans), sans-serif',
          borderBottomColor: '#d4d2cc',
        },
        head: {
          fontWeight: 700,
          fontSize: '0.75rem',
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          color: '#8a887f',
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:hover': { backgroundColor: '#f5f4f0' },
        },
      },
    },
    MuiPagination: {
      styleOverrides: {
        root: {
          '& .MuiPaginationItem-root': {
            fontFamily: '"Noto Sans", var(--font-noto-sans), sans-serif',
            fontWeight: 600,
            borderRadius: 4,
          },
          '& .MuiPaginationItem-root.Mui-selected': {
            backgroundColor: '#0a0a0a',
            color: '#ffffff',
            '&:hover': { backgroundColor: '#b8953a' },
          },
        },
      },
    },
  },
});