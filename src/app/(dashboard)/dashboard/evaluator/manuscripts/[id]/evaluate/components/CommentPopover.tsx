'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Popover,
  TextField,
  Button,
  Stack,
  Typography,
} from '@mui/material';

interface CommentPopoverProps {
  anchorEl: HTMLElement | null;
  onSubmit: (comment: string) => void;
  onCancel: () => void;
}

export function CommentPopover({ anchorEl, onSubmit, onCancel }: CommentPopoverProps) {
  const [comment, setComment] = useState('');
  const textFieldRef = useRef<HTMLInputElement>(null);

  // Focus automatique quand le popover s'ouvre
  useEffect(() => {
    if (anchorEl && textFieldRef.current) {
      // Petit délai pour que le popover soit complètement rendu
      const timer = setTimeout(() => {
        textFieldRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [anchorEl]);

  const handleSubmit = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (comment.trim()) {
      onSubmit(comment);
      setComment('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      e.preventDefault();
      handleSubmit();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onCancel();
    }
  };

  const handleClose = (event: Event, reason: string) => {
    // Ne fermer que si on clique en dehors (backdrop) ou sur Échap
    if (reason === 'backdropClick' || reason === 'escapeKeyDown') {
      onCancel();
    }
  };

  return (
    <Popover
      open={Boolean(anchorEl)}
      anchorEl={anchorEl}
      onClose={handleClose as any}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
      disableRestoreFocus
      disableEnforceFocus={false}
      slotProps={{
        paper: {
          sx: {
            p: 2,
            maxWidth: 400,
            boxShadow: 3,
          },
          onClick: (e) => {
            // Empêcher la propagation pour ne pas fermer le popover
            e.stopPropagation();
          },
        },
      }}
    >
      <Stack spacing={2}>
        <Typography variant="subtitle2" color="text.secondary">
          Ajouter un commentaire
        </Typography>

        <TextField
          inputRef={textFieldRef}
          fullWidth
          multiline
          rows={3}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Votre commentaire..."
          onKeyDown={handleKeyDown}
          helperText="Ctrl+Enter pour enregistrer, Échap pour annuler"
        />

        <Stack direction="row" spacing={1} justifyContent="flex-end">
          <Button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onCancel();
            }}
            variant="outlined"
            size="small"
          >
            Annuler
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            size="small"
            disabled={!comment.trim()}
          >
            Enregistrer
          </Button>
        </Stack>
      </Stack>
    </Popover>
  );
}
