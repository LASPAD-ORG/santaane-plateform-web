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
import PageHeader from '@/components/ui/PageHeader';

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
    <Box>
      {/* Header */}
     
       <PageHeader
               title={`Gestion des manuscrits`}
             />


      

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
              label="Statut des évaluateurs"
              value={filters.evaluatorStatus || 'all'}
              onChange={(e) => handleFilterChange('evaluatorStatus', e.target.value)}
              sx={{ minWidth: 220 }}
            >
              <MenuItem value="all">Tous les manuscrits</MenuItem>
              <MenuItem value="none">Sans évaluateur</MenuItem>
              <MenuItem value="pending">En attente de réponse</MenuItem>
              <MenuItem value="accepted">Évaluateur accepté</MenuItem>
              <MenuItem value="rejected">Évaluateur refusé</MenuItem>
            </TextField>

            {/* Filtre Statut d'Évaluation */}
            <TextField
              select
              label="Statut d'évaluation"
              value={filters.evaluationStatus || 'all'}
              onChange={(e) => handleFilterChange('evaluationStatus', e.target.value)}
              sx={{ minWidth: 200 }}
            >
              <MenuItem value="all">Tous</MenuItem>
              <MenuItem value="completed">Évaluations terminées</MenuItem>
              <MenuItem value="in_progress">En cours d'évaluation</MenuItem>
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
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          {manuscripts.map((manuscript) => (
            <Box key={manuscript.id} sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 12px)', lg: '1 1 calc(33.333% - 16px)' } }}>
              <ManuscriptCard manuscript={manuscript} onUpdate={refetch} />
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}
