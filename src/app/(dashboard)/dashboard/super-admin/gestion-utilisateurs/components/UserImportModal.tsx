'use client';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Alert,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Paper,
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { useState, useRef } from 'react';
import { CreateUserData } from '../fetchers/useFetchGestionUtilisateurs';
import { UserRole } from '@/types/auth';

interface UserImportModalProps {
  open: boolean;
  onClose: () => void;
  onImportUsers: (users: CreateUserData[]) => Promise<void>;
}

interface ImportResult {
  success: number;
  errors: Array<{ row: number; error: string; data: any }>;
  warnings: Array<{ row: number; warning: string; data: any }>;
}

const CSV_TEMPLATE = `email,prenom,nom,roles,laboratoire,specialite,telephone
exemple@santaane.com,Jean,Dupont,AUTHOR,lab1,informatique,+221771234567
admin@santaane.com,Marie,Martin,"EDITOR,EVALUATOR",lab2,biologie,+221762345678`;

export function UserImportModal({ open, onClose, onImportUsers }: UserImportModalProps) {
  const [dragOver, setDragOver] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [parsing, setParsing] = useState(false);
  const [importing, setImporting] = useState(false);
  const [parsedData, setParsedData] = useState<CreateUserData[]>([]);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [step, setStep] = useState<'upload' | 'preview' | 'result'>('upload');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClose = () => {
    setFile(null);
    setParsedData([]);
    setImportResult(null);
    setStep('upload');
    onClose();
  };

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    parseCSV(selectedFile);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === 'text/csv') {
      handleFileSelect(droppedFile);
    }
  };

  const parseCSV = async (csvFile: File) => {
    setParsing(true);

    try {
      const text = await csvFile.text();
      const lines = text.split('\n').filter(line => line.trim());
      const headers = lines[0].split(',').map(h => h.trim().toLowerCase());

      const requiredHeaders = ['email', 'prenom', 'nom', 'roles'];
      const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));

      if (missingHeaders.length > 0) {
        throw new Error(`Colonnes manquantes: ${missingHeaders.join(', ')}`);
      }

      const users: CreateUserData[] = [];
      const errors: Array<{ row: number; error: string; data: any }> = [];

      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim().replace(/^"/, '').replace(/"$/, ''));
        const row = i + 1;

        try {
          const userData: CreateUserData = {
            email: getValue(values, headers, 'email'),
            prenom: getValue(values, headers, 'prenom'),
            nom: getValue(values, headers, 'nom'),
            roles: parseRoles(getValue(values, headers, 'roles')),
            laboratoire: getValue(values, headers, 'laboratoire') || undefined,
            specialite: getValue(values, headers, 'specialite') || undefined,
            telephone: getValue(values, headers, 'telephone') || undefined,
            sendWelcomeEmail: true,
          };

          // Validation
          if (!userData.email) throw new Error('Email requis');
          if (!userData.prenom) throw new Error('Prénom requis');
          if (!userData.nom) throw new Error('Nom requis');
          if (userData.roles.length === 0) throw new Error('Au moins un rôle requis');

          users.push(userData);
        } catch (error) {
          errors.push({
            row,
            error: error instanceof Error ? error.message : 'Erreur inconnue',
            data: values,
          });
        }
      }

      setParsedData(users);
      if (errors.length === 0) {
        setStep('preview');
      } else {
        setImportResult({
          success: users.length,
          errors,
          warnings: [],
        });
        setStep('result');
      }
    } catch (error) {
      setImportResult({
        success: 0,
        errors: [{
          row: 0,
          error: error instanceof Error ? error.message : 'Erreur de parsing',
          data: {},
        }],
        warnings: [],
      });
      setStep('result');
    } finally {
      setParsing(false);
    }
  };

  const getValue = (values: string[], headers: string[], column: string): string => {
    const index = headers.indexOf(column);
    return index >= 0 ? values[index] || '' : '';
  };

  const parseRoles = (rolesString: string): UserRole[] => {
    if (!rolesString) return [UserRole.AUTHOR];

    return rolesString
      .split(/[;,]/)
      .map(role => role.trim().toUpperCase())
      .filter(role => Object.values(UserRole).includes(role as UserRole))
      .map(role => role as UserRole);
  };

  const handleImport = async () => {
    setImporting(true);

    try {
      await onImportUsers(parsedData);
      setImportResult({
        success: parsedData.length,
        errors: [],
        warnings: [],
      });
      setStep('result');
    } catch (error) {
      setImportResult({
        success: 0,
        errors: [{
          row: 0,
          error: error instanceof Error ? error.message : 'Erreur d\'import',
          data: {},
        }],
        warnings: [],
      });
      setStep('result');
    } finally {
      setImporting(false);
    }
  };

  const downloadTemplate = () => {
    const blob = new Blob([CSV_TEMPLATE], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'template_utilisateurs.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Import d'utilisateurs en masse
      </DialogTitle>

      <DialogContent>
        {step === 'upload' && (
          <Box>
            <Alert severity="info" sx={{ mb: 3 }}>
              <Typography variant="body2" component="div">
                <strong>Format CSV requis :</strong>
                <br />
                • Colonnes obligatoires : email, prenom, nom, roles
                <br />
                • Colonnes optionnelles : laboratoire, specialite, telephone
                <br />
                • Rôles multiples séparés par des virgules ou points-virgules
              </Typography>
            </Alert>

            <Button
              variant="outlined"
              onClick={downloadTemplate}
              sx={{ mb: 3 }}
              startIcon={<CloudUploadIcon />}
            >
              Télécharger le modèle CSV
            </Button>

            <Paper
              sx={{
                border: '2px dashed',
                borderColor: dragOver ? 'primary.main' : 'grey.300',
                borderRadius: 2,
                p: 4,
                textAlign: 'center',
                cursor: 'pointer',
                bgcolor: dragOver ? 'action.hover' : 'background.paper',
                transition: 'all 0.2s ease',
              }}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <CloudUploadIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Glissez votre fichier CSV ici
              </Typography>
              <Typography variant="body2" color="text.secondary">
                ou cliquez pour sélectionner un fichier
              </Typography>

              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                style={{ display: 'none' }}
                onChange={(e) => {
                  const selectedFile = e.target.files?.[0];
                  if (selectedFile) handleFileSelect(selectedFile);
                }}
              />
            </Paper>

            {parsing && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Analyse du fichier en cours...
                </Typography>
                <LinearProgress />
              </Box>
            )}
          </Box>
        )}

        {step === 'preview' && (
          <Box>
            <Alert severity="success" sx={{ mb: 3 }}>
              {parsedData.length} utilisateur(s) prêt(s) à être importé(s)
            </Alert>

            <Typography variant="h6" gutterBottom>
              Aperçu des données
            </Typography>

            <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
              <List dense>
                {parsedData.slice(0, 10).map((user, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <CheckCircleIcon color="success" />
                    </ListItemIcon>
                    <ListItemText
                      primary={`${user.prenom} ${user.nom}`}
                      secondary={`${user.email} - Rôles: ${user.roles.join(', ')}`}
                    />
                  </ListItem>
                ))}
                {parsedData.length > 10 && (
                  <ListItem>
                    <ListItemText
                      primary={`... et ${parsedData.length - 10} autres utilisateurs`}
                    />
                  </ListItem>
                )}
              </List>
            </Box>
          </Box>
        )}

        {step === 'result' && importResult && (
          <Box>
            {importResult.success > 0 && (
              <Alert severity="success" sx={{ mb: 2 }}>
                {importResult.success} utilisateur(s) importé(s) avec succès
              </Alert>
            )}

            {importResult.errors.length > 0 && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {importResult.errors.length} erreur(s) détectée(s)
              </Alert>
            )}

            {importResult.errors.length > 0 && (
              <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
                <Typography variant="h6" color="error" gutterBottom>
                  Erreurs :
                </Typography>
                <List dense>
                  {importResult.errors.map((error, index) => (
                    <ListItem key={index}>
                      <ListItemIcon>
                        <ErrorIcon color="error" />
                      </ListItemIcon>
                      <ListItemText
                        primary={`Ligne ${error.row}: ${error.error}`}
                        secondary={JSON.stringify(error.data)}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>
          {step === 'result' ? 'Fermer' : 'Annuler'}
        </Button>

        {step === 'preview' && (
          <Button
            variant="contained"
            onClick={handleImport}
            disabled={importing}
          >
            {importing ? 'Import en cours...' : `Importer ${parsedData.length} utilisateur(s)`}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}