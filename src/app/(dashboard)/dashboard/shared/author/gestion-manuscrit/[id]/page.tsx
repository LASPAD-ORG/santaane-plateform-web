'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Box,
  Typography,
  Chip,
  Divider,
  Paper,
  Skeleton,
  IconButton,
  Tabs,
  Tab,
  TextField,
  Button,
  Card,
  CardContent,
  Avatar,
  Badge
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Description as DescriptionIcon,
  Send as SendIcon,
  FormatAlignLeft as FormeIcon,
  Brush as StyleIcon,
  Psychology as MethodologieIcon,
  Comment as CommentIcon
} from '@mui/icons-material';
import { useFetchGestionManuscritById, GestionManuscritItem, CommentaireMentor } from '../fetchers/useFetchGestionManuscrit';
import { formatGestionManuscritDate, getStatusColor, getStatusLabel } from '../helpers/formatters';
import { PdfViewerAnnotated } from '../components/pdf/PdfViewerAnnotated';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel({ children, value, index, ...other }: TabPanelProps) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`comment-tabpanel-${index}`}
      aria-labelledby={`comment-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

type SectionType = 'forme' | 'style' | 'methodologie' | 'general';

export default function ManuscritDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { data: manuscrit, loading, fetch } = useFetchGestionManuscritById();

  const [activeTab, setActiveTab] = useState(0);
  const [newComment, setNewComment] = useState('');
  const [localCommentaires, setLocalCommentaires] = useState<{
    forme: CommentaireMentor[];
    style: CommentaireMentor[];
    methodologie: CommentaireMentor[];
    general: CommentaireMentor[];
  }>({
    forme: [],
    style: [],
    methodologie: [],
    general: []
  });

  const sections: { key: SectionType; label: string; icon: React.ElementType }[] = [
    { key: 'forme', label: 'Forme', icon: FormeIcon },
    { key: 'style', label: 'Style', icon: StyleIcon },
    { key: 'methodologie', label: 'Méthodologie', icon: MethodologieIcon },
    { key: 'general', label: 'Autres', icon: CommentIcon }
  ];

  useEffect(() => {
    if (id) {
      fetch(id);
    }
  }, [id]);

  useEffect(() => {
    if (manuscrit) {
      setLocalCommentaires(manuscrit.commentairesMentor);
    }
  }, [manuscrit]);

  const handleBack = () => {
    router.push('/dashboard/shared/author/gestion-manuscrit');
  };

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;

    const currentSection = sections[activeTab].key;
    const newCommentObj: CommentaireMentor = {
      id: `local-${Date.now()}`,
      auteur: 'Mentor', // En réalité, ceci viendrait du contexte utilisateur
      texte: newComment.trim(),
      date: new Date().toISOString(),
      section: currentSection,
      type: 'mentor' // Peut être changé selon le contexte utilisateur
    };

    setLocalCommentaires(prev => ({
      ...prev,
      [currentSection]: [...(prev[currentSection] || []), newCommentObj]
    }));

    setNewComment('');
  };

  const formatCommentDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) {
      return 'Il y a quelques minutes';
    } else if (diffInHours < 24) {
      return `Il y a ${diffInHours} heure${diffInHours > 1 ? 's' : ''}`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      if (diffInDays < 7) {
        return `Il y a ${diffInDays} jour${diffInDays > 1 ? 's' : ''}`;
      } else {
        return date.toLocaleDateString('fr-FR', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      }
    }
  };

  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const formatContent = (content: string) => {
    return content
      .split('\n')
      .map((line, index) => {
        const trimmedLine = line.trim();

        if (trimmedLine.startsWith('# ')) {
          return (
            <Typography
              key={index}
              variant="h4"
              component="h1"
              sx={{ fontWeight: 700, mb: 2, mt: index > 0 ? 3 : 0 }}
            >
              {trimmedLine.substring(2)}
            </Typography>
          );
        }

        if (trimmedLine.startsWith('## ')) {
          return (
            <Typography
              key={index}
              variant="h5"
              component="h2"
              sx={{ fontWeight: 600, mb: 2, mt: 2 }}
            >
              {trimmedLine.substring(3)}
            </Typography>
          );
        }

        if (trimmedLine.startsWith('### ')) {
          return (
            <Typography
              key={index}
              variant="h6"
              component="h3"
              sx={{ fontWeight: 600, mb: 1, mt: 2 }}
            >
              {trimmedLine.substring(4)}
            </Typography>
          );
        }

        if (trimmedLine.startsWith('**') && trimmedLine.endsWith('**')) {
          return (
            <Typography
              key={index}
              variant="subtitle1"
              sx={{ fontWeight: 700, mb: 1, mt: 1 }}
            >
              {trimmedLine.substring(2, trimmedLine.length - 2)}
            </Typography>
          );
        }

        if (trimmedLine.startsWith('*') && trimmedLine.endsWith('*')) {
          return (
            <Typography
              key={index}
              variant="body2"
              sx={{ fontStyle: 'italic', color: 'text.secondary', mb: 1 }}
            >
              {trimmedLine.substring(1, trimmedLine.length - 1)}
            </Typography>
          );
        }

        if (trimmedLine.match(/^\d+\.\s/)) {
          return (
            <Typography
              key={index}
              variant="body1"
              component="li"
              sx={{ ml: 2, mb: 0.5, listStyleType: 'decimal', display: 'list-item' }}
            >
              {trimmedLine.substring(trimmedLine.indexOf(' ') + 1)}
            </Typography>
          );
        }

        if (trimmedLine.startsWith('- ')) {
          return (
            <Typography
              key={index}
              variant="body1"
              component="li"
              sx={{ ml: 2, mb: 0.5, listStyleType: 'disc', display: 'list-item' }}
            >
              {trimmedLine.substring(2)}
            </Typography>
          );
        }

        if (trimmedLine === '') {
          return <Box key={index} sx={{ mb: 1 }} />;
        }

        return (
          <Typography
            key={index}
            variant="body1"
            sx={{ mb: 1, lineHeight: 1.7 }}
          >
            {trimmedLine}
          </Typography>
        );
      });
  };

  const renderCommentsList = (comments: CommentaireMentor[]) => {
    if (comments.length === 0) {
      return (
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
          <Typography variant="body2" color="text.secondary">
            Aucun commentaire pour cette section
          </Typography>
        </Paper>
      );
    }

    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {comments.map((comment) => (
          <Card key={comment.id} variant="outlined" sx={{ bgcolor: 'background.default' }}>
            <CardContent sx={{ pb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                <Avatar sx={{ width: 36, height: 36, bgcolor: 'secondary.main', fontSize: '0.875rem' }}>
                  {getInitials(comment.auteur)}
                </Avatar>
                <Box sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="subtitle2" fontWeight={600}>
                      {comment.auteur}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {formatCommentDate(comment.date)}
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                    {comment.texte}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    );
  };

  // Loading state
  if (loading) {
    return (
      <Box>
        {/* Header skeleton */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, gap: 2 }}>
          <Skeleton variant="circular" width={40} height={40} />
          <Box sx={{ flexGrow: 1 }}>
            <Skeleton variant="text" sx={{ fontSize: '2rem', width: '60%', mb: 1 }} />
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <Skeleton variant="rectangular" width={80} height={24} sx={{ borderRadius: 1 }} />
              <Skeleton variant="text" width={200} />
            </Box>
          </Box>
        </Box>
        <Divider sx={{ mb: 4 }} />
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {[1, 2, 3, 4, 5].map((item) => (
            <Skeleton key={item} variant="rectangular" height={60} sx={{ borderRadius: 2 }} />
          ))}
        </Box>
      </Box>
    );
  }

  // Error state
  if (!manuscrit) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <DescriptionIcon sx={{ fontSize: 80, color: 'text.disabled', mb: 2 }} />
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Manuscrit non trouvé
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Le manuscrit demandé n'existe pas ou n'est plus disponible.
        </Typography>
        <Button
          variant="contained"
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
          color="primary"
        >
          Retour à la liste
        </Button>
      </Box>
    );
  }

  const totalComments =
    localCommentaires.forme.length +
    localCommentaires.style.length +
    localCommentaires.methodologie.length +
    localCommentaires.general.length;

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, gap: 2 }}>
        <IconButton
          onClick={handleBack}
          sx={{
            bgcolor: 'background.paper',
            boxShadow: 1,
            '&:hover': { bgcolor: 'grey.100' }
          }}
        >
          <ArrowBackIcon />
        </IconButton>

        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
            {manuscrit.title}
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
            <Chip
              label={getStatusLabel(manuscrit.status)}
              color={getStatusColor(manuscrit.status)}
              size="medium"
            />
            <Typography variant="body2" color="text.secondary">
              Créé le {formatGestionManuscritDate(manuscrit.createdAt)}
            </Typography>
            {totalComments > 0 && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <CommentIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">
                  {totalComments} commentaire{totalComments > 1 ? 's' : ''}
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Box>

      <Divider sx={{ mb: 4 }} />

      {/* Description */}
      {manuscrit.description && (
        <Paper elevation={0} sx={{ p: 3, mb: 4, bgcolor: 'primary.light', borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
            Résumé
          </Typography>
          <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
            {manuscrit.description}
          </Typography>
        </Paper>
      )}

      {/* Content */}
      {/* Content */}
      <Paper
        elevation={0}
        sx={{
          p: 0,
          mb: 4,
          bgcolor: 'background.paper',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 2,
          height: '80vh',
          overflow: 'hidden'
        }}
      >
        <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Contenu du manuscrit
          </Typography>
        </Box>
        <Box sx={{ height: 'calc(100% - 60px)' }}>
          {/* Using a sample PDF for demonstration since we don't have a backend for files yet */}
          <PdfViewerAnnotated
            fileUrl="https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf"
            initialAnnotations={[]}
            onSaveAnnotations={(anns: any[]) => {
              console.log('Annotations saved:', anns);
              // Here we would save to backend
            }}
          />
        </Box>
      </Paper>

      {/* Comments Section */}
      <Box>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
          Commentaires du mentor
        </Typography>

        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="fullWidth"
            sx={{
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '1rem'
              }
            }}
          >
            {sections.map((section, index) => {
              const Icon = section.icon;
              const count = localCommentaires[section.key].length;
              return (
                <Tab
                  key={section.key}
                  icon={
                    <Badge badgeContent={count} color="primary">
                      <Icon />
                    </Badge>
                  }
                  label={section.label}
                  iconPosition="start"
                />
              );
            })}
          </Tabs>
        </Box>

        {sections.map((section, index) => (
          <TabPanel key={section.key} value={activeTab} index={index}>
            {renderCommentsList(localCommentaires[section.key])}
          </TabPanel>
        ))}

        <Divider sx={{ my: 3 }} />

        {/* Add new comment form */}
        <Box>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
            Ajouter un commentaire ({sections[activeTab].label.toLowerCase()})
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
            <TextField
              fullWidth
              multiline
              rows={3}
              placeholder={`Écrivez votre commentaire sur la ${sections[activeTab].label.toLowerCase()}...`}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              variant="outlined"
              sx={{
                flexGrow: 1,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2
                }
              }}
            />
            <Button
              variant="contained"
              startIcon={<SendIcon />}
              onClick={handleAddComment}
              disabled={!newComment.trim()}
              color="secondary"
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                px: 3,
                py: 1.5,
                alignSelf: 'flex-end'
              }}
            >
              Publier
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}