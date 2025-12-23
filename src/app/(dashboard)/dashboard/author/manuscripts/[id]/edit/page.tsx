'use client';

import { useParams, useRouter } from 'next/navigation';
import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Button,
  IconButton,
  Alert,
} from '@mui/material';
import { ArrowBack, Save } from '@mui/icons-material';
import { useManuscriptDetails } from '../hooks/useManuscriptDetails';
import { useManuscriptRevision } from './hooks/useManuscriptRevision';
import GeneralInfoSection from './components/GeneralInfoSection';
import PdfUploadSection from './components/PdfUploadSection';

export default function EditManuscriptPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { loading: loadingDetails, manuscript } = useManuscriptDetails(id);
  const {
    formData,
    handleFieldChange,
    handlePdfChange,
    handleSubmit,
    uploading,
    submitting,
  } = useManuscriptRevision(id);

  if (loadingDetails) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!manuscript) {
    return (
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="60vh" gap={2}>
        <Typography variant="h6" color="text.secondary">
          Manuscrit introuvable
        </Typography>
        <Button variant="contained" onClick={() => router.back()}>
          Retour
        </Button>
      </Box>
    );
  }

  if (manuscript.status !== 'revision_requested') {
    return (
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="60vh" gap={2}>
        <Alert severity="warning">
          Ce manuscrit ne peut pas être révisé. Seuls les manuscrits avec le statut "Révision demandée" peuvent être modifiés.
        </Alert>
        <Button variant="contained" onClick={() => router.back()}>
          Retour
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Box display="flex" alignItems="center" gap={2} mb={3}>
        <IconButton onClick={() => router.back()}>
          <ArrowBack />
        </IconButton>
        <Box flex={1}>
          <Typography variant="h4" fontWeight="bold">
            Réviser le Manuscrit
          </Typography>
          <Typography variant="body2" color="text.secondary">
            ID: {manuscript.id}
          </Typography>
        </Box>
      </Box>

      <Alert severity="info" sx={{ mb: 3 }}>
        Vous pouvez modifier le titre, le résumé, les mots-clés et le fichier PDF. Le thème, la section et la langue ne peuvent pas être modifiés.
      </Alert>

      <form onSubmit={handleSubmit}>
        {/* Informations générales */}
        <GeneralInfoSection
          title={formData.title}
          abstract={formData.abstract}
          keywords={formData.keywords}
          onFieldChange={handleFieldChange}
        />

        {/* Informations de classification (lecture seule) */}
        <Card elevation={2} sx={{ mb: 3 }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight="600" mb={2}>
              Classification (Non modifiable)
            </Typography>
            <Box display="flex" flexDirection="column" gap={2}>
              {manuscript.themeName && (
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Thème
                  </Typography>
                  <Typography variant="body1">{manuscript.themeName}</Typography>
                </Box>
              )}
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Section
                </Typography>
                <Typography variant="body1">{manuscript.sectionName}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Langue
                </Typography>
                <Typography variant="body1">{manuscript.languageName}</Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Upload PDF */}
        <PdfUploadSection
          selectedFile={formData.pdfFile}
          currentPdfName={manuscript.pdfFilename.split('/').pop() || ''}
          onFileChange={handlePdfChange}
          uploading={uploading}
        />

        {/* Actions */}
        <Box display="flex" justifyContent="flex-end" gap={2} mt={3}>
          <Button
            variant="outlined"
            onClick={() => router.back()}
            disabled={submitting || uploading}
          >
            Annuler
          </Button>
          <Button
            type="submit"
            variant="contained"
            startIcon={<Save />}
            disabled={submitting || uploading}
          >
            {submitting ? 'Enregistrement...' : 'Enregistrer les modifications'}
          </Button>
        </Box>
      </form>
    </Box>
  );
}
