'use client';

import { useState, useEffect } from 'react';
import apiClient from '@/lib/api/client';

export interface Language {
  id: number;
  name: string;
  code: string;
  created_at: string;
  updated_at: string;
}

export const useFetchLanguages = () => {
  const [data, setData] = useState<Language[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetch = async (skip = 0, limit = 100) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get<Language[]>('/languages/', {
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
