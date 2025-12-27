'use client';

import { useState } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Button,
  TextField,
  InputAdornment,
  MenuItem,
} from '@mui/material';
import { Add, Search, FilterList } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import ManuscriptCard from './components/ManuscriptCard';
import { useManuscripts } from './hooks/useManuscripts';
import { MANUSCRIPT_STATUS_LABELS, type ManuscriptStatus } from '@/types/manuscript';

export default function ManuscriptsPage() {
  const router = useRouter();
  const { loading, manuscripts, total } = useManuscripts();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ManuscriptStatus | 'all'>('all');

  const filteredManuscripts = manuscripts.filter((manuscript) => {
    const matchesSearch =
      manuscript.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      manuscript.abstract.toLowerCase().includes(searchQuery.toLowerCase()) ||
      manuscript.keywords?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || manuscript.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" fontWeight="bold">
            Mes Manuscrits
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {total} manuscrit{total > 1 ? 's' : ''} au total
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => router.push('/dashboard/author/soumission')}
        >
          Nouveau manuscrit
        </Button>
      </Box>

      {/* Filtres */}
      <Box display="flex" gap={2} mb={3} flexWrap="wrap">
        <TextField
          placeholder="Rechercher par titre, résumé ou mots-clés..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          size="small"
          sx={{ flex: 1, minWidth: { xs: '100%', sm: 300 } }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />
        <TextField
          select
          size="small"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as ManuscriptStatus | 'all')}
          sx={{ minWidth: 200 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <FilterList />
              </InputAdornment>
            ),
          }}
        >
          <MenuItem value="all">Tous les statuts</MenuItem>
          {Object.entries(MANUSCRIPT_STATUS_LABELS).map(([value, label]) => (
            <MenuItem key={value} value={value}>
              {label}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      {/* Liste des manuscrits */}
      {filteredManuscripts.length === 0 ? (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          minHeight="40vh"
          gap={2}
        >
          <Typography variant="h6" color="text.secondary">
            {searchQuery || statusFilter !== 'all'
              ? 'Aucun manuscrit ne correspond à vos critères'
              : 'Vous n\'avez pas encore soumis de manuscrit'}
          </Typography>
          {!searchQuery && statusFilter === 'all' && (
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => router.push('/dashboard/author/soumission')}
            >
              Soumettre mon premier manuscrit
            </Button>
          )}
        </Box>
      ) : (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          {filteredManuscripts.map((manuscript) => (
            <Box key={manuscript.id} sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 12px)', lg: '1 1 calc(33.333% - 16px)' } }}>
              <ManuscriptCard
                manuscript={manuscript}
                onView={(m) => router.push(`/dashboard/author/manuscripts/${m.id}`)}
                onEdit={(m) => router.push(`/dashboard/author/manuscripts/${m.id}/edit`)}
              />
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}
