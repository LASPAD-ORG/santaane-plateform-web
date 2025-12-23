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
import { useManuscriptStaffDetails } from '../hooks/useManuscriptStaffDetails';
import { useManuscriptStaffEdit } from './hooks/useManuscriptStaffEdit';
import GeneralInfoSection from './components/GeneralInfoSection';
import ClassificationSection from './components/ClassificationSection';
import PdfUploadSection from './components/PdfUploadSection';
import { useManuscriptData } from '../../../../author/soumission/hooks/useManuscriptData';

export default function EditManuscriptStaffPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { loading: loadingDetails, manuscript } = useManuscriptStaffDetails(id);
  const { themes, sections, languages } = useManuscriptData();
  const {
    formData,
    handleFieldChange,
    handlePdfChange,
    handleSubmit,
    uploading,
    submitting,
  } = useManuscriptStaffEdit(id);

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

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Box display="flex" alignItems="center" gap={2} mb={3}>
        <IconButton onClick={() => router.back()}>
          <ArrowBack />
        </IconButton>
        <Box flex={1}>
          <Typography variant="h4" fontWeight="bold">
            Modifier le Manuscrit
          </Typography>
          <Typography variant="body2" color="text.secondary">
            ID: {manuscript.id}
          </Typography>
        </Box>
      </Box>

      <Alert severity="info" sx={{ mb: 3 }}>
        Vous pouvez modifier tous les champs sauf le statut. Pour changer le statut, utilisez le menu d&apos;actions sur la liste des manuscrits.
      </Alert>

      <form onSubmit={handleSubmit}>
        {/* Informations générales */}
        <GeneralInfoSection
          title={formData.title}
          abstract={formData.abstract}
          keywords={formData.keywords}
          onFieldChange={handleFieldChange}
        />

        {/* Classification */}
        <ClassificationSection
          themeId={formData.themeId}
          sectionId={formData.sectionId}
          languageId={formData.languageId}
          themes={themes}
          sections={sections}
          languages={languages}
          onFieldChange={handleFieldChange}
        />

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
