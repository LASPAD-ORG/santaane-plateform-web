// Consolidated mock data for Super Admin Dashboard
// All data sources are now centralized here for consistency

export interface DashboardStats {
    totalUsers: number;
    activeUsers: number;
    totalLaboratoires: number;
    publishedManuscripts: number;
    monthlyGrowth: number;
}

export interface MonthlySubmission {
    month: string;
    submissions: number;
    accepted: number;
    rejected: number;
    pending: number;
}

export interface UserDistribution {
    role: string;
    count: number;
    color: string;
}

export interface Activity {
    id: string;
    type: 'submission' | 'user' | 'publication' | 'volume';
    title: string;
    description: string;
    timestamp: string;
    user?: {
        name: string;
        avatar?: string;
    };
}

// Dashboard Statistics - Consistent with user distribution
export const dashboardStats: DashboardStats = {
    totalUsers: 373, // Total matches sum of userDistribution
    activeUsers: 350,
    totalLaboratoires: 4,
    publishedManuscripts: 5432,
    monthlyGrowth: 0,
};

// Monthly submissions data for the last 6 months
export const monthlySubmissions: MonthlySubmission[] = [
    { month: 'Juin', submissions: 45, accepted: 28, rejected: 10, pending: 7 },
    { month: 'Juillet', submissions: 52, accepted: 31, rejected: 12, pending: 9 },
    { month: 'Août', submissions: 38, accepted: 22, rejected: 8, pending: 8 },
    { month: 'Septembre', submissions: 61, accepted: 35, rejected: 15, pending: 11 },
    { month: 'Octobre', submissions: 58, accepted: 33, rejected: 14, pending: 11 },
    { month: 'Novembre', submissions: 67, accepted: 38, rejected: 16, pending: 13 },
];

// User distribution by role - Total must equal dashboardStats.totalUsers (373)
export const userDistribution: UserDistribution[] = [
    { role: 'Auteurs', count: 245, color: '#f57c00' },
    { role: 'Mentors', count: 42, color: '#388e3c' },
    { role: 'Évaluateurs', count: 68, color: '#7b1fa2' },
    { role: 'Éditeurs', count: 15, color: '#1976d2' },
    { role: 'Super Admins', count: 3, color: '#d32f2f' },
];

// Recent activities - Using fixed timestamps to avoid hydration errors
const baseDate = new Date('2024-11-21T20:00:00Z');

export const recentActivities: Activity[] = [
    {
        id: '1',
        type: 'submission',
        title: 'Nouvelle soumission',
        description: 'Article "Intelligence Artificielle et Santé" soumis',
        timestamp: new Date(baseDate.getTime() - 1000 * 60 * 15).toISOString(), // 15 min ago
        user: {
            name: 'Dr. Amadou Diallo',
        },
    },
    {
        id: '2',
        type: 'publication',
        title: 'Article publié',
        description: 'Volume 2, Numéro 3 publié avec 8 articles',
        timestamp: new Date(baseDate.getTime() - 1000 * 60 * 60 * 2).toISOString(), // 2h ago
    },
    {
        id: '3',
        type: 'user',
        title: 'Nouvel utilisateur',
        description: 'Dr. Fatou Sow inscrit comme Évaluateur',
        timestamp: new Date(baseDate.getTime() - 1000 * 60 * 60 * 5).toISOString(), // 5h ago
        user: {
            name: 'Dr. Fatou Sow',
        },
    },
    {
        id: '4',
        type: 'submission',
        title: 'Article accepté',
        description: 'Article "Blockchain et Traçabilité" accepté pour publication',
        timestamp: new Date(baseDate.getTime() - 1000 * 60 * 60 * 8).toISOString(), // 8h ago
        user: {
            name: 'Dr. Moussa Kane',
        },
    },
    {
        id: '5',
        type: 'volume',
        title: 'Nouveau volume créé',
        description: 'Volume 3 (2025) créé',
        timestamp: new Date(baseDate.getTime() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    },
    {
        id: '6',
        type: 'user',
        title: 'Nouvel utilisateur',
        description: 'Dr. Aissatou Ndiaye inscrit comme Auteur',
        timestamp: new Date(baseDate.getTime() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
        user: {
            name: 'Dr. Aissatou Ndiaye',
        },
    },
    {
        id: '7',
        type: 'submission',
        title: 'Nouvelle soumission',
        description: 'Article "Machine Learning en Agriculture" soumis',
        timestamp: new Date(baseDate.getTime() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
        user: {
            name: 'Dr. Cheikh Sy',
        },
    },
    {
        id: '8',
        type: 'publication',
        title: 'Article publié',
        description: 'Volume 2, Numéro 2 publié avec 6 articles',
        timestamp: new Date(baseDate.getTime() - 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days ago
    },
];

// Helper to calculate global acceptance rate
export const getAcceptanceRate = (): { accepted: number; rejected: number; pending: number } => {
    const totals = monthlySubmissions.reduce(
        (acc, month) => ({
            accepted: acc.accepted + month.accepted,
            rejected: acc.rejected + month.rejected,
            pending: acc.pending + month.pending,
        }),
        { accepted: 0, rejected: 0, pending: 0 }
    );
    return totals;
};

export const useDashboardStats = () => {
    return dashboardStats;
};
