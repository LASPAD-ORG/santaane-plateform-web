'use client';

import { Box, Paper, Typography } from '@mui/material';
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

  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        height: '100%',
      }}
    >
      <Typography variant="subtitle1" fontWeight="600" gutterBottom>
        {data.title}
      </Typography>
      
      <Typography variant="h4" fontWeight="700" sx={{ mb: 2, color }}>
        {total}
      </Typography>

      <Box sx={{ width: '100%', height: 150 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
            <defs>
              <linearGradient id={`gradient-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={color} stopOpacity={0}/>
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
                border: 'none',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={2}
              fill={`url(#gradient-${color.replace('#', '')})`}
            />
          </AreaChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
}
