'use client';

import { Card, CardContent, CardActions, Typography, Box, Button, Chip } from '@mui/material';
import {
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Mail,
} from '@mui/icons-material';
import type { GestionMentorItem } from '../fetchers/useFetchGestionMentor';
import {
  formatGestionMentorDate,
  getStatusLabel,
  getStatusColor,
  truncateContent,
} from '../helpers/formatters';

interface GestionMentorCardProps {
  item: GestionMentorItem;
  onView?: (item: GestionMentorItem) => void;
  onEdit?: (item: GestionMentorItem) => void;
  onDelete?: (item: GestionMentorItem) => void;
}

export default function GestionMentorCard({
  item,
  onView,
  onEdit,
  onDelete,
}: GestionMentorCardProps) {
  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4,
        },
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        {/* Header with icon and status */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Mail sx={{ fontSize: 32, color: 'primary.main' }} />
          <Chip
            label={getStatusLabel(item.status)}
            color={getStatusColor(item.status)}
            size="small"
          />
        </Box>

        {/* Title */}
        <Typography variant="h6" component="h3" gutterBottom>
          {item.title}
        </Typography>

        {/* Description */}
        {item.description && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {truncateContent(item.description, 150)}
          </Typography>
        )}

        {/* Metadata */}
        <Box sx={{ mt: 'auto' }}>
          <Typography variant="caption" color="text.secondary" display="block">
            Créé le {formatGestionMentorDate(item.createdAt)}
          </Typography>
          {item.updatedAt !== item.createdAt && (
            <Typography variant="caption" color="text.secondary" display="block">
              Modifié le {formatGestionMentorDate(item.updatedAt)}
            </Typography>
          )}
        </Box>
      </CardContent>

      {/* Actions */}
      <CardActions sx={{ justifyContent: 'flex-end', px: 2, pb: 2 }}>
        {onView && (
          <Button
            size="small"
            startIcon={<VisibilityIcon />}
            onClick={() => onView(item)}
          >
            Voir
          </Button>
        )}
        {onEdit && (
          <Button
            size="small"
            startIcon={<EditIcon />}
            onClick={() => onEdit(item)}
          >
            Modifier
          </Button>
        )}
        {onDelete && (
          <Button
            size="small"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={() => onDelete(item)}
          >
            Supprimer
          </Button>
        )}
      </CardActions>
    </Card>
  );
}
