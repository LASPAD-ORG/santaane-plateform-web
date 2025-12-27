'use client';

import { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Avatar,
  Pagination,
  IconButton,
  Tooltip,
} from '@mui/material';
import { Add, Email, CheckCircle, Cancel } from '@mui/icons-material';
import { useEvaluators } from './hooks/useEvaluators';
import CreateEvaluatorDialog from './components/CreateEvaluatorDialog';
import PageHeader from '@/components/ui/PageHeader';

export default function EvaluatorsPage() {
  const [page, setPage] = useState(1);
  const [openDialog, setOpenDialog] = useState(false);
  const pageSize = 20;

  const { evaluators, total, loading, refetch } = useEvaluators(page, pageSize);

  const totalPages = Math.ceil(total / pageSize);

  const handlePageChange = (_: unknown, value: number) => {
    setPage(value);
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleSuccess = () => {
    refetch();
  };

  if (loading && evaluators.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}

           <PageHeader
                       title={`Gestion des évaluateurs`}
                       subtitle={`${total} évaluateur${total > 1 ? 's' : ''} au total`}
                      action={{
                                       label: 'Ajouter un Évaluateur',
                                       icon: <Add />,
                                       onClick: () => handleOpenDialog(),
                                     }}

                     />
                     

      {/* Table */}
      <Card>
        <CardContent sx={{ p: 0 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Évaluateur</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Institution</TableCell>
                  <TableCell>Poste</TableCell>
                  <TableCell>ORCID</TableCell>
                  <TableCell align="center">Statut</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {evaluators.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                      <Typography variant="body1" color="text.secondary">
                        Aucun évaluateur trouvé
                      </Typography>
                      <Button
                        variant="outlined"
                        startIcon={<Add />}
                        onClick={handleOpenDialog}
                        sx={{ mt: 2 }}
                      >
                        Créer le premier évaluateur
                      </Button>
                    </TableCell>
                  </TableRow>
                ) : (
                  evaluators.map((evaluator) => (
                    <TableRow key={evaluator.id} hover>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={2}>
                          <Avatar src={evaluator.profilePhoto} alt={evaluator.fullName}>
                            {evaluator.fullName.charAt(0)}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" fontWeight="500">
                              {evaluator.fullName}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              ID: {evaluator.id}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={1}>
                          <Email fontSize="small" color="action" />
                          <Typography variant="body2">{evaluator.email}</Typography>
                          {evaluator.emailVerified && (
                            <Tooltip title="Email vérifié">
                              <CheckCircle fontSize="small" color="success" />
                            </Tooltip>
                          )}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {evaluator.institution || '-'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {evaluator.position || '-'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontFamily="monospace" fontSize="0.85rem">
                          {evaluator.orcidId || '-'}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={evaluator.isActive ? 'Actif' : 'Inactif'}
                          color={evaluator.isActive ? 'success' : 'default'}
                          size="small"
                        />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          {totalPages > 1 && (
            <Box display="flex" justifyContent="center" p={3}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
                size="large"
              />
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Create Dialog */}
      <CreateEvaluatorDialog
        open={openDialog}
        onClose={handleCloseDialog}
        onSuccess={handleSuccess}
      />
    </Box>
  );
}
