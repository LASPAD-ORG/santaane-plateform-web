'use client';

import { useParams, useRouter } from 'next/navigation';
import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Button,
  Chip,
  Divider,
  IconButton,
  Tabs,
  Tab,
  Avatar,
} from '@mui/material';
import {
  ArrowBack,
  PictureAsPdf,
  CalendarToday,
  Category,
  Language,
  Label,
  Email,
  Business,
  Work,
  Info,
} from '@mui/icons-material';
import { useState } from 'react';
import { useManuscriptStaffDetails } from './hooks/useManuscriptStaffDetails';
import { MANUSCRIPT_STATUS_LABELS, MANUSCRIPT_STATUS_COLORS } from '@/types/manuscript';
import PdfViewer from '../../../author/manuscripts/[id]/components/PdfViewer';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function EditorManuscriptDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { loading, manuscript } = useManuscriptStaffDetails(id);
  const [currentTab, setCurrentTab] = useState(0);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateString;
    }
  };

  const handleDownloadPdf = () => {
    if (manuscript?.pdfFilename) {
      window.open(`/api/files/download/${manuscript.pdfFilename}`, '_blank');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!manuscript) {
    return (
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="60vh" gap={2}>
        <Typography variant="h6" color="text.secondary">
          Manuscrit introuvable
        </Typography>
        <Button variant="contained" onClick={() => router.back()}>
          Retour
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box display="flex" alignItems="center" gap={2} mb={3}>
        <IconButton onClick={() => router.back()}>
          <ArrowBack />
        </IconButton>
        <Box flex={1}>
          <Typography variant="h4" fontWeight="bold">
            Détails du Manuscrit
          </Typography>
        </Box>
        <Chip
          label={MANUSCRIPT_STATUS_LABELS[manuscript.status as keyof typeof MANUSCRIPT_STATUS_LABELS]}
          color={MANUSCRIPT_STATUS_COLORS[manuscript.status as keyof typeof MANUSCRIPT_STATUS_COLORS]}
          size="medium"
        />
      </Box>

      {/* Onglets */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={currentTab} onChange={(_, newValue) => setCurrentTab(newValue)}>
          <Tab label="Informations" />
          <Tab label="Auteur" />
          <Tab label="PDF" />
        </Tabs>
      </Box>

      {/* Contenu selon l'onglet */}
      {currentTab === 0 ? (
        // Onglet Informations
        <Card elevation={2}>
          <CardContent sx={{ p: 4 }}>
            {/* Titre */}
            <Typography variant="h5" fontWeight="600" mb={3}>
              {manuscript.title}
            </Typography>

            <Divider sx={{ my: 3 }} />

            {/* Résumé */}
            <Box mb={3}>
              <Typography variant="h6" fontWeight="600" mb={2}>
                Résumé
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ whiteSpace: 'pre-wrap' }}>
                {manuscript.abstract}
              </Typography>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Informations de classification */}
            <Box mb={3}>
              <Typography variant="h6" fontWeight="600" mb={2}>
                Classification
              </Typography>
              <Box display="flex" flexDirection="column" gap={2}>
                {manuscript.themeName && (
                  <Box display="flex" alignItems="center" gap={2}>
                    <Category sx={{ color: 'text.secondary' }} />
                    <Box>
                      <Typography variant="caption" color="text.secondary" display="block">
                        Thème
                      </Typography>
                      <Typography variant="body1">{manuscript.themeName}</Typography>
                    </Box>
                  </Box>
                )}

                <Box display="flex" alignItems="center" gap={2}>
                  <Category sx={{ color: 'text.secondary' }} />
                  <Box>
                    <Typography variant="caption" color="text.secondary" display="block">
                      Rubrique
                    </Typography>
                    <Typography variant="body1">{manuscript.sectionName}</Typography>
                  </Box>
                </Box>

                <Box display="flex" alignItems="center" gap={2}>
                  <Language sx={{ color: 'text.secondary' }} />
                  <Box>
                    <Typography variant="caption" color="text.secondary" display="block">
                      Langue
                    </Typography>
                    <Typography variant="body1">{manuscript.languageName}</Typography>
                  </Box>
                </Box>

                {manuscript.keywords && (
                  <Box display="flex" alignItems="flex-start" gap={2}>
                    <Label sx={{ color: 'text.secondary', mt: 0.5 }} />
                    <Box>
                      <Typography variant="caption" color="text.secondary" display="block" mb={1}>
                        Mots-clés
                      </Typography>
                      <Box display="flex" flexWrap="wrap" gap={1}>
                        {manuscript.keywords.split(',').map((keyword: string, index: number) => (
                          <Chip
                            key={index}
                            label={keyword.trim()}
                            size="small"
                            variant="outlined"
                          />
                        ))}
                      </Box>
                    </Box>
                  </Box>
                )}
              </Box>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Dates */}
            <Box>
              <Typography variant="h6" fontWeight="600" mb={2}>
                Dates
              </Typography>
              <Box display="flex" flexDirection="column" gap={1}>
                <Box display="flex" alignItems="center" gap={2}>
                  <CalendarToday sx={{ color: 'text.secondary', fontSize: 20 }} />
                  <Box>
                    <Typography variant="caption" color="text.secondary" display="block">
                      Date de soumission
                    </Typography>
                    <Typography variant="body2">{formatDate(manuscript.createdAt)}</Typography>
                  </Box>
                </Box>
                <Box display="flex" alignItems="center" gap={2}>
                  <CalendarToday sx={{ color: 'text.secondary', fontSize: 20 }} />
                  <Box>
                    <Typography variant="caption" color="text.secondary" display="block">
                      Dernière mise à jour
                    </Typography>
                    <Typography variant="body2">{formatDate(manuscript.updatedAt)}</Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </CardContent>
        </Card>
      ) : currentTab === 1 ? (
        // Onglet Auteur
        <Card elevation={2}>
          <CardContent sx={{ p: 4 }}>
            {/* En-tête avec avatar */}
            <Box display="flex" alignItems="center" gap={3} mb={4}>
              <Avatar sx={{ width: 100, height: 100, bgcolor: 'primary.main', fontSize: 40 }}>
                {manuscript.author.fullName.charAt(0).toUpperCase()}
              </Avatar>
              <Box>
                <Typography variant="h4" fontWeight="700">
                  {manuscript.author.fullName}
                </Typography>
                {manuscript.author.position && (
                  <Typography variant="subtitle1" color="text.secondary">
                    {manuscript.author.position}
                  </Typography>
                )}
                {manuscript.author.institution && (
                  <Chip 
                    icon={<Business sx={{ fontSize: 16 }} />}
                    label={manuscript.author.institution} 
                    size="small" 
                    sx={{ mt: 1 }}
                  />
                )}
              </Box>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Informations de contact */}
            <Typography variant="h6" fontWeight="600" mb={2}>
              Informations de contact
            </Typography>
            
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 3,
                mb: 3
              }}
            >
              {/* Email */}
              <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 12px)' }, display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box 
                  sx={{ 
                    p: 1, 
                    borderRadius: 1, 
                    bgcolor: 'primary.50',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Email sx={{ color: 'primary.main' }} />
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Email
                  </Typography>
                  <Typography variant="body1" fontWeight="500">
                    {manuscript.author.email}
                  </Typography>
                </Box>
              </Box>

              {/* ORCID */}
              {manuscript.author.orcidId && (
                <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 12px)' }, display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box 
                    sx={{ 
                      p: 1, 
                      borderRadius: 1, 
                      bgcolor: 'success.50',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Info sx={{ color: 'success.main' }} />
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary" display="block">
                      ORCID ID
                    </Typography>
                    <Typography variant="body1" fontWeight="500">
                      {manuscript.author.orcidId}
                    </Typography>
                  </Box>
                </Box>
              )}

              {/* Institution */}
              {manuscript.author.institution && (
                <Box display="flex" alignItems="center" gap={2}>
                  <Box 
                    sx={{ 
                      p: 1, 
                      borderRadius: 1, 
                      bgcolor: 'warning.50',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Business sx={{ color: 'warning.main' }} />
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary" display="block">
                      Institution
                    </Typography>
                    <Typography variant="body1" fontWeight="500">
                      {manuscript.author.institution}
                    </Typography>
                  </Box>
                </Box>
              )}

              {/* Poste */}
              {manuscript.author.position && (
                <Box display="flex" alignItems="center" gap={2}>
                  <Box 
                    sx={{ 
                      p: 1, 
                      borderRadius: 1, 
                      bgcolor: 'info.50',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Work sx={{ color: 'info.main' }} />
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary" display="block">
                      Poste / Fonction
                    </Typography>
                    <Typography variant="body1" fontWeight="500">
                      {manuscript.author.position}
                    </Typography>
                  </Box>
                </Box>
              )}
            </Box>

            {/* Biographie */}
            {manuscript.author.bio && (
              <>
                <Divider sx={{ my: 3 }} />
                <Typography variant="h6" fontWeight="600" mb={2}>
                  Biographie
                </Typography>
                <Box 
                  sx={{ 
                    p: 3, 
                    bgcolor: 'grey.50', 
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: 'divider'
                  }}
                >
                  <Typography variant="body1" color="text.secondary" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.8 }}>
                    {manuscript.author.bio}
                  </Typography>
                </Box>
              </>
            )}

            {/* Message si aucune info supplémentaire */}
            {!manuscript.author.bio && !manuscript.author.orcidId && !manuscript.author.institution && !manuscript.author.position && (
              <>
                <Divider sx={{ my: 3 }} />
                <Box 
                  sx={{ 
                    p: 3, 
                    bgcolor: 'grey.50', 
                    borderRadius: 2,
                    textAlign: 'center'
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    L'auteur n'a pas renseigné d'informations supplémentaires sur son profil.
                  </Typography>
                </Box>
              </>
            )}
          </CardContent>
        </Card>
      ) : (
        // Onglet PDF
        <Card elevation={2}>
          <CardContent sx={{ p: 2 }}>
            <Box display="flex" justifyContent="flex-end" mb={2}>
              <Button variant="outlined" size="small" startIcon={<PictureAsPdf />} onClick={handleDownloadPdf}>
                Télécharger
              </Button>
            </Box>
            <PdfViewer pdfUrl={`${API_URL}/api/v1/files/view/${manuscript.pdfFilename}`} />
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
