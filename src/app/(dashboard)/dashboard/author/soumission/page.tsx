'use client';

import { useState } from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Button, 
  Typography, 
  CircularProgress, 
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Checkbox,
  FormControlLabel,
  Link,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import { Send, NavigateNext, NavigateBefore, CheckCircle, Warning } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useAlertStore } from '@/stores/alertStore';
import GeneralInfoSection from './components/GeneralInfoSection';
import ClassificationSection from './components/ClassificationSection';
import PdfUploadSection from './components/PdfUploadSection';
import CoauthorsSection from './components/CoauthorsSection';
import { useManuscriptData } from './hooks/useManuscriptData';
import { useManuscriptSubmission } from './hooks/useManuscriptSubmission';
import { CoauthorInput } from '@/types/manuscript';

interface ManuscriptData {
  title: string;
  abstract: string;
  keywords: string;
  themeId: number | '';
  sectionId: number | '';
  languageId: number | '';
  pdfFile: File | null;
  coauthors: CoauthorInput[];
}

export default function AuthorSoumission() {
  const { showError } = useAlertStore();
  const router = useRouter();
  const { loading, themes, sections, languages } = useManuscriptData();
  const { submitting, submitManuscript } = useManuscriptSubmission();

  // État pour le stepper
  const [activeStep, setActiveStep] = useState(0);

  // États pour les prérequis
  const [ethicsAccepted, setEthicsAccepted] = useState(false);
  const [rulesAccepted, setRulesAccepted] = useState(false);
  const [apaAccepted, setApaAccepted] = useState(false);

  // État pour le modal d'alerte des signes
  const [signWarningOpen, setSignWarningOpen] = useState(false);
  const [selectedSectionInfo, setSelectedSectionInfo] = useState<{name: string, min: number, max: number} | null>(null);

  const [formData, setFormData] = useState<ManuscriptData>({
    title: '',
    abstract: '',
    keywords: '',
    themeId: '',
    sectionId: '',
    languageId: '',
    pdfFile: null,
    coauthors: [],
  });

  // Définition des étapes
  const steps = [
    {
      label: 'Prérequis',
      description: 'Règles et conditions de soumission'
    },
    {
      label: 'Classification',
      description: 'Appel, rubrique et langue de publication'
    },
    {
      label: 'Informations générales',
      description: 'Titre, résumé et mots-clés de votre manuscrit'
    },
    {
      label: 'Co-auteurs',
      description: 'Ajoutez les co-auteurs de votre manuscrit (optionnel)'
    },
    {
      label: 'Document PDF',
      description: 'Upload de votre fichier manuscrit'
    }
  ];

  const handleChange = (field: keyof ManuscriptData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));

    // Si c'est le changement de section, afficher le modal d'alerte
    if (field === 'sectionId' && e.target.value) {
      const selectedSection = sections.find(s => s.id === Number(e.target.value));
      if (selectedSection) {
        setSelectedSectionInfo({
          name: selectedSection.name,
          min: selectedSection.signe_min,
          max: selectedSection.signe_max
        });
        setSignWarningOpen(true);
      }
    }
  };

  // Validation pour chaque étape
  const validateStep = (step: number): boolean => {
    switch (step) {
      case 0: // Prérequis
        if (!ethicsAccepted || !rulesAccepted || !apaAccepted) {
          showError('Veuillez accepter tous les prérequis pour continuer');
          return false;
        }
        return true;

      case 1: // Classification
        if (!formData.sectionId) {
          showError('Veuillez sélectionner une rubrique');
          return false;
        }
        if (!formData.languageId) {
          showError('Veuillez sélectionner une langue');
          return false;
        }
        return true;

      case 2: // Informations générales
        if (formData.title.length < 3 || formData.title.length > 500) {
          showError('Le titre doit contenir entre 3 et 500 caractères');
          return false;
        }
        if (formData.abstract.length < 10) {
          showError('Le résumé doit contenir au moins 10 caractères');
          return false;
        }
        return true;

      case 3: // Co-auteurs (optionnel mais validation des données si présentes)
        for (const coauthor of formData.coauthors) {
          if (!coauthor.firstName.trim() || !coauthor.lastName.trim() || !coauthor.email.trim()) {
            showError('Veuillez remplir tous les champs obligatoires pour chaque co-auteur (prénom, nom, email)');
            return false;
          }
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(coauthor.email)) {
            showError(`L'email "${coauthor.email}" n'est pas valide`);
            return false;
          }
        }
        return true;

      case 4: // Document PDF
        if (!formData.pdfFile) {
          showError('Veuillez sélectionner un fichier PDF');
          return false;
        }
        return true;

      default:
        return true;
    }
  };

  // Navigation entre les étapes
  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        showError('Veuillez sélectionner un fichier PDF');
        return;
      }
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        showError('Le fichier PDF ne doit pas dépasser 10MB');
        return;
      }
      setFormData((prev) => ({ ...prev, pdfFile: file }));
    }
  };

  const handleRemoveFile = () => {
    setFormData((prev) => ({ ...prev, pdfFile: null }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep(4)) { // Validation finale (dernière étape)
      await submitManuscript(formData);
    }
  };

  const handleCoauthorsChange = (coauthors: CoauthorInput[]) => {
    setFormData((prev) => ({ ...prev, coauthors }));
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight="bold">
                    Soumettre un manuscrit
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={4}>
        Suivez les étapes ci-dessous pour soumettre votre manuscrit
      </Typography>

      <Card elevation={2}>
        <CardContent sx={{ p: 4 }}>
          <Stepper activeStep={activeStep} orientation="vertical">
            {steps.map((step, index) => (
              <Step key={step.label}>
                <StepLabel>
                  <Typography variant="h6" fontWeight="600">
                    {step.label}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {step.description}
                  </Typography>
                </StepLabel>
                <StepContent>
                  <Box sx={{ mb: 2 }}>
                    {/* Contenu de l'étape */}
                    {index === 0 && (
                      <Box>
                        <Typography variant="h6" gutterBottom fontWeight="600" color="primary">
                          Prérequis obligatoires
                        </Typography>
                        
                        <Alert severity="info" sx={{ mb: 3 }}>
                          Veuillez lire et accepter tous les prérequis ci-dessous avant de continuer
                        </Alert>

                        <List>
                          <ListItem>
                            <ListItemText>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={ethicsAccepted}
                                    onChange={(e) => setEthicsAccepted(e.target.checked)}
                                  />
                                }
                                label={
                                  <Typography>
                                    J'ai lu et j'accepte la{' '}
                                    <Link 
                                      href="https://www.globalafricasciences.org/fr/ethical-charter" 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                    >
                                      charte éthique
                                    </Link>
                                  </Typography>
                                }
                              />
                            </ListItemText>
                          </ListItem>

                          <ListItem>
                            <ListItemText>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={rulesAccepted}
                                    onChange={(e) => setRulesAccepted(e.target.checked)}
                                  />
                                }
                                label={
                                  <Typography>
                                    J'ai lu et j'accepte les{' '}
                                    <Link 
                                      href="https://www.globalafricasciences.org/fr/submission" 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                    >
                                      règles de soumission
                                    </Link>
                                  </Typography>
                                }
                              />
                            </ListItemText>
                          </ListItem>

                          <ListItem>
                            <ListItemText>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={apaAccepted}
                                    onChange={(e) => setApaAccepted(e.target.checked)}
                                  />
                                }
                                label={
                                  <Typography>
                                    Toutes mes citations et références bibliographiques sont formatées selon le{' '}
                                    <Link 
                                      href="https://3452f183-579a-4bee-a22d0677afc123bf.filesusr.com/ugd/526d98_9ea1870e53394ea5b34499481c0aed65.pdf" 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                    >
                                      style APA
                                    </Link>
                                  </Typography>
                                }
                              />
                            </ListItemText>
                          </ListItem>
                        </List>
                      </Box>
                    )}
                    {index === 1 && (
                      <ClassificationSection
                        formData={formData}
                        themes={themes}
                        sections={sections}
                        languages={languages}
                        onChange={handleChange}
                      />
                    )}
                    {index === 2 && (
                      <GeneralInfoSection formData={formData} onChange={handleChange} />
                    )}
                    {index === 3 && (
                      <CoauthorsSection
                        coauthors={formData.coauthors}
                        onChange={handleCoauthorsChange}
                      />
                    )}
                    {index === 4 && (
                      <PdfUploadSection
                        pdfFile={formData.pdfFile}
                        onFileChange={handleFileChange}
                        onRemoveFile={handleRemoveFile}
                      />
                    )}
                  </Box>

                  {/* Boutons de navigation */}
                  <Box sx={{ mb: 2 }}>
                    <div>
                      {index === steps.length - 1 ? (
                        <Button
                          variant="contained"
                          onClick={handleSubmit}
                          disabled={submitting}
                          startIcon={submitting ? <CircularProgress size={20} /> : <Send />}
                          sx={{ mt: 1, mr: 1 }}
                        >
                          {submitting ? 'Soumission...' : 'Soumettre le manuscrit'}
                        </Button>
                      ) : (
                        <Button
                          variant="contained"
                          onClick={handleNext}
                          sx={{ mt: 1, mr: 1 }}
                          endIcon={<NavigateNext />}
                        >
                          Continuer
                        </Button>
                      )}
                      {index > 0 && (
                        <Button
                          disabled={submitting}
                          onClick={handleBack}
                          sx={{ mt: 1, mr: 1 }}
                          startIcon={<NavigateBefore />}
                        >
                          Retour
                        </Button>
                      )}
                    </div>
                  </Box>
                </StepContent>
              </Step>
            ))}
          </Stepper>

          {/* Message de fin */}
          {activeStep === steps.length && (
            <Box sx={{ pt: 2 }}>
              <Typography>Toutes les étapes sont terminées - vous êtes maintenant prêt!</Typography>
              <Button onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
                Recommencer
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Modal d'alerte pour le nombre de signes */}
      <Dialog 
        open={signWarningOpen} 
        onClose={() => setSignWarningOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Warning color="warning" />
          Attention - Nombre de signes
        </DialogTitle>
        <DialogContent>
          {selectedSectionInfo && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              <Typography variant="body1" gutterBottom>
                <strong>Vous avez choisi la rubrique : {selectedSectionInfo.name}</strong>
              </Typography>
              <Typography variant="body2">
                Veuillez bien vérifier que le nombre de signes de votre manuscrit est compris entre{' '}
                <strong>{selectedSectionInfo.min.toLocaleString()}</strong> et{' '}
                <strong>{selectedSectionInfo.max.toLocaleString()}</strong> signes.
              </Typography>
              <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic' }}>
                Le non-respect de cette limite peut entraîner le refus de votre manuscrit.
              </Typography>
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setSignWarningOpen(false)} 
            variant="contained"
            color="primary"
          >
            J'ai compris
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}