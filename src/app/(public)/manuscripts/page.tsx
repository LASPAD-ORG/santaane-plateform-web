'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  InputAdornment,
  Paper,
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
  Button,
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

// ─── Design tokens ───
const TOKEN = {
  black: '#0a0a0a',
  white: '#ffffff',
  offWhite: '#f5f4f0',
  gray100: '#f0efeb',
  gray300: '#d4d2cc',
  gray500: '#8a887f',
  gray700: '#3d3c38',
  gold: '#b8953a',
  goldDim: 'rgba(184,149,58,0.08)',
};

const fontSans = '"Noto Sans", sans-serif';

const inputSx = {
  '& .MuiOutlinedInput-root': {
    fontFamily: fontSans,
    borderRadius: 1,
    bgcolor: TOKEN.white,
    '& fieldset': { borderColor: TOKEN.gray300 },
    '&:hover fieldset': { borderColor: TOKEN.gray700 },
    '&.Mui-focused fieldset': { borderColor: TOKEN.black, borderWidth: 1.5 },
  },
  '& .MuiInputLabel-root': {
    fontFamily: fontSans,
    fontSize: '0.875rem',
    color: TOKEN.gray500,
    '&.Mui-focused': { color: TOKEN.black },
  },
  '& .MuiOutlinedInput-input': { fontFamily: fontSans, fontSize: '0.875rem' },
};

function ManuscriptsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [manuscripts, setManuscripts] = useState<PublicManuscriptSummary[]>([]);
  const [filters, setFilters] = useState<FilterOptions | null>(null);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [showFilters, setShowFilters] = useState(true);

  const query = searchParams.get('q') || '';
  const themeId = searchParams.get('themeId') || '';
  const sectionId = searchParams.get('sectionId') || '';
  const languageId = searchParams.get('languageId') || '';
  const page = parseInt(searchParams.get('page') || '1');

  const [searchInput, setSearchInput] = useState(query);
  const [selectedTheme, setSelectedTheme] = useState(themeId);
  const [selectedSection, setSelectedSection] = useState(sectionId);
  const [selectedLanguage, setSelectedLanguage] = useState(languageId);

  useEffect(() => {
    publicApiService.getFilterOptions().then(setFilters).catch(console.error);
  }, []);

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

  const updateFilters = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value) params.set(key, value);
      else params.delete(key);
    });
    if (!updates.page) params.set('page', '1');
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
    return text.substring(0, maxLength).trim() + '…';
  };

  const hasActiveFilters = query || themeId || sectionId || languageId;

  return (
    <Box sx={{ bgcolor: TOKEN.offWhite, minHeight: 'calc(100vh - 200px)' }}>

      {/* ─── HERO ─── */}
      <Box
        sx={{
          bgcolor: TOKEN.black,
          color: TOKEN.white,
          py: { xs: 7, md: 10 },
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'repeating-linear-gradient(0deg, transparent, transparent 39px, rgba(255,255,255,0.03) 40px), repeating-linear-gradient(90deg, transparent, transparent 39px, rgba(255,255,255,0.03) 40px)',
            pointerEvents: 'none',
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            top: '-60px',
            right: '-80px',
            width: '360px',
            height: '360px',
            borderRadius: '50%',
            background: `radial-gradient(circle, ${TOKEN.gold}22 0%, transparent 70%)`,
            pointerEvents: 'none',
          },
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <Box sx={{ width: 48, height: 2, bgcolor: TOKEN.gold, mx: 'auto', mb: 3, borderRadius: 1 }} />
          <Typography
            variant="h3"
            fontWeight={700}
            sx={{
              fontFamily: fontSans,
              fontSize: { xs: '2rem', md: '2.8rem' },
              letterSpacing: '-0.02em',
              lineHeight: 1.15,
              mb: 2,
            }}
          >
            Publications
          </Typography>
          <Typography
            sx={{
              fontFamily: fontSans,
              fontWeight: 300,
              color: TOKEN.gray300,
              maxWidth: 500,
              mx: 'auto',
              fontSize: { xs: '1rem', md: '1.1rem' },
              lineHeight: 1.7,
            }}
          >
            Explorez notre collection de manuscrits scientifiques publiés
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 5, md: 8 } }}>

        {/* ─── SEARCH & FILTERS ─── */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 4 },
            mb: 5,
            border: `1px solid ${TOKEN.gray300}`,
            borderRadius: 2,
            bgcolor: TOKEN.white,
          }}
        >
          {/* Search Bar */}
          <Box component="form" onSubmit={handleSearch} sx={{ mb: 2.5 }}>
            <TextField
              fullWidth
              placeholder="Rechercher par titre, mots-clés, résumé…"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              sx={inputSx}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search sx={{ color: TOKEN.gray500, fontSize: 20 }} />
                    </InputAdornment>
                  ),
                  endAdornment: searchInput ? (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        onClick={() => setSearchInput('')}
                        sx={{ color: TOKEN.gray500 }}
                      >
                        <Clear sx={{ fontSize: 18 }} />
                      </IconButton>
                    </InputAdornment>
                  ) : null,
                },
              }}
            />
          </Box>

          {/* Filter toggle row */}
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: showFilters ? 2.5 : 0 }}>
            <Button
              size="small"
              startIcon={<FilterList sx={{ fontSize: 16 }} />}
              endIcon={showFilters ? <ExpandLess sx={{ fontSize: 16 }} /> : <ExpandMore sx={{ fontSize: 16 }} />}
              onClick={() => setShowFilters(!showFilters)}
              sx={{
                fontFamily: fontSans,
                fontWeight: 600,
                fontSize: '0.72rem',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                color: TOKEN.gray700,
                border: `1px solid ${TOKEN.gray300}`,
                borderRadius: 1,
                px: 2,
                py: 0.75,
                '&:hover': { bgcolor: TOKEN.gray100, borderColor: TOKEN.gray700 },
              }}
            >
              {showFilters ? 'Masquer les filtres' : 'Filtres'}
            </Button>

            {hasActiveFilters && (
              <Button
                size="small"
                startIcon={<Clear sx={{ fontSize: 14 }} />}
                onClick={handleClearFilters}
                sx={{
                  fontFamily: fontSans,
                  fontWeight: 600,
                  fontSize: '0.72rem',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  color: TOKEN.gold,
                  border: `1px solid ${TOKEN.gold}55`,
                  borderRadius: 1,
                  px: 2,
                  py: 0.75,
                  '&:hover': { bgcolor: TOKEN.goldDim },
                }}
              >
                Réinitialiser
              </Button>
            )}
          </Stack>

          {/* Filters */}
          <Collapse in={showFilters}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              {[
                {
                  label: 'Appel',
                  value: selectedTheme,
                  options: filters?.themes,
                  onChange: (val: string) => {
                    setSelectedTheme(val);
                    updateFilters({ themeId: val });
                  },
                  allLabel: 'Tous les appels',
                },
                {
                  label: 'Section',
                  value: selectedSection,
                  options: filters?.sections,
                  onChange: (val: string) => {
                    setSelectedSection(val);
                    updateFilters({ sectionId: val });
                  },
                  allLabel: 'Toutes les sections',
                },
                {
                  label: 'Langue',
                  value: selectedLanguage,
                  options: filters?.languages,
                  onChange: (val: string) => {
                    setSelectedLanguage(val);
                    updateFilters({ languageId: val });
                  },
                  allLabel: 'Toutes les langues',
                },
              ].map((f, fi) => (
                <Box key={fi} sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(33.333% - 11px)' } }}>
                  <FormControl fullWidth size="small" sx={inputSx}>
                    <InputLabel sx={{ fontFamily: fontSans, fontSize: '0.875rem' }}>{f.label}</InputLabel>
                    <Select
                      value={f.value}
                      label={f.label}
                      onChange={(e) => f.onChange(e.target.value)}
                      sx={{ fontFamily: fontSans, fontSize: '0.875rem' }}
                    >
                      <MenuItem value="" sx={{ fontFamily: fontSans, fontSize: '0.875rem' }}>
                        {f.allLabel}
                      </MenuItem>
                      {f.options?.map((opt) => (
                        <MenuItem
                          key={opt.id}
                          value={opt.id.toString()}
                          sx={{ fontFamily: fontSans, fontSize: '0.875rem' }}
                        >
                          {opt.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              ))}
            </Box>
          </Collapse>
        </Paper>

        {/* ─── RESULTS COUNT ─── */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
          <Typography
            sx={{
              fontFamily: fontSans,
              fontSize: '0.72rem',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: TOKEN.gray500,
              flexShrink: 0,
            }}
          >
            {total} publication{total !== 1 ? 's' : ''}
          </Typography>
          <Box sx={{ flex: 1, height: 1, bgcolor: TOKEN.gray300 }} />
        </Box>

        {/* ─── GRID ─── */}
        {loading ? (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <Box key={i} sx={{ flex: { xs: '1 1 100%', md: '0 0 calc(50% - 12px)', lg: '0 0 calc(25% - 18px)' } }}>
                <Skeleton variant="rectangular" height={240} sx={{ borderRadius: 2 }} />
              </Box>
            ))}
          </Box>
        ) : manuscripts.length === 0 ? (
          <Paper
            elevation={0}
            sx={{
              p: { xs: 6, md: 8 },
              textAlign: 'center',
              border: `1px dashed ${TOKEN.gray300}`,
              borderRadius: 2,
              bgcolor: TOKEN.white,
            }}
          >
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                bgcolor: TOKEN.gray100,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 2.5,
              }}
            >
              <Article sx={{ fontSize: 28, color: TOKEN.gray500 }} />
            </Box>
            <Typography
              fontWeight={700}
              sx={{ fontFamily: fontSans, letterSpacing: '-0.01em', mb: 0.75 }}
            >
              Aucun résultat
            </Typography>
            <Typography sx={{ fontFamily: fontSans, color: TOKEN.gray500, fontSize: '0.875rem' }}>
              Essayez de modifier vos critères de recherche
            </Typography>
          </Paper>
        ) : (
          <>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
              {manuscripts.map((manuscript, idx) => (
                <Box
                  key={manuscript.id}
                  sx={{ flex: { xs: '1 1 100%', md: '0 0 calc(50% - 12px)', lg: '0 0 calc(25% - 18px)' } }}
                >
                  <Card
                    elevation={0}
                    sx={{
                      height: '100%',
                      border: `1px solid ${TOKEN.gray300}`,
                      borderRadius: 2,
                      bgcolor: TOKEN.white,
                      transition: 'all 0.25s ease',
                      overflow: 'hidden',
                      position: 'relative',
                      '&:hover': {
                        borderColor: TOKEN.black,
                        transform: 'translateY(-3px)',
                        boxShadow: `0 10px 28px rgba(0,0,0,0.07)`,
                      },
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: 2,
                        bgcolor: TOKEN.black,
                        opacity: 0,
                        transition: 'opacity 0.25s',
                      },
                      '&:hover::before': { opacity: 1 },
                    }}
                  >
                    <CardActionArea
                      component={Link}
                      href={`/manuscripts/${manuscript.id}`}
                      sx={{ height: '100%' }}
                    >
                      <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>

                        {/* Index + chips */}
                        <Stack direction="row" alignItems="flex-start" justifyContent="space-between" sx={{ mb: 2 }}>
                          <Typography
                            sx={{
                              fontFamily: fontSans,
                              fontSize: '0.62rem',
                              fontWeight: 700,
                              letterSpacing: '0.1em',
                              textTransform: 'uppercase',
                              color: TOKEN.gray500,
                            }}
                          >
                            N°{String(idx + 1).padStart(2, '0')}
                          </Typography>
                          <Stack direction="row" spacing={0.5} flexWrap="wrap" justifyContent="flex-end" gap={0.5}>
                            {manuscript.themeName && (
                              <Chip
                                size="small"
                                label={manuscript.themeName}
                                icon={<Category sx={{ fontSize: '11px !important' }} />}
                                sx={{
                                  fontFamily: fontSans,
                                  fontSize: '0.65rem',
                                  height: 20,
                                  bgcolor: TOKEN.goldDim,
                                  border: `1px solid ${TOKEN.gold}44`,
                                  color: TOKEN.gray700,
                                  '& .MuiChip-icon': { color: TOKEN.gold },
                                }}
                              />
                            )}
                            <Chip
                              size="small"
                              label={manuscript.sectionName}
                              sx={{
                                fontFamily: fontSans,
                                fontSize: '0.65rem',
                                height: 20,
                                bgcolor: TOKEN.gray100,
                                border: `1px solid ${TOKEN.gray300}`,
                                color: TOKEN.gray700,
                              }}
                            />
                          </Stack>
                        </Stack>

                        {/* Title */}
                        <Typography
                          fontWeight={700}
                          gutterBottom
                          sx={{
                            fontFamily: fontSans,
                            fontSize: '0.95rem',
                            letterSpacing: '-0.01em',
                            lineHeight: 1.45,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            color: TOKEN.black,
                          }}
                        >
                          {manuscript.title}
                        </Typography>

                        {/* Abstract */}
                        <Typography
                          sx={{
                            fontFamily: fontSans,
                            fontSize: '0.82rem',
                            color: TOKEN.gray500,
                            lineHeight: 1.75,
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
                            {manuscript.keywords
                              .split(',')
                              .slice(0, 3)
                              .map((keyword, ki) => (
                                <Chip
                                  key={ki}
                                  label={keyword.trim()}
                                  size="small"
                                  sx={{
                                    fontFamily: fontSans,
                                    fontSize: '0.65rem',
                                    height: 20,
                                    bgcolor: 'transparent',
                                    border: `1px solid ${TOKEN.gray300}`,
                                    color: TOKEN.gray700,
                                  }}
                                />
                              ))}
                          </Stack>
                        )}

                        <Divider sx={{ borderColor: TOKEN.gray100, mb: 1.5 }} />

                        {/* Author & Date */}
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                          <Stack direction="row" alignItems="center" spacing={0.75}>
                            <Person sx={{ fontSize: 14, color: TOKEN.gray500 }} />
                            <Typography
                              sx={{ fontFamily: fontSans, fontSize: '0.75rem', color: TOKEN.gray500 }}
                            >
                              {manuscript.authorName}
                            </Typography>
                          </Stack>
                          <Stack direction="row" alignItems="center" spacing={0.5}>
                            <CalendarMonth sx={{ fontSize: 13, color: TOKEN.gray300 }} />
                            <Typography
                              sx={{ fontFamily: fontSans, fontSize: '0.72rem', color: TOKEN.gray500 }}
                            >
                              {formatDate(manuscript.publishedAt || manuscript.createdAt)}
                            </Typography>
                          </Stack>
                        </Stack>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Box>
              ))}
            </Box>

            {/* Pagination */}
            {totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={(_, value) => updateFilters({ page: value.toString() })}
                  size="large"
                  sx={{
                    '& .MuiPaginationItem-root': {
                      fontFamily: fontSans,
                      fontWeight: 600,
                      fontSize: '0.85rem',
                      borderRadius: 1,
                      color: TOKEN.gray700,
                      border: `1px solid transparent`,
                      '&:hover': { bgcolor: TOKEN.gray100, borderColor: TOKEN.gray300 },
                    },
                    '& .MuiPaginationItem-root.Mui-selected': {
                      bgcolor: TOKEN.black,
                      color: TOKEN.white,
                      borderColor: TOKEN.black,
                      '&:hover': { bgcolor: TOKEN.gold, borderColor: TOKEN.gold },
                    },
                  }}
                />
              </Box>
            )}
          </>
        )}
      </Container>
    </Box>
  );
}

export default function ManuscriptsPage() {
  return (
    <Suspense
      fallback={
        <Box sx={{ bgcolor: TOKEN.offWhite, minHeight: '100vh', py: 5 }}>
          <Container maxWidth="lg">
            <Skeleton variant="rectangular" height={200} sx={{ mb: 4, borderRadius: 2 }} />
            <Skeleton variant="rectangular" height={120} sx={{ mb: 3, borderRadius: 2 }} />
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
              {[1, 2, 3, 4].map((i) => (
                <Box key={i} sx={{ flex: '0 0 calc(25% - 18px)' }}>
                  <Skeleton variant="rectangular" height={240} sx={{ borderRadius: 2 }} />
                </Box>
              ))}
            </Box>
          </Container>
        </Box>
      }
    >
      <ManuscriptsPageContent />
    </Suspense>
  );
}