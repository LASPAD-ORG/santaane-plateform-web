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
import { FilterList, Assignment } from '@mui/icons-material';
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
            <MenuItem value="declined">Refusés</MenuItem>
          </TextField>
        </CardContent>
      </Card>

      {/* Statistiques */}
      <Stack direction="row" spacing={2} mb={3}>
        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Box display="flex" alignItems="center" gap={1}>
              <Assignment color="primary" />
              <Box>
                <Typography variant="h4" fontWeight="bold">
                  {manuscripts.filter((m) => m.assignmentStatus === 'pending').length}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  En attente
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Box display="flex" alignItems="center" gap={1}>
              <Assignment color="success" />
              <Box>
                <Typography variant="h4" fontWeight="bold">
                  {manuscripts.filter((m) => m.assignmentStatus === 'accepted').length}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Acceptés
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Box display="flex" alignItems="center" gap={1}>
              <Assignment color="error" />
              <Box>
                <Typography variant="h4" fontWeight="bold">
                  {manuscripts.filter((m) => m.assignmentStatus === 'declined').length}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Refusés
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Stack>

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
          <Typography variant="body1" gutterBottom fontWeight="600">
            Aucun manuscrit assigné pour le moment.
          </Typography>
          <Typography variant="body2">
            Les manuscrits qui vous seront assignés pour évaluation apparaîtront ici.
            Assurez-vous d'avoir le rôle <strong>EVALUATOR</strong> pour recevoir des assignations.
          </Typography>
        </Alert>
      ) : manuscripts.length === 0 ? (
        <Alert severity="info">
          Aucun manuscrit ne correspond aux filtres sélectionnés.
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
            <EvaluatorManuscriptCard
              key={manuscript.id}
              manuscript={manuscript}
              onUpdate={refetch}
            />
          ))}
        </Box>
      )}
    </Box>
  );
}
