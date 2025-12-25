'use client';

import { Card, CardContent, Typography, Box } from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { TimeSeriesResponse } from '../types/dashboard.types';

interface DashboardLineChartProps {
  data: TimeSeriesResponse;
  color?: string;
}

export default function DashboardLineChart({ data, color = '#3B82F6' }: DashboardLineChartProps) {
  // Transform data to Recharts format
  const chartData = data.data.map((item) => ({
    period: item.period,
    value: item.value,
  }));

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Typography variant="h6" component="h3" gutterBottom>
          {data.title}
        </Typography>

        <Box sx={{ width: '100%', height: 300, mt: 2 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="period"
                angle={-45}
                textAnchor="end"
                height={80}
                tick={{ fontSize: 12 }}
              />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="value"
                stroke={color}
                strokeWidth={2}
                dot={{ fill: color, r: 4 }}
                activeDot={{ r: 6 }}
                name="Valeur"
              />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
}
