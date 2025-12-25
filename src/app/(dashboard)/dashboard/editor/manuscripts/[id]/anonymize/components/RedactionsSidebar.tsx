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
  Block as BlockIcon,
} from '@mui/icons-material';
import type { RedactionHighlight } from '@/types/redaction';
import { groupRedactionsByPage } from '@/types/redaction';

interface RedactionsSidebarProps {
  redactions: RedactionHighlight[];
  onRedactionClick: (redactionId: string) => void;
  onDelete: (redactionId: string) => void;
  totalPages?: number;
}

export function RedactionsSidebar({
  redactions,
  onRedactionClick,
  onDelete,
  totalPages = 10,
}: RedactionsSidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedPages, setExpandedPages] = useState<Set<number>>(new Set([1]));

  // Group redactions by page (filter out invalid redactions)
  const redactionsByPage = useMemo(() => {
    // Filter out redactions without proper position data
    const validRedactions = redactions.filter(r =>
      r.position?.boundingRect?.pageNumber != null
    );
    return groupRedactionsByPage(validRedactions);
  }, [redactions]);

  // Filter redactions according to search
  const filteredRedactionsByPage = useMemo(() => {
    if (!searchQuery.trim()) {
      return redactionsByPage;
    }

    const filtered = new Map<number, RedactionHighlight[]>();
    const query = searchQuery.toLowerCase();

    redactionsByPage.forEach((pageRedactions, pageNumber) => {
      const matchingRedactions = pageRedactions.filter(
        (r) => r.comment.toLowerCase().includes(query)
      );

      if (matchingRedactions.length > 0) {
        filtered.set(pageNumber, matchingRedactions);
      }
    });

    return filtered;
  }, [redactionsByPage, searchQuery]);

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

  // Calculate total redactions
  const totalRedactions = redactions.length;

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
      {/* Fixed header */}
      <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <BlockIcon color="error" fontSize="small" />
            <Typography variant="h6">Zones anonymisées</Typography>
          </Stack>
          <Chip
            label={totalRedactions}
            color="error"
            size="small"
            variant="outlined"
          />
        </Stack>

        {/* Search bar */}
        <TextField
          fullWidth
          size="small"
          placeholder="Rechercher une zone..."
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

      {/* Scrollable zone with accordions */}
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        {filteredRedactionsByPage.size === 0 ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <BlockIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
            <Typography variant="body2" color="text.secondary">
              {searchQuery ? 'Aucune zone trouvée' : 'Aucune zone anonymisée'}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              Maintenez Alt et glissez pour créer une zone
            </Typography>
          </Box>
        ) : (
          Array.from(filteredRedactionsByPage.entries())
            .sort(([a], [b]) => a - b)
            .map(([pageNumber, pageRedactions]) => (
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
                    <Chip
                      label={pageRedactions.length}
                      size="small"
                      variant="outlined"
                      color="error"
                    />
                  </Stack>
                </AccordionSummary>

                <AccordionDetails sx={{ p: 0 }}>
                  <List disablePadding>
                    {pageRedactions.map((redaction, index) => (
                      <React.Fragment key={redaction.id}>
                        <ListItem
                          sx={{
                            display: 'block',
                            px: 2,
                            py: 1.5,
                            cursor: 'pointer',
                            transition: 'all 0.2s ease-in-out',
                            '&:hover': {
                              bgcolor: 'error.lighter',
                              transform: 'translateX(4px)',
                            },
                            '&:active': {
                              transform: 'scale(0.98)',
                            },
                          }}
                          onClick={() => onRedactionClick(redaction.id)}
                        >
                          <Stack direction="row" spacing={1} alignItems="flex-start">
                            <BlockIcon
                              fontSize="small"
                              sx={{ color: 'error.main', mt: 0.5 }}
                            />
                            <Box flex={1}>
                              {/* Comment */}
                              <Typography variant="body2" gutterBottom>
                                {redaction.comment}
                              </Typography>

                              {/* Author (editor name) */}
                              {redaction.author && (
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                  sx={{
                                    display: 'block',
                                    mt: 0.5,
                                  }}
                                >
                                  Par {redaction.author}
                                </Typography>
                              )}
                            </Box>

                            {/* Delete button */}
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                onDelete(redaction.id);
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
                          </Stack>
                        </ListItem>
                        {index < pageRedactions.length - 1 && <Divider />}
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
