'use client';

import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  MenuItem,
  CircularProgress,
  Alert,
  Paper,
  Stack,
  Chip,
} from '@mui/material';
import { 
  Search, 
  FilterList,
  HourglassEmpty,
  ThumbUp,
  ThumbDown,
  CheckCircleOutline,
  PersonAdd,
} from '@mui/icons-material';
import { useAllManuscripts } from './hooks/useAllManuscripts';
import { useManuscriptData } from '../../author/soumission/hooks/useManuscriptData';
import ManuscriptCard from './components/ManuscriptCard';

export default function EditorManuscriptsPage() {
  const {
    manuscripts,
    total,
    loading,
    filters,
    searchQuery,
    handleSearchChange,
    handleFilterChange,
    refetch,
  } = useAllManuscripts();

  const { themes, sections, languages } = useManuscriptData();

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box mb={3}>
        <Typography variant="h4" fontWeight="bold" mb={1}>
          Tous les Manuscrits
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Gérer et réviser les manuscrits soumis
        </Typography>
      </Box>

      {/* Filtres */}
      <Card elevation={2} sx={{ mb: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Box display="flex" alignItems="center" gap={1} mb={2}>
            <FilterList />
            <Typography variant="h6" fontWeight="600">
              Filtres
            </Typography>
          </Box>

          <Box
            display="flex"
            flexDirection={{ xs: 'column', md: 'row' }}
            gap={2}
          >
            {/* Recherche */}
            <TextField
              label="Rechercher"
              placeholder="Titre, résumé, mots-clés..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              fullWidth
              InputProps={{
                startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
            />

            {/* Filtre Statut Évaluateur */}
            <TextField
              select
              label="Évaluateurs"
              value={filters.evaluatorStatus || 'all'}
              onChange={(e) => handleFilterChange('evaluatorStatus', e.target.value)}
              sx={{ minWidth: 220 }}
            >
              <MenuItem value="all">Tous les manuscrits</MenuItem>
              <MenuItem value="none">Sans évaluateur</MenuItem>
              <MenuItem value="pending">En attente de réponse</MenuItem>
              <MenuItem value="accepted">Évaluation acceptée</MenuItem>
              <MenuItem value="rejected">Évaluation refusée</MenuItem>
              <MenuItem value="completed">Évaluation terminée</MenuItem>
            </TextField>

            {/* Filtre Langue */}
            <TextField
              select
              label="Langue"
              value={filters.languageId || ''}
              onChange={(e) => handleFilterChange('languageId', e.target.value ? Number(e.target.value) : null)}
              sx={{ minWidth: 200 }}
            >
              <MenuItem value="">Toutes</MenuItem>
              {languages.map((lang) => (
                <MenuItem key={lang.id} value={lang.id}>
                  {lang.name}
                </MenuItem>
              ))}
            </TextField>

            {/* Filtre Thème */}
            <TextField
              select
              label="Thème"
              value={filters.themeId || ''}
              onChange={(e) => handleFilterChange('themeId', e.target.value ? Number(e.target.value) : null)}
              sx={{ minWidth: 200 }}
            >
              <MenuItem value="">Tous</MenuItem>
              {themes.map((theme) => (
                <MenuItem key={theme.id} value={theme.id}>
                  {theme.title}
                </MenuItem>
              ))}
            </TextField>

            {/* Filtre Rubrique */}
            <TextField
              select
              label="Rubrique"
              value={filters.sectionId || ''}
              onChange={(e) => handleFilterChange('sectionId', e.target.value ? Number(e.target.value) : null)}
              sx={{ minWidth: 200 }}
            >
              <MenuItem value="">Toutes</MenuItem>
              {sections.map((section) => (
                <MenuItem key={section.id} value={section.id}>
                  {section.name}
                </MenuItem>
              ))}
            </TextField>
          </Box>
        </CardContent>
      </Card>

      {/* Légende des statuts évaluateurs */}
      <Paper elevation={1} sx={{ p: 2, mb: 3, bgcolor: 'background.default' }}>
        <Typography variant="caption" fontWeight="600" mb={1} display="block" color="text.secondary">
          Légende des statuts d'évaluateurs :
        </Typography>
        <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
          <Chip
            icon={<PersonAdd fontSize="small" />}
            label="Aucun évaluateur"
            size="small"
            variant="outlined"
            color="default"
          />
          <Chip
            icon={<HourglassEmpty fontSize="small" />}
            label="En attente de réponse"
            size="small"
            variant="outlined"
            color="warning"
          />
          <Chip
            icon={<ThumbUp fontSize="small" />}
            label="Évaluation acceptée"
            size="small"
            variant="outlined"
            color="info"
          />
          <Chip
            icon={<ThumbDown fontSize="small" />}
            label="Évaluation refusée"
            size="small"
            variant="outlined"
            color="error"
          />
          <Chip
            icon={<CheckCircleOutline fontSize="small" />}
            label="Évaluation terminée"
            size="small"
            variant="outlined"
            color="success"
          />
        </Stack>
      </Paper>

      {/* Résultats */}
      <Box mb={2} display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="body2" color="text.secondary">
          {loading ? 'Chargement...' : `${total} manuscrit(s) trouvé(s)`}
        </Typography>
      </Box>

      {/* Liste des manuscrits */}
      {loading ? (
        <Box display="flex" justifyContent="center" py={8}>
          <CircularProgress />
        </Box>
      ) : manuscripts.length === 0 ? (
        <Alert severity="info">
          Aucun manuscrit trouvé avec ces critères de recherche.
        </Alert>
      ) : (
        <Box
          display="grid"
          gridTemplateColumns={{
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            lg: 'repeat(3, 1fr)',
          }}
          gap={3}
        >
          {manuscripts.map((manuscript) => (
            <ManuscriptCard key={manuscript.id} manuscript={manuscript} onUpdate={refetch} />
          ))}
        </Box>
      )}
    </Box>
  );
}
