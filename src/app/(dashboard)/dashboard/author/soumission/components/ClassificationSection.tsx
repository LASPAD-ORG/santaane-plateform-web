import { useState } from 'react';
import { Box, TextField, Typography, MenuItem, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Chip } from '@mui/material';
import { Category, Language, Schedule } from '@mui/icons-material';

interface Theme {
  id: number;
  title: string;
  description: string;
  date_limite: string | null;
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
  // État local pour gérer le type de publication (varia ou theme)
  const [publicationType, setPublicationType] = useState<'varia' | 'theme'>(
    formData.themeId === '' ? 'varia' : 'theme'
  );
  
  const handleThemeTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newType = event.target.value as 'varia' | 'theme';
    setPublicationType(newType);
    
    if (newType === 'varia') {
      // Si Varia sélectionné, vider le themeId
      onChange('themeId')({ target: { value: '' } } as any);
    } else {
      // Si appel sélectionné, s'assurer qu'on a une valeur vide pour forcer la sélection
      if (formData.themeId === '') {
        onChange('themeId')({ target: { value: '' } } as any);
      }
    }
  };

  return (
    <>
      <Typography variant="h6" gutterBottom fontWeight="600" mb={2}>
        Classification
      </Typography>

      <Box display="flex" flexDirection="column" gap={3}>
        {/* Choix Varia ou Appel */}
        <FormControl component="fieldset">
          <FormLabel component="legend" sx={{ mb: 1, fontWeight: 500 }}>
            Publication
          </FormLabel>
          <RadioGroup
            row
            value={publicationType}
            onChange={handleThemeTypeChange}
          >
            <FormControlLabel 
              value="varia" 
              control={<Radio />} 
              label="Varia" 
            />
            <FormControlLabel 
              value="theme" 
              control={<Radio />} 
              label="Appel spécifique" 
            />
          </RadioGroup>
        </FormControl>

        <Box display="flex" gap={2} flexWrap="wrap">
          {/* Select des appels - affiché seulement si "Appel spécifique" est sélectionné */}
          {publicationType === 'theme' && (
            <Box flex={1} minWidth={{ xs: '100%', md: 'calc(50% - 8px)' }}>
              <TextField
                select
                fullWidth
                required
                label="Choisir un appel"
                value={formData.themeId}
                onChange={onChange('themeId')}
                helperText="Seuls les appels avec des dates limites non expirées sont affichés"
                InputProps={{
                  startAdornment: <Category sx={{ mr: 1, color: 'text.secondary' }} />,
                }}
              >
                <MenuItem value="">
                  <em>Sélectionnez un appel</em>
                </MenuItem>
                {themes.map((theme) => {
                  const formatDateLimit = (dateLimit: string | null) => {
                    if (!dateLimit) return 'Pas de limite';
                    try {
                      const date = new Date(dateLimit);
                      const now = new Date();
                      const diffDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
                      
                      const dateStr = date.toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      });
                      
                      if (diffDays > 0) {
                        return `${dateStr} (${diffDays}j restants)`;
                      } else {
                        return `${dateStr} (expiré)`;
                      }
                    } catch {
                      return 'Date invalide';
                    }
                  };
                  
                  return (
                    <MenuItem key={theme.id} value={theme.id}>
                      <Box sx={{ width: '100%' }}>
                        <Typography variant="body1">{theme.title}</Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Schedule fontSize="small" />
                          {formatDateLimit(theme.date_limite)}
                        </Typography>
                      </Box>
                    </MenuItem>
                  );
                })}
              </TextField>
            </Box>
          )}

          <Box flex={1} minWidth={{ xs: '100%', md: 'calc(50% - 8px)' }}>
            <TextField
              select
              fullWidth
              required
              label="Rubrique"
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
