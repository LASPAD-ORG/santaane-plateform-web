import { Box, TextField, Typography } from '@mui/material';
import { Title, Description, Label } from '@mui/icons-material';

interface GeneralInfoSectionProps {
  formData: {
    title: string;
    abstract: string;
    keywords: string;
  };
  onChange: (field: 'title' | 'abstract' | 'keywords') => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export default function GeneralInfoSection({ formData, onChange }: GeneralInfoSectionProps) {
  return (
    <>
      <Typography variant="h6" gutterBottom fontWeight="600" mb={2}>
        Informations générales
      </Typography>

      <Box display="flex" flexDirection="column" gap={3}>
        <TextField
          fullWidth
          required
          label="Titre du manuscrit"
          value={formData.title}
          onChange={onChange('title')}
          placeholder="Entrez le titre (3-500 caractères)"
          helperText={`${formData.title.length}/500 caractères`}
          InputProps={{
            startAdornment: <Title sx={{ mr: 1, color: 'text.secondary' }} />,
          }}
        />

        <TextField
          fullWidth
          required
          multiline
          rows={6}
          label="Résumé"
          value={formData.abstract}
          onChange={onChange('abstract')}
          placeholder="Résumé du manuscrit (minimum 10 caractères)"
          helperText={`${formData.abstract.length} caractères`}
          InputProps={{
            startAdornment: (
              <Description
                sx={{ mr: 1, color: 'text.secondary', alignSelf: 'flex-start', mt: 2 }}
              />
            ),
          }}
        />

        <TextField
          fullWidth
          label="Mots-clés"
          value={formData.keywords}
          onChange={onChange('keywords')}
          placeholder="Séparez les mots-clés par des virgules"
          InputProps={{
            startAdornment: <Label sx={{ mr: 1, color: 'text.secondary' }} />,
          }}
        />
      </Box>
    </>
  );
}
