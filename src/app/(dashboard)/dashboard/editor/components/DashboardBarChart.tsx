'use client';

import { Card, CardContent, Typography, Box } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { BarChartResponse, CategoryDistributionResponse } from '../types/dashboard.types';

interface DashboardBarChartProps {
  data: BarChartResponse | CategoryDistributionResponse;
}

export default function DashboardBarChart({ data }: DashboardBarChartProps) {
  // Transform data to Recharts format
  const chartData = 'data' in data && Array.isArray(data.data)
    ? data.data.map((item: any) => ({
        name: item.label,
        value: item.value || item.count || 0,
        color: item.color || '#3B82F6',
      }))
    : [];

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Typography variant="h6" component="h3" gutterBottom>
          {data.title}
        </Typography>

        <Box sx={{ width: '100%', height: 300, mt: 2 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                angle={-45}
                textAnchor="end"
                height={100}
                interval={0}
                tick={{ fontSize: 12 }}
              />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
}
