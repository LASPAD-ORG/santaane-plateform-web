'use client';

import {
  Box,
  Container,
  Typography,
  Paper,
  Stack,
  Divider,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
} from '@mui/material';
import {
  ExpandMore,
  CheckCircle,
  Description,
  Calculate,
  Upload,
  RateReview,
  PublishedWithChanges,
  PersonAdd,
} from '@mui/icons-material';
import Link from 'next/link';

// ─── Design tokens ───
const TOKEN = {
  black: '#0a0a0a',
  white: '#ffffff',
  offWhite: '#f5f4f0',
  gray100: '#f0efeb',
  gray300: '#d4d2cc',
  gray500: '#8a887f',
  gray700: '#3d3c38',
  gold: '#b8953a',
  goldDim: 'rgba(184,149,58,0.08)',
};

const fontSans = '"Noto Sans", sans-serif';

export default function GuideSubmissionPage() {
  const steps = [
    {
      icon: <PersonAdd sx={{ fontSize: 22 }} />,
      label: 'Inscription sur la plateforme',
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
      icon: <Description sx={{ fontSize: 22 }} />,
      label: 'Préparation du manuscrit',
      description:
        "Préparez votre manuscrit selon les normes de soumission. Assurez-vous qu'il respecte les exigences de format et de contenu.",
      details: [
        'Fichier au format PDF',
        'Respect des normes de citation',
        "Anonymisation du document (pour évaluation en double aveugle)",
        'Vérification du nombre de signes',
      ],
    },
    {
      icon: <Upload sx={{ fontSize: 22 }} />,
      label: 'Soumission en ligne',
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
      icon: <RateReview sx={{ fontSize: 22 }} />,
      label: 'Évaluation par les pairs',
      description:
        'Votre manuscrit est évalué par des pairs experts dans votre domaine. Ce processus peut prendre 4-8 semaines.',
      details: [
        'Évaluation en double aveugle',
        "Grille d'évaluation standardisée",
        'Commentaires détaillés des évaluateurs',
        'Décision éditoriale motivée',
      ],
    },
    {
      icon: <PublishedWithChanges sx={{ fontSize: 22 }} />,
      label: 'Révision et publication',
      description:
        'Selon les retours, vous pourrez être invité à réviser votre manuscrit. Une fois accepté, il sera publié sur la plateforme.',
      details: [
        "Intégration des commentaires des évaluateurs",
        'Soumission de la version révisée',
        "Validation finale par l'éditeur",
        "Publication et attribution d'un identifiant unique",
      ],
    },
  ];

  const exigences = [
    {
      title: 'Format',
      items: [
        'Fichier PDF uniquement',
        'Police : Times New Roman ou Arial, taille 12',
        'Interligne : 1.5 ou 2',
        'Marges : 2.5 cm de chaque côté',
      ],
    },
    {
      title: 'Longueur',
      items: [
        'Article standard : 30 000 - 80 000 signes',
        'Note de recherche : 15 000 - 30 000 signes',
        'Résumé : 200 - 300 mots',
        'Mots-clés : 5 - 7 maximum',
      ],
    },
    {
      title: 'Structure',
      items: [
        'Titre (français et anglais)',
        'Résumé bilingue',
        'Introduction, développement, conclusion',
        'Bibliographie (style APA recommandé)',
      ],
    },
    {
      title: 'Anonymisation',
      items: [
        'Retirer nom et affiliation du document',
        'Nettoyer les métadonnées du PDF',
        'Remplacer auto-citations par « [Auteur] »',
        'Page de garde séparée avec vos coordonnées',
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
    <Box sx={{ bgcolor: TOKEN.offWhite, minHeight: 'calc(100vh - 200px)' }}>

      {/* ─── HERO ─── */}
      <Box
        sx={{
          bgcolor: TOKEN.black,
          color: TOKEN.white,
          py: { xs: 7, md: 10 },
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'repeating-linear-gradient(0deg, transparent, transparent 39px, rgba(255,255,255,0.03) 40px), repeating-linear-gradient(90deg, transparent, transparent 39px, rgba(255,255,255,0.03) 40px)',
            pointerEvents: 'none',
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            top: '-60px',
            right: '-80px',
            width: '360px',
            height: '360px',
            borderRadius: '50%',
            background: `radial-gradient(circle, ${TOKEN.gold}22 0%, transparent 70%)`,
            pointerEvents: 'none',
          },
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <Box sx={{ width: 48, height: 2, bgcolor: TOKEN.gold, mx: 'auto', mb: 3, borderRadius: 1 }} />
          <Typography
            variant="h3"
            fontWeight={700}
            gutterBottom
            sx={{
              fontFamily: fontSans,
              fontSize: { xs: '2rem', md: '2.8rem' },
              letterSpacing: '-0.02em',
              lineHeight: 1.15,
            }}
          >
            Guide de Soumission
          </Typography>
          <Typography
            variant="h6"
            sx={{
              fontFamily: fontSans,
              fontWeight: 300,
              color: TOKEN.gray300,
              maxWidth: 620,
              mx: 'auto',
              fontSize: { xs: '1rem', md: '1.1rem' },
              lineHeight: 1.7,
            }}
          >
            Tout ce que vous devez savoir pour soumettre votre manuscrit sur Santaane
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 5, md: 8 } }}>

        {/* ─── INTRO BANNER ─── */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 4 },
            mb: 5,
            borderRadius: 2,
            border: `1px solid ${TOKEN.gold}44`,
            bgcolor: TOKEN.goldDim,
            display: 'flex',
            gap: 2.5,
            alignItems: 'flex-start',
          }}
        >
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: 1,
              bgcolor: TOKEN.gold,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              mt: 0.25,
            }}
          >
            <Typography sx={{ fontFamily: fontSans, color: TOKEN.white, fontWeight: 800, fontSize: '1rem' }}>
              i
            </Typography>
          </Box>
          <Box>
            <Typography
              sx={{ fontFamily: fontSans, fontWeight: 700, fontSize: '0.95rem', mb: 0.5 }}
            >
              Bienvenue dans notre guide de soumission
            </Typography>
            <Typography
              sx={{ fontFamily: fontSans, color: TOKEN.gray700, fontSize: '0.875rem', lineHeight: 1.75 }}
            >
              Ce guide vous accompagne à travers toutes les étapes de soumission d&apos;un manuscrit, depuis la création
              de votre compte jusqu&apos;à la publication de vos travaux.
            </Typography>
          </Box>
        </Paper>

        {/* ─── ÉTAPES ─── */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 5 },
            borderRadius: 2,
            mb: 4,
            border: `1px solid ${TOKEN.gray300}`,
            bgcolor: TOKEN.white,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 5 }}>
            <Box sx={{ width: 3, height: 24, bgcolor: TOKEN.gold, borderRadius: 2, flexShrink: 0 }} />
            <Typography variant="h5" fontWeight={700} sx={{ fontFamily: fontSans, letterSpacing: '-0.01em' }}>
              Les Étapes de Soumission
            </Typography>
          </Box>

          <Stack spacing={0}>
            {steps.map((step, index) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  gap: { xs: 2, md: 4 },
                  alignItems: 'flex-start',
                  position: 'relative',
                  pb: index < steps.length - 1 ? 4 : 0,
                  // Vertical connecting line
                  '&::before': index < steps.length - 1 ? {
                    content: '""',
                    position: 'absolute',
                    left: { xs: '17px', md: '17px' },
                    top: '36px',
                    bottom: 0,
                    width: '1px',
                    bgcolor: TOKEN.gray300,
                  } : {},
                }}
              >
                {/* Step indicator */}
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                  <Box
                    sx={{
                      width: 36,
                      height: 36,
                      borderRadius: '50%',
                      bgcolor: TOKEN.black,
                      color: TOKEN.white,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      zIndex: 1,
                      position: 'relative',
                    }}
                  >
                    {step.icon}
                  </Box>
                </Box>

                {/* Content */}
                <Box sx={{ flex: 1, pt: 0.5 }}>
                  <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1 }}>
                    <Typography
                      sx={{
                        fontFamily: fontSans,
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        color: TOKEN.gold,
                      }}
                    >
                      Étape {String(index + 1).padStart(2, '0')}
                    </Typography>
                  </Stack>
                  <Typography
                    variant="h6"
                    fontWeight={700}
                    sx={{
                      fontFamily: fontSans,
                      fontSize: '1rem',
                      letterSpacing: '-0.01em',
                      mb: 1,
                    }}
                  >
                    {step.label}
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: fontSans,
                      color: TOKEN.gray500,
                      fontSize: '0.875rem',
                      lineHeight: 1.75,
                      mb: 2,
                    }}
                  >
                    {step.description}
                  </Typography>

                  <Box
                    sx={{
                      pl: 2,
                      borderLeft: `2px solid ${TOKEN.gray100}`,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 1,
                    }}
                  >
                    {step.details.map((detail, di) => (
                      <Stack key={di} direction="row" spacing={1.5} alignItems="flex-start">
                        <CheckCircle sx={{ fontSize: 16, color: TOKEN.gold, mt: 0.2, flexShrink: 0 }} />
                        <Typography
                          sx={{ fontFamily: fontSans, fontSize: '0.85rem', color: TOKEN.gray700, lineHeight: 1.6 }}
                        >
                          {detail}
                        </Typography>
                      </Stack>
                    ))}
                  </Box>
                </Box>
              </Box>
            ))}
          </Stack>
        </Paper>

        {/* ─── SIGNES ─── */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 5 },
            borderRadius: 2,
            mb: 4,
            border: `1px solid ${TOKEN.gold}44`,
            bgcolor: TOKEN.goldDim,
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 4 }}>
            <Box sx={{ width: 3, height: 24, bgcolor: TOKEN.gold, borderRadius: 2, flexShrink: 0 }} />
            <Calculate sx={{ fontSize: 24, color: TOKEN.gold }} />
            <Typography
              variant="h5"
              fontWeight={700}
              sx={{ fontFamily: fontSans, letterSpacing: '-0.01em' }}
            >
              Qu&apos;est-ce qu&apos;un &quot;Signe&quot; ?
            </Typography>
          </Stack>

          <Typography
            sx={{
              fontFamily: fontSans,
              fontSize: { xs: '0.95rem', md: '1.02rem' },
              lineHeight: 1.85,
              mb: 3,
              color: TOKEN.gray700,
            }}
          >
            Le <Box component="strong" sx={{ color: TOKEN.black, fontWeight: 700 }}>signe</Box> est
            l&apos;unité de mesure utilisée pour calculer la longueur de votre manuscrit.
            Un signe correspond à un caractère : lettre, chiffre, espace, signe de ponctuation.
          </Typography>

          <Divider sx={{ borderColor: `${TOKEN.gold}33`, my: 3 }} />

          <Typography
            variant="h6"
            fontWeight={700}
            sx={{ fontFamily: fontSans, fontSize: '0.95rem', letterSpacing: '-0.01em', mb: 2 }}
          >
            Le décompte inclut{' '}
            <Box component="span" sx={{ color: TOKEN.gold }}>TOUS les caractères</Box>{' '}
            du manuscrit :
          </Typography>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, mb: 3 }}>
            {['Texte principal', 'Résumé (abstract)', 'Bibliographie', 'Annexes'].map((item, i) => (
              <Stack key={i} direction="row" alignItems="center" spacing={1}>
                <Box
                  sx={{
                    width: 22,
                    height: 22,
                    borderRadius: '50%',
                    bgcolor: TOKEN.gold,
                    color: TOKEN.white,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    fontFamily: fontSans,
                    flexShrink: 0,
                  }}
                >
                  {i + 1}
                </Box>
                <Typography sx={{ fontFamily: fontSans, fontSize: '0.875rem', color: TOKEN.gray700 }}>
                  {item}
                </Typography>
              </Stack>
            ))}
          </Box>

          {/* Warning */}
          <Box
            sx={{
              p: 2,
              borderRadius: 1,
              bgcolor: TOKEN.white,
              border: `1px solid ${TOKEN.gold}33`,
              mb: 3,
            }}
          >
            <Typography sx={{ fontFamily: fontSans, fontSize: '0.85rem', color: TOKEN.gray700, lineHeight: 1.7 }}>
              <Box component="strong" sx={{ color: TOKEN.black }}>Important :</Box>{' '}
              Les espaces, sauts de ligne et caractères spéciaux comptent également comme des signes.
            </Typography>
          </Box>

          {/* Tools */}
          <Typography
            variant="h6"
            fontWeight={700}
            sx={{ fontFamily: fontSans, fontSize: '0.95rem', letterSpacing: '-0.01em', mb: 2 }}
          >
            Comment compter les signes ?
          </Typography>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            {[
              { title: 'Microsoft Word', path: 'Révision → Statistiques → Caractères (espaces comprises)' },
              { title: 'LibreOffice', path: 'Outils → Statistiques → Caractères (espaces comprises)' },
              { title: 'Google Docs', path: 'Outils → Nombre de mots → Caractères (espaces compris)' },
            ].map((tool, i) => (
              <Paper
                key={i}
                elevation={0}
                sx={{
                  p: 2.5,
                  flex: { xs: '1 1 100%', md: '0 0 calc(33.333% - 11px)' },
                  borderRadius: 1,
                  border: `1px solid ${TOKEN.gray300}`,
                  bgcolor: TOKEN.white,
                }}
              >
                <Typography
                  sx={{ fontFamily: fontSans, fontWeight: 700, fontSize: '0.85rem', mb: 0.75 }}
                >
                  {tool.title}
                </Typography>
                <Typography sx={{ fontFamily: fontSans, fontSize: '0.8rem', color: TOKEN.gray500, lineHeight: 1.6 }}>
                  {tool.path}
                </Typography>
              </Paper>
            ))}
          </Box>

          <Box
            sx={{ mt: 2.5, p: 2, bgcolor: TOKEN.white, borderRadius: 1, border: `1px solid ${TOKEN.gray300}` }}
          >
            <Typography sx={{ fontFamily: fontSans, fontSize: '0.82rem', color: TOKEN.gray500, lineHeight: 1.7 }}>
              <Box component="strong" sx={{ color: TOKEN.gray700 }}>Exemple :</Box>{' '}
              Un article de 50 000 signes ≈ 8 000 mots (fr). Un article de 30 000 signes ≈ 5 000 mots.
            </Typography>
          </Box>
        </Paper>

        {/* ─── EXIGENCES ─── */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 5 },
            borderRadius: 2,
            mb: 4,
            border: `1px solid ${TOKEN.gray300}`,
            bgcolor: TOKEN.white,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 4 }}>
            <Box sx={{ width: 3, height: 24, bgcolor: TOKEN.gold, borderRadius: 2, flexShrink: 0 }} />
            <Typography variant="h5" fontWeight={700} sx={{ fontFamily: fontSans, letterSpacing: '-0.01em' }}>
              Exigences du Manuscrit
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
            {exigences.map((section, si) => (
              <Box key={si} sx={{ flex: { xs: '1 1 100%', md: '0 0 calc(50% - 12px)' } }}>
                <Box
                  sx={{
                    p: 3,
                    border: `1px solid ${TOKEN.gray300}`,
                    borderRadius: 1,
                    height: '100%',
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: fontSans,
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      color: TOKEN.gold,
                      mb: 2,
                    }}
                  >
                    {section.title}
                  </Typography>
                  <Stack spacing={1.25}>
                    {section.items.map((item, ii) => (
                      <Stack key={ii} direction="row" spacing={1.5} alignItems="flex-start">
                        <CheckCircle sx={{ fontSize: 16, color: TOKEN.gold, mt: 0.2, flexShrink: 0 }} />
                        <Typography
                          sx={{ fontFamily: fontSans, fontSize: '0.875rem', color: TOKEN.gray700, lineHeight: 1.6 }}
                        >
                          {item}
                        </Typography>
                      </Stack>
                    ))}
                  </Stack>
                </Box>
              </Box>
            ))}
          </Box>
        </Paper>

        {/* ─── FAQ ─── */}
        <Box sx={{ mb: 6 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
            <Box sx={{ width: 3, height: 24, bgcolor: TOKEN.gold, borderRadius: 2, flexShrink: 0 }} />
            <Typography variant="h5" fontWeight={700} sx={{ fontFamily: fontSans, letterSpacing: '-0.01em' }}>
              Questions Fréquentes
            </Typography>
            <Box sx={{ flex: 1, height: 1, bgcolor: TOKEN.gray300 }} />
          </Box>

          <Stack spacing={0}>
            {faq.map((item, index) => (
              <Accordion
                key={index}
                disableGutters
                elevation={0}
                sx={{
                  border: `1px solid ${TOKEN.gray300}`,
                  borderBottom: index < faq.length - 1 ? 'none' : `1px solid ${TOKEN.gray300}`,
                  borderRadius: 0,
                  '&:first-of-type': { borderRadius: '8px 8px 0 0' },
                  '&:last-of-type': { borderRadius: '0 0 8px 8px' },
                  '&::before': { display: 'none' },
                  bgcolor: TOKEN.white,
                  '&.Mui-expanded': {
                    bgcolor: TOKEN.offWhite,
                    borderColor: TOKEN.black,
                  },
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMore sx={{ color: TOKEN.gray500, fontSize: 20 }} />}
                  sx={{
                    px: 3,
                    py: 0.5,
                    '&.Mui-expanded': {
                      '& .faq-title': { color: TOKEN.black },
                    },
                  }}
                >
                  <Typography
                    className="faq-title"
                    sx={{
                      fontFamily: fontSans,
                      fontWeight: 600,
                      fontSize: '0.9rem',
                      color: TOKEN.gray700,
                      lineHeight: 1.5,
                    }}
                  >
                    {item.question}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ px: 3, pb: 3 }}>
                  <Divider sx={{ borderColor: TOKEN.gray100, mb: 2 }} />
                  <Typography
                    sx={{
                      fontFamily: fontSans,
                      fontSize: '0.875rem',
                      color: TOKEN.gray500,
                      lineHeight: 1.8,
                    }}
                  >
                    {item.answer}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Stack>
        </Box>

        {/* ─── CTA ─── */}
        <Box
          sx={{
            p: { xs: 4, md: 6 },
            bgcolor: TOKEN.black,
            borderRadius: 2,
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              bottom: '-60px',
              left: '-60px',
              width: '280px',
              height: '280px',
              borderRadius: '50%',
              background: `radial-gradient(circle, ${TOKEN.gold}18 0%, transparent 70%)`,
              pointerEvents: 'none',
            },
          }}
        >
          <Box sx={{ width: 32, height: 2, bgcolor: TOKEN.gold, mx: 'auto', mb: 3 }} />
          <Typography
            variant="h5"
            fontWeight={700}
            gutterBottom
            sx={{
              fontFamily: fontSans,
              color: TOKEN.white,
              letterSpacing: '-0.02em',
              fontSize: { xs: '1.4rem', md: '1.75rem' },
            }}
          >
            Prêt à soumettre votre manuscrit ?
          </Typography>
          <Typography
            sx={{
              fontFamily: fontSans,
              color: TOKEN.gray300,
              mb: 4,
              maxWidth: 480,
              mx: 'auto',
              lineHeight: 1.75,
              fontSize: '0.95rem',
            }}
          >
            Créez un compte et commencez votre parcours de publication sur Santaane
          </Typography>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
            <Link href="/register" style={{ textDecoration: 'none' }}>
              <Button
                variant="contained"
                size="large"
                sx={{
                  fontFamily: fontSans,
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  bgcolor: TOKEN.gold,
                  color: TOKEN.black,
                  borderRadius: 1,
                  px: 4,
                  py: 1.5,
                  boxShadow: 'none',
                  '&:hover': { bgcolor: '#c9a440', boxShadow: 'none' },
                }}
              >
                Créer un compte
              </Button>
            </Link>
            <Link href="/contact" style={{ textDecoration: 'none' }}>
              <Button
                variant="outlined"
                size="large"
                sx={{
                  fontFamily: fontSans,
                  fontWeight: 600,
                  fontSize: '0.8rem',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  borderColor: TOKEN.white,
                  color: TOKEN.white,
                  borderRadius: 1,
                  px: 4,
                  py: 1.5,
                  '&:hover': { bgcolor: TOKEN.white, color: TOKEN.black, borderColor: TOKEN.white },
                  transition: 'all 0.2s ease',
                }}
              >
                Nous contacter
              </Button>
            </Link>
          </Stack>
        </Box>

      </Container>
    </Box>
  );
}