'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  InputAdornment,
  Paper,
  Grid,
  Chip,
  Stack,
  Skeleton,
  Card,
  CardContent,
  CardActionArea,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
  Divider,
  IconButton,
  Collapse,
} from '@mui/material';
import {
  Search,
  Article,
  Person,
  Category,
  CalendarMonth,
  FilterList,
  Clear,
  ExpandMore,
  ExpandLess,
} from '@mui/icons-material';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  publicApiService,
  PublicManuscriptSummary,
  FilterOptions,
  PublicManuscriptListResponse,
} from '@/services/publicApiService';

function ManuscriptsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // State
  const [manuscripts, setManuscripts] = useState<PublicManuscriptSummary[]>([]);
  const [filters, setFilters] = useState<FilterOptions | null>(null);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [showFilters, setShowFilters] = useState(true);

  // Search params
  const query = searchParams.get('q') || '';
  const themeId = searchParams.get('themeId') || '';
  const sectionId = searchParams.get('sectionId') || '';
  const languageId = searchParams.get('languageId') || '';
  const page = parseInt(searchParams.get('page') || '1');

  // Local state for form
  const [searchInput, setSearchInput] = useState(query);
  const [selectedTheme, setSelectedTheme] = useState(themeId);
  const [selectedSection, setSelectedSection] = useState(sectionId);
  const [selectedLanguage, setSelectedLanguage] = useState(languageId);

  // Fetch filters
  useEffect(() => {
    publicApiService.getFilterOptions().then(setFilters).catch(console.error);
  }, []);

  // Fetch manuscripts
  const fetchManuscripts = useCallback(async () => {
    setLoading(true);
    try {
      const result: PublicManuscriptListResponse = await publicApiService.searchManuscripts({
        q: query || undefined,
        themeId: themeId ? parseInt(themeId) : undefined,
        sectionId: sectionId ? parseInt(sectionId) : undefined,
        languageId: languageId ? parseInt(languageId) : undefined,
        page,
        pageSize: 12,
      });
      setManuscripts(result.manuscripts);
      setTotalPages(result.totalPages);
      setTotal(result.total);
    } catch (error) {
      console.error('Error fetching manuscripts:', error);
    } finally {
      setLoading(false);
    }
  }, [query, themeId, sectionId, languageId, page]);

  useEffect(() => {
    fetchManuscripts();
  }, [fetchManuscripts]);

  // Update URL with filters
  const updateFilters = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    
    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    
    // Reset page when filters change
    if (!updates.page) {
      params.set('page', '1');
    }
    
    router.push(`/manuscripts?${params.toString()}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters({ q: searchInput });
  };

  const handleClearFilters = () => {
    setSearchInput('');
    setSelectedTheme('');
    setSelectedSection('');
    setSelectedLanguage('');
    router.push('/manuscripts');
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const truncateText = (text: string | undefined, maxLength: number) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  };

  const hasActiveFilters = query || themeId || sectionId || languageId;

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Publications
        </Typography>
        <Typography color="text.secondary">
          Explorez notre collection de manuscrits scientifiques publiés
        </Typography>
      </Box>

      {/* Search & Filters */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 4,
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 2,
        }}
      >
        {/* Search Bar */}
        <Box component="form" onSubmit={handleSearch} sx={{ mb: 2 }}>
          <TextField
            fullWidth
            placeholder="Rechercher par titre, mots-clés, résumé..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Search color="action" />
                  </InputAdornment>
                ),
                endAdornment: searchInput && (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setSearchInput('')}>
                      <Clear />
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              },
            }}
          />
        </Box>

        {/* Filter Toggle */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: showFilters ? 2 : 0 }}
        >
          <Chip
            icon={<FilterList />}
            label={showFilters ? 'Masquer les filtres' : 'Afficher les filtres'}
            onClick={() => setShowFilters(!showFilters)}
            variant="outlined"
            deleteIcon={showFilters ? <ExpandLess /> : <ExpandMore />}
            onDelete={() => setShowFilters(!showFilters)}
          />
          {hasActiveFilters && (
            <Chip
              label="Réinitialiser"
              onClick={handleClearFilters}
              onDelete={handleClearFilters}
              color="error"
              variant="outlined"
              size="small"
            />
          )}
        </Stack>

        {/* Filters */}
        <Collapse in={showFilters}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 4 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Thème</InputLabel>
                <Select
                  value={selectedTheme}
                  label="Thème"
                  onChange={(e) => {
                    setSelectedTheme(e.target.value);
                    updateFilters({ themeId: e.target.value });
                  }}
                >
                  <MenuItem value="">Tous les thèmes</MenuItem>
                  {filters?.themes.map((theme) => (
                    <MenuItem key={theme.id} value={theme.id.toString()}>
                      {theme.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Section</InputLabel>
                <Select
                  value={selectedSection}
                  label="Section"
                  onChange={(e) => {
                    setSelectedSection(e.target.value);
                    updateFilters({ sectionId: e.target.value });
                  }}
                >
                  <MenuItem value="">Toutes les sections</MenuItem>
                  {filters?.sections.map((section) => (
                    <MenuItem key={section.id} value={section.id.toString()}>
                      {section.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Langue</InputLabel>
                <Select
                  value={selectedLanguage}
                  label="Langue"
                  onChange={(e) => {
                    setSelectedLanguage(e.target.value);
                    updateFilters({ languageId: e.target.value });
                  }}
                >
                  <MenuItem value="">Toutes les langues</MenuItem>
                  {filters?.languages.map((lang) => (
                    <MenuItem key={lang.id} value={lang.id.toString()}>
                      {lang.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Collapse>
      </Paper>

      {/* Results count */}
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {total} publication{total !== 1 ? 's' : ''} trouvée{total !== 1 ? 's' : ''}
      </Typography>

      {/* Manuscripts Grid */}
      {loading ? (
        <Grid container spacing={3}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={i}>
              <Skeleton variant="rectangular" height={220} sx={{ borderRadius: 2 }} />
            </Grid>
          ))}
        </Grid>
      ) : manuscripts.length === 0 ? (
        <Paper
          elevation={0}
          sx={{
            p: 6,
            textAlign: 'center',
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 2,
          }}
        >
          <Article sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            Aucun résultat
          </Typography>
          <Typography color="text.secondary">
            Essayez de modifier vos critères de recherche
          </Typography>
        </Paper>
      ) : (
        <>
          <Grid container spacing={3}>
            {manuscripts.map((manuscript) => (
              <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={manuscript.id}>
                <Card
                  elevation={0}
                  sx={{
                    height: '100%',
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 2,
                    transition: 'all 0.2s',
                    '&:hover': {
                      borderColor: 'primary.main',
                      boxShadow: '0 4px 20px rgba(37, 99, 235, 0.1)',
                    },
                  }}
                >
                  <CardActionArea
                    component={Link}
                    href={`/manuscripts/${manuscript.id}`}
                    sx={{ height: '100%' }}
                  >
                    <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                      {/* Theme & Section */}
                      <Stack direction="row" spacing={1} sx={{ mb: 2 }} flexWrap="wrap" gap={0.5}>
                        {manuscript.themeName && (
                          <Chip
                            size="small"
                            label={manuscript.themeName}
                            icon={<Category sx={{ fontSize: 14 }} />}
                            sx={{ fontSize: 11 }}
                          />
                        )}
                        <Chip
                          size="small"
                          label={manuscript.sectionName}
                          variant="outlined"
                          sx={{ fontSize: 11 }}
                        />
                      </Stack>

                      {/* Title */}
                      <Typography
                        variant="subtitle1"
                        fontWeight="600"
                        gutterBottom
                        sx={{
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          lineHeight: 1.4,
                        }}
                      >
                        {manuscript.title}
                      </Typography>

                      {/* Abstract */}
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          mb: 2,
                          flex: 1,
                        }}
                      >
                        {truncateText(manuscript.abstract, 150)}
                      </Typography>

                      {/* Keywords */}
                      {manuscript.keywords && (
                        <Stack direction="row" spacing={0.5} flexWrap="wrap" gap={0.5} sx={{ mb: 2 }}>
                          {manuscript.keywords.split(',').slice(0, 3).map((keyword, idx) => (
                            <Chip
                              key={idx}
                              label={keyword.trim()}
                              size="small"
                              variant="outlined"
                              sx={{ fontSize: 10, height: 22 }}
                            />
                          ))}
                        </Stack>
                      )}

                      <Divider sx={{ my: 1.5 }} />

                      {/* Author & Date */}
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Stack direction="row" alignItems="center" spacing={0.5}>
                          <Person sx={{ fontSize: 16, color: 'text.secondary' }} />
                          <Typography variant="caption" color="text.secondary">
                            {manuscript.authorName}
                          </Typography>
                        </Stack>
                        <Stack direction="row" alignItems="center" spacing={0.5}>
                          <CalendarMonth sx={{ fontSize: 14, color: 'text.disabled' }} />
                          <Typography variant="caption" color="text.disabled">
                            {formatDate(manuscript.publishedAt || manuscript.createdAt)}
                          </Typography>
                        </Stack>
                      </Stack>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Pagination */}
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={(_, value) => updateFilters({ page: value.toString() })}
                color="primary"
                size="large"
              />
            </Box>
          )}
        </>
      )}
    </Container>
  );
}

export default function ManuscriptsPage() {
  return (
    <Suspense fallback={
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Skeleton variant="text" width={200} height={40} />
        <Skeleton variant="rectangular" height={200} sx={{ mt: 2, borderRadius: 2 }} />
      </Container>
    }>
      <ManuscriptsPageContent />
    </Suspense>
  );
}
