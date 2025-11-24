import { useState } from 'react';
import { getManuscritsByAuteur, type BaseManuscrit } from '@/lib/data/manuscrits-shared';
// import { apiClient } from '@/lib/api/client';
// import { useAlertStore } from '@/stores/alertStore';

// Interface pour les échanges auteur-éditeur
export interface EchangeAuteurEditeur {
  id: string;
  manuscritId: string;
  editeurNom: string;
  editeurId: string;
  type: 'commentaire' | 'decision' | 'demande_revision' | 'validation';
  contenu: string;
  statut: 'nouveau' | 'lu' | 'traite';
  priorite: 'low' | 'medium' | 'high';
  dateCreation: string;
  metadata?: {
    decision?: 'accepte' | 'refuse' | 'revision_demandee';
    delaiReponse?: string;
    manuscritTitre?: string;
  };
}

// Interface pour les notifications du mentor
export interface NotificationMentor {
  id: string;
  type: 'echange_nouveau' | 'decision_editeur' | 'delai_depasse' | 'manuscrit_soumis';
  titre: string;
  message: string;
  priorite: 'low' | 'medium' | 'high';
  auteurId: string;
  manuscritId?: string;
  lu: boolean;
  dateCreation: string;
  actionUrl?: string;
}

// Interface pour les commentaires pré-soumission
export interface CommentairePreSoumission {
  id: string;
  mentorId: string;
  auteurId: string;
  manuscritId: string;
  section: 'forme' | 'style' | 'methodologie' | 'general' | 'structure' | 'contenu';
  texte: string;
  type: 'suggestion' | 'question' | 'validation' | 'blocage';
  statut: 'brouillon' | 'envoye' | 'resolu' | 'ouvert';
  dateCreation: string;
  parent?: string; // Pour les réponses
  metadata?: {
    bloque_soumission?: boolean;
    niveau_importance?: 'info' | 'important' | 'critique';
  };
}

// Interface pour la checklist de validation
export interface ValidationChecklist {
  id: string;
  label: string;
  verifie: boolean;
  obligatoire: boolean;
  commentaire?: string;
  ordre: number;
}

// Interface pour les manuscrits d'un auteur - utilise maintenant BaseManuscrit
export interface ManuscritAuteur extends BaseManuscrit {
  dernierCommentaire?: string;
  validation_mentor?: {
    statut: 'en_attente' | 'en_cours' | 'valide' | 'besoin_revision';
    mentor_id: string;
    date_validation?: string;
    commentaires_pre_soumission: CommentairePreSoumission[];
    checklist: ValidationChecklist[];
    pret_soumission: boolean;
  };
}

// Define the auteur-a-acompagner item interface
export interface AuteurAAcompagnerItem {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  avatar?: string;
  dateInscription: string;
  statut: 'actif' | 'inactif' | 'suspendu';
  nombreManuscrits: number;
  dernierContact: string;
  mentorId: string; // ID du mentor assigné
  manuscrits: ManuscritAuteur[];
  specialites?: string[];
  echanges: EchangeAuteurEditeur[];
  notifications: NotificationMentor[];
  statistiques?: {
    totalEchanges: number;
    echangesNonLus: number;
    manuscritsEnAttente: number;
    dernierEchange?: string;
  };
  // Add more fields based on your API response
}

// Helper functions pour les données des manuscrits
function getLastComment(manuscritId: string): string {
  const comments: Record<string, string> = {
    'ms1': 'Excellent travail sur la structure narrative',
    'ms2': 'Développer davantage les personnages secondaires',
    'ms3': 'Prêt pour publication, félicitations !',
    'ms4': 'Les dialogues sont très naturels, continuez ainsi',
    'ms5': 'Belle atmosphère nostalgique',
    'ms6': 'Sujet passionnant, structurez mieux vos arguments'
  };
  return comments[manuscritId] || 'Aucun commentaire récent';
}

function getValidationMentor(manuscritId: string) {
  const validations: Record<string, any> = {
    'ms3': {
      statut: 'valide',
      mentor_id: 'mentor-1',
      date_validation: '2024-01-12T10:15:00Z',
      commentaires_pre_soumission: [],
      checklist: [
        { id: 'c1', label: 'Structure narrative claire', verifie: true, obligatoire: true, ordre: 1 },
        { id: 'c2', label: 'Orthographe et grammaire', verifie: true, obligatoire: true, ordre: 2 },
        { id: 'c3', label: 'Cohérence du style', verifie: true, obligatoire: false, ordre: 3 }
      ],
      pret_soumission: true
    },
    'ms5': {
      statut: 'en_cours',
      mentor_id: 'mentor-1',
      commentaires_pre_soumission: [
        {
          id: 'pre1',
          mentorId: 'mentor-1',
          auteurId: '2',
          manuscritId: 'ms5',
          section: 'style',
          texte: 'Le développement des personnages est excellent, mais quelques transitions pourraient être plus fluides.',
          type: 'suggestion',
          statut: 'envoye',
          dateCreation: '2024-01-23T11:20:00Z',
          metadata: {
            niveau_importance: 'important'
          }
        }
      ],
      checklist: [
        { id: 'c4', label: 'Développement des personnages', verifie: true, obligatoire: true, ordre: 1 },
        { id: 'c5', label: 'Fluidité narrative', verifie: false, obligatoire: true, ordre: 2 },
        { id: 'c6', label: 'Authenticité culturelle', verifie: true, obligatoire: false, ordre: 3 }
      ],
      pret_soumission: false
    },
    'ms6': {
      statut: 'en_attente',
      mentor_id: 'mentor-1',
      commentaires_pre_soumission: [],
      checklist: [
        { id: 'c7', label: 'Arguments bien structurés', verifie: false, obligatoire: true, ordre: 1 },
        { id: 'c8', label: 'Sources et références', verifie: false, obligatoire: true, ordre: 2 },
        { id: 'c9', label: 'Conclusion pertinente', verifie: false, obligatoire: false, ordre: 3 }
      ],
      pret_soumission: false
    }
  };
  return validations[manuscritId];
}

