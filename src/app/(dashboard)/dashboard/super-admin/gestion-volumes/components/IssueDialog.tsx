'use client';

import { useEffect, useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    MenuItem,
    Grid,
    FormControlLabel,
    Switch,
} from '@mui/material';
import { Issue, IssueStatus } from '../fetchers/useFetchGestionVolumes';

interface IssueDialogProps {
    open: boolean;
    onClose: () => void;
    onSave: (issue: Partial<Issue>) => void;
    issue?: Issue;
}

interface FormData {
    title: string;
    publicationDate: string;
    status: IssueStatus;
    isOpenAccess: boolean;
    description: string;
}

const defaultValues: FormData = {
    title: '',
    publicationDate: new Date().toISOString().split('T')[0],
    status: 'DRAFT',
    isOpenAccess: false,
    description: '',
};

export default function IssueDialog({
    open,
    onClose,
    onSave,
    issue,
}: IssueDialogProps) {
    const [formData, setFormData] = useState<FormData>(defaultValues);
    const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

    useEffect(() => {
        if (open) {
            if (issue) {
                setFormData({
                    title: issue.title,
                    publicationDate: issue.publicationDate,
                    status: issue.status,
                    isOpenAccess: issue.isOpenAccess,
                    description: issue.description || '',
                });
            } else {
                setFormData(defaultValues);
            }
            setErrors({});
        }
    }, [issue, open]);

    const handleChange = (field: keyof FormData, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: undefined }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors: Partial<Record<keyof FormData, string>> = {};
        if (!formData.title) newErrors.title = 'Le titre est requis';
        if (!formData.publicationDate) newErrors.publicationDate = 'La date est requise';
        if (!formData.status) newErrors.status = 'Le statut est requis';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        onSave({
            ...issue,
            ...formData,
        });
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                {issue ? 'Modifier le numéro' : 'Créer un nouveau numéro'}
            </DialogTitle>
            <form onSubmit={handleSubmit}>
                <DialogContent>
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12 }}>
                            <TextField
                                label="Titre"
                                fullWidth
                                value={formData.title}
                                onChange={(e) => handleChange('title', e.target.value)}
                                error={!!errors.title}
                                helperText={errors.title}
                            />
                        </Grid>
                        <Grid size={{ xs: 6 }}>
                            <TextField
                                label="Date de publication"
                                type="date"
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                                value={formData.publicationDate}
                                onChange={(e) => handleChange('publicationDate', e.target.value)}
                                error={!!errors.publicationDate}
                                helperText={errors.publicationDate}
                            />
                        </Grid>
                        <Grid size={{ xs: 6 }}>
                            <TextField
                                select
                                label="Statut"
                                fullWidth
                                value={formData.status}
                                onChange={(e) => handleChange('status', e.target.value)}
                                error={!!errors.status}
                                helperText={errors.status}
                            >
                                <MenuItem value="DRAFT">Brouillon</MenuItem>
                                <MenuItem value="PUBLISHED">Publié</MenuItem>
                                <MenuItem value="ARCHIVED">Archivé</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={formData.isOpenAccess}
                                        onChange={(e) => handleChange('isOpenAccess', e.target.checked)}
                                    />
                                }
                                label="Open Access"
                            />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <TextField
                                label="Description"
                                multiline
                                rows={3}
                                fullWidth
                                value={formData.description}
                                onChange={(e) => handleChange('description', e.target.value)}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Annuler</Button>
                    <Button type="submit" variant="contained" color="primary">
                        Enregistrer
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}
