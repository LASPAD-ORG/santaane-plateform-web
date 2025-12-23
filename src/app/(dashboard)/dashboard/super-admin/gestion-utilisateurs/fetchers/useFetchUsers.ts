'use client';

import { useState, useEffect } from 'react';
import apiClient from '@/lib/api/client';

export interface User {
  id: number;
  email: string;
  fullName: string;
  isActive: boolean;
  emailVerified: boolean;
  orcidId?: string;
  profilePhoto?: string;
  bio?: string;
  position?: string;
  institution?: string;
  created_at: string;
  updated_at: string;
  roles: Array<{ id: number; name: string; description: string }>;
}

interface UsersResponse {
  items: User[];
  total: number;
  skip: number;
  limit: number;
  has_more: boolean;
}

export const useFetchUsers = () => {
  const [data, setData] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetch = async (skip = 0, limit = 100) => {
    setLoading(true);
    setError(null);
    try {
      // Backend returns paginated response with items array
      const response = await apiClient.get<UsersResponse>('/users', {
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
