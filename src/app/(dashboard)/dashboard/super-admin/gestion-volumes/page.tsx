'use client';

import { useEffect, useState } from 'react';
import { Box, Typography, Button, CircularProgress } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useFetchGestionVolumes } from './fetchers/useFetchGestionVolumes';
import VolumeList from './components/VolumeList';
import VolumeDialog from './components/VolumeDialog';
import IssueListDialog from './components/IssueListDialog';
import { Volume } from './fetchers/useFetchGestionVolumes';

export default function GestionVolumesPage() {
  const { data: initialVolumes, loading, fetch } = useFetchGestionVolumes();
  const [volumes, setVolumes] = useState<Volume[]>([]);
  const [volumeDialogOpen, setVolumeDialogOpen] = useState(false);
  const [issueListDialogOpen, setIssueListDialogOpen] = useState(false);
  const [selectedVolume, setSelectedVolume] = useState<Volume | undefined>(undefined);

  useEffect(() => {
    fetch();
  }, []);

  useEffect(() => {
    if (initialVolumes) {
      setVolumes(initialVolumes);
    }
  }, [initialVolumes]);

  const handleCreateVolume = () => {
    setSelectedVolume(undefined);
    setVolumeDialogOpen(true);
  };

  const handleEditVolume = (volume: Volume) => {
    setSelectedVolume(volume);
    setVolumeDialogOpen(true);
  };

  const handleDeleteVolume = (volumeToDelete: Volume) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer le volume "${volumeToDelete.title}" ?`)) {
      setVolumes(volumes.filter((v) => v.id !== volumeToDelete.id));
    }
  };

  const handleManageIssues = (volume: Volume) => {
    setSelectedVolume(volume);
    setIssueListDialogOpen(true);
  };

  const handleSaveVolume = (volumeData: Partial<Volume>) => {
    if (selectedVolume) {
      // Edit existing volume
      setVolumes(volumes.map((v) => (v.id === selectedVolume.id ? { ...v, ...volumeData } as Volume : v)));
    } else {
      // Create new volume
      const newVolume: Volume = {
        id: `new-${Date.now()}`,
        title: volumeData.title || '',
        year: volumeData.year || new Date().getFullYear(),
        status: volumeData.status || 'DRAFT',
        description: volumeData.description,
        issues: [],
      };
      setVolumes([...volumes, newVolume]);
    }
  };

  const handleUpdateVolume = (updatedVolume: Volume) => {
    setVolumes(volumes.map((v) => (v.id === updatedVolume.id ? updatedVolume : v)));
    // Also update the selected volume if it's the one being edited in the issue list
    if (selectedVolume?.id === updatedVolume.id) {
      setSelectedVolume(updatedVolume);
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          Gestion des Volumes et Soumissions
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateVolume}
        >
          Nouveau Volume
        </Button>
      </Box>

      {/* Loading state */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Content */}
      {!loading && (
        <VolumeList
          volumes={volumes}
          onEdit={handleEditVolume}
          onDelete={handleDeleteVolume}
          onManageIssues={handleManageIssues}
        />
      )}

      {/* Dialogs */}
      <VolumeDialog
        open={volumeDialogOpen}
        onClose={() => setVolumeDialogOpen(false)}
        onSave={handleSaveVolume}
        volume={selectedVolume}
      />

      <IssueListDialog
        open={issueListDialogOpen}
        onClose={() => setIssueListDialogOpen(false)}
        volume={selectedVolume || null}
        onUpdateVolume={handleUpdateVolume}
      />
    </Box>
  );
}
