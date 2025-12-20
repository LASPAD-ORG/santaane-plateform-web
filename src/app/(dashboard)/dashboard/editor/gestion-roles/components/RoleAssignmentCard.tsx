'use client';

import {
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  Stack,
  Typography,
} from '@mui/material';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import CancelIcon from '@mui/icons-material/Cancel';
import { getRoleColor, getRoleLabel } from '../helpers/formatters';

interface RoleAssignmentCardProps {
  assignment: {
    id: string;
    userId: string;
    userName: string;
    userEmail: string;
    role: string;
    laboratoryId: string;
    laboratoryName: string;
    isActive: boolean;
    assignedAt: string;
    assignedBy?: string;
  };
  onRefresh?: () => void;
}

export function RoleAssignmentCard({
  assignment,
  onRefresh,
}: RoleAssignmentCardProps) {
  const handleDeactivate = () => {
    // TODO: Implement deactivation
    console.log('Désactiver attribution:', assignment.id);
    if (onRefresh) onRefresh();
  };

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.2s',
        opacity: assignment.isActive ? 1 : 0.6,
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4,
        },
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Stack direction="row" spacing={1} alignItems="center" mb={2}>
          <AssignmentIndIcon color="primary" />
          <Chip
            label={getRoleLabel(assignment.role)}
            color={getRoleColor(assignment.role)}
            size="small"
          />
          {!assignment.isActive && (
            <Chip label="Inactif" color="default" size="small" />
          )}
        </Stack>

        <Typography variant="h6" component="h3" gutterBottom>
          {assignment.userName}
        </Typography>

        <Stack spacing={1}>
          <Typography variant="body2" color="text.secondary">
            Email: {assignment.userEmail}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Laboratoire: {assignment.laboratoryName}
          </Typography>

          <Typography variant="caption" color="text.secondary">
            Attribué le:{' '}
            {new Date(assignment.assignedAt).toLocaleDateString('fr-FR')}
          </Typography>

          {assignment.assignedBy && (
            <Typography variant="caption" color="text.secondary">
              Par: {assignment.assignedBy}
            </Typography>
          )}
        </Stack>
      </CardContent>

      {assignment.isActive && (
        <CardActions sx={{ p: 2, pt: 0 }}>
          <Button
            size="small"
            startIcon={<CancelIcon />}
            color="error"
            onClick={handleDeactivate}
            fullWidth
          >
            Désactiver
          </Button>
        </CardActions>
      )}
    </Card>
  );
}
