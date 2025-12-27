'use client';

import { useState } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  ButtonGroup, 
  Button,
  Box
} from '@mui/material';
import { 
  CalendarViewWeek as WeekIcon,
  CalendarViewMonth as MonthIcon,
  CalendarToday as YearIcon
} from '@mui/icons-material';
import DashboardLineChart from './DashboardLineChart';
import EmptyState from './EmptyState';

type PeriodType = 'weekly' | 'monthly' | 'yearly';

interface UnifiedChartProps {
  weeklyData?: {
    period_type: 'week' | 'month' | 'year';
    title: string;
    data: Array<{
      period: string;
      count: number;
    }>;
  };
  monthlyData?: {
    period_type: 'week' | 'month' | 'year';
    title: string;
    data: Array<{
      period: string;
      count: number;
    }>;
  };
  yearlyData?: {
    period_type: 'week' | 'month' | 'year';
    title: string;
    data: Array<{
      period: string;
      count: number;
    }>;
  };
}

const PERIOD_CONFIG = {
  weekly: {
    label: 'Semaine',
    icon: <WeekIcon />,
    color: '#3B82F6',
    emptyMessage: 'Aucune soumission cette semaine'
  },
  monthly: {
    label: 'Mois',
    icon: <MonthIcon />,
    color: '#8B5CF6', 
    emptyMessage: 'Aucune soumission ce mois-ci'
  },
  yearly: {
    label: 'Année',
    icon: <YearIcon />,
    color: '#06B6D4',
    emptyMessage: 'Aucune soumission cette année'
  }
};

export default function UnifiedSubmissionChart({ 
  weeklyData, 
  monthlyData, 
  yearlyData 
}: UnifiedChartProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>('weekly');

  const getCurrentData = () => {
    switch (selectedPeriod) {
      case 'weekly':
        return weeklyData;
      case 'monthly':
        return monthlyData;
      case 'yearly':
        return yearlyData;
      default:
        return undefined;
    }
  };

  const currentData = getCurrentData();
  const config = PERIOD_CONFIG[selectedPeriod];
  const hasData = currentData?.data && currentData.data.length > 0;

  return (
    <Card>
      <CardContent>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
            Évolution des Soumissions
          </Typography>
          
          <ButtonGroup 
            variant="outlined" 
            size="small"
            sx={{ 
              '& .MuiButton-root': {
                borderColor: 'divider',
                color: 'text.secondary',
                '&.Mui-disabled': {
                  borderColor: config.color,
                  color: config.color,
                  bgcolor: `${config.color}10`
                }
              }
            }}
          >
            {Object.entries(PERIOD_CONFIG).map(([key, periodConfig]) => (
              <Button
                key={key}
                startIcon={periodConfig.icon}
                disabled={selectedPeriod === key}
                onClick={() => setSelectedPeriod(key as PeriodType)}
                sx={{
                  minWidth: 100,
                  fontWeight: selectedPeriod === key ? 600 : 400
                }}
              >
                {periodConfig.label}
              </Button>
            ))}
          </ButtonGroup>
        </Box>

        <Box sx={{ height: 300 }}>
          {hasData ? (
            <DashboardLineChart 
              data={currentData} 
              color={config.color}
            />
          ) : (
            <EmptyState
              title={`Aucune donnée ${selectedPeriod === 'weekly' ? 'hebdomadaire' : selectedPeriod === 'monthly' ? 'mensuelle' : 'annuelle'}`}
              description={config.emptyMessage}
              variant="compact"
            />
          )}
        </Box>

        {hasData && (
          <Box sx={{ mt: 2, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              <strong>{currentData?.title}</strong>
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Période sélectionnée : {config.label.toLowerCase()}
              {currentData?.data && ` • ${currentData.data.length} point${currentData.data.length > 1 ? 's' : ''} de données`}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}