// Helper function pour créer les données des auteurs avec leurs manuscrits
function createAuteurData(): AuteurAAcompagnerItem[] {
  const auteursBase = [
    {
      id: '1',
      nom: 'Diallo',
      prenom: 'Amadou',
      email: 'amadou.diallo@email.com',
      avatar: 'AD',
      dateInscription: '2024-01-10T08:30:00Z',
      statut: 'actif' as const,
      dernierContact: '2024-01-25T14:20:00Z',
      mentorId: 'mentor-1',
      specialites: ['Littérature africaine', 'Poésie']
    },
    {
      id: '2',
      nom: 'Traoré',
      prenom: 'Fatoumata',
      email: 'fatoumata.traore@email.com',
      avatar: 'FT',
      dateInscription: '2024-01-08T12:45:00Z',
      statut: 'actif' as const,
      dernierContact: '2024-01-24T09:30:00Z',
      mentorId: 'mentor-1',
      specialites: ['Roman', 'Fiction contemporaine']
    },
    {
      id: '3',
      nom: 'Sow',
      prenom: 'Ibrahim',
      email: 'ibrahim.sow@email.com',
      avatar: 'IS',
      dateInscription: '2024-01-12T16:20:00Z',
      statut: 'actif' as const,
      dernierContact: '2024-01-23T11:15:00Z',
      mentorId: 'mentor-1',
      specialites: ['Essai', 'Philosophie']
    }
  ];

  return auteursBase.map(auteur => {
    const manuscritsAuteur = getManuscritsByAuteur(auteur.id);
    const manuscritsFormatted: ManuscritAuteur[] = manuscritsAuteur.map(ms => ({
      ...ms,
      dernierCommentaire: getLastComment(ms.id),
      validation_mentor: getValidationMentor(ms.id)
    }));

    return {
      ...auteur,
      nombreManuscrits: manuscritsAuteur.length,
      manuscrits: manuscritsFormatted,
      echanges: getEchangesByAuteur(auteur.id),
      notifications: getNotificationsByAuteur(auteur.id),
      statistiques: getStatistiquesByAuteur(auteur.id, manuscritsFormatted)
    };
  });
}

// Helper functions pour les échanges, notifications et statistiques
function getEchangesByAuteur(auteurId: string): EchangeAuteurEditeur[] {
  const echangesData: Record<string, EchangeAuteurEditeur[]> = {
    '1': [
      {
        id: 'ex1',
        manuscritId: 'ms1',
        editeurNom: 'Dr. Aminata Sow',
        editeurId: 'edit-1',
        type: 'commentaire',
        contenu: 'Le manuscrit "Les voix du Sahel" montre une belle maîtrise des techniques narratives. Quelques ajustements mineurs sont nécessaires avant publication.',
        statut: 'nouveau',
        priorite: 'medium',
        dateCreation: '2024-01-25T09:30:00Z',
        metadata: {
          manuscritTitre: 'Les voix du Sahel'
        }
      },
      {
        id: 'ex2',
        manuscritId: 'ms3',
        editeurNom: 'Prof. Ousmane Dia',
        editeurId: 'edit-2',
        type: 'decision',
        contenu: 'Félicitations ! "Mémoires d\'un village" est accepté pour publication. Le comité éditorial a été impressionné par la richesse historique du récit.',
        statut: 'lu',
        priorite: 'high',
        dateCreation: '2024-01-20T14:15:00Z',
        metadata: {
          decision: 'accepte',
          manuscritTitre: 'Mémoires d\'un village'
        }
      }
    ],
    '2': [
      {
        id: 'ex3',
        manuscritId: 'ms4',
        editeurNom: 'Dr. Khadija Toure',
        editeurId: 'edit-3',
        type: 'demande_revision',
        contenu: 'Le manuscrit "Entre deux mondes" est prometteur. Veuillez réviser les chapitres 3 et 7 pour renforcer la cohérence narrative.',
        statut: 'traite',
        priorite: 'medium',
        dateCreation: '2024-01-22T16:45:00Z',
        metadata: {
          decision: 'revision_demandee',
          manuscritTitre: 'Entre deux mondes',
          delaiReponse: '2024-02-05'
        }
      }
    ],
    '3': []
  };
  return echangesData[auteurId] || [];
}

