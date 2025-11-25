'use client';

import { Card, CardContent, CardActions, Typography, Box, Button, Chip, Skeleton } from '@mui/material';
import {
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Description as DescriptionIcon,
  Comment as CommentIcon,
} from '@mui/icons-material';
import type { GestionManuscritItem } from '../fetchers/useFetchGestionManuscrit';
import {
  formatGestionManuscritDate,
  getStatusLabel,
  getStatusColor,
  truncateContent,
} from '../helpers/formatters';

interface GestionManuscritCardProps {
  item: GestionManuscritItem;
  onView?: (item: GestionManuscritItem) => void;
  onEdit?: (item: GestionManuscritItem) => void;
  onDelete?: (item: GestionManuscritItem) => void;
  loading?: boolean;
}

export default function GestionManuscritCard({
  item,
  onView,
  onEdit,
  onDelete,
  loading = false,
}: GestionManuscritCardProps) {
  if (loading) {
    return (
      <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <CardContent sx={{ flexGrow: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Skeleton variant="circular" width={32} height={32} />
            <Skeleton variant="rectangular" width={80} height={24} sx={{ borderRadius: 1 }} />
          </Box>
          <Skeleton variant="text" sx={{ fontSize: '1.25rem', mb: 1 }} />
          <Skeleton variant="text" sx={{ mb: 2 }} />
          <Skeleton variant="text" sx={{ mb: 2 }} />
          <Skeleton variant="text" width="60%" />
        </CardContent>
        <CardActions sx={{ justifyContent: 'flex-end', px: 2, pb: 2 }}>
          <Skeleton variant="rectangular" width={80} height={36} sx={{ borderRadius: 1 }} />
        </CardActions>
      </Card>
    );
  }

  const totalComments = 
    item.commentairesMentor.forme.length +
    item.commentairesMentor.style.length +
    item.commentairesMentor.methodologie.length;
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
          <DescriptionIcon sx={{ fontSize: 32, color: 'secondary.main' }} />
          <Chip
            label={getStatusLabel(item.status)}
            color={getStatusColor(item.status)}
            size="small"
          />
        </Box>

        {/* Title */}
        <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 600 }}>
          {item.title}
        </Typography>

        {/* Description */}
        {item.description && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.5 }}>
            {truncateContent(item.description, 120)}
          </Typography>
        )}

        {/* Comments indicator */}
        {totalComments > 0 && (
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <CommentIcon sx={{ fontSize: 16, color: 'text.secondary', mr: 0.5 }} />
            <Typography variant="caption" color="text.secondary">
              {totalComments} commentaire{totalComments > 1 ? 's' : ''}
            </Typography>
          </Box>
        )}

        {/* Metadata */}
        <Box sx={{ mt: 'auto' }}>
          <Typography variant="caption" color="text.secondary" display="block">
            Créé le {formatGestionManuscritDate(item.createdAt)}
          </Typography>
          {item.updatedAt !== item.createdAt && (
            <Typography variant="caption" color="text.secondary" display="block">
              Modifié le {formatGestionManuscritDate(item.updatedAt)}
            </Typography>
          )}
        </Box>
      </CardContent>

      {/* Actions */}
      <CardActions sx={{ justifyContent: 'flex-end', px: 2, pb: 2 }}>
        {onView && (
          <Button
            variant="contained"
            size="small"
            startIcon={<VisibilityIcon />}
            onClick={() => onView(item)}
            color="primary"
            sx={{ 
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600
            }}
          >
            Voir
          </Button>
        )}
        {onEdit && (
          <Button
            size="small"
            startIcon={<EditIcon />}
            onClick={() => onEdit(item)}
            sx={{ 
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600
            }}
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
            sx={{ 
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600
            }}
          >
            Supprimer
          </Button>
        )}
      </CardActions>
    </Card>
  );
}
