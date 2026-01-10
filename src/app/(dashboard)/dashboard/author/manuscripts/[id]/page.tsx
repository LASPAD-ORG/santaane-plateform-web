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
  Tooltip,
  Tabs,
  Tab,
} from '@mui/material';
import {
  ArrowBack,
  Edit,
  PictureAsPdf,
  CalendarToday,
  Category,
  Language,
  Label,
  Visibility,
} from '@mui/icons-material';
import { useState } from 'react';
import { useManuscriptDetails } from './hooks/useManuscriptDetails';
import { MANUSCRIPT_STATUS_LABELS, MANUSCRIPT_STATUS_COLORS } from '@/types/manuscript';
import PdfViewer from './components/PdfViewer';
import DocxUploadSection from './components/DocxUploadSection';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function ManuscriptDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { loading, manuscript, refetch } = useManuscriptDetails(id);
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
          label={MANUSCRIPT_STATUS_LABELS[manuscript.status]}
          color={MANUSCRIPT_STATUS_COLORS[manuscript.status]}
          size="medium"
        />
      </Box>

      {/* Actions */}
      <Box display="flex" gap={2} mb={3}>
        {manuscript.status === 'revision_requested' && (
          <Button
            variant="contained"
            color="warning"
            startIcon={<Edit />}
            onClick={() => router.push(`/dashboard/author/manuscripts/${id}/edit`)}
          >
            Modifier le manuscrit
          </Button>
        )}
      </Box>

      {/* DOCX Upload Section - Only for accepted manuscripts */}
      {manuscript.status === 'accepted' && (
        <DocxUploadSection
          manuscriptId={id}
          currentDocxFilename={manuscript.docxFilename}
          onUploadSuccess={refetch}
        />
      )}

      {/* Onglets */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={currentTab} onChange={(_, newValue) => setCurrentTab(newValue)}>
          <Tab label="Informations" />
          <Tab label="Prévisualisation PDF"  />
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
                Document
              </Typography>
              <Button 
                variant="contained" 
                startIcon={<PictureAsPdf />} 
                onClick={handleDownloadPdf}
                sx={{ mt: 1 }}
              >
                Télécharger le PDF
              </Button>
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
      ) : (
        // Onglet Prévisualisation PDF
        <Card elevation={2}>
          <CardContent sx={{ p: 4 }}>
            <PdfViewer pdfUrl={`${API_URL}/api/v1/files/view/${manuscript.pdfFilename}`} />
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
