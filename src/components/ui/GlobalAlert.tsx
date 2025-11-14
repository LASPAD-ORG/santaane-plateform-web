'use client';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Box,
} from '@mui/material';
import {
  CheckCircle as SuccessIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { useAlertStore, type AlertType } from '@/stores/alertStore';

const ICON_MAP = {
  success: SuccessIcon,
  error: ErrorIcon,
  warning: WarningIcon,
  info: InfoIcon,
};

const COLOR_MAP: Record<AlertType, string> = {
  success: 'success.main',
  error: 'error.main',
  warning: 'warning.main',
  info: 'info.main',
};

export default function GlobalAlert() {
  const { currentAlert, closeAlert } = useAlertStore();

  if (!currentAlert) return null;

  const Icon = ICON_MAP[currentAlert.type];

  const handleConfirm = () => {
    if (currentAlert.onConfirm) {
      currentAlert.onConfirm();
    }
    closeAlert();
  };

  const handleCancel = () => {
    if (currentAlert.onCancel) {
      currentAlert.onCancel();
    }
    closeAlert();
  };

  const hasActions = currentAlert.onConfirm || currentAlert.onCancel;

  return (
    <Dialog
      open={true}
      onClose={handleCancel}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderTop: `4px solid`,
          borderColor: COLOR_MAP[currentAlert.type],
        },
      }}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Icon sx={{ fontSize: 32, color: COLOR_MAP[currentAlert.type] }} />
          <Box>{currentAlert.title}</Box>
        </Box>
      </DialogTitle>

      {currentAlert.message && (
        <DialogContent>
          <DialogContentText>{currentAlert.message}</DialogContentText>
        </DialogContent>
      )}

      <DialogActions>
        {hasActions && currentAlert.cancelText && (
          <Button onClick={handleCancel} color="inherit">
            {currentAlert.cancelText}
          </Button>
        )}
        <Button onClick={handleConfirm} variant="contained" autoFocus>
          {currentAlert.confirmText || 'OK'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
