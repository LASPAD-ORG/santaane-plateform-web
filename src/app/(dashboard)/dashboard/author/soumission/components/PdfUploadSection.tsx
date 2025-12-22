import { Box, Button, Typography } from '@mui/material';
import { PictureAsPdf } from '@mui/icons-material';

interface PdfUploadSectionProps {
  pdfFile: File | null;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveFile: () => void;
}

export default function PdfUploadSection({
  pdfFile,
  onFileChange,
  onRemoveFile,
}: PdfUploadSectionProps) {
  return (
    <>
      <Typography variant="h6" gutterBottom fontWeight="600" mb={2}>
        Fichier PDF
      </Typography>

      <Box>
        <Button
          variant="outlined"
          component="label"
          startIcon={<PictureAsPdf />}
          fullWidth
          sx={{
            p: 2,
            borderStyle: 'dashed',
            borderWidth: 2,
            textTransform: 'none',
            justifyContent: 'flex-start',
          }}
        >
          {pdfFile ? (
            <Box display="flex" flexDirection="column" alignItems="flex-start">
              <Typography variant="body1" fontWeight="500">
                {pdfFile.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {(pdfFile.size / 1024 / 1024).toFixed(2)} MB
              </Typography>
            </Box>
          ) : (
            <Typography variant="body1" color="text.secondary">
              Cliquez pour sélectionner un fichier PDF (max 10MB)
            </Typography>
          )}
          <input
            type="file"
            hidden
            accept=".pdf,application/pdf"
            onChange={onFileChange}
          />
        </Button>
        {pdfFile && (
          <Button
            variant="text"
            color="error"
            size="small"
            onClick={onRemoveFile}
            sx={{ mt: 1 }}
          >
            Supprimer le fichier
          </Button>
        )}
      </Box>
    </>
  );
}
