'use client';

import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import ArticleIcon from '@mui/icons-material/Article';
import { useFetchManuscrits } from './fetchers/useFetchManuscrits';
import { useAssignReviewer, useAssignMentor } from './fetchers/useCreateManuscrit';
import { ManuscritCard } from './components/ManuscritCard';

export default function GestionManuscritsPage() {
  const { data: manuscrits, loading, fetch, refresh } = useFetchManuscrits();
  const { assign: assignReviewer, loading: assigningReviewer } = useAssignReviewer();
  const { assign: assignMentor, loading: assigningMentor } = useAssignMentor();

  const [assignReviewerDialogOpen, setAssignReviewerDialogOpen] = useState(false);
  const [assignMentorDialogOpen, setAssignMentorDialogOpen] = useState(false);
  const [selectedManuscrit, setSelectedManuscrit] = useState<any>(null);
  const [reviewerEmail, setReviewerEmail] = useState('');
  const [reviewerDueDate, setReviewerDueDate] = useState('');
  const [mentorEmail, setMentorEmail] = useState('');

  useEffect(() => {
    fetch();
  }, []);

  const handleOpenAssignReviewer = (manuscrit: any) => {
    setSelectedManuscrit(manuscrit);
    setAssignReviewerDialogOpen(true);
    setReviewerEmail('');
    setReviewerDueDate('');
  };

  const handleCloseAssignReviewer = () => {
    setAssignReviewerDialogOpen(false);
    setSelectedManuscrit(null);
  };

  const handleSubmitAssignReviewer = async () => {
    const success = await assignReviewer(
      selectedManuscrit?.id,
      reviewerEmail,
      reviewerDueDate
    );
    if (success) {
      handleCloseAssignReviewer();
      refresh();
    }
  };

  const handleOpenAssignMentor = (manuscrit: any) => {
    setSelectedManuscrit(manuscrit);
    setAssignMentorDialogOpen(true);
    setMentorEmail('');
  };

  const handleCloseAssignMentor = () => {
    setAssignMentorDialogOpen(false);
    setSelectedManuscrit(null);
  };

  const handleSubmitAssignMentor = async () => {
    const success = await assignMentor(selectedManuscrit?.id, mentorEmail);
    if (success) {
      handleCloseAssignMentor();
      refresh();
    }
  };

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" component="h1">
            Gestion des Manuscrits
          </Typography>
          <Typography variant="body2" color="text.secondary" mt={1}>
            Attribuez des évaluateurs et mentors aux manuscrits du laboratoire
          </Typography>
        </Box>
        <Typography variant="h6" color="text.secondary">
          {manuscrits?.length || 0} manuscrit{manuscrits && manuscrits.length > 1 ? 's' : ''}
        </Typography>
      </Stack>

      {loading && (
        <Typography variant="body1" color="text.secondary">
          Chargement...
        </Typography>
      )}

      {!loading && manuscrits && manuscrits.length === 0 && (
        <Card sx={{ p: 6, textAlign: 'center' }}>
          <ArticleIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            Aucun manuscrit trouvé
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Aucun manuscrit dans votre laboratoire pour le moment.
          </Typography>
        </Card>
      )}

      {!loading && manuscrits && manuscrits.length > 0 && (
        <Grid container spacing={3}>
          {manuscrits.map((manuscrit) => (
            <Grid item xs={12} md={6} lg={4} key={manuscrit.id}>
              <ManuscritCard
                manuscrit={manuscrit}
                onAssignReviewer={() => handleOpenAssignReviewer(manuscrit)}
                onAssignMentor={() => handleOpenAssignMentor(manuscrit)}
              />
            </Grid>
          ))}
        </Grid>
      )}

      {/* Modal d'attribution d'évaluateur */}
      <Dialog
        open={assignReviewerDialogOpen}
        onClose={handleCloseAssignReviewer}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Attribuer un évaluateur - {selectedManuscrit?.title}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 2 }}>
            <TextField
              label="Email de l'évaluateur"
              fullWidth
              required
              value={reviewerEmail}
              onChange={(e) => setReviewerEmail(e.target.value)}
              placeholder="evaluateur@example.com"
              helperText="Entrez l'email d'un évaluateur avec le rôle EVALUATOR"
            />

            <TextField
              label="Date limite (optionnel)"
              type="date"
              fullWidth
              value={reviewerDueDate}
              onChange={(e) => setReviewerDueDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              helperText="Date limite pour compléter l'évaluation"
            />

            {selectedManuscrit?.reviewAssignments &&
              selectedManuscrit.reviewAssignments.length > 0 && (
                <Box>
                  <Typography variant="subtitle2" gutterBottom>
                    Évaluateurs déjà assignés ({selectedManuscrit.reviewAssignments.length})
                  </Typography>
                  {selectedManuscrit.reviewAssignments.map((review: any) => (
                    <Card key={review.id} sx={{ p: 1.5, mb: 1, bgcolor: 'grey.50' }}>
                      <Typography variant="body2">
                        {review.reviewerName} - {review.status}
                      </Typography>
                    </Card>
                  ))}
                </Box>
              )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAssignReviewer}>Annuler</Button>
          <Button
            onClick={handleSubmitAssignReviewer}
            variant="contained"
            disabled={assigningReviewer || !reviewerEmail}
          >
            Attribuer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal d'attribution de mentor */}
      <Dialog
        open={assignMentorDialogOpen}
        onClose={handleCloseAssignMentor}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Attribuer un mentor - {selectedManuscrit?.title}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 2 }}>
            <TextField
              label="Email du mentor"
              fullWidth
              required
              value={mentorEmail}
              onChange={(e) => setMentorEmail(e.target.value)}
              placeholder="mentor@example.com"
              helperText="Entrez l'email d'un chercheur avec le rôle MENTOR"
            />

            {selectedManuscrit?.mentorships &&
              selectedManuscrit.mentorships.length > 0 && (
                <Box>
                  <Typography variant="subtitle2" gutterBottom>
                    Mentors déjà assignés ({selectedManuscrit.mentorships.length})
                  </Typography>
                  {selectedManuscrit.mentorships.map((mentorship: any) => (
                    <Card key={mentorship.id} sx={{ p: 1.5, mb: 1, bgcolor: 'grey.50' }}>
                      <Typography variant="body2">
                        {mentorship.mentorName} - {mentorship.status}
                      </Typography>
                    </Card>
                  ))}
                </Box>
              )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAssignMentor}>Annuler</Button>
          <Button
            onClick={handleSubmitAssignMentor}
            variant="contained"
            disabled={assigningMentor || !mentorEmail}
          >
            Attribuer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
