'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  IconButton,
  Paper,
  Tooltip,
  TextField,
  Button,
  Stack,
  ClickAwayListener,
} from '@mui/material';
import { Block as BlockIcon } from '@mui/icons-material';

interface RedactionSelectionTipProps {
  onAddRedaction: (comment: string) => void;
}

export function RedactionSelectionTip({ onAddRedaction }: RedactionSelectionTipProps) {
  const [showForm, setShowForm] = useState(false);
  const [comment, setComment] = useState('Zone anonymisée');
  const textFieldRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (showForm && textFieldRef.current) {
      setTimeout(() => {
        textFieldRef.current?.focus();
      }, 50);
    }
  }, [showForm]);

  const handleSubmit = () => {
    if (comment.trim()) {
      onAddRedaction(comment);
      setComment('Zone anonymisée'); // Reset to default
      setShowForm(false);
    }
  };

  const handleCancel = () => {
    setComment('Zone anonymisée'); // Reset to default
    setShowForm(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      e.preventDefault();
      e.stopPropagation();
      handleSubmit();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      e.stopPropagation();
      handleCancel();
    }
  };

  if (showForm) {
    return (
      <ClickAwayListener onClickAway={handleCancel}>
        <Paper
          elevation={6}
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
          sx={{
            p: 2,
            minWidth: 350,
            maxWidth: 400,
            animation: 'slideIn 0.2s ease-out',
            '@keyframes slideIn': {
              from: { opacity: 0, transform: 'translateY(-10px)' },
              to: { opacity: 1, transform: 'translateY(0)' },
            },
          }}
        >
          <Stack spacing={2}>
            <TextField
              inputRef={textFieldRef}
              fullWidth
              multiline
              rows={2}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Description de la zone anonymisée..."
              onKeyDown={handleKeyDown}
              onMouseDown={(e) => e.stopPropagation()}
              onClick={(e) => e.stopPropagation()}
              size="small"
              helperText="Ctrl+Enter pour créer, Échap pour annuler"
            />

            <Stack direction="row" spacing={1} justifyContent="flex-end">
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  handleCancel();
                }}
                variant="outlined"
                size="small"
              >
                Annuler
              </Button>
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  handleSubmit();
                }}
                variant="contained"
                size="small"
                color="error"
                disabled={!comment.trim()}
              >
                Masquer
              </Button>
            </Stack>
          </Stack>
        </Paper>
      </ClickAwayListener>
    );
  }

  return (
    <Paper
      elevation={4}
      sx={{
        p: 0.5,
        borderRadius: 1,
        bgcolor: 'error.main',
        transition: 'all 0.2s ease-in-out',
        animation: 'fadeIn 0.2s ease-in',
        '@keyframes fadeIn': {
          from: { opacity: 0, transform: 'scale(0.8)' },
          to: { opacity: 1, transform: 'scale(1)' },
        },
        '&:hover': {
          transform: 'scale(1.15)',
          boxShadow: 6,
        },
      }}
    >
      <Tooltip title="Créer une zone d'anonymisation (Alt+Drag)" arrow>
        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            setShowForm(true);
          }}
          onMouseDown={(e) => e.stopPropagation()}
          sx={{
            color: 'white',
            transition: 'all 0.2s',
            '&:hover': {
              bgcolor: 'rgba(255, 255, 255, 0.15)',
            },
          }}
        >
          <BlockIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </Paper>
  );
}
