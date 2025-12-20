import { useState } from 'react';

export interface StatisticsData {
  totalManuscripts: number;
  manuscriptsThisMonth: number;
  reviewsCompleted: number;
  activeResearchers: number;
  averageReviewTime: number;
  acceptanceRate: number;
  rejectionRate: number;
  manuscriptsByStatus: Array<{ status: string; label: string; count: number }>;
  topReviewers: Array<{ id: string; name: string; reviewCount: number }>;
}

const MOCK_STATISTICS: StatisticsData = {
  totalManuscripts: 45,
  manuscriptsThisMonth: 8,
  reviewsCompleted: 67,
  activeResearchers: 28,
  averageReviewTime: 21,
  acceptanceRate: 42,
  rejectionRate: 18,
  manuscriptsByStatus: [
    { status: 'SUBMITTED', label: 'Soumis', count: 5 },
    { status: 'UNDER_REVIEW', label: 'En révision', count: 12 },
    { status: 'REVISION_REQUESTED', label: 'Révision demandée', count: 8 },
    { status: 'ACCEPTED', label: 'Acceptés', count: 14 },
    { status: 'REJECTED', label: 'Rejetés', count: 6 },
  ],
  topReviewers: [
    { id: 'user-20', name: 'Prof. Jean Dupont', reviewCount: 12 },
    { id: 'user-21', name: 'Dr. Marie Leclerc', reviewCount: 8 },
    { id: 'user-25', name: 'Prof. Aminata Touré', reviewCount: 6 },
    { id: 'user-26', name: 'Dr. Sylvie Morel', reviewCount: 4 },
    { id: 'user-27', name: 'Dr. Elisabeth Fontaine', reviewCount: 2 },
  ],
};

export function useFetchStatistics() {
  const [data, setData] = useState<StatisticsData | null>(null);
  const [loading, setLoading] = useState(false);

  const fetch = async () => {
    setLoading(true);
    try {
      // TODO: Replace with real API call to /api/editor/statistics
      // const response = await apiClient.get('/editor/statistics');
      // setData(response.data);

      await new Promise((resolve) => setTimeout(resolve, 500));
      setData(MOCK_STATISTICS);
      return MOCK_STATISTICS;
    } catch (error) {
      console.error('Error fetching statistics:', error);
      setData(null);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, fetch };
}
