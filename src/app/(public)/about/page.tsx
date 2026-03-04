'use client';

import {
  Box,
  Container,
  Typography,
  Paper,
  Stack,
  Button,
} from '@mui/material';
import {
  School,
  Groups,
  Science,
  OpenInNew,
  Verified,
  TrendingUp,
  EmojiObjects,
} from '@mui/icons-material';
import Link from 'next/link';

// Token design
const TOKEN = {
  black: '#0a0a0a',
  white: '#ffffff',
  offWhite: '#f5f4f0',
  gray100: '#f0efeb',
  gray300: '#d4d2cc',
  gray500: '#8a887f',
  gray700: '#3d3c38',
  gold: '#b8953a',
  goldLight: '#f5e9cc',
  goldDim: 'rgba(184,149,58,0.12)',
};

export default function AboutPage() {
  const missions = [
    {
      icon: <Science sx={{ fontSize: 28 }} />,
      title: 'Recherche et publication',
      description:
        'Co-production et publication de savoirs émancipateurs et protecteurs pour l\'Afrique, la diaspora et le monde.',
    },
    {
      icon: <School sx={{ fontSize: 28 }} />,
      title: 'Formation',
      description:
        'Formation de démocrates et panafricains avertis, innovateurs sociaux et professionnels dévoués à la délivrance de services publics de qualité.',
    },
    {
      icon: <Verified sx={{ fontSize: 28 }} />,
      title: 'Expertise',
      description:
        'Accompagnement des décideurs pour élaborer, mettre en œuvre et évaluer des politiques publiques efficientes et équitables.',
    },
    {
      icon: <Groups sx={{ fontSize: 28 }} />,
      title: 'Médiation scientifique',
      description:
        'Circulation de savoirs scientifiques robustes offrant des solutions pertinentes à des problèmes complexes.',
    },
  ];

  const values = [
    {
      title: 'Transmission',
      description:
        'Partage de connaissances, compétences et expériences entre chercheurs expérimentés et en début de carrière.',
    },
    {
      title: 'Respect des droits humains',
      description:
        'Protection des droits fondamentaux : dignité, confidentialité, équité et consentement des participants.',
    },
    {
      title: 'Approche féministe',
      description:
        'Perspective critique sur les inégalités de genre et promotion de l\'égalité entre les sexes.',
    },
    {
      title: 'Engagement social et environnemental',
      description:
        'Utilisation des résultats de recherche pour influencer les politiques publiques et promouvoir le changement social.',
    },
    {
      title: 'Transparence',
      description:
        'Accessibilité et compréhension des processus, méthodes et résultats de recherche. Communication ouverte et honnête.',
    },
  ];

  return (
    <Box
      sx={{
        bgcolor: TOKEN.offWhite,
        minHeight: 'calc(100vh - 200px)',
        fontFamily: '"Noto Sans", sans-serif',
        '@import': 'url("https://fonts.googleapis.com/css2?family=Noto+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap")',
      }}
    >
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
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          {/* Thin gold rule */}
          <Box
            sx={{
              width: 48,
              height: 2,
              bgcolor: TOKEN.gold,
              mx: 'auto',
              mb: 3,
              borderRadius: 1,
            }}
          />
          <Typography
            variant="h3"
            fontWeight={700}
            gutterBottom
            textAlign="center"
            sx={{
              fontFamily: '"Noto Sans", sans-serif',
              fontSize: { xs: '2rem', md: '2.8rem' },
              letterSpacing: '-0.02em',
              lineHeight: 1.15,
            }}
          >
            À propos de Global Africa Journal
          </Typography>
          <Typography
            variant="h6"
            textAlign="center"
            sx={{
              fontFamily: '"Noto Sans", sans-serif',
              fontWeight: 300,
              color: TOKEN.gray300,
              maxWidth: 620,
              mx: 'auto',
              mt: 1,
              fontSize: { xs: '1rem', md: '1.15rem' },
              lineHeight: 1.7,
            }}
          >
            Une plateforme de publication scientifique développée par le LASPAD
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 5, md: 8 } }}>

        {/* ─── Global Africa Journal PLATFORM ─── */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 6 },
            borderRadius: 2,
            mb: 4,
            border: `1px solid ${TOKEN.gray300}`,
            bgcolor: TOKEN.white,
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 4 }}>
            <Box sx={{ width: 3, height: 28, bgcolor: TOKEN.gold, borderRadius: 2, flexShrink: 0 }} />
            <TrendingUp sx={{ fontSize: 24, color: TOKEN.gray700 }} />
            <Typography
              variant="h5"
              fontWeight={700}
              sx={{ fontFamily: '"Noto Sans", sans-serif', letterSpacing: '-0.01em' }}
            >
              La plateforme Global Africa Journal
            </Typography>
          </Stack>

          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 5, alignItems: 'center' }}>
            <Box sx={{ flex: 1 }}>
              {[
                'Global Africa Journal est la plateforme numérique développée par le LASPAD pour faciliter la soumission, l\'évaluation et la publication de travaux de recherche scientifique.',
                'Elle permet aux chercheur.e.s de soumettre leurs manuscrits dans notre revue de presse, de bénéficier d\'une évaluation par les pairs rigoureuse et transparente, et de contribuer à la diffusion de savoirs scientifiques de qualité.',
              ].map((text, i) => (
                <Typography
                  key={i}
                  variant="body1"
                  sx={{
                    fontFamily: '"Noto Sans", sans-serif',
                    fontSize: { xs: '0.95rem', md: '1.02rem' },
                    lineHeight: 1.85,
                    mb: 2,
                    color: TOKEN.gray700,
                  }}
                >
                  {text}
                </Typography>
              ))}
              <Typography
                variant="body1"
                sx={{
                  fontFamily: '"Noto Sans", sans-serif',
                  fontSize: { xs: '0.95rem', md: '1.02rem' },
                  lineHeight: 1.85,
                  color: TOKEN.gray700,
                }}
              >
                En phase avec nos valeurs de{' '}
                <Box component="strong" sx={{ color: TOKEN.black, fontWeight: 600 }}>transparence</Box>,
                {' '}de{' '}
                <Box component="strong" sx={{ color: TOKEN.black, fontWeight: 600 }}>science ouverte</Box>
                {' '}et d&apos;
                <Box component="strong" sx={{ color: TOKEN.black, fontWeight: 600 }}>engagement social</Box>,
                {' '}Global Africa Journal incarne notre vision d&apos;une recherche accessible, collaborative et au service des communautés africaines et de la diaspora.
              </Typography>
            </Box>

            <Box
              sx={{
                flex: { xs: '0 0 auto', md: '0 0 220px' },
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                p: 3,
                bgcolor: TOKEN.gray100,
                borderRadius: 2,
              }}
            >
              <Box
                component="img"
                src="/images/logo_santaane.png"
                alt="Global Africa Journal - Plateforme de publication scientifique"
                sx={{ maxWidth: '100%', height: 'auto', maxHeight: { xs: 130, md: 170 } }}
              />
            </Box>
          </Box>
        </Paper>

        {/* ─── LASPAD ─── */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 6 },
            borderRadius: 2,
            mb: 4,
            border: `1px solid ${TOKEN.gray300}`,
            bgcolor: TOKEN.white,
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 5 }}>
            <Typography
              variant="h4"
              fontWeight={700}
              sx={{ fontFamily: '"Noto Sans", sans-serif', letterSpacing: '-0.02em' }}
            >
              Le LASPAD
            </Typography>
            <Box sx={{ width: 40, height: 2, bgcolor: TOKEN.gold, mx: 'auto', my: 1.5 }} />
            <Typography
              variant="subtitle1"
              sx={{
                fontFamily: '"Noto Sans", sans-serif',
                fontWeight: 400,
                color: TOKEN.gray500,
                fontStyle: 'italic',
              }}
            >
              Laboratoire d&apos;Analyse des Sociétés et Pouvoirs / Afrique – Diasporas
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 5, alignItems: 'center' }}>
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="body1"
                sx={{
                  fontFamily: '"Noto Sans", sans-serif',
                  fontSize: { xs: '0.95rem', md: '1.02rem' },
                  lineHeight: 1.85,
                  mb: 2,
                  color: TOKEN.gray700,
                }}
              >
                Créé en 2014, le LASPAD est l&apos;un des laboratoires les plus dynamiques de l&apos;Université Gaston Berger de Saint-Louis au Sénégal (UGB).
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  fontFamily: '"Noto Sans", sans-serif',
                  fontSize: { xs: '0.95rem', md: '1.02rem' },
                  lineHeight: 1.85,
                  mb: 2,
                  color: TOKEN.gray700,
                }}
              >
                Notre axiome,{' '}
                <Box component="strong" sx={{ color: TOKEN.black, fontWeight: 600 }}>
                  la connaissance est le bien collectif ultime
                </Box>
                , nous permet d&apos;impulser une recherche innovante et en phase avec la science citoyenne, la science de la durabilité et la science ouverte.
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  fontFamily: '"Noto Sans", sans-serif',
                  fontSize: { xs: '0.95rem', md: '1.02rem' },
                  lineHeight: 1.85,
                  mb: 4,
                  color: TOKEN.gray700,
                }}
              >
                Pour nous, la recherche doit être impliquée, éthique et orientée vers une priorité absolue :{' '}
                <Box component="strong" sx={{ color: TOKEN.black, fontWeight: 600 }}>
                  la construction de sociétés décentes et conviviales
                </Box>
                . Cela suppose de prendre à bras le corps les défis extrêmement sérieux auxquels les sociétés africaines sont confrontées.
              </Typography>

              <Button
                component="a"
                href="https://laspad.org/"
                target="_blank"
                rel="noopener noreferrer"
                variant="outlined"
                endIcon={<OpenInNew sx={{ fontSize: 16 }} />}
                sx={{
                  fontFamily: '"Noto Sans", sans-serif',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  borderColor: TOKEN.black,
                  color: TOKEN.black,
                  borderRadius: 1,
                  px: 3,
                  py: 1.2,
                  '&:hover': {
                    bgcolor: TOKEN.black,
                    color: TOKEN.white,
                    borderColor: TOKEN.black,
                  },
                  transition: 'all 0.2s ease',
                }}
              >
                Visiter le site du LASPAD
              </Button>
            </Box>

            <Box
              sx={{
                flex: { xs: '0 0 auto', md: '0 0 220px' },
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                p: 3,
                bgcolor: TOKEN.gray100,
                borderRadius: 2,
              }}
            >
              <Box
                component="img"
                src="/images/logo/LASPAD-logo-noir.png"
                alt="LASPAD - Laboratoire d'Analyse des Sociétés et Pouvoirs / Afrique – Diasporas"
                sx={{ maxWidth: '100%', height: 'auto', maxHeight: { xs: 130, md: 170 } }}
              />
            </Box>
          </Box>
        </Paper>

        {/* ─── QUI SOMMES-NOUS ─── */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 6 },
            borderRadius: 2,
            mb: 4,
            border: `1px solid ${TOKEN.gold}44`,
            bgcolor: TOKEN.goldDim,
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 3 }}>
            <Box sx={{ width: 3, height: 28, bgcolor: TOKEN.gold, borderRadius: 2, flexShrink: 0 }} />
            <EmojiObjects sx={{ fontSize: 24, color: TOKEN.gold }} />
            <Typography
              variant="h5"
              fontWeight={700}
              sx={{ fontFamily: '"Noto Sans", sans-serif', letterSpacing: '-0.01em' }}
            >
              Qui sommes-nous ?
            </Typography>
          </Stack>

          {[
            'Une communauté qui partage une cause commune : faire de nos universités non pas seulement des espaces de production du savoir, de sa transmission et sa discussion, mais le lieu ouvert de la définition par nous-mêmes et pour nous-mêmes de notre projet de société.',
          ].map((text, i) => (
            <Typography
              key={i}
              variant="body1"
              sx={{
                fontFamily: '"Noto Sans", sans-serif',
                fontSize: { xs: '0.95rem', md: '1.02rem' },
                lineHeight: 1.85,
                mb: 2,
                color: TOKEN.gray700,
              }}
            >
              {text}
            </Typography>
          ))}

          <Typography
            variant="body1"
            sx={{
              fontFamily: '"Noto Sans", sans-serif',
              fontSize: { xs: '0.95rem', md: '1.02rem' },
              lineHeight: 1.85,
              color: TOKEN.gray700,
            }}
          >
            Nous sommes des enseignant.e.s, des chercheur.e.s, senior.e.s et junior.e.s, des praticien.ne.s de disciplines et secteurs différents convaincus que{' '}
            <Box component="strong" sx={{ color: TOKEN.black, fontWeight: 600 }}>
              la recherche collective et collaborative
            </Box>{' '}
            est seule à même de produire un savoir au service des sociétés humaines et de l&apos;intérêt public.
          </Typography>
        </Paper>

        {/* ─── MISSIONS ─── */}
        <Box sx={{ mb: 6 }}>
          <Box sx={{ textAlign: 'center', mb: 5 }}>
            <Typography
              variant="h4"
              fontWeight={700}
              sx={{ fontFamily: '"Noto Sans", sans-serif', letterSpacing: '-0.02em' }}
            >
              Nos Missions
            </Typography>
            <Box sx={{ width: 40, height: 2, bgcolor: TOKEN.black, mx: 'auto', mt: 1.5 }} />
          </Box>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
            {missions.map((mission, index) => (
              <Box key={index} sx={{ flex: { xs: '1 1 100%', md: '0 0 calc(50% - 12px)' } }}>
                <Paper
                  elevation={0}
                  sx={{
                    p: { xs: 3, md: 4 },
                    height: '100%',
                    borderRadius: 2,
                    border: `1px solid ${TOKEN.gray300}`,
                    bgcolor: TOKEN.white,
                    transition: 'all 0.25s ease',
                    '&:hover': {
                      transform: 'translateY(-3px)',
                      borderColor: TOKEN.black,
                      boxShadow: `0 12px 32px rgba(0,0,0,0.08)`,
                    },
                  }}
                >
                  {/* Numbered badge */}
                  <Stack direction="row" alignItems="flex-start" spacing={2} sx={{ mb: 2 }}>
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
                        flexShrink: 0,
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        fontFamily: '"Noto Sans", sans-serif',
                        letterSpacing: '0.05em',
                      }}
                    >
                      0{index + 1}
                    </Box>
                    <Box sx={{ color: TOKEN.gold, mt: 0.5 }}>{mission.icon}</Box>
                  </Stack>

                  <Typography
                    variant="h6"
                    fontWeight={600}
                    gutterBottom
                    sx={{
                      fontFamily: '"Noto Sans", sans-serif',
                      fontSize: '1rem',
                      letterSpacing: '-0.01em',
                    }}
                  >
                    {mission.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontFamily: '"Noto Sans", sans-serif',
                      color: TOKEN.gray500,
                      lineHeight: 1.75,
                      fontSize: '0.9rem',
                    }}
                  >
                    {mission.description}
                  </Typography>
                </Paper>
              </Box>
            ))}
          </Box>
        </Box>

        {/* ─── VALUES ─── */}
        <Box sx={{ mb: 6 }}>
          <Box sx={{ textAlign: 'center', mb: 5 }}>
            <Typography
              variant="h4"
              fontWeight={700}
              sx={{ fontFamily: '"Noto Sans", sans-serif', letterSpacing: '-0.02em' }}
            >
              Nos Valeurs
            </Typography>
            <Box sx={{ width: 40, height: 2, bgcolor: TOKEN.black, mx: 'auto', mt: 1.5 }} />
          </Box>

          <Stack spacing={0}>
            {values.map((value, index) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  alignItems: 'stretch',
                  gap: 0,
                  borderTop: index === 0 ? `1px solid ${TOKEN.gray300}` : 'none',
                  borderBottom: `1px solid ${TOKEN.gray300}`,
                  transition: 'background 0.2s ease',
                  '&:hover': {
                    bgcolor: TOKEN.white,
                    '& .value-index': { bgcolor: TOKEN.black, color: TOKEN.white },
                  },
                }}
              >
                {/* Left index */}
                <Box
                  className="value-index"
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minWidth: { xs: 48, md: 72 },
                    fontSize: { xs: '0.7rem', md: '0.75rem' },
                    fontWeight: 700,
                    fontFamily: '"Noto Sans", sans-serif',
                    color: TOKEN.gray500,
                    borderRight: `1px solid ${TOKEN.gray300}`,
                    letterSpacing: '0.05em',
                    transition: 'all 0.2s',
                    py: 3,
                  }}
                >
                  0{index + 1}
                </Box>

                {/* Content */}
                <Box sx={{ flex: 1, p: { xs: 3, md: 4 } }}>
                  <Typography
                    variant="h6"
                    fontWeight={600}
                    gutterBottom
                    sx={{
                      fontFamily: '"Noto Sans", sans-serif',
                      fontSize: { xs: '0.95rem', md: '1rem' },
                      letterSpacing: '-0.01em',
                      color: TOKEN.black,
                      mb: 0.5,
                    }}
                  >
                    {value.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontFamily: '"Noto Sans", sans-serif',
                      color: TOKEN.gray500,
                      lineHeight: 1.75,
                      fontSize: '0.88rem',
                    }}
                  >
                    {value.description}
                  </Typography>
                </Box>

                {/* Gold dot accent */}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    px: 3,
                  }}
                >
                  <Box
                    sx={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      bgcolor: TOKEN.gold,
                      opacity: 0.5,
                    }}
                  />
                </Box>
              </Box>
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
              fontFamily: '"Noto Sans", sans-serif',
              color: TOKEN.white,
              letterSpacing: '-0.02em',
              fontSize: { xs: '1.4rem', md: '1.75rem' },
            }}
          >
            Rejoignez notre communauté
          </Typography>
          <Typography
            sx={{
              fontFamily: '"Noto Sans", sans-serif',
              color: TOKEN.gray300,
              mb: 4,
              maxWidth: 520,
              mx: 'auto',
              lineHeight: 1.75,
              fontSize: '0.95rem',
            }}
          >
            Soumettez vos travaux de recherche et contribuez à la production de savoirs émancipateurs
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
            <Link href="/register" style={{ textDecoration: 'none' }}>
              <Button
                variant="contained"
                size="large"
                sx={{
                  fontFamily: '"Noto Sans", sans-serif',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  bgcolor: TOKEN.gold,
                  color: TOKEN.black,
                  borderRadius: 1,
                  px: 4,
                  py: 1.5,
                  '&:hover': { bgcolor: '#c9a440' },
                  boxShadow: 'none',
                }}
              >
                Créer un compte
              </Button>
            </Link>
            <Link href="/guide-soumission" style={{ textDecoration: 'none' }}>
              <Button
                variant="outlined"
                size="large"
                sx={{
                  fontFamily: '"Noto Sans", sans-serif',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  borderColor: TOKEN.white,
                  color: TOKEN.white,
                  borderRadius: 1,
                  px: 4,
                  py: 1.5,
                  '&:hover': {
                    bgcolor: TOKEN.white,
                    color: TOKEN.black,
                    borderColor: TOKEN.white,
                  },
                  transition: 'all 0.2s ease',
                }}
              >
                Guide de soumission
              </Button>
            </Link>
          </Stack>
        </Box>

      </Container>
    </Box>
  );
}