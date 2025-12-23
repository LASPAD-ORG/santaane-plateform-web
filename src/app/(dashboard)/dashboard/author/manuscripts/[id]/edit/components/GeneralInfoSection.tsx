import { Card, CardContent, TextField, Typography, Box } from '@mui/material';

interface GeneralInfoSectionProps {
  title: string;
  abstract: string;
  keywords: string;
  onFieldChange: (field: 'title' | 'abstract' | 'keywords', value: string) => void;
}

export default function GeneralInfoSection({
  title,
  abstract,
  keywords,
  onFieldChange,
}: GeneralInfoSectionProps) {
  return (
    <Card elevation={2} sx={{ mb: 3 }}>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight="600" mb={2}>
          Informations générales
        </Typography>

        <Box display="flex" flexDirection="column" gap={2}>
          <TextField
            label="Titre du manuscrit"
            value={title}
            onChange={(e) => onFieldChange('title', e.target.value)}
            required
            fullWidth
            variant="outlined"
          />

          <TextField
            label="Résumé"
            value={abstract}
            onChange={(e) => onFieldChange('abstract', e.target.value)}
            required
            fullWidth
            multiline
            rows={6}
            variant="outlined"
            helperText="Minimum 10 caractères"
          />

          <TextField
            label="Mots-clés"
            value={keywords}
            onChange={(e) => onFieldChange('keywords', e.target.value)}
            required
            fullWidth
            variant="outlined"
            helperText="Séparez les mots-clés par des virgules"
          />
        </Box>
      </CardContent>
    </Card>
  );
}
