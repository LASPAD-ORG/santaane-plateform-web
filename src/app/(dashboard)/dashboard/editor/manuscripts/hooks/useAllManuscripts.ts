import { useState, useEffect } from 'react';
import axios from 'axios';
import { Manuscript, EvaluatorStatus } from '@/types/manuscript';

interface Filters {
  themeId: number | null;
  sectionId: number | null;
  languageId: number | null;
  evaluatorStatus: EvaluatorStatus | 'all' | 'none';
}

export function useAllManuscripts() {
  const [manuscripts, setManuscripts] = useState<Manuscript[]>([]);
  const [filteredManuscripts, setFilteredManuscripts] = useState<Manuscript[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<Filters>({
    themeId: null,
    sectionId: null,
    languageId: null,
    evaluatorStatus: 'all',
  });

  // Fetch manuscripts
  const fetchManuscripts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        skip: '0',
        limit: '100',
      });

      if (filters.themeId) params.append('theme_id', filters.themeId.toString());
      if (filters.sectionId) params.append('section_id', filters.sectionId.toString());
      if (filters.languageId) params.append('language_id', filters.languageId.toString());

      const response = await axios.get(`/api/manuscripts/all?${params.toString()}`);
      setManuscripts(response.data.manuscripts);
      setFilteredManuscripts(response.data.manuscripts);
      setTotal(response.data.total);
    } catch (error) {
      console.error('Erreur lors de la récupération des manuscrits:', error);
      setManuscripts([]);
      setFilteredManuscripts([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  // Fetch on mount and when filters change
  useEffect(() => {
    fetchManuscripts();
  }, [filters.themeId, filters.sectionId, filters.languageId]);

  // Client-side search filter
  useEffect(() => {
    let filtered = manuscripts;

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((manuscript) => {
        return (
          manuscript.title.toLowerCase().includes(query) ||
          manuscript.abstract.toLowerCase().includes(query) ||
          manuscript.keywords.toLowerCase().includes(query) ||
          manuscript.themeName?.toLowerCase().includes(query) ||
          manuscript.sectionName.toLowerCase().includes(query) ||
          manuscript.languageName.toLowerCase().includes(query)
        );
      });
    }

    // Filter by evaluator status
    if (filters.evaluatorStatus !== 'all') {
      if (filters.evaluatorStatus === 'none') {
        // Manuscripts without evaluators
        filtered = filtered.filter((m) => !m.evaluators || m.evaluators.length === 0);
      } else {
        // Manuscripts with at least one evaluator with the specified status
        filtered = filtered.filter((m) => 
          m.evaluators && m.evaluators.some((e) => e.status === filters.evaluatorStatus)
        );
      }
    }

    setFilteredManuscripts(filtered);
    setTotal(filtered.length);
  }, [searchQuery, manuscripts, filters.evaluatorStatus]);

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const handleFilterChange = (filterKey: keyof Filters, value: number | string | null) => {
    setFilters((prev) => ({ ...prev, [filterKey]: value }));
  };

  const refetch = () => {
    fetchManuscripts();
  };

  return {
    manuscripts: filteredManuscripts,
    total,
    loading,
    filters,
    searchQuery,
    handleSearchChange,
    handleFilterChange,
    refetch,
  };
}
