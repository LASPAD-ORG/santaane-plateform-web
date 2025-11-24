'use client';

import { Paper, Typography, Box } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getAcceptanceRate } from '../hooks/useDashboardStats';

export default function AcceptanceRateChart() {
    const data = getAcceptanceRate();
    const chartData = [
        { name: 'Acceptés', value: data.accepted, fill: '#388e3c' },
        { name: 'Rejetés', value: data.rejected, fill: '#d32f2f' },
        { name: 'En cours', value: data.pending, fill: '#f57c00' },
    ];

    const total = data.accepted + data.rejected + data.pending;
    const acceptanceRate = total > 0 ? ((data.accepted / total) * 100).toFixed(1) : 0;

    return (
        <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
                Taux d'acceptation
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Statut global des soumissions
            </Typography>
            <Typography variant="h4" color="success.main" sx={{ mb: 2 }}>
                {acceptanceRate}%
            </Typography>
            <div style={{ width: '100%', height: 250 }}>
                <ResponsiveContainer width="100%" height="100%" minWidth={0} debounce={200}>
                    <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </Paper>
    );
}
