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
  Stack,
} from '@mui/material';
import { FilterList } from '@mui/icons-material';
import { useEvaluatorManuscripts } from './hooks/useEvaluatorManuscripts';
import EvaluatorManuscriptCard from './components/EvaluatorManuscriptCard';

export default function EvaluatorManuscriptsPage() {
  const {
    manuscripts,
    total,
    loading,
    statusFilter,
    handleStatusFilterChange,
    refetch,
  } = useEvaluatorManuscripts();

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box mb={3}>
        <Typography variant="h4" fontWeight="bold" mb={1}>
          Mes Assignations
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Manuscrits qui vous ont été assignés pour évaluation
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

          <TextField
            select
            label="Statut"
            value={statusFilter}
            onChange={(e) => handleStatusFilterChange(e.target.value as any)}
            sx={{ minWidth: 250 }}
          >
            <MenuItem value="all">Tous les manuscrits</MenuItem>
            <MenuItem value="pending">En attente de réponse</MenuItem>
            <MenuItem value="accepted">Acceptés</MenuItem>
            <MenuItem value="in_progress">En cours d'évaluation</MenuItem>
            <MenuItem value="completed">Terminés</MenuItem>
          </TextField>
        </CardContent>
      </Card>

      {/* Résultats */}
      <Box mb={2}>
        <Typography variant="body2" color="text.secondary">
          {loading ? 'Chargement...' : `${total} manuscrit(s) trouvé(s)`}
        </Typography>
      </Box>

      {/* Liste des manuscrits */}
      {loading ? (
        <Box display="flex" justifyContent="center" py={8}>
          <CircularProgress />
        </Box>
      ) : manuscripts.length === 0 && total === 0 ? (
        <Alert severity="info" sx={{ mt: 2 }}>
          Aucun résultat trouvé.
        </Alert>
      ) : manuscripts.length === 0 ? (
        <Alert severity="info">
          Aucun manuscrit ne correspond aux filtres sélectionnés.
        </Alert>
      ) : (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          {manuscripts.map((manuscript) => (
            <Box key={manuscript.id} sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 12px)', lg: '1 1 calc(33.333% - 16px)' } }}>
              <EvaluatorManuscriptCard
                manuscript={manuscript}
                onUpdate={refetch}
              />
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}
