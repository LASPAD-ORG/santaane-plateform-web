'use client';

import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  Stack,
  Typography,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import ArticleIcon from '@mui/icons-material/Article';
import RateReviewIcon from '@mui/icons-material/RateReview';
import { getRoleColor, getRoleLabel, getUserInitials } from '../helpers/formatters';

interface UtilisateurCardProps {
  utilisateur: {
    id: string;
    fullName: string;
    email: string;
    roles: string[];
    laboratoryName: string;
    countryName?: string;
    manuscriptCount: number;
    reviewCount: number;
    isActive: boolean;
    createdAt: string;
  };
}

export function UtilisateurCard({ utilisateur }: UtilisateurCardProps) {
  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.2s',
        opacity: utilisateur.isActive ? 1 : 0.6,
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4,
        },
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Stack direction="row" spacing={2} alignItems="flex-start" mb={2}>
          <Avatar
            sx={{
              bgcolor: 'primary.main',
              width: 56,
              height: 56,
            }}
          >
            {getUserInitials(utilisateur.fullName)}
          </Avatar>
          <Box flexGrow={1}>
            <Typography variant="h6" component="h3" gutterBottom>
              {utilisateur.fullName}
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" gap={0.5}>
              {utilisateur.roles.map((role) => (
                <Chip
                  key={role}
                  label={getRoleLabel(role)}
                  color={getRoleColor(role)}
                  size="small"
                />
              ))}
              {!utilisateur.isActive && (
                <Chip label="Inactif" color="default" size="small" />
              )}
            </Stack>
          </Box>
        </Stack>

        <Stack spacing={1.5}>
          <Stack direction="row" spacing={1} alignItems="center">
            <EmailIcon fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              {utilisateur.email}
            </Typography>
          </Stack>

          <Typography variant="body2" color="text.secondary">
            Laboratoire: {utilisateur.laboratoryName}
          </Typography>

          {utilisateur.countryName && (
            <Typography variant="body2" color="text.secondary">
              Pays: {utilisateur.countryName}
            </Typography>
          )}

          <Stack direction="row" spacing={3} mt={1}>
            <Stack direction="row" spacing={0.5} alignItems="center">
              <ArticleIcon fontSize="small" color="primary" />
              <Typography variant="body2" fontWeight="medium">
                {utilisateur.manuscriptCount} manuscrit{utilisateur.manuscriptCount > 1 ? 's' : ''}
              </Typography>
            </Stack>

            <Stack direction="row" spacing={0.5} alignItems="center">
              <RateReviewIcon fontSize="small" color="info" />
              <Typography variant="body2" fontWeight="medium">
                {utilisateur.reviewCount} évaluation{utilisateur.reviewCount > 1 ? 's' : ''}
              </Typography>
            </Stack>
          </Stack>

          <Typography variant="caption" color="text.secondary" mt={1}>
            Inscrit le:{' '}
            {new Date(utilisateur.createdAt).toLocaleDateString('fr-FR')}
          </Typography>
        </Stack>
      </CardContent>

      <CardActions sx={{ p: 2, pt: 0 }}>
        <Button size="small" fullWidth>
          Voir les manuscrits
        </Button>
      </CardActions>
    </Card>
  );
}
