'use client';

import { useState } from 'react';
import {
  Box,
  TextField,
  Typography,
  Button,
  IconButton,
  Card,
  CardContent,
  Stack,
  Collapse,
  Alert,
} from '@mui/material';
import {
  PersonAdd,
  Delete,
  ExpandMore,
  ExpandLess,
  Person,
  Email,
  Business,
  Badge,
} from '@mui/icons-material';
import { CoauthorInput } from '@/types/manuscript';

interface CoauthorsSectionProps {
  coauthors: CoauthorInput[];
  onChange: (coauthors: CoauthorInput[]) => void;
}

const emptyCoauthor: CoauthorInput = {
  firstName: '',
  lastName: '',
  email: '',
  institution: '',
  orcidId: '',
};

export default function CoauthorsSection({ coauthors, onChange }: CoauthorsSectionProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const handleAddCoauthor = () => {
    onChange([...coauthors, { ...emptyCoauthor }]);
    setExpandedIndex(coauthors.length);
  };

  const handleRemoveCoauthor = (index: number) => {
    const newCoauthors = coauthors.filter((_, i) => i !== index);
    onChange(newCoauthors);
    if (expandedIndex === index) {
      setExpandedIndex(null);
    } else if (expandedIndex !== null && expandedIndex > index) {
      setExpandedIndex(expandedIndex - 1);
    }
  };

  const handleCoauthorChange = (
    index: number,
    field: keyof CoauthorInput,
    value: string
  ) => {
    const newCoauthors = [...coauthors];
    newCoauthors[index] = {
      ...newCoauthors[index],
      [field]: value,
    };
    onChange(newCoauthors);
  };

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const isCoauthorValid = (coauthor: CoauthorInput): boolean => {
    return (
      coauthor.firstName.trim().length > 0 &&
      coauthor.lastName.trim().length > 0 &&
      coauthor.email.trim().length > 0 &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(coauthor.email)
    );
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom fontWeight="600" mb={2}>
        Co-auteurs
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        Ajoutez les co-auteurs de votre manuscrit. Les co-auteurs seront affichés dans l'ordre dans lequel vous les ajoutez.
      </Alert>

      <Stack spacing={2}>
        {coauthors.map((coauthor, index) => (
          <Card
            key={index}
            variant="outlined"
            sx={{
              borderColor: isCoauthorValid(coauthor) ? 'success.main' : 'divider',
              borderWidth: isCoauthorValid(coauthor) ? 2 : 1,
            }}
          >
            <CardContent sx={{ pb: 1 }}>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                sx={{ cursor: 'pointer' }}
                onClick={() => toggleExpand(index)}
              >
                <Box display="flex" alignItems="center" gap={1}>
                  <Person color="primary" />
                  <Typography variant="subtitle1" fontWeight="500">
                    {coauthor.firstName || coauthor.lastName
                      ? `${coauthor.firstName} ${coauthor.lastName}`.trim()
                      : `Co-auteur ${index + 1}`}
                  </Typography>
                  {coauthor.email && (
                    <Typography variant="body2" color="text.secondary">
                      ({coauthor.email})
                    </Typography>
                  )}
                </Box>
                <Box>
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveCoauthor(index);
                    }}
                    color="error"
                  >
                    <Delete />
                  </IconButton>
                  <IconButton size="small">
                    {expandedIndex === index ? <ExpandLess /> : <ExpandMore />}
                  </IconButton>
                </Box>
              </Box>

              <Collapse in={expandedIndex === index}>
                <Box mt={2} display="flex" flexDirection="column" gap={2}>
                  <Box display="flex" gap={2}>
                    <TextField
                      fullWidth
                      required
                      label="Prenom"
                      value={coauthor.firstName}
                      onChange={(e) =>
                        handleCoauthorChange(index, 'firstName', e.target.value)
                      }
                      placeholder="Prenom du co-auteur"
                      InputProps={{
                        startAdornment: (
                          <Person sx={{ mr: 1, color: 'text.secondary' }} />
                        ),
                      }}
                    />
                    <TextField
                      fullWidth
                      required
                      label="Nom"
                      value={coauthor.lastName}
                      onChange={(e) =>
                        handleCoauthorChange(index, 'lastName', e.target.value)
                      }
                      placeholder="Nom du co-auteur"
                    />
                  </Box>

                  <TextField
                    fullWidth
                    required
                    type="email"
                    label="Email"
                    value={coauthor.email}
                    onChange={(e) =>
                      handleCoauthorChange(index, 'email', e.target.value)
                    }
                    placeholder="email@exemple.com"
                    InputProps={{
                      startAdornment: (
                        <Email sx={{ mr: 1, color: 'text.secondary' }} />
                      ),
                    }}
                  />

                  <TextField
                    fullWidth
                    label="Institution / Affiliation"
                    value={coauthor.institution || ''}
                    onChange={(e) =>
                      handleCoauthorChange(index, 'institution', e.target.value)
                    }
                    placeholder="Universite, laboratoire, etc."
                    InputProps={{
                      startAdornment: (
                        <Business sx={{ mr: 1, color: 'text.secondary' }} />
                      ),
                    }}
                  />

                  <TextField
                    fullWidth
                    label="ORCID ID"
                    value={coauthor.orcidId || ''}
                    onChange={(e) =>
                      handleCoauthorChange(index, 'orcidId', e.target.value)
                    }
                    placeholder="0000-0000-0000-0000"
                    helperText="Identifiant ORCID (optionnel)"
                    InputProps={{
                      startAdornment: (
                        <Badge sx={{ mr: 1, color: 'text.secondary' }} />
                      ),
                    }}
                  />
                </Box>
              </Collapse>
            </CardContent>
          </Card>
        ))}
      </Stack>

      <Button
        variant="outlined"
        startIcon={<PersonAdd />}
        onClick={handleAddCoauthor}
        sx={{ mt: 2 }}
      >
        Ajouter un co-auteur
      </Button>

      {coauthors.length > 0 && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          {coauthors.length} co-auteur{coauthors.length > 1 ? 's' : ''} ajoute
          {coauthors.length > 1 ? 's' : ''}
        </Typography>
      )}
    </Box>
  );
}
