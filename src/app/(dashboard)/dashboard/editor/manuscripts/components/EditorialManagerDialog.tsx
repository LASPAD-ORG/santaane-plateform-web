import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button,
  Typography, Box, List, ListItem, ListItemText, ListItemIcon,
  IconButton, Divider, CircularProgress, Alert, Chip,
} from '@mui/material';
import {
  CloudUpload, Description, GetApp, History, CheckCircle, Person,
} from '@mui/icons-material';
import { Manuscript, EditorialVersion } from '@/types/manuscript';
import { useAlertStore } from '@/stores/alertStore';
import axios from 'axios';

interface EditorialManagerDialogProps {
  open: boolean;
  onClose: () => void;
  manuscript: Manuscript;
  onUpdate?: () => void;
}

export default function EditorialManagerDialog({
  open, onClose, manuscript, onUpdate,
}: EditorialManagerDialogProps) {
  const { showSuccess, showError } = useAlertStore();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [versions, setVersions] = useState<EditorialVersion[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Charger les versions à l'ouverture du dialogue
  useEffect(() => {
    if (open && manuscript.id) {
      fetchVersions();
    }
  }, [open, manuscript.id]);

  const fetchVersions = async () => {
    setLoading(true);
    try {
      // Appel vers ton API FastAPI via le proxy Next.js
      const response = await axios.get(`/api/manuscripts/${manuscript.id}/editorial/versions`);
      
      // On s'assure que les données correspondent aux types attendus (Pydantic alias)
      const data = response.data.map((v: any) => ({
        id: v.id,
        versionNumber: v.versionNumber || v.version_number,
        filename: v.filename,
        editorName: v.editorName || 'Éditeur',
        createdAt: v.createdAt || v.created_at,
        editorId: v.editorId || v.editor_id
      }));
      
      setVersions(data);
    } catch (error) {
      console.error('Erreur versions:', error);
      showError('Impossible de charger l\'historique des versions');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (file.name.toLowerCase().endsWith('.docx')) {
        setSelectedFile(file);
      } else {
        showError('Veuillez sélectionner un fichier Word (.docx)');
      }
    }
  };

  const handleUpload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!selectedFile) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      await axios.post(`/api/manuscripts/${manuscript.id}/editorial/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      
      showSuccess('Nouvelle version enregistrée avec succès');
      setSelectedFile(null);
      await fetchVersions();
      onUpdate?.(); 
    } catch (error) {
      console.error('Upload error:', error);
      showError('Erreur lors de l\'envoi du fichier');
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = (e: React.MouseEvent, versionId: number) => {
    e.stopPropagation();
    // Utilisation de la route proxy sécurisée
    const downloadUrl = `/api/manuscripts/${manuscript.id}/editorial/download/${versionId}`;
    window.location.href = downloadUrl;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Date inconnue';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Format date invalide';
    
    return date.toLocaleString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
      onClick={(e) => e.stopPropagation()}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <History color="primary" />
        Suivi Éditorial : {manuscript.title.substring(0, 40)}...
      </DialogTitle>

      <DialogContent dividers>
        {/* Zone de dépôt de fichier */}
        <Box 
          mb={4} 
          p={2} 
          sx={{ border: '2px dashed', borderColor: 'divider', borderRadius: 2, textAlign: 'center' }}
        >
          <Typography variant="subtitle2" gutterBottom>
            Déposer une nouvelle version modifiée (DOCX)
          </Typography>
          
          <input
            accept=".docx"
            style={{ display: 'none' }}
            id="editorial-file-upload-dialog"
            type="file"
            onChange={handleFileChange}
          />
          
          <label htmlFor="editorial-file-upload-dialog">
            <Button 
              variant="outlined" 
              component="span" 
              startIcon={<CloudUpload />} 
              disabled={uploading}
            >
              Sélectionner le fichier
            </Button>
          </label>
          
          {selectedFile && (
            <Box mt={2} display="flex" alignItems="center" justifyContent="center" gap={1}>
              <Typography variant="caption" color="success.main" sx={{ display: 'flex', alignItems: 'center' }}>
                <CheckCircle fontSize="inherit" sx={{ mr: 0.5 }} />
                {selectedFile.name}
              </Typography>
              <Button 
                size="small" 
                variant="contained" 
                onClick={handleUpload} 
                disabled={uploading}
              >
                {uploading ? <CircularProgress size={20} color="inherit" /> : 'Envoyer'}
              </Button>
            </Box>
          )}
        </Box>

        <Typography variant="h6" gutterBottom fontSize="1rem">
          Historique des versions
        </Typography>

        {loading ? (
          <Box display="flex" justifyContent="center" p={3}><CircularProgress size={24} /></Box>
        ) : versions.length === 0 ? (
          <Alert severity="info">Aucune version éditoriale enregistrée.</Alert>
        ) : (
          <List dense>
            {versions.map((version) => (
              <React.Fragment key={version.id}>
                <ListItem
                  secondaryAction={
                    <IconButton edge="end" onClick={(e) => handleDownload(e, version.id)}>
                      <GetApp />
                    </IconButton>
                  }
                >
                  <ListItemIcon>
                    <Description color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box display="flex" alignItems="center" gap={1}>
                        <Typography variant="body1" fontWeight="medium">
                          Version {version.versionNumber}
                        </Typography>
                        <Chip
                          label={version.editorName}
                          size="small"
                          icon={<Person />}
                          color="secondary"
                          variant="outlined"
                        />
                      </Box>
                    }
                    secondary={formatDate(version.createdAt)}
                  />
                </ListItem>
                <Divider variant="inset" component="li" />
              </React.Fragment>
            ))}
          </List>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="inherit">Fermer</Button>
      </DialogActions>
    </Dialog>
  );
}