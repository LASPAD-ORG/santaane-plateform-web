'use client';

import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  CircularProgress,
  Alert,
  LinearProgress,
} from '@mui/material';
import { CloudUpload, Description, CheckCircle } from '@mui/icons-material';
import { useState } from 'react';
import { useDocxUpload } from '../hooks/useDocxUpload';

interface DocxUploadSectionProps {
  manuscriptId: string;
  currentDocxFilename?: string | null;
  onUploadSuccess: () => void;
}

export default function DocxUploadSection({
  manuscriptId,
  currentDocxFilename,
  onUploadSuccess,
}: DocxUploadSectionProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { uploading, uploadProgress, uploadDocx } = useDocxUpload(manuscriptId);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;

    // Validate file type
    if (file && !file.name.endsWith('.docx')) {
      alert('Veuillez sélectionner un fichier au format DOCX');
      return;
    }

    // Validate file size (max 10MB)
    if (file && file.size > 10 * 1024 * 1024) {
      alert('La taille du fichier ne doit pas dépasser 10 Mo');
      return;
    }

    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    const success = await uploadDocx(selectedFile);
    if (success) {
      setSelectedFile(null);
      onUploadSuccess();
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
  };

  return (
    <Card
      elevation={3}
      sx={{
        mb: 3,
        borderLeft: '4px solid',
        borderColor: currentDocxFilename ? 'success.main' : 'warning.main',
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box display="flex" alignItems="center" gap={1} mb={2}>
          <Description sx={{ color: 'primary.main', fontSize: 28 }} />
          <Typography variant="h6" fontWeight="600">
            Manuscrit au format DOCX
          </Typography>
        </Box>

        {!currentDocxFilename ? (
          <Alert severity="info" sx={{ mb: 2 }}>
            <Typography variant="body2" fontWeight="500" mb={1}>
              🎉 Félicitations ! Votre manuscrit a été accepté.
            </Typography>
            <Typography variant="body2">
              Veuillez téléverser le manuscrit au format DOCX pour la publication finale.
            </Typography>
          </Alert>
        ) : (
          <Alert severity="success" icon={<CheckCircle />} sx={{ mb: 2 }}>
            <Typography variant="body2">
              ✅ Fichier DOCX déjà téléversé : <strong>{currentDocxFilename.split('/').pop()}</strong>
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Vous pouvez téléverser un nouveau fichier pour le remplacer.
            </Typography>
          </Alert>
        )}

        <Box display="flex" flexDirection="column" gap={2}>
          <input
            accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            style={{ display: 'none' }}
            id="docx-file-upload"
            type="file"
            onChange={handleFileSelect}
            disabled={uploading}
          />

          <label htmlFor="docx-file-upload">
            <Button
              variant="outlined"
              component="span"
              startIcon={uploading ? <CircularProgress size={20} /> : <CloudUpload />}
              disabled={uploading}
              fullWidth
              color="primary"
            >
              {uploading ? 'Téléchargement...' : 'Choisir un fichier DOCX'}
            </Button>
          </label>

          {selectedFile && (
            <>
              <Box
                display="flex"
                alignItems="center"
                gap={2}
                p={2}
                sx={{
                  border: '1px solid',
                  borderColor: 'primary.main',
                  borderRadius: 1,
                  bgcolor: 'primary.50',
                }}
              >
                <Description sx={{ color: 'primary.main', fontSize: 40 }} />
                <Box flex={1}>
                  <Typography variant="body1" fontWeight="500">
                    {selectedFile.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} Mo
                  </Typography>
                </Box>
                <Button
                  size="small"
                  color="error"
                  onClick={handleRemoveFile}
                  disabled={uploading}
                >
                  Supprimer
                </Button>
              </Box>

              {uploading && (
                <Box>
                  <LinearProgress variant="determinate" value={uploadProgress} />
                  <Typography variant="caption" color="text.secondary" textAlign="center" display="block" mt={1}>
                    {uploadProgress}%
                  </Typography>
                </Box>
              )}

              <Button
                variant="contained"
                onClick={handleUpload}
                disabled={uploading}
                fullWidth
                color="success"
                size="large"
              >
                {uploading ? 'Téléversement en cours...' : 'Téléverser le fichier DOCX'}
              </Button>
            </>
          )}

          <Typography variant="caption" color="text.secondary">
            Format accepté : DOCX (.docx) • Taille max : 10 Mo
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
