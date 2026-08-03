import { Box, Button, Typography } from '@mui/material';
import { Description } from '@mui/icons-material';

interface InitialDocxUploadSectionProps {
  docxFile: File | null;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveFile: () => void;
}

export default function InitialDocxUploadSection({
  docxFile,
  onFileChange,
  onRemoveFile,
}: InitialDocxUploadSectionProps) {
  return (
    <>
      <Typography variant="h6" gutterBottom fontWeight="600" mb={2}>
        Fichier Word (obligatoire)
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={2}>
        Cette version Word ne sera visible que par l&apos;editeur. Elle ne sera jamais transmise aux evaluateurs.
      </Typography>
      <Box>
        <Button
          variant="outlined"
          component="label"
          startIcon={<Description />}
          fullWidth
          sx={{
            p: 2,
            borderStyle: 'dashed',
            borderWidth: 2,
            textTransform: 'none',
            justifyContent: 'flex-start',
          }}
        >
          {docxFile ? (
            <Box display="flex" flexDirection="column" alignItems="flex-start">
              <Typography variant="body1" fontWeight="500">
                {docxFile.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {(docxFile.size / 1024 / 1024).toFixed(2)} MB
              </Typography>
            </Box>
          ) : (
            <Typography variant="body1" color="text.secondary">
              Cliquez pour selectionner un fichier Word (.docx, max 10MB)
            </Typography>
          )}
          <input
            type="file"
            hidden
            accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            onChange={onFileChange}
          />
        </Button>
        {docxFile && (
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