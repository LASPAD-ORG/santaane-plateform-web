'use client';

import { Card, CardContent, CardActions, Typography, Box, Button } from '@mui/material';
import {
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Category,
} from '@mui/icons-material';
import type { GestionRubriquesItem } from '../fetchers/useFetchGestionRubriques';

interface GestionRubriquesCardProps {
  item: GestionRubriquesItem;
  onView?: (item: GestionRubriquesItem) => void;
  onEdit?: (item: GestionRubriquesItem) => void;
  onDelete?: (item: GestionRubriquesItem) => void;
}

export default function GestionRubriquesCard({
  item,
  onView,
  onEdit,
  onDelete,
}: GestionRubriquesCardProps) {
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
          <Category sx={{ fontSize: 32, color: 'primary.main' }} />
        </Box>

        {/* Name */}
        <Typography variant="h6" component="h3" gutterBottom>
          {item.name}
        </Typography>

        {/* Signes range */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Signes: {item.signe_min} - {item.signe_max}
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
