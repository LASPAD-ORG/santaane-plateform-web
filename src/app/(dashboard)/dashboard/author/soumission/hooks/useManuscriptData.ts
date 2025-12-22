import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAlertStore } from '@/stores/alertStore';

interface Theme {
  id: number;
  title: string;
  description: string;
}

interface Section {
  id: number;
  name: string;
  signe_min: number;
  signe_max: number;
}

interface LanguageOption {
  id: number;
  name: string;
  code: string;
}

export function useManuscriptData() {
  const { showError } = useAlertStore();
  const [loading, setLoading] = useState(true);
  const [themes, setThemes] = useState<Theme[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [languages, setLanguages] = useState<LanguageOption[]>([]);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [themesRes, sectionsRes, languagesRes] = await Promise.all([
        axios.get('/api/themes'),
        axios.get('/api/sections'),
        axios.get('/api/languages'),
      ]);

      setThemes(themesRes.data);
      setSections(sectionsRes.data);
      setLanguages(languagesRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      showError('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  return { loading, themes, sections, languages };
}
