'use client';

import { Card, CardContent, CardActions, Typography, Box, Button, Chip } from '@mui/material';
import {
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Settings,
} from '@mui/icons-material';
import type { User } from '../fetchers/useFetchGestionUtilisateurs';
import {
  formatGestionUtilisateursDate,
  getStatusLabel,
  getStatusColor,
} from '../helpers/formatters';

interface GestionUtilisateursCardProps {
  item: User;
  onView?: (item: User) => void;
  onEdit?: (item: User) => void;
  onDelete?: (item: User) => void;
}

export default function GestionUtilisateursCard({
  item,
  onView,
  onEdit,
  onDelete,
}: GestionUtilisateursCardProps) {
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
          <Settings sx={{ fontSize: 32, color: 'primary.main' }} />
          <Chip
            label={getStatusLabel(item.isActive)}
            color={getStatusColor(item.isActive) as any}
            size="small"
          />
        </Box>

        {/* User Name */}
        <Typography variant="h6" component="h3" gutterBottom>
          {item.prenom} {item.nom}
        </Typography>

        {/* User Info */}
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {item.email}
        </Typography>
        {(item.laboratoire || item.specialite) && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {[item.laboratoire, item.specialite].filter(Boolean).join(' • ')}
          </Typography>
        )}

        {/* Metadata */}
        <Box sx={{ mt: 'auto' }}>
          <Typography variant="caption" color="text.secondary" display="block">
            Créé le {formatGestionUtilisateursDate(item.dateCreation)}
          </Typography>
          {item.derniereConnexion && (
            <Typography variant="caption" color="text.secondary" display="block">
              Dernière connexion le {formatGestionUtilisateursDate(item.derniereConnexion)}
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
