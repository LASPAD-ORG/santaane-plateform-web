import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  CircularProgress,
  Alert,
} from '@mui/material';
import { CloudUpload, PictureAsPdf } from '@mui/icons-material';

interface PdfUploadSectionProps {
  selectedFile: File | null;
  currentPdfName: string;
  onFileChange: (file: File | null) => void;
  uploading: boolean;
}

export default function PdfUploadSection({
  selectedFile,
  currentPdfName,
  onFileChange,
  uploading,
}: PdfUploadSectionProps) {
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    onFileChange(file);
  };

  return (
    <Card elevation={2} sx={{ mb: 3 }}>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight="600" mb={2}>
          Fichier PDF
        </Typography>

        <Alert severity="info" sx={{ mb: 2 }}>
          PDF actuel : <strong>{currentPdfName}</strong>
          {selectedFile && ' → Sera remplacé par le nouveau fichier'}
        </Alert>

        <Box display="flex" flexDirection="column" gap={2}>
          <input
            accept="application/pdf"
            style={{ display: 'none' }}
            id="pdf-file-upload"
            type="file"
            onChange={handleFileSelect}
            disabled={uploading}
          />
          <label htmlFor="pdf-file-upload">
            <Button
              variant="outlined"
              component="span"
              startIcon={uploading ? <CircularProgress size={20} /> : <CloudUpload />}
              disabled={uploading}
              fullWidth
            >
              {uploading ? 'Téléchargement...' : 'Choisir un nouveau PDF (optionnel)'}
            </Button>
          </label>

          {selectedFile && (
            <Box
              display="flex"
              alignItems="center"
              gap={2}
              p={2}
              sx={{
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
                bgcolor: 'background.paper',
              }}
            >
              <PictureAsPdf sx={{ color: 'error.main', fontSize: 40 }} />
              <Box flex={1}>
                <Typography variant="body1" fontWeight="500">
                  {selectedFile.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} Mo
                </Typography>
              </Box>
            </Box>
          )}

          <Typography variant="caption" color="text.secondary">
            Format accepté : PDF • Taille max : 10 Mo
            {!selectedFile && ' • Laissez vide pour conserver le PDF actuel'}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
