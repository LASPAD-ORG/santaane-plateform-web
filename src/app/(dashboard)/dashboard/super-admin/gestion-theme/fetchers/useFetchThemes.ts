'use client';

import { useState, useEffect } from 'react';
import apiClient from '@/lib/api/client';

export interface Theme {
  id: number;
  title: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export const useFetchThemes = () => {
  const [data, setData] = useState<Theme[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetch = async (skip = 0, limit = 100) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get<Theme[]>('/themes/', {
        params: { skip, limit },
      });
      setData(response.data || []);
    } catch (err) {
      setError(err as Error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  return { data, loading, error, fetch };
};
