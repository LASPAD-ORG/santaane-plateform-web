import { useState, useEffect } from 'react';
import { JournalConfig } from '../types';
import { useAlertStore } from '@/stores/alertStore';

const initialConfig: JournalConfig = {
    name: 'Revue Santaane',
    description: 'Une revue scientifique d\'excellence.',
    logoUrl: '',
    issn: '1234-5678',
    editorialPolicy: 'Politique éditoriale standard...',
};

export function useJournalConfig() {
    const [config, setConfig] = useState<JournalConfig>(initialConfig);
    const [loading, setLoading] = useState(false);
    const { showSuccess, showError } = useAlertStore();

    // Simuler le chargement initial
    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            // Ici on pourrait fetcher les vraies données
            setLoading(false);
        }, 500);
    }, []);

    const updateConfig = (field: keyof JournalConfig, value: string) => {
        setConfig(prev => ({ ...prev, [field]: value }));
    };

    const saveConfig = async () => {
        setLoading(true);
        try {
            // Simulation d'appel API
            await new Promise(resolve => setTimeout(resolve, 1000));
            showSuccess('Configuration enregistrée', 'Les paramètres de la revue ont été mis à jour avec succès.');
        } catch (error) {
            showError('Erreur', 'Impossible d\'enregistrer la configuration.');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return {
        config,
        loading,
        updateConfig,
        saveConfig,
    };
}
