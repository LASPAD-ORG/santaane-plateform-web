import { Box, TextField, Typography, MenuItem } from '@mui/material';
import { Category, Language } from '@mui/icons-material';

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
  formData: {
    themeId: number | '';
    sectionId: number | '';
    languageId: number | '';
  };
  themes: Theme[];
  sections: Section[];
  languages: LanguageOption[];
  onChange: (field: 'themeId' | 'sectionId' | 'languageId') => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export default function ClassificationSection({
  formData,
  themes,
  sections,
  languages,
  onChange,
}: ClassificationSectionProps) {
  return (
    <>
      <Typography variant="h6" gutterBottom fontWeight="600" mb={2}>
        Classification
      </Typography>

      <Box display="flex" flexDirection="column" gap={3}>
        <Box display="flex" gap={2} flexWrap="wrap">
          <Box flex={1} minWidth={{ xs: '100%', md: 'calc(50% - 8px)' }}>
            <TextField
              select
              fullWidth
              label="Thème (optionnel)"
              value={formData.themeId}
              onChange={onChange('themeId')}
              InputProps={{
                startAdornment: <Category sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
            >
              <MenuItem value="">
                <em>Aucun thème</em>
              </MenuItem>
              {themes.map((theme) => (
                <MenuItem key={theme.id} value={theme.id}>
                  {theme.title}
                </MenuItem>
              ))}
            </TextField>
          </Box>

          <Box flex={1} minWidth={{ xs: '100%', md: 'calc(50% - 8px)' }}>
            <TextField
              select
              fullWidth
              required
              label="Section"
              value={formData.sectionId}
              onChange={onChange('sectionId')}
              InputProps={{
                startAdornment: <Category sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
            >
              <MenuItem value="">
                <em>Sélectionnez une section</em>
              </MenuItem>
              {sections.map((section) => (
                <MenuItem key={section.id} value={section.id}>
                  {section.name} ({section.signe_min}-{section.signe_max} signes)
                </MenuItem>
              ))}
            </TextField>
          </Box>
        </Box>

        <TextField
          select
          fullWidth
          required
          label="Langue"
          value={formData.languageId}
          onChange={onChange('languageId')}
          InputProps={{
            startAdornment: <Language sx={{ mr: 1, color: 'text.secondary' }} />,
          }}
        >
          <MenuItem value="">
            <em>Sélectionnez une langue</em>
          </MenuItem>
          {languages.map((language) => (
            <MenuItem key={language.id} value={language.id}>
              {language.name} ({language.code})
            </MenuItem>
          ))}
        </TextField>
      </Box>
    </>
  );
}
