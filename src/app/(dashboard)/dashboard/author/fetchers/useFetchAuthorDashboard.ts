'use client';

import { useState, useEffect } from 'react';
import apiClient from '@/lib/api/client';
import { AuthorDashboardResponse } from '../types/dashboard.types';

export const useFetchAuthorDashboard = () => {
  const [data, setData] = useState<AuthorDashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetch = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get<AuthorDashboardResponse>(
        '/dashboards/author'
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
