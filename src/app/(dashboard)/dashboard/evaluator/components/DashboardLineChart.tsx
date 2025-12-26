'use client';

import { Paper, Typography, Box, Stack } from '@mui/material';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { TimeSeriesResponse } from '../types/dashboard.types';

interface DashboardLineChartProps {
  data: TimeSeriesResponse;
  color?: string;
}

export default function DashboardLineChart({ data, color = '#3B82F6' }: DashboardLineChartProps) {
  const chartData = data.data.map((item) => ({
    period: item.period,
    value: item.count,
  }));

  const total = chartData.reduce((acc, item) => acc + item.value, 0);

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
        <Typography variant="subtitle2" fontWeight={600}>
          {data.title}
        </Typography>
        <Typography variant="h6" fontWeight="bold">
          {total}
        </Typography>
      </Stack>

      <Box sx={{ width: '100%', height: 150 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id={`gradient-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={0.3} />
                <stop offset="100%" stopColor={color} stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="period"
              tick={{ fontSize: 10 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis hide />
            <Tooltip
              contentStyle={{
                borderRadius: 8,
                border: '1px solid #e5e7eb',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={2}
              fill={`url(#gradient-${color.replace('#', '')})`}
              name="Évaluations"
            />
          </AreaChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
}
