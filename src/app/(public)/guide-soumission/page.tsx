'use client';

import {
  Box,
  Container,
  Typography,
  Paper,
  Stack,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Divider,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Alert,
  Button,
} from '@mui/material';
import {
  ExpandMore,
  CheckCircle,
  Info,
  Description,
  Calculate,
  Upload,
  RateReview,
  PublishedWithChanges,
} from '@mui/icons-material';
import Link from 'next/link';

export default function GuideSubmissionPage() {
  const steps = [
    {
      label: 'Inscription sur la plateforme',
      icon: <CheckCircle />,
      description:
        'Créez un compte auteur sur la plateforme Santaane. Renseignez vos informations personnelles et académiques.',
      details: [
        'Nom complet et coordonnées',
        'Affiliation institutionnelle',
        'Domaine de recherche',
        'Adresse email valide',
      ],
    },
    {
      label: 'Préparation du manuscrit',
      icon: <Description />,
      description:
        'Préparez votre manuscrit selon les normes de soumission. Assurez-vous qu\'il respecte les exigences de format et de contenu.',
      details: [
        'Fichier au format PDF',
        'Respect des normes de citation',
        'Anonymisation du document (pour évaluation en double aveugle)',
        'Vérification du nombre de signes',
      ],
    },
    {
      label: 'Soumission en ligne',
      icon: <Upload />,
      description:
        'Soumettez votre manuscrit via le formulaire de soumission. Renseignez les métadonnées et téléchargez votre fichier.',
      details: [
        'Titre en français et anglais',
        'Résumé (200-300 mots)',
        'Mots-clés (5-7 maximum)',
        'Classification thématique',
        'Téléchargement du fichier PDF',
      ],
    },
    {
      label: 'Évaluation par les pairs',
      icon: <RateReview />,
      description:
        'Votre manuscrit est évalué par des pairs experts dans votre domaine. Ce processus peut prendre 4-8 semaines.',
      details: [
        'Évaluation en double aveugle',
        'Grille d\'évaluation standardisée',
        'Commentaires détaillés des évaluateurs',
        'Décision éditoriale motivée',
      ],
    },
    {
      label: 'Révision et publication',
      icon: <PublishedWithChanges />,
      description:
        'Selon les retours, vous pourrez être invité à réviser votre manuscrit. Une fois accepté, il sera publié sur la plateforme.',
      details: [
        'Intégration des commentaires des évaluateurs',
        'Soumission de la version révisée',
        'Validation finale par l\'éditeur',
        'Publication et attribution d\'un identifiant unique',
      ],
    },
  ];

  const faq = [
    {
      question: 'Qu\'est-ce qu\'un "signe" ?',
      answer:
        'Un signe correspond à un caractère (lettre, chiffre, espace, ponctuation). Le nombre de signes est le nombre total de caractères dans votre manuscrit, incluant le texte principal, le résumé, la bibliographie et les annexes. Par exemple, un manuscrit de 50 000 signes équivaut à environ 8 000 mots.',
    },
    {
      question: 'Quelle est la longueur recommandée pour un manuscrit ?',
      answer:
        'Nous recommandons entre 30 000 et 80 000 signes (espaces compris) pour un article de recherche standard. Les notes de recherche peuvent être plus courtes (15 000-30 000 signes). Contactez l\'éditeur pour les manuscrits dépassant 80 000 signes.',
    },
    {
      question: 'Comment compter le nombre de signes dans mon document ?',
      answer:
        'Dans Microsoft Word : Révision > Statistiques > Caractères (espaces comprises). Dans LibreOffice : Outils > Statistiques > Caractères (espaces comprises). Dans Google Docs : Outils > Nombre de mots > Caractères (espaces compris).',
    },
    {
      question: 'Quel format de citation dois-je utiliser ?',
      answer:
        'Nous recommandons le style APA (American Psychological Association) 7e édition pour les sciences humaines et sociales. Assurez-vous de la cohérence de vos citations tout au long du manuscrit.',
    },
    {
      question: 'Dois-je anonymiser mon manuscrit ?',
      answer:
        'Oui, pour garantir une évaluation impartiale en double aveugle, retirez toute information permettant d\'identifier l\'auteur (nom, affiliation) du corps du texte et des métadonnées du fichier PDF.',
    },
    {
      question: 'Combien de temps prend l\'évaluation ?',
      answer:
        'Le processus d\'évaluation par les pairs prend généralement entre 4 et 8 semaines. Vous serez informé de la décision éditoriale dès que toutes les évaluations seront complétées.',
    },
    {
      question: 'Que se passe-t-il si mon manuscrit est refusé ?',
      answer:
        'En cas de refus, vous recevrez les commentaires des évaluateurs expliquant les raisons de la décision. Vous pourrez utiliser ces retours pour améliorer votre manuscrit et le soumettre ailleurs ou le resoumettre après révisions majeures si l\'éditeur le permet.',
    },
    {
      question: 'Y a-t-il des frais de soumission ou de publication ?',
      answer:
        'Non, la soumission et la publication sur la plateforme Santaane sont entièrement gratuites. Nous croyons en l\'accès ouvert à la recherche scientifique.',
    },
  ];

  return (
    <Box sx={{ bgcolor: '#fafafa', minHeight: 'calc(100vh - 200px)' }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #59a498 0%, #ff9d00 100%)',
          color: 'white',
          py: { xs: 6, md: 8 },
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h3" fontWeight="bold" gutterBottom sx={{ fontSize: { xs: '2rem', md: '2.5rem' } }}>
              Guide de Soumission
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.95, maxWidth: 700, mx: 'auto' }}>
              Tout ce que vous devez savoir pour soumettre votre manuscrit sur Santaane
            </Typography>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
        {/* Introduction */}
        <Alert
          severity="info"
          icon={<Info />}
          sx={{ mb: 4, borderRadius: 2, '& .MuiAlert-message': { width: '100%' } }}
        >
          <Typography variant="body1" fontWeight="500" gutterBottom>
            Bienvenue dans notre guide de soumission
          </Typography>
          <Typography variant="body2">
            Ce guide vous accompagne à travers toutes les étapes de soumission d&apos;un manuscrit, depuis la création
            de votre compte jusqu&apos;à la publication de vos travaux.
          </Typography>
        </Alert>

        {/* Étapes de soumission */}
        <Paper sx={{ p: { xs: 3, md: 4 }, borderRadius: 3, mb: 4 }}>
          <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mb: 3 }}>
            Les Étapes de Soumission
          </Typography>

          <Stepper orientation="vertical">
            {steps.map((step, index) => (
              <Step key={index} active={true} completed={false}>
                <StepLabel
                  StepIconComponent={() => (
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        bgcolor: index % 2 === 0 ? '#59a498' : '#ff9d00',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                      }}
                    >
                      {step.icon}
                    </Box>
                  )}
                >
                  <Typography variant="h6" fontWeight="600">
                    {step.label}
                  </Typography>
                </StepLabel>
                <StepContent>
                  <Typography variant="body1" paragraph sx={{ mb: 2 }}>
                    {step.description}
                  </Typography>
                  <Box sx={{ pl: 2, borderLeft: '3px solid', borderColor: 'divider' }}>
                    {step.details.map((detail, idx) => (
                      <Stack key={idx} direction="row" spacing={1} sx={{ mb: 1 }}>
                        <CheckCircle sx={{ fontSize: 20, color: '#59a498', mt: 0.2 }} />
                        <Typography variant="body2" color="text.secondary">
                          {detail}
                        </Typography>
                      </Stack>
                    ))}
                  </Box>
                </StepContent>
              </Step>
            ))}
          </Stepper>
        </Paper>

        {/* Comprendre le "Signe" */}
        <Paper sx={{ p: { xs: 3, md: 4 }, borderRadius: 3, mb: 4, bgcolor: '#fff7ed' }}>
          <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
            <Calculate sx={{ fontSize: 40, color: '#ff9d00' }} />
            <Typography variant="h5" fontWeight="bold">
              Qu&apos;est-ce qu&apos;un &quot;Signe&quot; ?
            </Typography>
          </Stack>

          <Typography variant="body1" paragraph sx={{ fontSize: '1.05rem', lineHeight: 1.8 }}>
            Le <strong>signe</strong> est l&apos;unité de mesure utilisée pour calculer la longueur de votre manuscrit.
            Un signe correspond à un caractère : lettre, chiffre, espace, signe de ponctuation.
          </Typography>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h6" fontWeight="600" gutterBottom>
            Comment calculer le nombre de signes ?
          </Typography>
          <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
            Le nombre total de signes inclut <strong>TOUS les caractères</strong> de votre manuscrit :
          </Typography>

          <Box sx={{ pl: 2, mb: 3 }}>
            <Stack spacing={1.5}>
              <Stack direction="row" spacing={2}>
                <Chip label="1" size="small" sx={{ bgcolor: '#ff9d00', color: 'white', fontWeight: 600 }} />
                <Typography variant="body2">Le texte principal du manuscrit</Typography>
              </Stack>
              <Stack direction="row" spacing={2}>
                <Chip label="2" size="small" sx={{ bgcolor: '#ff9d00', color: 'white', fontWeight: 600 }} />
                <Typography variant="body2">Le résumé (abstract)</Typography>
              </Stack>
              <Stack direction="row" spacing={2}>
                <Chip label="3" size="small" sx={{ bgcolor: '#ff9d00', color: 'white', fontWeight: 600 }} />
                <Typography variant="body2">La bibliographie / références</Typography>
              </Stack>
              <Stack direction="row" spacing={2}>
                <Chip label="4" size="small" sx={{ bgcolor: '#ff9d00', color: 'white', fontWeight: 600 }} />
                <Typography variant="body2">Les annexes (si présentes)</Typography>
              </Stack>
            </Stack>
          </Box>

          <Alert severity="warning" sx={{ mb: 2 }}>
            <Typography variant="body2">
              <strong>Important :</strong> Les espaces, sauts de ligne et caractères spéciaux comptent également comme
              des signes.
            </Typography>
          </Alert>

          <Typography variant="h6" fontWeight="600" gutterBottom>
            Outils pour compter les signes
          </Typography>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 2 }}>
            <Paper sx={{ p: 2, flex: { xs: '1 1 100%', md: '0 0 calc(33.333% - 11px)' } }}>
              <Typography variant="subtitle2" fontWeight="600" gutterBottom>
                Microsoft Word
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Révision → Statistiques → <strong>Caractères (espaces comprises)</strong>
              </Typography>
            </Paper>

            <Paper sx={{ p: 2, flex: { xs: '1 1 100%', md: '0 0 calc(33.333% - 11px)' } }}>
              <Typography variant="subtitle2" fontWeight="600" gutterBottom>
                LibreOffice
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Outils → Statistiques → <strong>Caractères (espaces comprises)</strong>
              </Typography>
            </Paper>

            <Paper sx={{ p: 2, flex: { xs: '1 1 100%', md: '0 0 calc(33.333% - 11px)' } }}>
              <Typography variant="subtitle2" fontWeight="600" gutterBottom>
                Google Docs
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Outils → Nombre de mots → <strong>Caractères (espaces compris)</strong>
              </Typography>
            </Paper>
          </Box>

          <Box sx={{ mt: 3, p: 2, bgcolor: 'white', borderRadius: 2 }}>
            <Typography variant="body2" color="text.secondary">
              <strong>Exemple :</strong> Un article de 50 000 signes équivaut à environ 8 000 mots (en français). Un
              article de 30 000 signes = environ 5 000 mots.
            </Typography>
          </Box>
        </Paper>

        {/* Exigences */}
        <Paper sx={{ p: { xs: 3, md: 4 }, borderRadius: 3, mb: 4 }}>
          <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mb: 3 }}>
            Exigences du Manuscrit
          </Typography>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
            {/* Format */}
            <Box sx={{ flex: { xs: '1 1 100%', md: '0 0 calc(50% - 12px)' } }}>
              <Stack spacing={2}>
                <Typography variant="h6" fontWeight="600" color="primary">
                  Format
                </Typography>
                <Stack spacing={1}>
                  <Stack direction="row" spacing={1}>
                    <CheckCircle sx={{ fontSize: 20, color: '#59a498' }} />
                    <Typography variant="body2">Fichier PDF uniquement</Typography>
                  </Stack>
                  <Stack direction="row" spacing={1}>
                    <CheckCircle sx={{ fontSize: 20, color: '#59a498' }} />
                    <Typography variant="body2">Police : Times New Roman ou Arial, taille 12</Typography>
                  </Stack>
                  <Stack direction="row" spacing={1}>
                    <CheckCircle sx={{ fontSize: 20, color: '#59a498' }} />
                    <Typography variant="body2">Interligne : 1.5 ou 2</Typography>
                  </Stack>
                  <Stack direction="row" spacing={1}>
                    <CheckCircle sx={{ fontSize: 20, color: '#59a498' }} />
                    <Typography variant="body2">Marges : 2.5 cm de chaque côté</Typography>
                  </Stack>
                </Stack>
              </Stack>
            </Box>

            {/* Longueur */}
            <Box sx={{ flex: { xs: '1 1 100%', md: '0 0 calc(50% - 12px)' } }}>
              <Stack spacing={2}>
                <Typography variant="h6" fontWeight="600" color="primary">
                  Longueur
                </Typography>
                <Stack spacing={1}>
                  <Stack direction="row" spacing={1}>
                    <CheckCircle sx={{ fontSize: 20, color: '#59a498' }} />
                    <Typography variant="body2">Article standard : 30 000 - 80 000 signes</Typography>
                  </Stack>
                  <Stack direction="row" spacing={1}>
                    <CheckCircle sx={{ fontSize: 20, color: '#59a498' }} />
                    <Typography variant="body2">Note de recherche : 15 000 - 30 000 signes</Typography>
                  </Stack>
                  <Stack direction="row" spacing={1}>
                    <CheckCircle sx={{ fontSize: 20, color: '#59a498' }} />
                    <Typography variant="body2">Résumé : 200 - 300 mots</Typography>
                  </Stack>
                  <Stack direction="row" spacing={1}>
                    <CheckCircle sx={{ fontSize: 20, color: '#59a498' }} />
                    <Typography variant="body2">Mots-clés : 5 - 7 maximum</Typography>
                  </Stack>
                </Stack>
              </Stack>
            </Box>

            {/* Structure */}
            <Box sx={{ flex: { xs: '1 1 100%', md: '0 0 calc(50% - 12px)' } }}>
              <Stack spacing={2}>
                <Typography variant="h6" fontWeight="600" color="primary">
                  Structure
                </Typography>
                <Stack spacing={1}>
                  <Stack direction="row" spacing={1}>
                    <CheckCircle sx={{ fontSize: 20, color: '#59a498' }} />
                    <Typography variant="body2">Titre (français et anglais)</Typography>
                  </Stack>
                  <Stack direction="row" spacing={1}>
                    <CheckCircle sx={{ fontSize: 20, color: '#59a498' }} />
                    <Typography variant="body2">Résumé bilingue</Typography>
                  </Stack>
                  <Stack direction="row" spacing={1}>
                    <CheckCircle sx={{ fontSize: 20, color: '#59a498' }} />
                    <Typography variant="body2">Introduction, développement, conclusion</Typography>
                  </Stack>
                  <Stack direction="row" spacing={1}>
                    <CheckCircle sx={{ fontSize: 20, color: '#59a498' }} />
                    <Typography variant="body2">Bibliographie (style APA recommandé)</Typography>
                  </Stack>
                </Stack>
              </Stack>
            </Box>

            {/* Anonymisation */}
            <Box sx={{ flex: { xs: '1 1 100%', md: '0 0 calc(50% - 12px)' } }}>
              <Stack spacing={2}>
                <Typography variant="h6" fontWeight="600" color="primary">
                  Anonymisation
                </Typography>
                <Stack spacing={1}>
                  <Stack direction="row" spacing={1}>
                    <CheckCircle sx={{ fontSize: 20, color: '#59a498' }} />
                    <Typography variant="body2">Retirer nom et affiliation du document</Typography>
                  </Stack>
                  <Stack direction="row" spacing={1}>
                    <CheckCircle sx={{ fontSize: 20, color: '#59a498' }} />
                    <Typography variant="body2">Nettoyer les métadonnées du PDF</Typography>
                  </Stack>
                  <Stack direction="row" spacing={1}>
                    <CheckCircle sx={{ fontSize: 20, color: '#59a498' }} />
                    <Typography variant="body2">Remplacer auto-citations par &quot;[Auteur]&quot;</Typography>
                  </Stack>
                  <Stack direction="row" spacing={1}>
                    <CheckCircle sx={{ fontSize: 20, color: '#59a498' }} />
                    <Typography variant="body2">Page de garde séparée avec vos coordonnées</Typography>
                  </Stack>
                </Stack>
              </Stack>
            </Box>
          </Box>
        </Paper>

        {/* FAQ */}
        <Box>
          <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mb: 3 }}>
            Questions Fréquentes
          </Typography>

          {faq.map((item, index) => (
            <Accordion key={index} sx={{ mb: 1, '&:before': { display: 'none' } }}>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography variant="subtitle1" fontWeight="600">
                  {item.question}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                  {item.answer}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>

        {/* CTA */}
        <Box sx={{ textAlign: 'center', mt: 6, p: 4, bgcolor: 'white', borderRadius: 3 }}>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Prêt à soumettre votre manuscrit ?
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 3, maxWidth: 600, mx: 'auto' }}>
            Créez un compte et commencez votre parcours de publication sur Santaane
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
            <Link href="/register" style={{ textDecoration: 'none' }}>
              <Button
                variant="contained"
                size="large"
                sx={{
                  bgcolor: '#ff9d00',
                  '&:hover': { bgcolor: '#e68a00' },
                  px: 4,
                }}
              >
                Créer un compte
              </Button>
            </Link>
            <Link href="/contact" style={{ textDecoration: 'none' }}>
              <Button variant="outlined" size="large" sx={{ px: 4 }}>
                Nous contacter
              </Button>
            </Link>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}
