'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Button,
  IconButton,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import { ArrowBack, Save, Warning } from '@mui/icons-material';
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

  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleOpenConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    setConfirmOpen(true);
  };

  const handleConfirmSubmit = async () => {
    setConfirmOpen(false);
    await handleSubmit();
  };

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
    <Box>
      {/* Header */}
      <Box display="flex" alignItems="center" gap={2} mb={3}>
        <IconButton onClick={() => router.back()}>
          <ArrowBack />
        </IconButton>
        <Box flex={1}>
          <Typography variant="h4" fontWeight="bold">
            Modifier le Manuscrit
          </Typography>
        </Box>
      </Box>


      <form onSubmit={handleOpenConfirm}>
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

      {/* Modal de confirmation */}
      <Dialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Warning color="warning" />
          Confirmer les modifications
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Êtes-vous sûr de vouloir enregistrer les modifications apportées à ce manuscrit ?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setConfirmOpen(false)} color="inherit">
            Annuler
          </Button>
          <Button
            onClick={handleConfirmSubmit}
            variant="contained"
            autoFocus
          >
            Confirmer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
