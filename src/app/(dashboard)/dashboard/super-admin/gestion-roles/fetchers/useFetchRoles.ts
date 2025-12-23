'use client';

import { useState, useEffect } from 'react';
import apiClient from '@/lib/api/client';

export interface Role {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

interface RolesResponse {
  items: Role[];
  total: number;
  skip: number;
  limit: number;
  hasMore: boolean;
}

export const useFetchRoles = () => {
  const [data, setData] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetch = async (skip = 0, limit = 100) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get<RolesResponse>('/roles', {
        params: { skip, limit },
      });
      setData(response.data.items || []);
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
