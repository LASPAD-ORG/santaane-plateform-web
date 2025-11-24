'use client';

import { Card, CardContent, CardActions, Typography, Box, Button, Chip, Avatar, Skeleton } from '@mui/material';
import {
  Visibility as VisibilityIcon,
  Person as PersonIcon,
  Description as DescriptionIcon,
  Comment as CommentIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
import type { AuteurAAcompagnerItem } from '../fetchers/useFetchAuteurAAcompagner';
import {
  formatAuteurAAcompagnerDate,
  getStatusLabel,
  getStatusColor,
  getAuteurFullName,
  getAuteurInitials,
  formatDernierContact,
} from '../helpers/formatters';

interface AuteurAAcompagnerCardProps {
  item: AuteurAAcompagnerItem;
  onView?: (item: AuteurAAcompagnerItem) => void;
  onEdit?: (item: AuteurAAcompagnerItem) => void;
  onDelete?: (item: AuteurAAcompagnerItem) => void;
  loading?: boolean;
}

export default function AuteurAAcompagnerCard({
  item,
  onView,
  onEdit,
  onDelete,
  loading = false,
}: AuteurAAcompagnerCardProps) {
  if (loading) {
    return (
      <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <CardContent sx={{ flexGrow: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 2 }}>
            <Skeleton variant="circular" width={48} height={48} />
            <Box sx={{ flexGrow: 1 }}>
              <Skeleton variant="text" sx={{ fontSize: '1.25rem', mb: 0.5 }} />
              <Skeleton variant="text" width="60%" />
            </Box>
            <Skeleton variant="rectangular" width={60} height={24} sx={{ borderRadius: 1 }} />
          </Box>
          <Skeleton variant="text" sx={{ mb: 1 }} />
          <Skeleton variant="text" sx={{ mb: 2 }} />
          <Skeleton variant="text" width="40%" />
        </CardContent>
        <CardActions sx={{ justifyContent: 'flex-end', px: 2, pb: 2 }}>
          <Skeleton variant="rectangular" width={70} height={32} sx={{ borderRadius: 1 }} />
        </CardActions>
      </Card>
    );
  }
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
        {/* Header with avatar and status */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 2 }}>
          <Avatar 
            sx={{ 
              width: 48, 
              height: 48, 
              bgcolor: 'secondary.main',
              fontSize: '1rem',
              fontWeight: 600
            }}
          >
            {item.avatar || getAuteurInitials(item.prenom, item.nom)}
          </Avatar>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" component="h3" sx={{ fontWeight: 600, mb: 0.5 }}>
              {getAuteurFullName(item.prenom, item.nom)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {item.email}
            </Typography>
          </Box>
          <Chip
            label={getStatusLabel(item.statut)}
            color={getStatusColor(item.statut)}
            size="small"
          />
        </Box>

        {/* Manuscripts info */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <DescriptionIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              {item.nombreManuscrits} manuscrit{item.nombreManuscrits > 1 ? 's' : ''}
            </Typography>
          </Box>
          {item.manuscrits.reduce((total, ms) => total + ms.nombreCommentaires, 0) > 0 && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <CommentIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary">
                {item.manuscrits.reduce((total, ms) => total + ms.nombreCommentaires, 0)} commentaires
              </Typography>
            </Box>
          )}
        </Box>

        {/* Specialities */}
        {item.specialites && item.specialites.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
              Spécialités :
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {item.specialites.slice(0, 2).map((specialite, index) => (
                <Chip
                  key={index}
                  label={specialite}
                  variant="outlined"
                  size="small"
                  color="secondary"
                  sx={{ fontSize: '0.75rem' }}
                />
              ))}
              {item.specialites.length > 2 && (
                <Typography variant="caption" color="text.secondary" sx={{ alignSelf: 'center', ml: 0.5 }}>
                  +{item.specialites.length - 2}
                </Typography>
              )}
            </Box>
          </Box>
        )}

        {/* Metadata */}
        <Box sx={{ mt: 'auto' }}>
          <Typography variant="caption" color="text.secondary" display="flex" alignItems="center" gap={0.5}>
            <ScheduleIcon sx={{ fontSize: 14 }} />
            Dernier contact : {formatDernierContact(item.dernierContact)}
          </Typography>
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
            color="secondary"
            sx={{ 
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600
            }}
          >
            Voir profil
          </Button>
        )}
      </CardActions>
    </Card>
  );
}