function getNotificationsByAuteur(auteurId: string): NotificationMentor[] {
  const notificationsData: Record<string, NotificationMentor[]> = {
    '1': [
      {
        id: 'notif1',
        type: 'decision_editeur',
        titre: 'Décision positive pour Amadou Diallo',
        message: 'Le manuscrit "Mémoires d\'un village" a été accepté pour publication',
        priorite: 'high',
        auteurId: '1',
        manuscritId: 'ms3',
        lu: false,
        dateCreation: '2024-01-20T14:20:00Z',
        actionUrl: '/dashboard/mentor/auteur-a-acompagner/1/echanges'
      },
      {
        id: 'notif2',
        type: 'echange_nouveau',
        titre: 'Nouveau commentaire éditeur',
        message: 'Dr. Aminata Sow a laissé des commentaires sur "Les voix du Sahel"',
        priorite: 'medium',
        auteurId: '1',
        manuscritId: 'ms1',
        lu: false,
        dateCreation: '2024-01-25T09:35:00Z',
        actionUrl: '/dashboard/mentor/auteur-a-acompagner/1/echanges'
      }
    ],
    '2': [
      {
        id: 'notif3',
        type: 'delai_depasse',
        titre: 'Délai de révision approche',
        message: 'Fatoumata Traoré a 3 jours pour finaliser les révisions de "Entre deux mondes"',
        priorite: 'medium',
        auteurId: '2',
        manuscritId: 'ms4',
        lu: true,
        dateCreation: '2024-01-24T08:00:00Z',
        actionUrl: '/dashboard/mentor/auteur-a-acompagner/2'
      }
    ],
    '3': [
      {
        id: 'notif4',
        type: 'manuscrit_soumis',
        titre: 'Nouveau manuscrit à examiner',
        message: 'Ibrahim Sow a soumis "Réflexions sur l\'éducation moderne" pour pré-révision',
        priorite: 'low',
        auteurId: '3',
        manuscritId: 'ms6',
        lu: false,
        dateCreation: '2024-01-24T14:35:00Z',
        actionUrl: '/dashboard/mentor/auteur-a-acompagner/3/pre-revision'
      }
    ]
  };
  return notificationsData[auteurId] || [];
}

function getStatistiquesByAuteur(auteurId: string, manuscrits: ManuscritAuteur[]) {
  const echanges = getEchangesByAuteur(auteurId);
  const notifications = getNotificationsByAuteur(auteurId);
  
  return {
    totalEchanges: echanges.length,
    echangesNonLus: echanges.filter(e => e.statut === 'nouveau').length,
    manuscritsEnAttente: manuscrits.filter(m => m.statut === 'en_attente').length,
    dernierEchange: echanges.length > 0 ? echanges[0].dateCreation : undefined
  };
}

// Mock data using centralized data
const MOCK_DATA: AuteurAAcompagnerItem[] = createAuteurData();

/**
 * Custom hook to fetch auteur-a-acompagner list
 */
export function useFetchAuteurAAcompagner() {
  const [data, setData] = useState<AuteurAAcompagnerItem[] | null>(null);
  const [loading, setLoading] = useState(false);
  // const { showError } = useAlertStore();

  const fetch = async () => {
    setLoading(true);
    try {
      // TODO: Replace mock data with real API call
      // Uncomment the lines below and remove the mock data when ready

      // const response = await apiClient.get('/api/v1/auteur-a-acompagner');
      // setData(response.data);
      // return response.data;

      // Mock implementation - Remove this
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate network delay
      setData(MOCK_DATA);
      return MOCK_DATA;

    } catch (error: any) {
      // Uncomment when using real API
      // showError(
      //   'Erreur de chargement',
      //   error.response?.data?.message || 'Impossible de charger les auteur-a-acompagner'
      // );
      console.error('Error fetching auteur-a-acompagner:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    loading,
    fetch,
    refresh: fetch,
  };
}

/**
 * Custom hook to fetch a single auteur-a-acompagner by ID
 */
export function useFetchAuteurAAcompagnerById() {
  const [data, setData] = useState<AuteurAAcompagnerItem | null>(null);
  const [loading, setLoading] = useState(false);
  // const { showError } = useAlertStore();

  const fetch = async (id: string) => {
    setLoading(true);
    try {
      // TODO: Replace mock data with real API call
      // Uncomment the lines below and remove the mock data when ready

      // const response = await apiClient.get(`/api/v1/auteur-a-acompagner/${id}`);
      // setData(response.data);
      // return response.data;

      // Mock implementation - Remove this
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate network delay
      const mockItem = MOCK_DATA.find((item) => item.id === id) || MOCK_DATA[0];
      setData(mockItem);
      return mockItem;

    } catch (error: any) {
      // Uncomment when using real API
      // showError(
      //   'Erreur de chargement',
      //   error.response?.data?.message || 'Impossible de charger cet élément'
      // );
      console.error('Error fetching auteur-a-acompagner by ID:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    loading,
    fetch,
  };
}
