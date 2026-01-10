import { useState } from 'react';
import axios from 'axios';
import { useAlertStore } from '@/stores/alertStore';

export function useDocxUpload(manuscriptId: string) {
  const { showSuccess, showError } = useAlertStore();
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const uploadDocx = async (file: File): Promise<boolean> => {
    try {
      setUploading(true);
      setUploadProgress(0);

      // Step 1: Upload file to storage
      const formData = new FormData();
      formData.append('file', file);
      formData.append('subdirectory', `manuscripts/${manuscriptId}`);

      const uploadResponse = await axios.post('/api/files/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(progress);
          }
        },
      });

      const { filePath } = uploadResponse.data;

      // Step 2: Update manuscript with DOCX filename
      await axios.put(`/api/manuscripts/${manuscriptId}/docx`, {
        docxFilename: filePath,
      });

      showSuccess('Fichier DOCX téléversé avec succès');
      setUploadProgress(100);
      return true;
    } catch (error) {
      console.error('Error uploading DOCX:', error);
      if (axios.isAxiosError(error)) {
        showError(error.response?.data?.error || 'Erreur lors du téléversement du fichier DOCX');
      } else {
        showError('Erreur lors du téléversement du fichier DOCX');
      }
      return false;
    } finally {
      setUploading(false);
    }
  };

  return { uploading, uploadProgress, uploadDocx };
}
