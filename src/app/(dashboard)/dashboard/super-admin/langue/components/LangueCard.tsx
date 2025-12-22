'use client';

import { Card, CardContent, CardActions, Typography, Box, Button } from '@mui/material';
import {
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Language,
} from '@mui/icons-material';
import type { LangueItem } from '../fetchers/useFetchLangue';

interface LangueCardProps {
  item: LangueItem;
  onView?: (item: LangueItem) => void;
  onEdit?: (item: LangueItem) => void;
  onDelete?: (item: LangueItem) => void;
}

export default function LangueCard({
  item,
  onView,
  onEdit,
  onDelete,
}: LangueCardProps) {
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
        {/* Header with icon */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Language sx={{ fontSize: 32, color: 'primary.main' }} />
        </Box>

        {/* Name */}
        <Typography variant="h6" component="h3" gutterBottom>
          {item.name}
        </Typography>

        {/* Code */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ fontFamily: 'monospace' }}>
            Code: {item.code.toUpperCase()}
          </Typography>
        </Box>

        {/* Metadata */}
        <Box sx={{ mt: 'auto' }}>
          <Typography variant="caption" color="text.secondary" display="block">
            Créé le {new Date(item.created_at).toLocaleDateString('fr-FR', {
              day: 'numeric',
              month: 'short',
              year: 'numeric'
            })}
          </Typography>
          {item.updated_at !== item.created_at && (
            <Typography variant="caption" color="text.secondary" display="block">
              Modifié le {new Date(item.updated_at).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
              })}
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
