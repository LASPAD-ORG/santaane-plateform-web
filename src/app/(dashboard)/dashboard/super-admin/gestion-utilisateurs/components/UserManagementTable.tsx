'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  Chip,
  Avatar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Tooltip,
  Switch,
  FormControlLabel,
  Card,
  CardContent,
  Divider,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  VpnKey as VpnKeyIcon,
  Block as BlockIcon,
  CheckCircle as CheckCircleIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Business as BusinessIcon,
  School as SchoolIcon,
  AdminPanelSettings as AdminPanelSettingsIcon,
  People as PeopleIcon,
  PersonAdd as PersonAddIcon,
} from '@mui/icons-material';
import { useState, useEffect } from 'react';
import { User, Pagination } from '../fetchers/useFetchGestionUtilisateurs';
import { ROLE_CONFIGS } from '@/config/roles';
import { getStatusLabel, getStatusColor } from '../helpers/formatters';
import { useAuthStore } from '@/stores/authStore';
import { UserRole } from '@/types/auth';

// Utility functions for date formatting
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

const formatDateTime = (dateString?: string) => {
  if (!dateString) return 'Jamais';
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

interface UserManagementTableProps {
  users: User[];
  pagination: Pagination;
  onPaginationChange: (page: number, size: number) => void;
  loading: boolean;
  onEditUser: (userId: string) => void;
  onDeleteUser: (userId: string) => void;
  onToggleStatus: (userId: string, currentStatus: boolean) => void;
  onResetPassword: (userId: string) => void;
}

interface ActionMenuProps {
  user: User;
  onEditUser: (userId: string) => void;
  onDeleteUser: (userId: string) => void;
  onToggleStatus: (userId: string, currentStatus: boolean) => void;
  onResetPassword: (userId: string) => void;
}

function ActionMenu({ 
  user, 
  onEditUser, 
  onDeleteUser, 
  onToggleStatus, 
  onResetPassword
}: ActionMenuProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const { user: currentUser } = useAuthStore();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    onEditUser(user.id);
    handleClose();
  };

  const handleToggleStatus = () => {
    onToggleStatus(user.id, user.isActive);
    handleClose();
  };

  const handleResetPassword = () => {
    onResetPassword(user.id);
    handleClose();
  };

  const handleDelete = () => {
    onDeleteUser(user.id);
    handleClose();
  };

  return (
    <>
      <IconButton onClick={handleClick} size="small">
        <MoreVertIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={handleEdit}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Modifier</ListItemText>
        </MenuItem>

        <MenuItem onClick={handleToggleStatus}>
          <ListItemIcon>
            {user.isActive ? (
              <BlockIcon fontSize="small" />
            ) : (
              <CheckCircleIcon fontSize="small" />
            )}
          </ListItemIcon>
          <ListItemText>
            {user.isActive ? 'Désactiver' : 'Activer'}
          </ListItemText>
        </MenuItem>

        <MenuItem onClick={handleResetPassword}>
          <ListItemIcon>
            <VpnKeyIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Réinitialiser mot de passe</ListItemText>
        </MenuItem>

        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Supprimer</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
}

function UserAvatar({ user }: { user: User }) {
  const initials = `${user.prenom.charAt(0)}${user.nom.charAt(0)}`.toUpperCase();

  return (
    <Avatar
      src={user.avatar}
      alt={`${user.prenom} ${user.nom}`}
      sx={{
        width: 40,
        height: 40,
        bgcolor: user.avatar ? 'transparent' : 'primary.main',
      }}
    >
      {!user.avatar && initials}
    </Avatar>
  );
}

function StatusChip({ isActive }: { isActive: boolean }) {
  return (
    <Chip
      label={getStatusLabel(isActive)}
      sx={{
        bgcolor: getStatusColor(isActive) + '20',
        color: getStatusColor(isActive),
        borderColor: getStatusColor(isActive) + '40',
        fontWeight: 600,
      }}
      size="small"
      variant="outlined"
    />
  );
}

function RoleChips({ roles }: { roles: string[] }) {
  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
      {roles.map((role) => (
        <Chip
          key={role}
          label={role}
          size="small"
          style={{
            backgroundColor: ((ROLE_CONFIGS as any)[role]?.color || '#757575') + '20',
            color: (ROLE_CONFIGS as any)[role]?.color || '#757575',
            border: `1px solid ${(ROLE_CONFIGS as any)[role]?.color || '#757575'}40`,
          }}
        />
      ))}
    </Box>
  );
}

