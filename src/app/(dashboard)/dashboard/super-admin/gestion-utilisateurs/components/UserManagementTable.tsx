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
} from '@mui/icons-material';
import { useState } from 'react';
import { User, UserStatus, Pagination } from '../types';
import { UserRole } from '@/types/auth';
import { ROLE_CONFIGS } from '@/config/roles';
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
  onToggleStatus: (userId: string, newStatus: UserStatus) => void;
  onResetPassword: (userId: string) => void;
}

interface ActionMenuProps {
  user: User;
  onEditUser: (userId: string) => void;
  onDeleteUser: (userId: string) => void;
  onToggleStatus: (userId: string, newStatus: UserStatus) => void;
  onResetPassword: (userId: string) => void;
}

function ActionMenu({ user, onEditUser, onDeleteUser, onToggleStatus, onResetPassword }: ActionMenuProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

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
    const newStatus = user.status === UserStatus.ACTIVE ? UserStatus.INACTIVE : UserStatus.ACTIVE;
    onToggleStatus(user.id, newStatus);
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
            {user.status === UserStatus.ACTIVE ? (
              <BlockIcon fontSize="small" />
            ) : (
              <CheckCircleIcon fontSize="small" />
            )}
          </ListItemIcon>
          <ListItemText>
            {user.status === UserStatus.ACTIVE ? 'Désactiver' : 'Activer'}
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

function StatusChip({ status }: { status: UserStatus }) {
  const getStatusConfig = (status: UserStatus) => {
    switch (status) {
      case UserStatus.ACTIVE:
        return { label: 'Actif', color: 'success' as const };
      case UserStatus.INACTIVE:
        return { label: 'Inactif', color: 'default' as const };
      case UserStatus.PENDING:
        return { label: 'En attente', color: 'warning' as const };
      case UserStatus.SUSPENDED:
        return { label: 'Suspendu', color: 'error' as const };
      default:
        return { label: status, color: 'default' as const };
    }
  };

  const config = getStatusConfig(status);

  return (
    <Chip
      label={config.label}
      color={config.color}
      size="small"
      variant="outlined"
    />
  );
}

function RoleChips({ roles }: { roles: UserRole[] }) {
  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
      {roles.map((role) => (
        <Chip
          key={role}
          label={ROLE_CONFIGS[role]?.label || role}
          size="small"
          style={{
            backgroundColor: ROLE_CONFIGS[role]?.color + '20',
            color: ROLE_CONFIGS[role]?.color,
            border: `1px solid ${ROLE_CONFIGS[role]?.color}40`,
          }}
        />
      ))}
    </Box>
  );
}

export function UserManagementTable({
  users,
  pagination,
  onPaginationChange,
  loading,
  onEditUser,
  onDeleteUser,
  onToggleStatus,
  onResetPassword,
}: UserManagementTableProps) {
  const handleChangePage = (event: unknown, newPage: number) => {
    onPaginationChange(newPage, pagination.size);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    onPaginationChange(0, parseInt(event.target.value, 10));
  };


  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 600 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Utilisateur</TableCell>
              <TableCell>Contact</TableCell>
              <TableCell>Rôles</TableCell>
              <TableCell>Statut</TableCell>
              <TableCell>Laboratoire</TableCell>
              <TableCell>Spécialité</TableCell>

              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow hover key={user.id}>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <UserAvatar user={user} />
                    <Box>
                      <Typography variant="subtitle2">
                        {user.prenom} {user.nom}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {user.email}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>

                <TableCell>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <EmailIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="body2">{user.email}</Typography>
                    </Box>
                    {user.telephone && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PhoneIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <Typography variant="body2">{user.telephone}</Typography>
                      </Box>
                    )}
                  </Box>
                </TableCell>

                <TableCell>
                  <RoleChips roles={user.roles} />
                </TableCell>

                <TableCell>
                  <StatusChip status={user.status} />
                </TableCell>

                <TableCell>
                  {user.laboratoire ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <BusinessIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="body2">{user.laboratoire}</Typography>
                    </Box>
                  ) : (
                    <Typography variant="body2" color="text.secondary">-</Typography>
                  )}
                </TableCell>

                <TableCell>
                  {user.specialite ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <SchoolIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="body2">{user.specialite}</Typography>
                    </Box>
                  ) : (
                    <Typography variant="body2" color="text.secondary">-</Typography>
                  )}
                </TableCell>




                <TableCell align="center">
                  <ActionMenu
                    user={user}
                    onEditUser={onEditUser}
                    onDeleteUser={onDeleteUser}
                    onToggleStatus={onToggleStatus}
                    onResetPassword={onResetPassword}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

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