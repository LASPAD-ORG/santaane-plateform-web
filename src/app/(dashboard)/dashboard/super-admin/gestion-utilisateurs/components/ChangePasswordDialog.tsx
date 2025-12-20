'use client';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Alert,
  InputAdornment,
  IconButton,
} from '@mui/material';
import {
  VpnKey as VpnKeyIcon,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import { useState } from 'react';

interface ChangePasswordDialogProps {
  open: boolean;
  onClose: () => void;
  userName: string;
  onChangePassword: (password: string) => Promise<void>;
}

export function ChangePasswordDialog({
  open,
  onClose,
  userName,
  onChangePassword,
}: ChangePasswordDialogProps) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{ password?: string; confirmPassword?: string }>({});
  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    setPassword('');
    setConfirmPassword('');
    setErrors({});
    setShowPassword(false);
    setShowConfirmPassword(false);
    onClose();
  };

  const validateForm = (): boolean => {
    const newErrors: { password?: string; confirmPassword?: string } = {};

    if (!password) {
      newErrors.password = 'Le mot de passe est requis';
    } else if (password.length < 8) {
      newErrors.password = 'Le mot de passe doit contenir au moins 8 caractères';
    } else if (!/(?=.*[a-z])/.test(password)) {
      newErrors.password = 'Le mot de passe doit contenir au moins une minuscule';
    } else if (!/(?=.*[A-Z])/.test(password)) {
      newErrors.password = 'Le mot de passe doit contenir au moins une majuscule';
    } else if (!/(?=.*\d)/.test(password)) {
      newErrors.password = 'Le mot de passe doit contenir au moins un chiffre';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Veuillez confirmer le mot de passe';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      await onChangePassword(password);
      handleClose();
    } catch (error) {
      console.error('Erreur lors du changement de mot de passe:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrength = () => {
    if (!password) return { strength: 0, label: '', color: '' };

    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/(?=.*[a-z])/.test(password)) strength++;
    if (/(?=.*[A-Z])/.test(password)) strength++;
    if (/(?=.*\d)/.test(password)) strength++;
    if (/(?=.*[@$!%*?&#])/.test(password)) strength++;

    if (strength <= 2) return { strength, label: 'Faible', color: 'error' };
    if (strength <= 4) return { strength, label: 'Moyen', color: 'warning' };
    return { strength, label: 'Fort', color: 'success' };
  };

  const passwordStrength = getPasswordStrength();

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <VpnKeyIcon />
        Réinitialiser le mot de passe
      </DialogTitle>

      <DialogContent>
        <Alert severity="info" sx={{ mb: 3 }}>
          Vous êtes sur le point de réinitialiser le mot de passe de <strong>{userName}</strong>.
          L'utilisateur devra utiliser ce nouveau mot de passe pour se connecter.
        </Alert>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            fullWidth
            type={showPassword ? 'text' : 'password'}
            label="Nouveau mot de passe"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (errors.password) setErrors({ ...errors, password: undefined });
            }}
            error={!!errors.password}
            helperText={errors.password || 'Minimum 8 caractères, avec majuscule, minuscule et chiffre'}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {password && (
            <Box>
              <Typography variant="caption" color="text.secondary">
                Force du mot de passe: {passwordStrength.label}
              </Typography>
              <Box
                sx={{
                  width: '100%',
                  height: 4,
                  bgcolor: 'grey.200',
                  borderRadius: 1,
                  mt: 0.5,
                }}
              >
                <Box
                  sx={{
                    width: `${(passwordStrength.strength / 6) * 100}%`,
                    height: '100%',
                    bgcolor: `${passwordStrength.color}.main`,
                    borderRadius: 1,
                    transition: 'width 0.3s',
                  }}
                />
              </Box>
            </Box>
          )}

          <TextField
            fullWidth
            type={showConfirmPassword ? 'text' : 'password'}
            label="Confirmer le mot de passe"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: undefined });
            }}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    edge="end"
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button onClick={handleClose} disabled={loading}>
          Annuler
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading || !password || !confirmPassword}
        >
          {loading ? 'Modification...' : 'Réinitialiser'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
