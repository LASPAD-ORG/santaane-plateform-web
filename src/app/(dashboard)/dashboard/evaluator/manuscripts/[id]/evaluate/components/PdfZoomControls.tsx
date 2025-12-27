'use client';

import React from 'react';
import {
  Paper,
  Stack,
  IconButton,
  Select,
  MenuItem,
  Tooltip,
  Divider,
} from '@mui/material';
import {
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
} from '@mui/icons-material';
import type { PdfScaleValue } from 'react-pdf-highlighter-plus';

interface PdfZoomControlsProps {
  currentZoom: PdfScaleValue;
  onZoomChange: (value: PdfScaleValue) => void;
}

const ZOOM_OPTIONS = [
  { value: 'auto', label: 'Ajuster' },
  { value: 'page-fit', label: 'Page entière' },
  { value: 'page-width', label: 'Largeur page' },
  { value: 0.5, label: '50%' },
  { value: 0.75, label: '75%' },
  { value: 1, label: '100%' },
  { value: 1.25, label: '125%' },
  { value: 1.5, label: '150%' },
  { value: 2, label: '200%' },
];

export function PdfZoomControls({ currentZoom, onZoomChange }: PdfZoomControlsProps) {
  const handleZoomIn = () => {
    if (typeof currentZoom === 'number') {
      const newZoom = Math.min(currentZoom + 0.25, 3);
      onZoomChange(newZoom);
    } else {
      onZoomChange(1.25);
    }
  };

  const handleZoomOut = () => {
    if (typeof currentZoom === 'number') {
      const newZoom = Math.max(currentZoom - 0.25, 0.5);
      onZoomChange(newZoom);
    } else {
      onZoomChange(0.75);
    }
  };

  return (
    <Paper
      elevation={1}
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        px: 1,
        py: 0.5,
        borderRadius: 1,
        transition: 'box-shadow 0.2s',
        '&:hover': {
          boxShadow: 2,
        },
      }}
    >
      <Stack direction="row" spacing={0.5} alignItems="center">
        <Tooltip title="Zoom arrière">
          <IconButton
            size="small"
            onClick={handleZoomOut}
            sx={{
              transition: 'all 0.2s',
              '&:hover': {
                transform: 'scale(1.1)',
                bgcolor: 'action.hover',
              },
            }}
          >
            <ZoomOutIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

        <Select
          value={currentZoom}
          onChange={(e) => onZoomChange(e.target.value)}
          size="small"
          sx={{
            minWidth: 120,
            '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
            transition: 'all 0.2s',
            '&:hover': {
              bgcolor: 'action.hover',
            },
          }}
        >
          {ZOOM_OPTIONS.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>

        <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

        <Tooltip title="Zoom avant">
          <IconButton
            size="small"
            onClick={handleZoomIn}
            sx={{
              transition: 'all 0.2s',
              '&:hover': {
                transform: 'scale(1.1)',
                bgcolor: 'action.hover',
              },
            }}
          >
            <ZoomInIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Stack>
    </Paper>
  );
}
