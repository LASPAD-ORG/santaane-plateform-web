'use client';

import { Paper, Typography, Box, Stack } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { BarChartResponse } from '../types/dashboard.types';

interface DashboardBarChartProps {
  data: BarChartResponse;
}

export default function DashboardBarChart({ data }: DashboardBarChartProps) {
  const chartData = data.data.map((item) => ({
    name: item.label,
    value: item.value,
    color: item.color || '#3B82F6',
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
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="subtitle1" fontWeight={600}>
          {data.title}
        </Typography>
        <Typography variant="h5" fontWeight="bold">
          {total}
        </Typography>
      </Stack>

      <Box sx={{ width: '100%', height: 200 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 40 }}>
            <XAxis
              dataKey="name"
              angle={-35}
              textAnchor="end"
              tick={{ fontSize: 11 }}
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
