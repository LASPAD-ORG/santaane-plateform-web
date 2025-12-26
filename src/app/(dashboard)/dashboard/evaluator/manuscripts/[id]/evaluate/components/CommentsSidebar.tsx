'use client';

import React, { useState, useMemo } from 'react';
import {
  Box,
  Paper,
  TextField,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  IconButton,
  InputAdornment,
  Divider,
  Stack,
  Chip,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import type { EvaluatorHighlight } from '@/types/evaluator';
import { groupHighlightsByPage } from '@/types/evaluator';

interface CommentsSidebarProps {
  highlights: EvaluatorHighlight[];
  onHighlightClick: (highlightId: string) => void;
  onDelete?: (highlightId: string) => void;
  totalPages?: number;
  readOnly?: boolean;
}

export function CommentsSidebar({
  highlights,
  onHighlightClick,
  onDelete,
  totalPages = 10,
  readOnly = false,
}: CommentsSidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedPages, setExpandedPages] = useState<Set<number>>(new Set([1]));

  // Grouper les highlights par page
  const highlightsByPage = useMemo(() => {
    return groupHighlightsByPage(highlights);
  }, [highlights]);

  // Filtrer les highlights selon la recherche
  const filteredHighlightsByPage = useMemo(() => {
    if (!searchQuery.trim()) {
      return highlightsByPage;
    }

    const filtered = new Map<number, EvaluatorHighlight[]>();
    const query = searchQuery.toLowerCase();

    highlightsByPage.forEach((pageHighlights, pageNumber) => {
      const matchingHighlights = pageHighlights.filter(
        (h) =>
          h.comment.toLowerCase().includes(query) ||
          h.content?.text?.toLowerCase().includes(query)
      );

      if (matchingHighlights.length > 0) {
        filtered.set(pageNumber, matchingHighlights);
      }
    });

    return filtered;
  }, [highlightsByPage, searchQuery]);

  const handleAccordionChange = (pageNumber: number) => {
    setExpandedPages((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(pageNumber)) {
        newSet.delete(pageNumber);
      } else {
        newSet.add(pageNumber);
      }
      return newSet;
    });
  };

  // Calculer le nombre total de commentaires
  const totalComments = highlights.length;

  return (
    <Paper
      elevation={0}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 0,
        borderLeft: '1px solid',
        borderColor: 'divider',
      }}
    >
      {/* Header fixe */}
      <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
          <Typography variant="h6">Commentaires</Typography>
          <Chip label={totalComments} color="primary" size="small" />
        </Stack>

        {/* Barre de recherche */}
        <TextField
          fullWidth
          size="small"
          placeholder="Rechercher dans les commentaires..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
            endAdornment: searchQuery && (
              <InputAdornment position="end">
                <IconButton size="small" onClick={() => setSearchQuery('')}>
                  <ClearIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* Zone scrollable avec accordéons */}
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        {filteredHighlightsByPage.size === 0 ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              {searchQuery ? 'Aucun commentaire trouvé' : 'Aucun commentaire pour le moment'}
            </Typography>
          </Box>
        ) : (
          Array.from(filteredHighlightsByPage.entries())
            .sort(([a], [b]) => a - b)
            .map(([pageNumber, pageHighlights]) => (
              <Accordion
                key={pageNumber}
                expanded={expandedPages.has(pageNumber)}
                onChange={() => handleAccordionChange(pageNumber)}
                disableGutters
                elevation={0}
                TransitionProps={{ timeout: 300 }}
                sx={{
                  '&:before': { display: 'none' },
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                  transition: 'all 0.2s ease-in-out',
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  sx={{
                    minHeight: 48,
                    '&.Mui-expanded': {
                      minHeight: 48,
                    },
                  }}
                >
                  <Stack direction="row" alignItems="center" spacing={1} width="100%">
                    <Typography variant="subtitle2" fontWeight="medium">
                      Page {pageNumber}
                    </Typography>
                    <Chip label={pageHighlights.length} size="small" variant="outlined" />
                  </Stack>
                </AccordionSummary>

                <AccordionDetails sx={{ p: 0 }}>
                  <List disablePadding>
                    {pageHighlights.map((highlight, index) => (
                      <React.Fragment key={highlight.id}>
                        <ListItem
                          sx={{
                            display: 'block',
                            px: 2,
                            py: 1.5,
                            cursor: 'pointer',
                            transition: 'all 0.2s ease-in-out',
                            '&:hover': {
                              bgcolor: 'action.hover',
                              transform: 'translateX(4px)',
                            },
                            '&:active': {
                              transform: 'scale(0.98)',
                            },
                          }}
                          onClick={() => onHighlightClick(highlight.id)}
                        >
                          <Stack direction="row" spacing={1} alignItems="flex-start">
                            <Box flex={1}>
                              {/* Commentaire */}
                              <Typography variant="body2" gutterBottom>
                                {highlight.comment}
                              </Typography>

                              {/* Texte sélectionné */}
                              {highlight.content?.text && (
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                  sx={{
                                    fontStyle: 'italic',
                                    display: 'block',
                                    mt: 0.5,
                                  }}
                                >
                                  "{highlight.content.text.substring(0, 100)}
                                  {highlight.content.text.length > 100 ? '...' : ''}"
                                </Typography>
                              )}
                            </Box>

                            {/* Bouton supprimer - masqué en mode lecture seule */}
                            {!readOnly && onDelete && (
                              <IconButton
                                size="small"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onDelete(highlight.id);
                                }}
                                sx={{
                                  opacity: 0.5,
                                  '&:hover': {
                                    opacity: 1,
                                    color: 'error.main',
                                  },
                                }}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            )}
                          </Stack>
                        </ListItem>
                        {index < pageHighlights.length - 1 && <Divider />}
                      </React.Fragment>
                    ))}
                  </List>
                </AccordionDetails>
              </Accordion>
            ))
        )}
      </Box>
    </Paper>
  );
}
