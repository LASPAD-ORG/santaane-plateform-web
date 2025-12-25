'use client';

import { useState, useEffect } from 'react';
import apiClient from '@/lib/api/client';
import { EditorDashboardResponse } from '../types/dashboard.types';

export const useFetchEditorDashboard = () => {
  const [data, setData] = useState<EditorDashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetch = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get<EditorDashboardResponse>(
        '/dashboards/editor'
      );
      setData(response.data);
    } catch (err) {
      setError(err as Error);
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  return { data, loading, error, refetch: fetch };
};
