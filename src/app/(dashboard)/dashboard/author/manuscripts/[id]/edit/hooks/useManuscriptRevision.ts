import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useAlertStore } from '@/stores/alertStore';
import { useManuscriptDetails } from '../../hooks/useManuscriptDetails';

interface RevisionFormData {
  title: string;
  abstract: string;
  keywords: string;
  pdfFile: File | null;
  pdfFilePath: string;
}

export function useManuscriptRevision(manuscriptId: string) {
  const router = useRouter();
  const { showSuccess, showError } = useAlertStore();
  const { manuscript } = useManuscriptDetails(manuscriptId);

  const [formData, setFormData] = useState<RevisionFormData>({
    title: '',
    abstract: '',
    keywords: '',
    pdfFile: null,
    pdfFilePath: '',
  });

  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Initialize form with manuscript data
  useEffect(() => {
    if (manuscript) {
      setFormData({
        title: manuscript.title,
        abstract: manuscript.abstract,
        keywords: manuscript.keywords,
        pdfFile: null,
        pdfFilePath: manuscript.pdfFilename,
      });
    }
  }, [manuscript]);

  const handleFieldChange = (field: 'title' | 'abstract' | 'keywords', value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePdfChange = async (file: File | null) => {
    if (!file) {
      setFormData((prev) => ({ ...prev, pdfFile: null }));
      return;
    }

    // Validate file
    if (file.type !== 'application/pdf') {
      showError('Seuls les fichiers PDF sont acceptés');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      showError('Le fichier ne doit pas dépasser 10 Mo');
      return;
    }

    setFormData((prev) => ({ ...prev, pdfFile: file }));

    // Upload file
    setUploading(true);
    try {
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);
      uploadFormData.append('subdirectory', 'manuscripts');

      const response = await axios.post('/api/files/upload', uploadFormData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setFormData((prev) => ({ ...prev, pdfFilePath: response.data.filePath }));
      showSuccess('PDF téléchargé avec succès');
    } catch (error) {
      console.error('Erreur lors du téléchargement du PDF:', error);
      showError('Erreur lors du téléchargement du PDF');
      setFormData((prev) => ({ ...prev, pdfFile: null }));
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.title.trim()) {
      showError('Le titre est requis');
      return;
    }

    if (!formData.abstract.trim() || formData.abstract.length < 10) {
      showError('Le résumé doit contenir au moins 10 caractères');
      return;
    }

    if (!formData.keywords.trim()) {
      showError('Les mots-clés sont requis');
      return;
    }

    setSubmitting(true);
    try {
      const payload: {
        title: string;
        abstract: string;
        keywords: string;
        pdfFilename?: string;
      } = {
        title: formData.title,
        abstract: formData.abstract,
        keywords: formData.keywords,
      };

      // Only include pdfFilename if a new file was uploaded
      if (formData.pdfFile && formData.pdfFilePath) {
        payload.pdfFilename = formData.pdfFilePath;
      }

      await axios.put(`/api/manuscripts/${manuscriptId}/revise`, payload);

      showSuccess('Manuscrit révisé avec succès', 'Il sera re-soumis pour révision.');
      router.push(`/dashboard/author/manuscripts/${manuscriptId}`);
    } catch (error) {
      console.error('Erreur lors de la révision:', error);
      if (axios.isAxiosError(error) && error.response) {
        showError(error.response.data.detail || 'Erreur lors de la révision');
      } else {
        showError('Erreur lors de la révision du manuscrit');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return {
    formData,
    handleFieldChange,
    handlePdfChange,
    handleSubmit,
    uploading,
    submitting,
  };
}
