'use client';

import { useState, useEffect } from 'react';
import apiClient from '@/lib/api/client';

export interface Theme {
  id: number;
  title: string;
  description: string;
  date_limite: string | null;
  created_at: string;
  updated_at: string;
}

export const useFetchThemes = () => {
  const [data, setData] = useState<Theme[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetch = async (skip = 0, limit = 100, filterType: 'all' | 'active' | 'expired' = 'all') => {
    setLoading(true);
    setError(null);
    try {
      let endpoint = '/themes/';
      if (filterType === 'all') endpoint = '/themes/all';
      else if (filterType === 'active') endpoint = '/themes/active';
      else if (filterType === 'expired') endpoint = '/themes/expired';
      
      const response = await apiClient.get<Theme[]>(endpoint, {
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
    fetch(0, 100, 'all');
  }, []);

  return { data, loading, error, fetch };
};
