'use client';

import { Paper, Typography, Box } from '@mui/material';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';
import { monthlySubmissions } from '../hooks/useDashboardStats';

export default function SubmissionsChart() {
    return (
        <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
                Évolution des soumissions
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Soumissions des 6 derniers mois
            </Typography>
            <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer width="100%" height="100%" minWidth={0} debounce={200}>
                    <LineChart data={monthlySubmissions}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line
                            type="monotone"
                            dataKey="submissions"
                            stroke="#1976d2"
                            strokeWidth={2}
                            name="Total"
                        />
                        <Line
                            type="monotone"
                            dataKey="accepted"
                            stroke="#388e3c"
                            strokeWidth={2}
                            name="Acceptés"
                        />
                        <Line
                            type="monotone"
                            dataKey="rejected"
                            stroke="#d32f2f"
                            strokeWidth={2}
                            name="Rejetés"
                        />
                        <Line
                            type="monotone"
                            dataKey="pending"
                            stroke="#f57c00"
                            strokeWidth={2}
                            name="En cours"
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </Paper>
    );
}
