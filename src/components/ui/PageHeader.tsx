'use client';

import { Box, Typography, Button } from '@mui/material';
import { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: {
    label: string;
    icon?: ReactNode;
    onClick: () => void;
    variant?: 'contained' | 'outlined' | 'text';
  };
}

export default function PageHeader({ title, subtitle, action }: PageHeaderProps) {
  return (
    <Box
      sx={{
        mb: { xs: 3, md: 4 },
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'space-between',
        alignItems: { xs: 'flex-start', sm: 'center' },
        gap: { xs: 2, sm: 0 },
      }}
    >
      <Box>
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontWeight: 700,
            fontSize: { xs: '1.75rem', sm: '2rem', md: '1.25rem' },
            color: 'text.primary',
            mb: subtitle ? 1 : 0,
          }}
        >
          {title}
        </Typography>
        {subtitle && (
          <Typography
            variant="body1"
            sx={{
              color: 'text.secondary',
              fontSize: { xs: '0.875rem', sm: '1rem' },
            }}
          >
            {subtitle}
          </Typography>
        )}
      </Box>

      {action && (
        <Button
          variant={action.variant || 'contained'}
          startIcon={action.icon}
          onClick={action.onClick}
          sx={{
            minWidth: { xs: '100%', sm: 'auto' },
            whiteSpace: 'nowrap',
          }}
        >
          {action.label}
        </Button>
      )}
    </Box>
  );
}
