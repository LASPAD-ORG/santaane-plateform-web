'use client';

import { Box, Paper, Typography, Stack } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { BarChartResponse, CategoryDistributionResponse } from '../types/dashboard.types';

interface DashboardBarChartProps {
  data: BarChartResponse | CategoryDistributionResponse;
}

export default function DashboardBarChart({ data }: DashboardBarChartProps) {
  const chartData = 'data' in data && Array.isArray(data.data)
    ? data.data.map((item: any) => ({
        name: item.label,
        value: item.value || item.count || 0,
        color: item.color || '#3B82F6',
      }))
    : [];

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
      
      <Typography variant="h4" fontWeight="700" color="primary" sx={{ mb: 2 }}>
        {total}
      </Typography>

      <Box sx={{ width: '100%', height: 200 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 40 }}>
            <XAxis
              dataKey="name"
              angle={-45}
              textAnchor="end"
              height={60}
              interval={0}
              tick={{ fontSize: 11 }}
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
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
}
