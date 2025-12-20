'use client';

import {
  Box,
  Button,
  Chip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Block as BlockIcon,
  Delete as DeleteIcon,
  Email as EmailIcon,
  Download as DownloadIcon,
  Upload as UploadIcon,
  MoreVert as MoreVertIcon,
} from '@mui/icons-material';
import { useState } from 'react';
import { User, UserStatus } from '../fetchers/useFetchGestionUtilisateurs';
import { exportUsersToCSV } from '../helpers/formatters';

interface BulkActionsProps {
  selectedUsers: User[];
  allUsers: User[];
  onBulkStatusChange: (userIds: string[], status: UserStatus) => void;
  onBulkDelete: (userIds: string[]) => void;
  onBulkEmailSend: (userIds: string[]) => void;
  onClearSelection: () => void;
}

export function BulkActions({
  selectedUsers,
  allUsers,
  onBulkStatusChange,
  onBulkDelete,
  onBulkEmailSend,
  onClearSelection,
}: BulkActionsProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleActivateUsers = () => {
    const userIds = selectedUsers.map(user => user.id);
    onBulkStatusChange(userIds, 'ACTIVE');
    handleClose();
  };

  const handleDeactivateUsers = () => {
    const userIds = selectedUsers.map(user => user.id);
    onBulkStatusChange(userIds, 'INACTIVE');
    handleClose();
  };

  const handleSuspendUsers = () => {
    if (window.confirm(`Êtes-vous sûr de vouloir suspendre ${selectedUsers.length} utilisateur(s) ?`)) {
      const userIds = selectedUsers.map(user => user.id);
      onBulkStatusChange(userIds, 'INACTIVE'); // Simplified: no SUSPENDED status
    }
    handleClose();
  };

  const handleDeleteUsers = () => {
    if (window.confirm(
      `Êtes-vous sûr de vouloir supprimer définitivement ${selectedUsers.length} utilisateur(s) ?\n\nCette action est irréversible.`
    )) {
      const userIds = selectedUsers.map(user => user.id);
      onBulkDelete(userIds);
    }
    handleClose();
  };

  const handleSendEmail = () => {
    const userIds = selectedUsers.map(user => user.id);
    onBulkEmailSend(userIds);
    handleClose();
  };

  const handleExportSelected = () => {
    exportUsersToCSV(selectedUsers);
    handleClose();
  };

  const handleExportAll = () => {
    exportUsersToCSV(allUsers);
    handleClose();
  };

  const hasAdminUsers = selectedUsers.some(user =>
    user.roles.includes('SUPER_ADMIN') || user.roles.includes('EDITOR')
  );

  if (selectedUsers.length === 0) {
    return null;
  }

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 20,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1000,
        bgcolor: 'background.paper',
        boxShadow: 3,
        borderRadius: 2,
        p: 2,
        border: '1px solid',
        borderColor: 'divider',
        minWidth: 400,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Chip
            label={`${selectedUsers.length} sélectionné(s)`}
            color="primary"
            size="small"
          />
          {hasAdminUsers && (
            <Chip
              label="Admins inclus"
              color="warning"
              size="small"
              variant="outlined"
            />
          )}
        </Box>
        <Button
          size="small"
          onClick={onClearSelection}
        >
          Désélectionner tout
        </Button>
      </Box>

      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        <Button
          size="small"
          startIcon={<CheckCircleIcon />}
          onClick={handleActivateUsers}
          color="success"
          variant="outlined"
        >
          Activer
        </Button>

        <Button
          size="small"
          startIcon={<BlockIcon />}
          onClick={handleDeactivateUsers}
          color="warning"
          variant="outlined"
        >
          Désactiver
        </Button>

        <Button
          size="small"
          startIcon={<EmailIcon />}
          onClick={handleSendEmail}
          variant="outlined"
        >
          Envoyer email
        </Button>

        <Button
          size="small"
          startIcon={<MoreVertIcon />}
          onClick={handleClick}
          variant="outlined"
        >
          Plus d'actions
        </Button>
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <MenuItem onClick={handleSuspendUsers}>
          <ListItemIcon>
            <BlockIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Suspendre les utilisateurs</ListItemText>
        </MenuItem>

        <Divider />

        <MenuItem onClick={handleExportSelected}>
          <ListItemIcon>
            <DownloadIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Exporter la sélection</ListItemText>
        </MenuItem>

        <MenuItem onClick={handleExportAll}>
          <ListItemIcon>
            <DownloadIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Exporter tous les utilisateurs</ListItemText>
        </MenuItem>

        <Divider />

        <MenuItem
          onClick={handleDeleteUsers}
          disabled={hasAdminUsers}
          sx={{ color: hasAdminUsers ? 'text.disabled' : 'error.main' }}
        >
          <ListItemIcon>
            <DeleteIcon fontSize="small" color={hasAdminUsers ? 'disabled' : 'error'} />
          </ListItemIcon>
          <ListItemText>
            <Box>
              <Typography variant="inherit">
                Supprimer définitivement
              </Typography>
              {hasAdminUsers && (
                <Typography variant="caption" color="text.secondary">
                  Impossible : Administrateurs sélectionnés
                </Typography>
              )}
            </Box>
          </ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
}