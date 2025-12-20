'use client';

import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  Stack,
  Typography,
} from '@mui/material';
import ArticleIcon from '@mui/icons-material/Article';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { getStatusColor, getStatusLabel } from '../helpers/formatters';

interface ManuscritCardProps {
  manuscrit: {
    id: string;
    title: string;
    abstract?: string;
    status: string;
    authorName: string;
    categoryName?: string;
    submittedAt?: string;
    version: number;
    reviewAssignments?: any[];
    mentorships?: any[];
  };
  onAssignReviewer?: (manuscrit: any) => void;
  onAssignMentor?: (manuscrit: any) => void;
}

export function ManuscritCard({
  manuscrit,
  onAssignReviewer,
  onAssignMentor,
}: ManuscritCardProps) {
  const reviewCount = manuscrit.reviewAssignments?.length || 0;
  const completedReviews =
    manuscrit.reviewAssignments?.filter((r) => r.status === 'COMPLETED').length || 0;
  const mentorCount = manuscrit.mentorships?.length || 0;

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4,
        },
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Stack spacing={2}>
          <Stack direction="row" spacing={1} alignItems="center">
            <ArticleIcon color="primary" />
            <Chip
              label={getStatusLabel(manuscrit.status)}
              color={getStatusColor(manuscrit.status)}
              size="small"
            />
          </Stack>

          <Typography variant="h6" component="h3">
            {manuscrit.title}
          </Typography>

          <Stack spacing={0.5}>
            <Typography variant="body2" color="text.secondary">
              <strong>Auteur:</strong> {manuscrit.authorName}
            </Typography>

            {manuscrit.submittedAt && (
              <Typography variant="body2" color="text.secondary">
                <strong>Soumis le:</strong>{' '}
                {new Date(manuscrit.submittedAt).toLocaleDateString('fr-FR')}
              </Typography>
            )}

            <Stack direction="row" spacing={2} mt={1}>
              <Chip
                label={`${reviewCount} évaluateur${reviewCount > 1 ? 's' : ''}`}
                size="small"
                color={reviewCount > 0 ? 'info' : 'default'}
                variant="outlined"
              />
              <Chip
                label={`${mentorCount} mentor${mentorCount > 1 ? 's' : ''}`}
                size="small"
                color={mentorCount > 0 ? 'success' : 'default'}
                variant="outlined"
              />
            </Stack>
          </Stack>
        </Stack>
      </CardContent>

      <CardActions sx={{ p: 2, pt: 0 }}>
        <Stack direction="column" spacing={1} width="100%">
          <Stack direction="row" spacing={1}>
            {onAssignReviewer && (
              <Button
                size="small"
                startIcon={<PersonAddIcon />}
                onClick={() => onAssignReviewer(manuscrit)}
                fullWidth
                variant="outlined"
              >
                Évaluateur
              </Button>
            )}
            {onAssignMentor && (
              <Button
                size="small"
                startIcon={<SupervisorAccountIcon />}
                onClick={() => onAssignMentor(manuscrit)}
                fullWidth
                variant="outlined"
              >
                Mentor
              </Button>
            )}
          </Stack>
          <Button
            size="small"
            startIcon={<VisibilityIcon />}
            fullWidth
          >
            Voir les détails
          </Button>
        </Stack>
      </CardActions>
    </Card>
  );
}