export default function UserManagementTable({
  users,
  pagination,
  onPaginationChange,
  loading,
  onEditUser,
  onDeleteUser,
  onToggleStatus,
  onResetPassword,
}: UserManagementTableProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleChangePage = (event: unknown, newPage: number) => {
    onPaginationChange(newPage, pagination.size);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    onPaginationChange(0, parseInt(event.target.value, 10));
  };

  // Mobile Card View
  if (isMobile) {
    return (
      <Paper
        elevation={0}
        sx={{
          borderRadius: 4,
          border: '1px solid',
          borderColor: 'divider',
          overflow: 'hidden',
          bgcolor: 'background.paper'
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 2 }}>
          {loading && users.length === 0 ? (
            // Skeleton Loading Cards
            Array.from(new Array(5)).map((_, index) => (
              <Card key={index} sx={{ border: '1px solid', borderColor: 'divider' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                    <Box sx={{ width: 48, height: 48, borderRadius: '50%', bgcolor: 'grey.100' }} />
                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ width: '60%', height: 16, bgcolor: 'grey.100', mb: 1, borderRadius: 1 }} />
                      <Box sx={{ width: '40%', height: 12, bgcolor: 'grey.100', borderRadius: 1 }} />
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            ))
          ) : users.length > 0 ? (
            users.map((user) => (
              <Card
                key={user.id}
                sx={{
                  border: '1px solid',
                  borderColor: 'divider',
                  '&:hover': {
                    borderColor: 'primary.main',
                    boxShadow: 1
                  }
                }}
              >
                <CardContent sx={{ p: 2 }}>
                  {/* Header: Avatar + Name + Actions */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1, minWidth: 0 }}>
                      <UserAvatar user={user} />
                      <Box sx={{ minWidth: 0, flex: 1 }}>
                        <Typography variant="subtitle2" fontWeight={700} noWrap>
                          {user.prenom} {user.nom}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" noWrap>
                          {user.email}
                        </Typography>
                      </Box>
                    </Box>
                    <ActionMenu
                      user={user}
                      onEditUser={onEditUser}
                      onDeleteUser={onDeleteUser}
                      onToggleStatus={onToggleStatus}
                      onResetPassword={onResetPassword}
                    />
                  </Box>

                  <Divider sx={{ my: 1.5 }} />

                  {/* Info Grid */}
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    {/* Contact */}
                    {user.telephone && (
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="caption" color="text.secondary">
                          Téléphone:
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <PhoneIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                          <Typography variant="body2">{user.telephone}</Typography>
                        </Box>
                      </Box>
                    )}

                    {/* Roles */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
                      <Typography variant="caption" color="text.secondary">
                        Rôles:
                      </Typography>
                      <RoleChips roles={user.roles} />
                    </Box>

                    {/* Status */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="caption" color="text.secondary">
                        Statut:
                      </Typography>
                      <StatusChip isActive={user.isActive} />
                    </Box>

                    {/* Laboratoire */}
                    {user.laboratoire && (
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="caption" color="text.secondary">
                          Laboratoire:
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <BusinessIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                          <Typography variant="body2" noWrap sx={{ maxWidth: 150 }}>
                            {user.laboratoire}
                          </Typography>
                        </Box>
                      </Box>
                    )}

                    {/* Specialite */}
                    {user.specialite && (
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="caption" color="text.secondary">
                          Spécialité:
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <SchoolIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                          <Typography variant="body2" noWrap sx={{ maxWidth: 150 }}>
                            {user.specialite}
                          </Typography>
                        </Box>
                      </Box>
                    )}
                  </Box>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card sx={{ border: '1px solid', borderColor: 'divider' }}>
              <CardContent sx={{ py: 8, textAlign: 'center' }}>
                <Box sx={{ color: 'text.disabled', mb: 2 }}>
                  <PeopleIcon sx={{ fontSize: 48, opacity: 0.2 }} />
                </Box>
                <Typography variant="subtitle1" fontWeight={700}>
                  Aucun utilisateur trouvé
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Essayez de modifier vos filtres ou créez un nouvel utilisateur.
                </Typography>
              </CardContent>
            </Card>
          )}
        </Box>

        <Divider />

        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={pagination.total}
          rowsPerPage={pagination.size}
          page={pagination.page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Lignes par page:"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} sur ${count !== -1 ? count : `plus de ${to}`}`
          }
        />
      </Paper>
    );
  }

  // Desktop Table View
  return (
    <TableContainer
      component={Paper}
      elevation={0}
      sx={{
        borderRadius: 4,
        border: '1px solid',
        borderColor: 'divider',
        overflow: 'hidden',
        bgcolor: 'background.paper'
      }}
    >
      <Table sx={{ minWidth: 800 }}>
        <TableHead>
          <TableRow sx={{ bgcolor: 'grey.50' }}>
            <TableCell sx={{ fontWeight: 700, color: 'text.secondary', py: 2.5 }}>Utilisateur</TableCell>
            <TableCell sx={{ fontWeight: 700, color: 'text.secondary', py: 2.5 }}>Contact</TableCell>
            <TableCell sx={{ fontWeight: 700, color: 'text.secondary', py: 2.5 }}>Rôles</TableCell>
            <TableCell sx={{ fontWeight: 700, color: 'text.secondary', py: 2.5 }}>Statut</TableCell>
            <TableCell sx={{ fontWeight: 700, color: 'text.secondary', py: 2.5 }}>Laboratoire</TableCell>
            <TableCell sx={{ fontWeight: 700, color: 'text.secondary', py: 2.5 }}>Spécialité</TableCell>
            <TableCell align="right" sx={{ fontWeight: 700, color: 'text.secondary', py: 2.5 }}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loading && users.length === 0 ? (
            // Skeleton Loading Rows
            Array.from(new Array(5)).map((_, index) => (
              <TableRow key={index}>
                <TableCell colSpan={7}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 1 }}>
                    <Box sx={{ width: 40, height: 40, borderRadius: '50%', bgcolor: 'grey.100' }} />
                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ width: '40%', height: 16, bgcolor: 'grey.100', mb: 1, borderRadius: 1 }} />
                      <Box sx={{ width: '20%', height: 12, bgcolor: 'grey.100', borderRadius: 1 }} />
                    </Box>
                  </Box>
                </TableCell>
              </TableRow>
            ))
          ) : users.length > 0 ? (
            users.map((user) => (
              <TableRow
                key={user.id}
                sx={{
                  transition: 'all 0.2s',
                  '&:hover': {
                    bgcolor: 'rgba(255, 156, 0, 0.02)',
                    '& .row-actions': { opacity: 1 }
                  }
                }}
              >
                <TableCell sx={{ py: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <UserAvatar user={user} />
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                        {user.prenom} {user.nom}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ opacity: 0.7 }}>
                        {user.email}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>

                <TableCell sx={{ py: 2 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <EmailIcon sx={{ fontSize: 14, color: 'text.secondary', opacity: 0.6 }} />
                      <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>{user.email}</Typography>
                    </Box>
                    {user.telephone && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PhoneIcon sx={{ fontSize: 14, color: 'text.secondary', opacity: 0.6 }} />
                        <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>{user.telephone}</Typography>
                      </Box>
                    )}
                  </Box>
                </TableCell>

                <TableCell sx={{ py: 2 }}>
                  <RoleChips roles={user.roles} />
                </TableCell>

                <TableCell sx={{ py: 2 }}>
                  <StatusChip isActive={user.isActive} />
                </TableCell>

                <TableCell sx={{ py: 2 }}>
                  {user.laboratoire ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <BusinessIcon sx={{ fontSize: 14, color: 'text.secondary', opacity: 0.6 }} />
                      <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>{user.laboratoire}</Typography>
                    </Box>
                  ) : (
                    <Typography variant="body2" color="text.secondary" sx={{ opacity: 0.5 }}>-</Typography>
                  )}
                </TableCell>

                <TableCell sx={{ py: 2 }}>
                  {user.specialite ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <SchoolIcon sx={{ fontSize: 14, color: 'text.secondary', opacity: 0.6 }} />
                      <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>{user.specialite}</Typography>
                    </Box>
                  ) : (
                    <Typography variant="body2" color="text.secondary" sx={{ opacity: 0.5 }}>-</Typography>
                  )}
                </TableCell>

                <TableCell align="right" sx={{ py: 2 }}>
                  <Box className="row-actions" sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: 0.5,
                    opacity: { xs: 1, md: 0.5 },
                    transition: 'opacity 0.2s'
                  }}>
                    <ActionMenu
                      user={user}
                      onEditUser={onEditUser}
                      onDeleteUser={onDeleteUser}
                      onToggleStatus={onToggleStatus}
                      onResetPassword={onResetPassword}
                    />
                  </Box>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} sx={{ py: 10, textAlign: 'center' }}>
                <Box sx={{ color: 'text.disabled', mb: 2 }}>
                  <PeopleIcon sx={{ fontSize: 48, opacity: 0.2 }} />
                </Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  Aucun utilisateur trouvé
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Essayez de modifier vos filtres ou créez un nouvel utilisateur.
                </Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50]}
        component="div"
        count={pagination.total}
        rowsPerPage={pagination.size}
        page={pagination.page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="Lignes par page:"
        labelDisplayedRows={({ from, to, count }) =>
          `${from}-${to} sur ${count !== -1 ? count : `plus de ${to}`}`
        }
        sx={{ borderTop: '1px solid', borderColor: 'divider' }}
      />
    </TableContainer>
  );
}