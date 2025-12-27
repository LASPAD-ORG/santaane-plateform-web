'use client';

import {
  Box,
  Container,
  Typography,
  Paper,
  Stack,
  Divider,
  Button,
  Chip,
} from '@mui/material';
import {
  School,
  MenuBook,
  Groups,
  Science,
  OpenInNew,
  Verified,
  TrendingUp,
  EmojiObjects,
} from '@mui/icons-material';
import Link from 'next/link';

export default function AboutPage() {
  const missions = [
    {
      icon: <Science sx={{ fontSize: 40 }} />,
      title: 'Recherche et publication',
      description:
        'Co-production et publication de savoirs émancipateurs et protecteurs pour l\'Afrique, la diaspora et le monde.',
    },
    {
      icon: <School sx={{ fontSize: 40 }} />,
      title: 'Formation',
      description:
        'Formation de démocrates et panafricains avertis, innovateurs sociaux et professionnels dévoués à la délivrance de services publics de qualité.',
    },
    {
      icon: <Verified sx={{ fontSize: 40 }} />,
      title: 'Expertise',
      description:
        'Accompagnement des décideurs pour élaborer, mettre en œuvre et évaluer des politiques publiques efficientes et équitables.',
    },
    {
      icon: <Groups sx={{ fontSize: 40 }} />,
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
              À propos de Santaane
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.95, maxWidth: 700, mx: 'auto' }}>
              Une plateforme de publication scientifique développée par le LASPAD
            </Typography>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
        {/* LASPAD Presentation */}
        <Paper sx={{ p: { xs: 3, md: 5 }, borderRadius: 3, mb: 4 }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Box
              component="img"
              src="/images/logo_laspad.png"
              alt="LASPAD"
              sx={{
                maxWidth: '100%',
                height: 'auto',
                maxHeight: 150,
                mb: 3,
              }}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
            <Chip
              icon={<MenuBook />}
              label="Laboratoire Panafricain"
              sx={{
                bgcolor: '#ff9d00',
                color: 'white',
                fontWeight: 600,
                mb: 2,
              }}
            />
          </Box>

          <Typography variant="h4" fontWeight="bold" gutterBottom textAlign="center">
            Le LASPAD
          </Typography>
          <Typography variant="h6" color="primary" gutterBottom textAlign="center" sx={{ mb: 3 }}>
            Laboratoire d&apos;Analyse des Sociétés et Pouvoirs / Afrique – Diasporas
          </Typography>

          <Typography variant="body1" paragraph sx={{ fontSize: { xs: '0.95rem', md: '1.05rem' }, lineHeight: 1.8 }}>
            Créé en 2014, le LASPAD est l&apos;un des laboratoires les plus dynamiques de l&apos;Université Gaston
            Berger de Saint-Louis au Sénégal (UGB).
          </Typography>

          <Typography variant="body1" paragraph sx={{ fontSize: { xs: '0.95rem', md: '1.05rem' }, lineHeight: 1.8 }}>
            Notre axiome, <strong>la connaissance est le bien collectif ultime</strong>, nous permet d&apos;impulser une
            recherche innovante et en phase avec la science citoyenne, la science de la durabilité et la science
            ouverte.
          </Typography>

          <Typography variant="body1" paragraph sx={{ fontSize: { xs: '0.95rem', md: '1.05rem' }, lineHeight: 1.8 }}>
            Pour nous, la recherche doit être impliquée, éthique et orientée vers une priorité absolue :{' '}
            <strong>la construction de sociétés décentes et conviviales</strong>. Cela suppose de prendre à bras le
            corps les défis extrêmement sérieux auxquels les sociétés africaines sont confrontées.
          </Typography>

          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Button
              component="a"
              href="https://laspad.org/"
              target="_blank"
              rel="noopener noreferrer"
              variant="outlined"
              endIcon={<OpenInNew />}
              sx={{
                borderColor: '#59a498',
                color: '#59a498',
                '&:hover': {
                  borderColor: '#59a498',
                  bgcolor: 'rgba(89, 164, 152, 0.08)',
                },
                px: 3,
                py: 1.5,
              }}
            >
              Visiter le site du LASPAD
            </Button>
          </Box>
        </Paper>

        {/* Qui sommes-nous */}
        <Paper sx={{ p: { xs: 3, md: 5 }, borderRadius: 3, mb: 4, bgcolor: '#fff7ed' }}>
          <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
            <EmojiObjects sx={{ fontSize: 40, color: '#ff9d00' }} />
            <Typography variant="h5" fontWeight="bold">
              Qui sommes-nous ?
            </Typography>
          </Stack>

          <Typography variant="body1" paragraph sx={{ fontSize: { xs: '0.95rem', md: '1.05rem' }, lineHeight: 1.8 }}>
            Une communauté qui partage une cause commune : faire de nos universités non pas seulement des espaces de
            production du savoir, de sa transmission et sa discussion, mais le lieu ouvert de la définition par
            nous-mêmes et pour nous-mêmes de notre projet de société.
          </Typography>

          <Typography variant="body1" paragraph sx={{ fontSize: { xs: '0.95rem', md: '1.05rem' }, lineHeight: 1.8 }}>
            Nous sommes des enseignant.e.s, des chercheur.e.s, senior.e.s et junior.e.s, des praticien.ne.s de
            disciplines et secteurs différents convaincus que{' '}
            <strong>la recherche collective et collaborative</strong> est seule à même de produire un savoir au service
            des sociétés humaines et de l&apos;intérêt public.
          </Typography>
        </Paper>

        {/* Santaane Platform */}
        <Paper sx={{ p: { xs: 3, md: 5 }, borderRadius: 3, mb: 4 }}>
          <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
            <TrendingUp sx={{ fontSize: 40, color: '#59a498' }} />
            <Typography variant="h5" fontWeight="bold">
              La plateforme Santaane
            </Typography>
          </Stack>

          <Typography variant="body1" paragraph sx={{ fontSize: { xs: '0.95rem', md: '1.05rem' }, lineHeight: 1.8 }}>
            Santaane est la plateforme numérique développée par le LASPAD pour faciliter la soumission, l&apos;évaluation
            et la publication de travaux de recherche scientifique.
          </Typography>

          <Typography variant="body1" paragraph sx={{ fontSize: { xs: '0.95rem', md: '1.05rem' }, lineHeight: 1.8 }}>
            Elle permet aux chercheur.e.s de soumettre leurs manuscrits dans notre revue de presse, de bénéficier
            d&apos;une évaluation par les pairs rigoureuse et transparente, et de contribuer à la diffusion de savoirs
            scientifiques de qualité.
          </Typography>

          <Typography variant="body1" sx={{ fontSize: { xs: '0.95rem', md: '1.05rem' }, lineHeight: 1.8 }}>
            En phase avec nos valeurs de <strong>transparence</strong>, de <strong>science ouverte</strong> et
            d&apos;<strong>engagement social</strong>, Santaane incarne notre vision d&apos;une recherche accessible,
            collaborative et au service des communautés africaines et de la diaspora.
          </Typography>
        </Paper>

        {/* Missions */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom textAlign="center" sx={{ mb: 4 }}>
            Nos Missions
          </Typography>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
            {missions.map((mission, index) => (
              <Box key={index} sx={{ flex: { xs: '1 1 100%', md: '0 0 calc(50% - 12px)' } }}>
                <Paper
                  sx={{
                    p: 3,
                    height: '100%',
                    borderRadius: 2,
                    transition: 'all 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 30px rgba(89, 164, 152, 0.15)',
                    },
                  }}
                >
                  <Box sx={{ color: '#59a498', mb: 2 }}>{mission.icon}</Box>
                  <Typography variant="h6" fontWeight="600" gutterBottom>
                    {mission.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                    {mission.description}
                  </Typography>
                </Paper>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Values */}
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom textAlign="center" sx={{ mb: 4 }}>
            Nos Valeurs
          </Typography>

          <Stack spacing={2}>
            {values.map((value, index) => (
              <Paper key={index} sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h6" fontWeight="600" gutterBottom color="primary">
                  {value.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                  {value.description}
                </Typography>
              </Paper>
            ))}
          </Stack>
        </Box>

        {/* CTA */}
        <Box sx={{ textAlign: 'center', mt: 6, p: 4, bgcolor: 'white', borderRadius: 3 }}>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Rejoignez notre communauté
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 3, maxWidth: 600, mx: 'auto' }}>
            Soumettez vos travaux de recherche et contribuez à la production de savoirs émancipateurs
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
            <Link href="/guide-soumission" style={{ textDecoration: 'none' }}>
              <Button variant="outlined" size="large" sx={{ px: 4 }}>
                Guide de soumission
              </Button>
            </Link>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}
