'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  InputAdornment,
  Paper,
  Chip,
  Stack,
  Skeleton,
  Card,
  CardContent,
  CardActionArea,
  IconButton,
  Divider,
  AppBar,
  Toolbar,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from '@mui/material';
import {
  Search,
  Article,
  Person,
  Category,
  ArrowForward,
  CalendarMonth,
  Login,
  Schedule,
  TrendingUp,
  Menu as MenuIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { publicApiService, PublicManuscriptSummary, PublicStats, ActiveTheme } from '@/services/publicApiService';
import dynamic from 'next/dynamic';

const GoogleTranslate = dynamic(() => import('@/components/ui/GoogleTranslate'), { ssr: false });

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

// ─── AppelCard ───
function AppelCard({ theme }: { theme: ActiveTheme }) {
  const [mounted, setMounted] = useState(false);
  const [daysLeft, setDaysLeft] = useState<number | null>(null);
  const [formattedDate, setFormattedDate] = useState<string>('');

  useEffect(() => {
    setMounted(true);
    if (theme.date_limite) {
      const deadline = new Date(theme.date_limite);
      const days = Math.ceil((deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
      setDaysLeft(days);
      setFormattedDate(deadline.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }));
    }
  }, [theme.date_limite]);

  const isUrgent = daysLeft !== null && daysLeft <= 7;

  if (!mounted) {
    return (
      <Card elevation={0} sx={{ height: '100%', border: `1px solid ${TOKEN.gray300}`, borderRadius: 2, bgcolor: TOKEN.white }}>
        <CardContent sx={{ p: 3, height: '100%' }}>
          <Skeleton variant="text" width="60%" height={32} />
          <Skeleton variant="text" width="100%" height={20} sx={{ mt: 2 }} />
          <Skeleton variant="text" width="80%" height={20} />
          <Skeleton variant="rectangular" height={40} sx={{ mt: 3, borderRadius: 1 }} />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      elevation={0}
      sx={{
        height: '100%',
        border: `1px solid`,
        borderColor: isUrgent ? TOKEN.gold : TOKEN.gray300,
        borderRadius: 2,
        bgcolor: TOKEN.white,
        transition: 'all 0.25s ease',
        position: 'relative',
        overflow: 'hidden',
        '&:hover': { transform: 'translateY(-3px)', borderColor: TOKEN.black, boxShadow: `0 10px 28px rgba(0,0,0,0.07)` },
        '&::before': { content: '""', position: 'absolute', top: 0, left: 0, right: 0, height: 2, bgcolor: TOKEN.black, opacity: 0, transition: 'opacity 0.25s' },
        '&:hover::before': { opacity: 1 },
      }}
    >
      <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Urgency badge */}
        {isUrgent && daysLeft !== null && (
          <Chip
            size="small"
            label={`Plus que ${daysLeft} jour${daysLeft > 1 ? 's' : ''} !`}
            sx={{ alignSelf: 'flex-start', mb: 2, fontFamily: fontSans, fontWeight: 700, fontSize: '0.68rem', height: 22, bgcolor: TOKEN.gold, color: TOKEN.white }}
          />
        )}

        {/* Title */}
        <Typography
          variant="h6"
          fontWeight={700}
          gutterBottom
          sx={{ fontFamily: fontSans, fontSize: '0.95rem', letterSpacing: '-0.01em', lineHeight: 1.45, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', color: TOKEN.black }}
        >
          {theme.title}
        </Typography>

        {/* Description */}
        <Typography
          variant="body2"
          sx={{ fontFamily: fontSans, color: TOKEN.gray500, lineHeight: 1.75, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', mb: 3, flex: 1 }}
        >
          {theme.description || 'Aucune description disponible'}
        </Typography>

        <Divider sx={{ borderColor: TOKEN.gray100, mb: 2 }} />

        {/* Deadline */}
        {formattedDate && (
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Stack direction="row" alignItems="center" spacing={1}>
              <Schedule sx={{ fontSize: 16, color: isUrgent ? TOKEN.gold : TOKEN.gray500 }} />
              <Typography variant="body2" sx={{ fontFamily: fontSans, fontWeight: isUrgent ? 600 : 400, color: isUrgent ? TOKEN.gold : TOKEN.gray500, fontSize: '0.8rem' }}>
                Date limite: {formattedDate}
              </Typography>
            </Stack>
          </Stack>
        )}

        {/* CTA */}
        <Link href="/register" style={{ textDecoration: 'none', marginTop: 16 }}>
          <Button
            fullWidth
            variant="contained"
            sx={{ fontFamily: fontSans, fontWeight: 700, fontSize: '0.75rem', letterSpacing: '0.05em', textTransform: 'uppercase', bgcolor: TOKEN.black, color: TOKEN.white, borderRadius: 1, py: 1.2, boxShadow: 'none', '&:hover': { bgcolor: TOKEN.gold, boxShadow: 'none' }, transition: 'background 0.2s ease' }}
          >
            Soumettre un manuscrit
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}

// ─── HomePage ───
export default function HomePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [recentManuscripts, setRecentManuscripts] = useState<PublicManuscriptSummary[]>([]);
  const [stats, setStats] = useState<PublicStats | null>(null);
  const [activeThemes, setActiveThemes] = useState<ActiveTheme[]>([]);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [manuscripts, statsData, themes] = await Promise.all([
          publicApiService.getRecentPublications(6),
          publicApiService.getStats(),
          publicApiService.getActiveThemes(),
        ]);
        setRecentManuscripts(manuscripts);
        setStats(statsData);
        setActiveThemes(themes);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/manuscripts?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/manuscripts');
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('fr-FR', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const truncateText = (text: string | undefined, maxLength: number) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  };

  const menuItems = [
    { label: 'Accueil', path: '/' },
    { label: 'Publications', path: '/manuscripts' },
    { label: 'Appels Ouverts', path: '/appels' },
    { label: 'Guide de soumission', path: '/guide-soumission' },
    { label: 'À propos', path: '/about' },
    { label: 'Contact', path: '/contact' },
    { label: 'Connexion', path: '/login', variant: 'outlined' as const },
  ];

  const handleMobileMenuToggle = () => setMobileMenuOpen(!mobileMenuOpen);

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: TOKEN.offWhite }}>

      {/* ─── HEADER ─── */}
      <AppBar
        position="sticky"
        elevation={0}
        sx={{ bgcolor: TOKEN.white, borderBottom: `1px solid ${TOKEN.gray300}`, color: TOKEN.black }}
      >
        <Container maxWidth="xl">
          <Toolbar
            disableGutters
            sx={{ justifyContent: 'space-between', minHeight: { xs: 56, sm: 64, md: 70 }, py: { xs: 0.5, sm: 1 } }}
          >
            {/* Logo */}
            <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
              <Box
                component="img"
                src="/images/02-GA-Site-Page-Noir.gif"
                alt="Global Africa Journal"
                sx={{ height: { xs: 50, sm: 70, md: 100 }, width: 'auto', py: { xs: 0.5, sm: 1 } }}
              />
            </Link>

            {/* Right side: Nav + Translate + Login */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {/* Desktop Navigation Links */}
              <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 0.5, alignItems: 'center' }}>
                {[
                  { label: 'Publications', path: '/manuscripts' },
                  { label: 'Appels', path: '/appels' },
                  { label: 'Guide', path: '/guide-soumission' },
                  { label: 'À propos', path: '/about' },
                  { label: 'Contact', path: '/contact' },
                ].map((item) => (
                  <Link key={item.path} href={item.path} style={{ textDecoration: 'none' }}>
                    <Button
                      color="inherit"
                      sx={{
                        fontFamily: fontSans,
                        fontWeight: 500,
                        fontSize: '0.82rem',
                        color: TOKEN.gray500,
                        textTransform: 'none',
                        px: 1.5,
                        borderBottom: '2px solid transparent',
                        borderRadius: 0,
                        '&:hover': { color: TOKEN.black, bgcolor: 'transparent', borderBottomColor: TOKEN.gray300 },
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {item.label}
                    </Button>
                  </Link>
                ))}
              </Box>

              {/* Google Translate - visible on all screen sizes */}
              <GoogleTranslate />

              {/* Desktop: Login button */}
              <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                <Link href="/login" style={{ textDecoration: 'none' }}>
                  <Button
                    variant="outlined"
                    startIcon={<Login sx={{ fontSize: 16 }} />}
                    sx={{
                      fontFamily: fontSans,
                      fontWeight: 700,
                      fontSize: '0.78rem',
                      letterSpacing: '0.04em',
                      textTransform: 'uppercase',
                      borderColor: TOKEN.black,
                      color: TOKEN.black,
                      borderRadius: 1,
                      px: 2,
                      py: 0.85,
                      '&:hover': { bgcolor: TOKEN.black, color: TOKEN.white, borderColor: TOKEN.black },
                      transition: 'all 0.2s ease',
                    }}
                  >
                    Connexion
                  </Button>
                </Link>
              </Box>

              {/* Mobile Menu Icon */}
              <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                <IconButton
                  onClick={handleMobileMenuToggle}
                  edge="end"
                  sx={{ color: TOKEN.black, border: `1px solid ${TOKEN.gray300}`, borderRadius: 1, p: 0.75 }}
                >
                  <MenuIcon sx={{ fontSize: 20 }} />
                </IconButton>
              </Box>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* ─── MOBILE DRAWER ─── */}
      <Drawer
        anchor="right"
        open={mobileMenuOpen}
        onClose={handleMobileMenuToggle}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { width: 280, bgcolor: TOKEN.white, borderLeft: `1px solid ${TOKEN.gray300}` },
        }}
      >
        <Box sx={{ p: 2.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${TOKEN.gray100}` }}>
          <Box sx={{ width: 28, height: 2, bgcolor: TOKEN.gold, borderRadius: 1 }} />
          <IconButton onClick={handleMobileMenuToggle} size="small" sx={{ color: TOKEN.gray500 }}>
            <CloseIcon sx={{ fontSize: 20 }} />
          </IconButton>
        </Box>

        <List sx={{ px: 1, py: 2 }}>
          {menuItems.map((item) => (
            <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
              <Link href={item.path} style={{ textDecoration: 'none', width: '100%' }} onClick={handleMobileMenuToggle}>
                <ListItemButton sx={{ borderRadius: 1, px: 2, py: 1.25, '&:hover': { bgcolor: TOKEN.gray100 } }}>
                  <ListItemText
                    primary={
                      <Typography
                        sx={{
                          fontFamily: fontSans,
                          fontWeight: item.variant === 'outlined' ? 700 : 500,
                          fontSize: '0.9rem',
                          color: item.variant === 'outlined' ? TOKEN.black : TOKEN.gray700,
                        }}
                      >
                        {item.label}
                      </Typography>
                    }
                  />
                </ListItemButton>
              </Link>
            </ListItem>
          ))}
        </List>
      </Drawer>

      {/* ─── MAIN CONTENT ─── */}
      <Box component="main" sx={{ flex: 1 }}>

        {/* ─── HERO SECTION ─── */}
        <Box
          sx={{
            bgcolor: TOKEN.black,
            color: TOKEN.white,
            py: { xs: 8, md: 12 },
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              inset: 0,
              backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 39px, rgba(255,255,255,0.03) 40px), repeating-linear-gradient(90deg, transparent, transparent 39px, rgba(255,255,255,0.03) 40px)',
              pointerEvents: 'none',
            },
            '&::after': {
              content: '""',
              position: 'absolute',
              top: '-80px',
              right: '-100px',
              width: '500px',
              height: '500px',
              borderRadius: '50%',
              background: `radial-gradient(circle, ${TOKEN.gold}20 0%, transparent 70%)`,
              pointerEvents: 'none',
            },
          }}
        >
          <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
            <Box textAlign="center" mb={6}>
              <Box sx={{ width: 48, height: 2, bgcolor: TOKEN.gold, mx: 'auto', mb: 3, borderRadius: 1 }} />
              <Typography
                variant="h3"
                component="h1"
                fontWeight={800}
                gutterBottom
                sx={{ fontFamily: fontSans, fontSize: { xs: '2rem', md: '3rem' }, letterSpacing: '-0.03em', lineHeight: 1.1, mb: 2 }}
              >
                Découvrez les Publications Scientifiques
              </Typography>
              <Typography
                variant="h6"
                sx={{ fontFamily: fontSans, fontWeight: 300, opacity: 0.75, maxWidth: 600, mx: 'auto', mb: 5, lineHeight: 1.7, fontSize: { xs: '1rem', md: '1.1rem' } }}
              >
                Accédez à une collection de manuscrits scientifiques évalués par des pairs
              </Typography>

              {/* Search Bar */}
              <Paper
                component="form"
                onSubmit={handleSearch}
                elevation={0}
                sx={{
                  maxWidth: 700,
                  mx: 'auto',
                  display: 'flex',
                  alignItems: 'center',
                  borderRadius: 1,
                  overflow: 'hidden',
                  border: `1px solid ${TOKEN.gray300}`,
                  boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
                }}
              >
                <TextField
                  fullWidth
                  placeholder="Rechercher par titre, mots-clés, auteur..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  variant="outlined"
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <Search sx={{ color: TOKEN.gray500, fontSize: 20 }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            type="submit"
                            size="large"
                            sx={{ bgcolor: TOKEN.gold, borderRadius: 0, color: TOKEN.white, px: 2.5, '&:hover': { bgcolor: '#c9a440' } }}
                          >
                            <ArrowForward />
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      fontFamily: fontSans,
                      bgcolor: TOKEN.white,
                      '& fieldset': { border: 'none' },
                    },
                    '& .MuiOutlinedInput-input': { fontFamily: fontSans, fontSize: '0.9rem', color: TOKEN.black },
                  }}
                />
              </Paper>
            </Box>
          </Container>
        </Box>

        {/* ─── RECENT PUBLICATIONS ─── */}
        <Container maxWidth="xl" sx={{ py: 8 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 5 }}>
            <Box sx={{ width: 3, height: 24, bgcolor: TOKEN.gold, borderRadius: 2, flexShrink: 0 }} />
            <Typography variant="h5" fontWeight={700} sx={{ fontFamily: fontSans, letterSpacing: '-0.02em' }}>
              Publications Récentes
            </Typography>
            <Box sx={{ flex: 1, height: 1, bgcolor: TOKEN.gray300 }} />
            <Link href="/manuscripts" style={{ textDecoration: 'none' }}>
              <Button
                endIcon={<ArrowForward sx={{ fontSize: 15 }} />}
                sx={{
                  fontFamily: fontSans, fontWeight: 700, fontSize: '0.72rem', letterSpacing: '0.06em',
                  textTransform: 'uppercase', color: TOKEN.gray700, border: `1px solid ${TOKEN.gray300}`,
                  borderRadius: 1, px: 2, py: 0.75,
                  '&:hover': { bgcolor: TOKEN.black, color: TOKEN.white, borderColor: TOKEN.black },
                  transition: 'all 0.2s',
                }}
              >
                Voir tout
              </Button>
            </Link>
          </Box>

          {loading ? (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Box key={i} sx={{ flex: { xs: '1 1 100%', lg: '0 0 calc(25% - 18px)' } }}>
                  <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2 }} />
                </Box>
              ))}
            </Box>
          ) : recentManuscripts.length === 0 ? (
            <Paper elevation={0} sx={{ p: 6, textAlign: 'center', border: `1px dashed ${TOKEN.gray300}`, borderRadius: 2, bgcolor: TOKEN.white }}>
              <Box sx={{ width: 60, height: 60, borderRadius: '50%', bgcolor: TOKEN.gray100, display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2 }}>
                <Article sx={{ fontSize: 28, color: TOKEN.gray500 }} />
              </Box>
              <Typography sx={{ fontFamily: fontSans, color: TOKEN.gray500 }}>
                Aucune publication disponible pour le moment
              </Typography>
            </Paper>
          ) : (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
              {recentManuscripts.map((manuscript) => (
                <Box key={manuscript.id} sx={{ flex: { xs: '1 1 100%', lg: '0 0 calc(25% - 18px)' } }}>
                  <Card
                    elevation={0}
                    sx={{
                      height: '100%',
                      border: `1px solid ${TOKEN.gray300}`,
                      borderRadius: 2,
                      bgcolor: TOKEN.white,
                      transition: 'all 0.25s ease',
                      overflow: 'hidden',
                      position: 'relative',
                      '&:hover': { borderColor: TOKEN.black, transform: 'translateY(-3px)', boxShadow: `0 10px 28px rgba(0,0,0,0.07)` },
                      '&::before': { content: '""', position: 'absolute', top: 0, left: 0, right: 0, height: 2, bgcolor: TOKEN.black, opacity: 0, transition: 'opacity 0.25s' },
                      '&:hover::before': { opacity: 1 },
                    }}
                  >
                    <CardActionArea component={Link} href={`/manuscripts/${manuscript.id}`} sx={{ height: '100%' }}>
                      <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                        {/* Appel & Section */}
                        <Stack direction="row" spacing={1} sx={{ mb: 2 }} flexWrap="wrap" gap={0.5}>
                          {manuscript.themeName && (
                            <Chip size="small" label={manuscript.themeName} icon={<Category sx={{ fontSize: '11px !important' }} />}
                              sx={{ fontFamily: fontSans, fontSize: '0.65rem', height: 20, bgcolor: TOKEN.goldDim, border: `1px solid ${TOKEN.gold}44`, color: TOKEN.gray700, '& .MuiChip-icon': { color: TOKEN.gold } }}
                            />
                          )}
                          <Chip size="small" label={manuscript.sectionName}
                            sx={{ fontFamily: fontSans, fontSize: '0.65rem', height: 20, bgcolor: TOKEN.gray100, border: `1px solid ${TOKEN.gray300}`, color: TOKEN.gray700 }}
                          />
                        </Stack>

                        {/* Title */}
                        <Typography variant="subtitle1" fontWeight={700} gutterBottom
                          sx={{ fontFamily: fontSans, fontSize: '0.95rem', letterSpacing: '-0.01em', lineHeight: 1.45, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', color: TOKEN.black }}
                        >
                          {manuscript.title}
                        </Typography>

                        {/* Abstract */}
                        <Typography variant="body2"
                          sx={{ fontFamily: fontSans, color: TOKEN.gray500, lineHeight: 1.75, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', mb: 2, flex: 1 }}
                        >
                          {truncateText(manuscript.abstract, 150)}
                        </Typography>

                        {/* Keywords */}
                        {manuscript.keywords && (
                          <Stack direction="row" spacing={0.5} flexWrap="wrap" gap={0.5} sx={{ mb: 2 }}>
                            {manuscript.keywords.split(',').slice(0, 3).map((keyword, idx) => (
                              <Chip key={idx} label={keyword.trim()} size="small"
                                sx={{ fontFamily: fontSans, fontSize: '0.62rem', height: 18, bgcolor: 'transparent', border: `1px solid ${TOKEN.gray300}`, color: TOKEN.gray700 }}
                              />
                            ))}
                          </Stack>
                        )}

                        <Divider sx={{ borderColor: TOKEN.gray100, my: 1.5 }} />

                        {/* Author & Date */}
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                          <Stack direction="row" alignItems="center" spacing={0.5}>
                            <Person sx={{ fontSize: 14, color: TOKEN.gray500 }} />
                            <Typography sx={{ fontFamily: fontSans, fontSize: '0.72rem', color: TOKEN.gray500 }}>
                              {manuscript.authorName}
                            </Typography>
                          </Stack>
                          <Stack direction="row" alignItems="center" spacing={0.5}>
                            <CalendarMonth sx={{ fontSize: 13, color: TOKEN.gray300 }} />
                            <Typography sx={{ fontFamily: fontSans, fontSize: '0.7rem', color: TOKEN.gray500 }}>
                              {formatDate(manuscript.publishedAt || manuscript.createdAt)}
                            </Typography>
                          </Stack>
                        </Stack>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Box>
              ))}
            </Box>
          )}
        </Container>

        {/* ─── ACTIVE APPELS SECTION ─── */}
        {activeThemes.length > 0 && (
          <Box sx={{ bgcolor: TOKEN.offWhite, borderTop: `1px solid ${TOKEN.gray300}`, borderBottom: `1px solid ${TOKEN.gray300}`, py: 8 }}>
            <Container maxWidth="xl">
              <Box textAlign="center" sx={{ mb: 5 }}>
                <Stack direction="row" alignItems="center" justifyContent="center" spacing={1} sx={{ mb: 2 }}>
                  <TrendingUp sx={{ fontSize: 16, color: TOKEN.gold }} />
                  <Typography sx={{ fontFamily: fontSans, fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: TOKEN.gold }}>
                    Appels à contribution
                  </Typography>
                </Stack>
                <Box sx={{ width: 40, height: 2, bgcolor: TOKEN.gold, mx: 'auto', mb: 3 }} />
                <Typography variant="h4" fontWeight={700} gutterBottom
                  sx={{ fontFamily: fontSans, letterSpacing: '-0.02em', fontSize: { xs: '1.6rem', md: '2rem' } }}
                >
                  Appels Ouverts aux Soumissions
                </Typography>
                <Typography variant="h6" sx={{ fontFamily: fontSans, color: TOKEN.gray500, maxWidth: 700, mx: 'auto', fontWeight: 300, lineHeight: 1.7, fontSize: '0.95rem' }}>
                  Vous avez des travaux de recherche à partager ? Ces thématiques n&apos;attendent que vos contributions !
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                {activeThemes.map((theme) => (
                  <Box key={theme.id} sx={{ flex: { xs: '1 1 100%', lg: '0 0 calc(25% - 18px)' } }}>
                    <AppelCard theme={theme} />
                  </Box>
                ))}
              </Box>

              <Box textAlign="center" sx={{ mt: 5 }}>
                <Link href="/themes" style={{ textDecoration: 'none' }}>
                  <Button
                    variant="outlined"
                    endIcon={<ArrowForward sx={{ fontSize: 16 }} />}
                    sx={{
                      fontFamily: fontSans, fontWeight: 700, fontSize: '0.78rem', letterSpacing: '0.05em',
                      textTransform: 'uppercase', borderColor: TOKEN.black, color: TOKEN.black, borderRadius: 1,
                      px: 4, py: 1.3,
                      '&:hover': { bgcolor: TOKEN.black, color: TOKEN.white, borderColor: TOKEN.black },
                      transition: 'all 0.2s ease',
                    }}
                  >
                    Voir tous les appels
                  </Button>
                </Link>
              </Box>
            </Container>
          </Box>
        )}

        {/* ─── CALL TO ACTION ─── */}
        <Box sx={{ bgcolor: TOKEN.white, borderBottom: `1px solid ${TOKEN.gray300}`, py: 8 }}>
          <Container maxWidth="md" sx={{ textAlign: 'center' }}>
            <Box sx={{ width: 32, height: 2, bgcolor: TOKEN.gold, mx: 'auto', mb: 3 }} />
            <Typography variant="h5" fontWeight={700} gutterBottom
              sx={{ fontFamily: fontSans, letterSpacing: '-0.02em', fontSize: { xs: '1.3rem', md: '1.6rem' } }}
            >
              Vous êtes chercheur ?
            </Typography>
            <Typography sx={{ fontFamily: fontSans, color: TOKEN.gray500, mb: 5, lineHeight: 1.75, fontSize: '0.95rem' }}>
              Soumettez vos manuscrits et bénéficiez d&apos;une évaluation par des pairs experts
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
              <Link href="/register" style={{ textDecoration: 'none' }}>
                <Button
                  variant="contained"
                  size="large"
                  sx={{
                    fontFamily: fontSans, fontWeight: 700, fontSize: '0.82rem', letterSpacing: '0.05em',
                    textTransform: 'uppercase', bgcolor: TOKEN.black, color: TOKEN.white, borderRadius: 1,
                    px: 4, py: 1.5, boxShadow: 'none',
                    '&:hover': { bgcolor: TOKEN.gold, boxShadow: 'none' },
                    transition: 'background 0.2s ease',
                  }}
                >
                  Créer un compte
                </Button>
              </Link>
              <Link href="/manuscripts" style={{ textDecoration: 'none' }}>
                <Button
                  variant="outlined"
                  size="large"
                  sx={{
                    fontFamily: fontSans, fontWeight: 600, fontSize: '0.82rem', letterSpacing: '0.04em',
                    textTransform: 'uppercase', borderColor: TOKEN.gray300, color: TOKEN.gray700, borderRadius: 1,
                    px: 4, py: 1.5,
                    '&:hover': { borderColor: TOKEN.black, color: TOKEN.black, bgcolor: 'transparent' },
                    transition: 'all 0.2s ease',
                  }}
                >
                  Explorer les publications
                </Button>
              </Link>
            </Stack>
          </Container>
        </Box>
      </Box>

      {/* ─── FOOTER ─── */}
      <Box component="footer" sx={{ py: { xs: 3, md: 4 }, bgcolor: TOKEN.black, borderTop: `1px solid rgba(255,255,255,0.06)` }}>
        <Container maxWidth="xl">
          <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }} spacing={2}>
            <Box>
              <Box sx={{ width: 28, height: 2, bgcolor: TOKEN.gold, mb: 1.5, borderRadius: 1 }} />
              <Typography variant="body2" sx={{ fontFamily: fontSans, color: TOKEN.gray500, fontSize: '0.8rem' }}>
                © {mounted ? new Date().getFullYear() : 2024} Global Africa Journal — Plateforme de publication scientifique
              </Typography>
            </Box>
            <Stack direction="row" spacing={3} flexWrap="wrap" justifyContent="center">
              {[
                { label: 'À propos', path: '/about' },
                { label: 'Guide de soumission', path: '/guide-soumission' },
                { label: 'Contact', path: '/contact' },
              ].map((item) => (
                <Link key={item.path} href={item.path} style={{ textDecoration: 'none' }}>
                  <Typography variant="body2" sx={{ fontFamily: fontSans, color: TOKEN.gray500, fontSize: '0.8rem', transition: 'color 0.15s ease', '&:hover': { color: TOKEN.gold } }}>
                    {item.label}
                  </Typography>
                </Link>
              ))}
            </Stack>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}