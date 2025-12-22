'use client';

import { useState } from 'react';
import { Box, Card, CardContent, Button, Typography, CircularProgress, Divider } from '@mui/material';
import { Send } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useAlertStore } from '@/stores/alertStore';
import GeneralInfoSection from './components/GeneralInfoSection';
import ClassificationSection from './components/ClassificationSection';
import PdfUploadSection from './components/PdfUploadSection';
import { useManuscriptData } from './hooks/useManuscriptData';
import { useManuscriptSubmission } from './hooks/useManuscriptSubmission';

interface ManuscriptData {
  title: string;
  abstract: string;
  keywords: string;
  themeId: number | '';
  sectionId: number | '';
  languageId: number | '';
  pdfFile: File | null;
}

export default function AuthorSoumission() {
  const { showError } = useAlertStore();
  const router = useRouter();
  const { loading, themes, sections, languages } = useManuscriptData();
  const { submitting, submitManuscript } = useManuscriptSubmission();

  const [formData, setFormData] = useState<ManuscriptData>({
    title: '',
    abstract: '',
    keywords: '',
    themeId: '',
    sectionId: '',
    languageId: '',
    pdfFile: null,
  });

  const handleChange = (field: keyof ManuscriptData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        showError('Veuillez sélectionner un fichier PDF');
        return;
      }
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        showError('Le fichier PDF ne doit pas dépasser 10MB');
        return;
      }
      setFormData((prev) => ({ ...prev, pdfFile: file }));
    }
  };

  const handleRemoveFile = () => {
    setFormData((prev) => ({ ...prev, pdfFile: null }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitManuscript(formData);
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', p: 3 }}>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Soumettre un Manuscrit
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>
        Remplissez le formulaire ci-dessous pour soumettre votre manuscrit
      </Typography>

      <form onSubmit={handleSubmit}>
        <Card elevation={2}>
          <CardContent sx={{ p: 4 }}>
            <GeneralInfoSection formData={formData} onChange={handleChange} />

            <Divider sx={{ my: 4 }} />

            <ClassificationSection
              formData={formData}
              themes={themes}
              sections={sections}
              languages={languages}
              onChange={handleChange}
            />

            <Divider sx={{ my: 4 }} />

            <PdfUploadSection
              pdfFile={formData.pdfFile}
              onFileChange={handleFileChange}
              onRemoveFile={handleRemoveFile}
            />

            {/* Actions */}
            <Box display="flex" justifyContent="flex-end" gap={2} mt={4}>
              <Button
                variant="outlined"
                onClick={() => router.back()}
                disabled={submitting}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={submitting}
                startIcon={submitting ? <CircularProgress size={20} /> : <Send />}
              >
                {submitting ? 'Soumission...' : 'Soumettre le manuscrit'}
              </Button>
            </Box>
          </CardContent>
        </Card>
      </form>
    </Box>
  );
}