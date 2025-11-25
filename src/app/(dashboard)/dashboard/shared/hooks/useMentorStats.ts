'use client';

import { useState, useEffect } from 'react';
import { useFetchAuteurAAcompagner, type AuteurAAcompagnerItem } from '../../mentor/auteur-a-acompagner/fetchers/useFetchAuteurAAcompagner';

export interface MentorStats {
  auteursAccompagnes: number;
  manuscritsEnCours: number;
  manuscritsValides: number;
  echangesNonLus: number;
  notificationsNonLues: number;
  manuscritsEnAttente: number;
  tauxValidation: number;
  activiteRecente: ActivityItem[];
  statistiquesDetaillees: {
    parStatut: {
      brouillon: number;
      en_attente: number;
      publie: number;
      archive: number;
    };
    parValidation: {
      en_attente: number;
      en_cours: number;
      valide: number;
      besoin_revision: number;
    };
    tendances: {
      manuscritsCeMois: number;
      manuscritsMoisPrecedent: number;
      echangesCeMois: number;
      echangesMoisPrecedent: number;
    };
  };
}

export interface ActivityItem {
  id: string;
  type: 'manuscrit_recu' | 'validation_terminee' | 'echange_nouveau' | 'notification' | 'commentaire_ajoute';
  titre: string;
  description: string;
  date: string;
  auteurNom?: string;
  manuscritTitre?: string;
  statut?: string;
  priorite?: 'low' | 'medium' | 'high';
}

export function useMentorStats() {
  const { data: auteurs, loading: auteursLoading, fetch } = useFetchAuteurAAcompagner();
  const [stats, setStats] = useState<MentorStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      setLoading(true);
      await fetch();
    };
    loadStats();
  }, []);

  useEffect(() => {
    if (auteurs && auteurs.length > 0) {
      calculateStats(auteurs);
    }
  }, [auteurs]);

  const calculateStats = (auteurs: AuteurAAcompagnerItem[]) => {
    // Calculs statistiques basés sur les données réelles
    const auteursAccompagnes = auteurs.length;
    
    // Comptage des manuscrits
    const tousManuscrits = auteurs.flatMap(a => a.manuscrits);
    const manuscritsEnCours = tousManuscrits.filter(m => 
      m.statut === 'brouillon' || m.statut === 'en_attente'
    ).length;
    
    const manuscritsValides = tousManuscrits.filter(m => 
      m.validation_mentor?.statut === 'valide'
    ).length;
    
    // Comptage des échanges et notifications
    const echangesNonLus = auteurs.reduce((total, auteur) => 
      total + (auteur.statistiques?.echangesNonLus || 0), 0
    );
    
    const notificationsNonLues = auteurs.reduce((total, auteur) => 
      total + auteur.notifications.filter(n => !n.lu).length, 0
    );
    
    const manuscritsEnAttente = tousManuscrits.filter(m => 
      m.validation_mentor?.statut === 'en_attente' || 
      m.validation_mentor?.statut === 'en_cours'
    ).length;
    
    // Calcul du taux de validation
    const manuscritsAvecValidation = tousManuscrits.filter(m => m.validation_mentor);
    const tauxValidation = manuscritsAvecValidation.length > 0 ? 
      Math.round((manuscritsValides / manuscritsAvecValidation.length) * 100) : 0;

    // Statistiques détaillées
    const parStatut = {
      brouillon: tousManuscrits.filter(m => m.statut === 'brouillon').length,
      en_attente: tousManuscrits.filter(m => m.statut === 'en_attente').length,
      publie: tousManuscrits.filter(m => m.statut === 'publie').length,
      archive: tousManuscrits.filter(m => m.statut === 'archive').length,
    };

    const parValidation = {
      en_attente: tousManuscrits.filter(m => m.validation_mentor?.statut === 'en_attente').length,
      en_cours: tousManuscrits.filter(m => m.validation_mentor?.statut === 'en_cours').length,
      valide: tousManuscrits.filter(m => m.validation_mentor?.statut === 'valide').length,
      besoin_revision: tousManuscrits.filter(m => m.validation_mentor?.statut === 'besoin_revision').length,
    };

    // Activité récente générée à partir des données
    const activiteRecente: ActivityItem[] = [];

    // Ajouter les notifications importantes uniquement
    auteurs.forEach(auteur => {
      auteur.notifications
        .filter(notif => notif.priorite === 'high' || notif.priorite === 'medium') // Filtrer les priorités
        .sort((a, b) => new Date(b.dateCreation).getTime() - new Date(a.dateCreation).getTime())
        .slice(0, 1) // Maximum 1 par auteur
        .forEach(notif => {
          activiteRecente.push({
            id: `notif-${notif.id}`,
            type: 'notification',
            titre: notif.titre,
            description: notif.message,
            date: notif.dateCreation,
            auteurNom: `${auteur.prenom} ${auteur.nom}`,
            priorite: notif.priorite
          });
        });
    });

    // Ajouter les échanges récents importants
    auteurs.forEach(auteur => {
      auteur.echanges
        .filter(echange => echange.statut === 'nouveau') // Seulement les nouveaux échanges
        .sort((a, b) => new Date(b.dateCreation).getTime() - new Date(a.dateCreation).getTime())
        .slice(0, 1) // Maximum 1 par auteur
        .forEach(echange => {
          activiteRecente.push({
            id: `echange-${echange.id}`,
            type: 'echange_nouveau',
            titre: `Nouvel échange avec éditeur`,
            description: `${echange.editeurNom}: ${echange.contenu.substring(0, 80)}...`,
            date: echange.dateCreation,
            auteurNom: `${auteur.prenom} ${auteur.nom}`,
            manuscritTitre: echange.metadata?.manuscritTitre,
            priorite: echange.priorite
          });
        });
    });

    // Ajouter les validations récentes
    auteurs.forEach(auteur => {
      auteur.manuscrits
        .filter(m => m.validation_mentor?.statut === 'valide')
        .slice(0, 1)
        .forEach(manuscrit => {
          activiteRecente.push({
            id: `validation-${manuscrit.id}`,
            type: 'validation_terminee',
            titre: 'Manuscrit validé',
            description: `"${manuscrit.titre}" prêt pour soumission`,
            date: manuscrit.validation_mentor?.date_validation || manuscrit.dateMiseAJour,
            auteurNom: `${auteur.prenom} ${auteur.nom}`,
            manuscritTitre: manuscrit.titre,
            statut: 'valide'
          });
        });
    });

    // Trier par date et prendre les 10 plus récents
    activiteRecente.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // Tendances (simulation basique)
    const tendances = {
      manuscritsCeMois: tousManuscrits.length,
      manuscritsMoisPrecedent: Math.max(0, tousManuscrits.length - 2),
      echangesCeMois: auteurs.reduce((total, a) => total + a.echanges.length, 0),
      echangesMoisPrecedent: Math.max(0, auteurs.reduce((total, a) => total + a.echanges.length, 0) - 1),
    };

    const statsCalculees: MentorStats = {
      auteursAccompagnes,
      manuscritsEnCours,
      manuscritsValides,
      echangesNonLus,
      notificationsNonLues,
      manuscritsEnAttente,
      tauxValidation,
      activiteRecente: activiteRecente.slice(0, 10),
      statistiquesDetaillees: {
        parStatut,
        parValidation,
        tendances
      }
    };

    setStats(statsCalculees);
    setLoading(false);
  };

  return {
    stats,
    loading: loading || auteursLoading,
    refresh: fetch
  };
}