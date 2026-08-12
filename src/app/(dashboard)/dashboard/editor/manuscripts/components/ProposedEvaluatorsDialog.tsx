'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Chip,
  CircularProgress,
  IconButton,
  Stack,
  TextField,
  Divider,
  Alert,
} from '@mui/material';
import { Close as CloseIcon, PersonAdd as PersonAddIcon, CheckCircle } from '@mui/icons-material';
import { useAlertStore } from '@/stores/alertStore';

interface Proposal {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  status: string;
  proposedByName: string | null;
  hasAccount: boolean;
  accountRoles: string[];
  hasEvaluatorRole: boolean;
}

interface ProposedEvaluatorsDialogProps {
  open: boolean;
  onClose: () => void;
  manuscriptId: number;
  onAssigned?: () => void;
}

const ROLE_LABELS: Record<string, string> = {
  SUPER_ADMIN: 'Super admin',
  EDITOR: 'Éditeur',
  EVALUATOR: 'Évaluateur externe',
  AUTHOR: 'Auteur',
  INTERNAL_EVALUATOR: 'Évaluateur interne',
};

function defaultDeadline(): string {
  const d = new Date();
  d.setDate(d.getDate() + 30);
  return d.toISOString().slice(0, 10); // YYYY-MM-DD
}

export default function ProposedEvaluatorsDialog({
  open,
  onClose,
  manuscriptId,
  onAssigned,
}: ProposedEvaluatorsDialogProps) {
  const { showSuccess, showError } = useAlertStore();
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deadline, setDeadline] = useState<string>(defaultDeadline());
  const [assigningId, setAssigningId] = useState<number | null>(null);

  const loadProposals = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/manuscripts/${manuscriptId}/proposed-evaluators`);
      if (!res.ok) {
        setError('Impossible de charger les propositions.');
        setProposals([]);
        return;
      }
      const data = await res.json();
      const list = Array.isArray(data) ? data : [];
      setProposals(
        list.map((p: any) => ({
          id: p.id,
          firstName: p.firstName ?? p.first_name ?? '',
          lastName: p.lastName ?? p.last_name ?? '',
          email: p.email ?? '',
          status: p.status ?? 'proposed',
          proposedByName: p.proposedByName ?? p.proposed_by_name ?? null,
          hasAccount: Boolean(p.hasAccount ?? p.has_account),
          accountRoles: p.accountRoles ?? p.account_roles ?? [],
          hasEvaluatorRole: Boolean(p.hasEvaluatorRole ?? p.has_evaluator_role),
        }))
      );
    } catch {
      setError('Erreur réseau lors du chargement des propositions.');
      setProposals([]);
    } finally {
      setLoading(false);
    }
  }, [manuscriptId]);

  useEffect(() => {
    if (open) {
      setDeadline(defaultDeadline());
      loadProposals();
    }
  }, [open, loadProposals]);

  const handleAssign = async (proposal: Proposal) => {
    if (!deadline) {
      showError("Veuillez choisir une date limite d'évaluation.");
      return;
    }
    setAssigningId(proposal.id);
    try {
      const res = await fetch(
        `/api/manuscripts/${manuscriptId}/proposed-evaluators/${proposal.id}/assign`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ evaluationDeadline: new Date(deadline).toISOString() }),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.detail || data?.message || "Échec de l'affectation");
      }
      let msg = 'Évaluateur externe affecté et invité.';
      if (data?.accountCreated) {
        msg = 'Compte créé, évaluateur affecté et invité par email.';
      } else if (data?.roleAdded) {
        msg = "Rôle évaluateur ajouté, évaluateur affecté et invité.";
      }
      showSuccess(msg);
      await loadProposals();
      onAssigned?.();
    } catch (err) {
      showError(err instanceof Error ? err.message : "Erreur lors de l'affectation");
    } finally {
      setAssigningId(null);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        Évaluateurs externes proposés
        <IconButton onClick={onClose} size="small">
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Propositions faites par l&apos;évaluateur interne. Affecter crée le compte si nécessaire
          (rôles Auteur + Évaluateur externe) et envoie l&apos;invitation.
        </Typography>

        <TextField
          label="Date limite d'évaluation"
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          fullWidth
          size="small"
          InputLabelProps={{ shrink: true }}
          sx={{ mb: 2 }}
        />

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
            <CircularProgress size={24} />
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : proposals.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            Aucune proposition pour ce manuscrit.
          </Typography>
        ) : (
          <Stack divider={<Divider flexItem />} spacing={2}>
            {proposals.map((p) => {
              const isAssigned = p.status === 'assigned' || p.status === 'converted';
              return (
                <Box key={p.id}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 2 }}>
                    <Box sx={{ minWidth: 0 }}>
                      <Typography variant="subtitle2">
                        {`${p.firstName} ${p.lastName}`.trim() || p.email}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ wordBreak: 'break-all' }}>
                        {p.email}
                      </Typography>
                      {p.proposedByName && (
                        <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
                          Proposé par : {p.proposedByName}
                        </Typography>
                      )}
                      <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {p.hasAccount ? (
                          <>
                            <Chip label="Compte existant" size="small" color="info" variant="outlined" />
                            {p.hasEvaluatorRole ? (
                              <Chip label="Déjà évaluateur externe" size="small" color="success" variant="outlined" />
                            ) : (
                              <Chip label="Rôle évaluateur à ajouter" size="small" color="warning" variant="outlined" />
                            )}
                            {p.accountRoles.map((r) => (
                              <Chip key={r} label={ROLE_LABELS[r] || r} size="small" variant="outlined" />
                            ))}
                          </>
                        ) : (
                          <Chip label="Aucun compte — sera créé" size="small" color="default" variant="outlined" />
                        )}
                      </Box>
                    </Box>
                    <Box sx={{ flexShrink: 0 }}>
                      {isAssigned ? (
                        <Chip icon={<CheckCircle />} label="Affecté" size="small" color="success" />
                      ) : (
                        <Button
                          variant="contained"
                          size="small"
                          startIcon={
                            assigningId === p.id ? <CircularProgress size={16} color="inherit" /> : <PersonAddIcon />
                          }
                          disabled={assigningId !== null}
                          onClick={() => handleAssign(p)}
                        >
                          {assigningId === p.id ? 'Affectation...' : 'Affecter'}
                        </Button>
                      )}
                    </Box>
                  </Box>
                </Box>
              );
            })}
          </Stack>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Fermer</Button>
      </DialogActions>
    </Dialog>
  );
}