import { useState, useEffect } from 'react';
import axios from 'axios';

export interface RecentManuscript {
  id: number;
  title: string;
  status: string;
  created_at: string;
  updated_at: string;
  theme?: {
    id: number;
    title: string;
  };
  evaluation_status?: string;
}

export function useRecentManuscripts() {
  const [manuscripts, setManuscripts] = useState<RecentManuscript[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchManuscripts = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/author/manuscripts/recent');
      setManuscripts(response.data || []);
    } catch (err) {
      setError(err as Error);
      setManuscripts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchManuscripts();
  }, []);

  const getStatusColor = (status: string): 'default' | 'primary' | 'success' | 'warning' | 'error' => {
    switch (status?.toLowerCase()) {
      case 'submitted':
      case 'soumis':
        return 'primary';
      case 'accepted':
      case 'accepté':
        return 'success';
      case 'rejected':
      case 'rejeté':
        return 'error';
      case 'under_review':
      case 'en_revision':
      case 'in_review':
        return 'warning';
      case 'published':
      case 'publié':
        return 'success';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status: string): string => {
    switch (status?.toLowerCase()) {
      case 'submitted':
        return 'Soumis';
      case 'accepted':
        return 'Accepté';
      case 'rejected':
        return 'Rejeté';
      case 'under_review':
      case 'in_review':
        return 'En révision';
      case 'published':
        return 'Publié';
      default:
        return status || 'Statut inconnu';
    }
  };

  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch {
      return 'Date inconnue';
    }
  };

  return {
    manuscripts,
    loading,
    error,
    refetch: fetchManuscripts,
    getStatusColor,
    getStatusLabel,
    formatDate
  };
}