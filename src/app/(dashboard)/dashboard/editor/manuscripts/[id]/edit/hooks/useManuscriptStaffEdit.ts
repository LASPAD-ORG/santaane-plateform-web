import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useAlertStore } from '@/stores/alertStore';
import { useManuscriptStaffDetails } from '../../hooks/useManuscriptStaffDetails';

interface EditFormData {
  title: string;
  abstract: string;
  keywords: string;
  themeId: number | null;
  sectionId: number | null;
  languageId: number | null;
  pdfFile: File | null;
  pdfFilePath: string;
}

export function useManuscriptStaffEdit(manuscriptId: string) {
  const router = useRouter();
  const { showSuccess, showError } = useAlertStore();
  const { manuscript } = useManuscriptStaffDetails(manuscriptId);

  const [formData, setFormData] = useState<EditFormData>({
    title: '',
    abstract: '',
    keywords: '',
    themeId: null,
    sectionId: null,
    languageId: null,
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
        themeId: manuscript.themeId,
        sectionId: manuscript.sectionId,
        languageId: manuscript.languageId,
        pdfFile: null,
        pdfFilePath: manuscript.pdfFilename,
      });
    }
  }, [manuscript]);

  const handleFieldChange = (
    field: 'title' | 'abstract' | 'keywords' | 'themeId' | 'sectionId' | 'languageId',
    value: string | number | null
  ) => {
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

    if (!formData.sectionId) {
      showError('La rubrique est requise');
      return;
    }

    if (!formData.languageId) {
      showError('La langue est requise');
      return;
    }

    setSubmitting(true);
    try {
      const payload: {
        title: string;
        abstract: string;
        keywords: string;
        themeId?: number;
        sectionId: number;
        languageId: number;
        pdfFilename?: string;
      } = {
        title: formData.title,
        abstract: formData.abstract,
        keywords: formData.keywords,
        sectionId: formData.sectionId,
        languageId: formData.languageId,
      };

      if (formData.themeId) {
        payload.themeId = formData.themeId;
      }

      // Only include pdfFilename if a new file was uploaded
      if (formData.pdfFile && formData.pdfFilePath) {
        payload.pdfFilename = formData.pdfFilePath;
      }

      await axios.put(`/api/manuscripts/detail/${manuscriptId}`, payload);

      showSuccess('Manuscrit mis à jour avec succès');
      router.push(`/dashboard/editor/manuscripts/${manuscriptId}`);
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      if (axios.isAxiosError(error) && error.response) {
        showError(error.response.data.detail || 'Erreur lors de la mise à jour');
      } else {
        showError('Erreur lors de la mise à jour du manuscrit');
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
