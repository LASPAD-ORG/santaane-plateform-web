'use client';

import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Avatar,
  Paper,
  Skeleton,
  Divider,
  Stack
} from '@mui/material';
import {
  Forum as ForumIcon,
  CheckCircle as CheckCircleIcon,
  Edit as EditIcon,
  Verified as VerifiedIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { 
  EchangeAuteurEditeur,
  type ManuscritAuteur 
} from '../fetchers/useFetchAuteurAAcompagner';
import {
  getPrioriteColor,
  getEchangeTypeColor,
  getEchangeTypeLabel,
  formatDernierContact,
  getAuteurInitials
} from '../helpers/formatters';

interface EchangeTimelineProps {
  echanges: EchangeAuteurEditeur[];
  manuscrits: ManuscritAuteur[];
  loading?: boolean;
}

export default function EchangeTimeline({ 
  echanges, 
  manuscrits,
  loading = false 
}: EchangeTimelineProps) {
  if (loading) {
    return (
      <Box>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
          Timeline des Échanges
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {[1, 2, 3].map((item) => (
            <Skeleton key={item} variant="rectangular" height={120} sx={{ borderRadius: 2 }} />
          ))}
        </Box>
      </Box>
    );
  }

  const getEchangeIcon = (type: string) => {
    switch (type) {
      case 'decision':
        return <CheckCircleIcon />;
      case 'demande_revision':
        return <EditIcon />;
      case 'validation':
        return <VerifiedIcon />;
      case 'commentaire':
      default:
        return <ForumIcon />;
    }
  };

  const getManuscritTitle = (manuscritId: string): string => {
    const manuscrit = manuscrits.find(m => m.id === manuscritId);
    return manuscrit?.titre || 'Manuscrit inconnu';
  };

  const sortedEchanges = [...echanges].sort(
    (a, b) => new Date(b.dateCreation).getTime() - new Date(a.dateCreation).getTime()
  );

  if (echanges.length === 0) {
    return (
      <Box>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
          Timeline des Échanges
        </Typography>
        <Paper 
          variant="outlined" 
          sx={{ 
            p: 4, 
            textAlign: 'center',
            bgcolor: 'grey.50',
            border: '1px dashed',
            borderColor: 'grey.300'
          }}
        >
          <ForumIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
          <Typography variant="body1" color="text.secondary" gutterBottom>
            Aucun échange
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Les échanges avec les éditeurs apparaîtront ici.
          </Typography>
        </Paper>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
        Timeline des Échanges ({echanges.length})
      </Typography>

      <Stack spacing={3}>
        {sortedEchanges.map((echange, index) => (
          <Box key={echange.id} sx={{ position: 'relative' }}>
            {/* Timeline connector line */}
            {index < sortedEchanges.length - 1 && (
              <Box
                sx={{
                  position: 'absolute',
                  left: 20,
                  top: 60,
                  width: 2,
                  height: 'calc(100% + 24px)',
                  bgcolor: 'grey.300',
                  zIndex: 0
                }}
              />
            )}
            
            {/* Timeline dot */}
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
              <Avatar 
                sx={{ 
                  width: 40, 
                  height: 40, 
                  bgcolor: `${getEchangeTypeColor(echange.type)}.main`,
                  position: 'relative',
                  zIndex: 1
                }}
              >
                {getEchangeIcon(echange.type)}
              </Avatar>
              
              <Card 
                variant="outlined"
                sx={{
                  flexGrow: 1,
                  border: echange.statut === 'nouveau' ? 2 : 1,
                  borderColor: echange.statut === 'nouveau' ? 'primary.main' : 'divider',
                  bgcolor: echange.statut === 'nouveau' ? 'primary.light' : 'background.paper',
                  transition: 'all 0.2s',
                  '&:hover': {
                    transform: 'translateX(4px)',
                    boxShadow: 2,
                  },
                }}
              >
                <CardContent sx={{ pb: 2 }}>
                  {/* Header */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar 
                        sx={{ 
                          width: 32, 
                          height: 32, 
                          bgcolor: 'secondary.main',
                          fontSize: '0.875rem'
                        }}
                      >
                        {getAuteurInitials(echange.editeurNom.split(' ')[0] || 'E', echange.editeurNom.split(' ')[1] || 'D')}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          {echange.editeurNom}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Éditeur • {formatDernierContact(echange.dateCreation)}
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                      <Chip
                        label={getEchangeTypeLabel(echange.type)}
                        color={getEchangeTypeColor(echange.type)}
                        size="small"
                        variant="outlined"
                      />
                      <Chip
                        label={echange.priorite}
                        color={getPrioriteColor(echange.priorite)}
                        size="small"
                      />
                    </Box>
                  </Box>

                  {/* Manuscrit info */}
                  <Box sx={{ 
                    bgcolor: 'grey.50', 
                    borderRadius: 1, 
                    p: 1.5, 
                    mb: 2,
                    borderLeft: 3,
                    borderLeftColor: 'secondary.main'
                  }}>
                    <Typography variant="caption" color="text.secondary" display="block">
                      Manuscrit concerné :
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {echange.metadata?.manuscritTitre || getManuscritTitle(echange.manuscritId)}
                    </Typography>
                  </Box>

                  {/* Contenu */}
                  <Typography variant="body2" sx={{ lineHeight: 1.6, mb: 2 }}>
                    {echange.contenu}
                  </Typography>

                  {/* Metadata additionnelle */}
                  {echange.metadata?.decision && (
                    <Box sx={{ 
                      bgcolor: echange.metadata.decision === 'accepte' ? 'success.light' : 
                                echange.metadata.decision === 'refuse' ? 'error.light' : 'warning.light',
                      borderRadius: 1,
                      p: 1.5,
                      mb: 1
                    }}>
                      <Typography variant="caption" color="text.secondary" display="block">
                        Décision :
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {echange.metadata.decision === 'accepte' ? '✅ Accepté' :
                         echange.metadata.decision === 'refuse' ? '❌ Refusé' : 
                         '📝 Révision demandée'}
                      </Typography>
                    </Box>
                  )}

                  {echange.metadata?.delaiReponse && (
                    <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
                      Délai de réponse : {new Date(echange.metadata.delaiReponse).toLocaleDateString('fr-FR')}
                    </Typography>
                  )}

                  {/* Statut */}
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                    <Chip
                      label={
                        echange.statut === 'nouveau' ? '🔴 Nouveau' :
                        echange.statut === 'lu' ? '👀 Lu' : 
                        '✅ Traité'
                      }
                      size="small"
                      color={
                        echange.statut === 'nouveau' ? 'error' :
                        echange.statut === 'lu' ? 'info' : 
                        'success'
                      }
                      variant="outlined"
                    />
                  </Box>
                </CardContent>
              </Card>
            </Box>
          </Box>
        ))}
      </Stack>
    </Box>
  );
}