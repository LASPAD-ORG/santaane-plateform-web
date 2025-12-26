import { useState, useEffect } from 'react';
import axios from 'axios';
import { Manuscript, EvaluatorStatus } from '@/types/manuscript';

interface Filters {
  themeId: number | null;
  sectionId: number | null;
  languageId: number | null;
  evaluatorStatus: EvaluatorStatus | 'all' | 'none';
  evaluationStatus: 'all' | 'completed' | 'in_progress';
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
    evaluationStatus: 'all',
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

  // Helper function to calculate evaluation status
  const calculateEvaluationStatus = (manuscript: Manuscript) => {
    const acceptedEvals = manuscript.evaluators?.filter(e => e.status === 'accepted') || [];
    if (acceptedEvals.length === 0) return 'in_progress';
    
    const completedEvaluations = acceptedEvals.filter(e => e.evaluationStatus === 'completed').length;
    const result = completedEvaluations === acceptedEvals.length ? 'completed' : 'in_progress';
    
    return result;
  };

  // Client-side search and evaluation status filter
  useEffect(() => {
    console.log(`[Filter] Manuscrits: ${manuscripts.length}, Filtres:`, { 
      evaluatorStatus: filters.evaluatorStatus, 
      evaluationStatus: filters.evaluationStatus 
    });
    
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

    // Filter by evaluation status
    if (filters.evaluationStatus !== 'all') {
      console.log(`[Filter] Filtrage évaluation: ${filters.evaluationStatus}`);
      const beforeFilter = filtered.length;
      
      filtered = filtered.filter((manuscript) => {
        const evaluationStatus = calculateEvaluationStatus(manuscript);
        const matches = evaluationStatus === filters.evaluationStatus;
        if (!matches) console.log(`[Filter] Manuscrit ${manuscript.id}: ${evaluationStatus} ≠ ${filters.evaluationStatus}`);
        return matches;
      });
      
      console.log(`[Filter] Résultat: ${filtered.length}/${beforeFilter} manuscrits`);
    }

    console.log(`[Filter] Manuscrits finaux: ${filtered.length}`);
    setFilteredManuscripts(filtered);
    setTotal(filtered.length);
  }, [searchQuery, manuscripts, filters.evaluatorStatus, filters.evaluationStatus]);

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
