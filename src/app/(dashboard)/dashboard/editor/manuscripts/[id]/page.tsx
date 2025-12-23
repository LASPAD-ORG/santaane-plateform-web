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
  Visibility,
  Email,
  Person,
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
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Box display="flex" alignItems="center" gap={2} mb={3}>
        <IconButton onClick={() => router.back()}>
          <ArrowBack />
        </IconButton>
        <Box flex={1}>
          <Typography variant="h4" fontWeight="bold">
            Détails du Manuscrit
          </Typography>
          <Typography variant="body2" color="text.secondary">
            ID: {manuscript.id}
          </Typography>
        </Box>
        <Chip
          label={MANUSCRIPT_STATUS_LABELS[manuscript.status as keyof typeof MANUSCRIPT_STATUS_LABELS]}
          color={MANUSCRIPT_STATUS_COLORS[manuscript.status as keyof typeof MANUSCRIPT_STATUS_COLORS]}
          size="medium"
        />
      </Box>

      {/* Actions */}
      <Box display="flex" gap={2} mb={3}>
        <Button variant="outlined" startIcon={<PictureAsPdf />} onClick={handleDownloadPdf}>
          Télécharger le PDF
        </Button>
      </Box>

      {/* Onglets */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={currentTab} onChange={(_, newValue) => setCurrentTab(newValue)}>
          <Tab label="Informations" />
          <Tab label="Auteur" icon={<Person />} iconPosition="start" />
          <Tab label="Prévisualisation PDF" icon={<Visibility />} iconPosition="start" />
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
                  <Box display="flex" alignItems="center" gap={2}>
                    <Label sx={{ color: 'text.secondary' }} />
                    <Box>
                      <Typography variant="caption" color="text.secondary" display="block">
                        Mots-clés
                      </Typography>
                      <Typography variant="body1">{manuscript.keywords}</Typography>
                    </Box>
                  </Box>
                )}
              </Box>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Fichier PDF */}
            <Box mb={3}>
              <Typography variant="h6" fontWeight="600" mb={2}>
                Fichier PDF
              </Typography>
              <Box display="flex" alignItems="center" gap={2}>
                <PictureAsPdf sx={{ color: 'error.main', fontSize: 40 }} />
                <Box flex={1}>
                  <Typography variant="body1" fontWeight="500">
                    {manuscript.pdfFilename.split('/').pop()}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Chemin: {manuscript.pdfFilename}
                  </Typography>
                </Box>
                <Button size="small" variant="contained" onClick={handleDownloadPdf}>
                  Télécharger
                </Button>
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
            <Box display="flex" alignItems="center" gap={3} mb={4}>
              <Avatar sx={{ width: 80, height: 80, bgcolor: 'primary.main', fontSize: 32 }}>
                {manuscript.author.fullName.charAt(0).toUpperCase()}
              </Avatar>
              <Box>
                <Typography variant="h5" fontWeight="600">
                  {manuscript.author.fullName}
                </Typography>
                {manuscript.author.position && (
                  <Typography variant="body2" color="text.secondary">
                    {manuscript.author.position}
                  </Typography>
                )}
              </Box>
            </Box>

            <Divider sx={{ my: 3 }} />

            <Box display="flex" flexDirection="column" gap={3}>
              {/* Email */}
              <Box display="flex" alignItems="center" gap={2}>
                <Email sx={{ color: 'text.secondary' }} />
                <Box>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Email
                  </Typography>
                  <Typography variant="body1">{manuscript.author.email}</Typography>
                </Box>
              </Box>

              {/* Institution */}
              {manuscript.author.institution && (
                <Box display="flex" alignItems="center" gap={2}>
                  <Business sx={{ color: 'text.secondary' }} />
                  <Box>
                    <Typography variant="caption" color="text.secondary" display="block">
                      Institution
                    </Typography>
                    <Typography variant="body1">{manuscript.author.institution}</Typography>
                  </Box>
                </Box>
              )}

              {/* Position */}
              {manuscript.author.position && (
                <Box display="flex" alignItems="center" gap={2}>
                  <Work sx={{ color: 'text.secondary' }} />
                  <Box>
                    <Typography variant="caption" color="text.secondary" display="block">
                      Poste
                    </Typography>
                    <Typography variant="body1">{manuscript.author.position}</Typography>
                  </Box>
                </Box>
              )}

              {/* ORCID */}
              {manuscript.author.orcidId && (
                <Box display="flex" alignItems="center" gap={2}>
                  <Info sx={{ color: 'text.secondary' }} />
                  <Box>
                    <Typography variant="caption" color="text.secondary" display="block">
                      ORCID ID
                    </Typography>
                    <Typography variant="body1">{manuscript.author.orcidId}</Typography>
                  </Box>
                </Box>
              )}

              {/* Bio */}
              {manuscript.author.bio && (
                <Box>
                  <Typography variant="h6" fontWeight="600" mb={2}>
                    Biographie
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ whiteSpace: 'pre-wrap' }}>
                    {manuscript.author.bio}
                  </Typography>
                </Box>
              )}
            </Box>
          </CardContent>
        </Card>
      ) : (
        // Onglet Prévisualisation PDF
        <Card elevation={2}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h6" fontWeight="600" mb={3}>
              Prévisualisation du PDF
            </Typography>
            <PdfViewer pdfUrl={`${API_URL}/api/v1/files/view/${manuscript.pdfFilename}`} />
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
