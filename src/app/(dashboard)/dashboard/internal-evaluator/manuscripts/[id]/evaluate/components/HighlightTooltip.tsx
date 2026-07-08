'use client';

import React from 'react';
import { Paper, Typography } from '@mui/material';

interface HighlightTooltipProps {
  comment: string;
}

export function HighlightTooltip({ comment }: HighlightTooltipProps) {
  return (
    <Paper
      elevation={6}
      sx={{
        p: 1.5,
        maxWidth: 300,
        backgroundColor: 'rgba(255, 235, 59, 0.95)',
        border: '1px solid #fbc02d',
        borderRadius: 1,
        animation: 'tooltipFadeIn 0.2s ease-out',
        '@keyframes tooltipFadeIn': {
          from: { opacity: 0, transform: 'scale(0.9)' },
          to: { opacity: 1, transform: 'scale(1)' },
        },
      }}
    >
      <Typography
        variant="body2"
        sx={{
          color: 'rgba(0, 0, 0, 0.87)',
          wordWrap: 'break-word',
          whiteSpace: 'pre-wrap',
        }}
      >
        {comment}
      </Typography>
    </Paper>
  );
}
