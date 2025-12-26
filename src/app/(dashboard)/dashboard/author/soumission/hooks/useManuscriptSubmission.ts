import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useAlertStore } from '@/stores/alertStore';

interface ManuscriptData {
  title: string;
  abstract: string;
  keywords: string;
  themeId: number | '';
  sectionId: number | '';
  languageId: number | '';
  pdfFile: File | null;
}

export function useManuscriptSubmission() {
  const { showSuccess, showError } = useAlertStore();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const validateForm = (formData: ManuscriptData): boolean => {
    if (formData.title.length < 3 || formData.title.length > 500) {
      showError('Le titre doit contenir entre 3 et 500 caractères');
      return false;
    }

    if (formData.abstract.length < 10) {
      showError('Le résumé doit contenir au moins 10 caractères');
      return false;
    }

    if (!formData.sectionId) {
      showError('Veuillez sélectionner une section');
      return false;
    }

    if (!formData.languageId) {
      showError('Veuillez sélectionner une langue');
      return false;
    }

    if (!formData.pdfFile) {
      showError('Veuillez sélectionner un fichier PDF');
      return false;
    }

    return true;
  };

  const submitManuscript = async (formData: ManuscriptData) => {
    if (!validateForm(formData)) {
      return;
    }

    try {
      setSubmitting(true);

      // Étape 1: Upload du fichier PDF
      const fileFormData = new FormData();
      fileFormData.append('file', formData.pdfFile!);
      fileFormData.append('subdirectory', 'manuscripts');

      const uploadResponse = await axios.post('/api/files/upload', fileFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const pdfFilePath = uploadResponse.data.filePath;
      console.log('PDF uploaded successfully:', pdfFilePath);

      // Étape 2: Soumettre le manuscrit avec le chemin du fichier
      const submitData = {
        title: formData.title,
        abstract: formData.abstract,
        keywords: formData.keywords || undefined,
        themeId: formData.themeId || undefined,
        sectionId: Number(formData.sectionId),
        languageId: Number(formData.languageId),
        pdfFilename: pdfFilePath,
      };

      await axios.post('/api/manuscripts/submit', submitData);

      showSuccess('Manuscrit soumis avec succès');

      // Rediriger vers la liste des manuscrits
      setTimeout(() => {
        router.push('/dashboard/author/manuscripts');
      }, 1500);
    } catch (error: any) {
      console.error('Error submitting manuscript:', error);
      showError(
        error.response?.data?.error || 'Erreur lors de la soumission du manuscrit'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return { submitting, submitManuscript };
}
