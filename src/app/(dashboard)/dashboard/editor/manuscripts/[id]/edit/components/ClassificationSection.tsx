import { Card, CardContent, TextField, Typography, Box, MenuItem } from '@mui/material';

interface Theme {
  id: number;
  title: string;
  description: string;
}

interface Section {
  id: number;
  name: string;
  signe_min: number;
  signe_max: number;
}

interface LanguageOption {
  id: number;
  name: string;
  code: string;
}

interface ClassificationSectionProps {
  themeId: number | null;
  sectionId: number | null;
  languageId: number | null;
  themes: Theme[];
  sections: Section[];
  languages: LanguageOption[];
  onFieldChange: (field: 'themeId' | 'sectionId' | 'languageId', value: number | null) => void;
}

export default function ClassificationSection({
  themeId,
  sectionId,
  languageId,
  themes,
  sections,
  languages,
  onFieldChange,
}: ClassificationSectionProps) {
  return (
    <Card elevation={2} sx={{ mb: 3 }}>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight="600" mb={2}>
          Classification
        </Typography>

        <Box display="flex" flexDirection="column" gap={2}>
          <TextField
            select
            label="Appel (optionnel)"
            value={themeId || ''}
            onChange={(e) => onFieldChange('themeId', e.target.value ? Number(e.target.value) : null)}
            fullWidth
            variant="outlined"
          >
            <MenuItem value="">
              <em>Aucun appel</em>
            </MenuItem>
            {themes.map((theme) => (
              <MenuItem key={theme.id} value={theme.id}>
                {theme.title}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Rubrique"
            value={sectionId || ''}
            onChange={(e) => onFieldChange('sectionId', e.target.value ? Number(e.target.value) : null)}
            required
            fullWidth
            variant="outlined"
          >
            <MenuItem value="">
              <em>Sélectionner une rubrique</em>
            </MenuItem>
            {sections.map((section) => (
              <MenuItem key={section.id} value={section.id}>
                {section.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Langue"
            value={languageId || ''}
            onChange={(e) => onFieldChange('languageId', e.target.value ? Number(e.target.value) : null)}
            required
            fullWidth
            variant="outlined"
          >
            <MenuItem value="">
              <em>Sélectionner une langue</em>
            </MenuItem>
            {languages.map((lang) => (
              <MenuItem key={lang.id} value={lang.id}>
                {lang.name}
              </MenuItem>
            ))}
          </TextField>
        </Box>
      </CardContent>
    </Card>
  );
}
