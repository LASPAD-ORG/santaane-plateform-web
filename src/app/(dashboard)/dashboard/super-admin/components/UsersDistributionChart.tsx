'use client';

import { Paper, Typography, Box } from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { userDistribution } from '../hooks/useDashboardStats';

export default function UsersDistributionChart() {
    // Transform data to match recharts expected format
    const chartData = userDistribution.map((item) => ({
        name: item.role,
        value: item.count,
        color: item.color,
    }));

    return (
        <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
                Répartition des utilisateurs
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Par rôle
            </Typography>
            <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer width="100%" height="100%" minWidth={0} debounce={200}>
                    <PieChart>
                        <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={(entry: any) => `${entry.name}: ${entry.value}`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                        >
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </Paper>
    );
}
