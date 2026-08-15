'use client';

import { useState, useMemo } from 'react';
import { Box, Tabs, Tab, Paper } from '@mui/material';
import {
  Article as AuthorIcon,
  RateReview as EvaluatorIcon,
  EditNote as EditorIcon,
} from '@mui/icons-material';
import { useAuthStore } from '@/stores/authStore';
import { UserRole } from '@/types/auth';
import PageHeader from '@/components/ui/PageHeader';
import AuthorDashboardContent from './author/components/AuthorDashboardContent';
import EvaluatorDashboardContent from './evaluator/components/EvaluatorDashboardContent';
import EditorDashboardContent from './editor/components/EditorDashboardContent';

interface ProfileTab {
  role: UserRole;
  label: string;
  icon: React.ReactElement;
  content: React.ReactNode;
}

export default function UnifiedDashboardPage() {
  const { user } = useAuthStore();

  // Construire les onglets selon les roles de l'utilisateur (ordre : editeur, evaluateur, auteur)
  const tabs = useMemo<ProfileTab[]>(() => {
    if (!user) return [];
    const roles = user.roles || [];
    const list: ProfileTab[] = [];

    if (roles.includes(UserRole.EDITOR)) {
      list.push({
        role: UserRole.EDITOR,
        label: 'Éditeur',
        icon: <EditorIcon fontSize="small" />,
        content: <EditorDashboardContent />,
      });
    }
    if (roles.includes(UserRole.EVALUATOR)) {
      list.push({
        role: UserRole.EVALUATOR,
        label: 'Évaluateur',
        icon: <EvaluatorIcon fontSize="small" />,
        content: <EvaluatorDashboardContent />,
      });
    }
    if (roles.includes(UserRole.AUTHOR)) {
      list.push({
        role: UserRole.AUTHOR,
        label: 'Auteur',
        icon: <AuthorIcon fontSize="small" />,
        content: <AuthorDashboardContent />,
      });
    }
    return list;
  }, [user]);

  const [activeTab, setActiveTab] = useState(0);

  if (!user) return null;

  // Aucun des 3 roles cibles : message simple
  if (tabs.length === 0) {
    return (
      <Box>
        <PageHeader title={`Bienvenue, ${user.fullName}`} subtitle="Tableau de bord" />
        <Paper elevation={0} sx={{ p: 4, textAlign: 'center', border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
          Aucun tableau de bord disponible pour vos rôles.
        </Paper>
      </Box>
    );
  }

  const current = Math.min(activeTab, tabs.length - 1);

  return (
    <Box>
      <PageHeader title={`Bienvenue, ${user.fullName}`} subtitle="Tableau de bord" />

      {tabs.length > 1 && (
        <Paper elevation={0} sx={{ mb: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
          <Tabs
            value={current}
            onChange={(_, v) => setActiveTab(v)}
            variant="scrollable"
            scrollButtons="auto"
          >
            {tabs.map((t) => (
              <Tab key={t.role} icon={t.icon} iconPosition="start" label={t.label} sx={{ minHeight: 56 }} />
            ))}
          </Tabs>
        </Paper>
      )}

      <Box>{tabs[current].content}</Box>
    </Box>
  );
}