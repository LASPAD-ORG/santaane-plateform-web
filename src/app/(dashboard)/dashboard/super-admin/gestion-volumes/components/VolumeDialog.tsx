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
} from '@mui/material';
import { Volume, VolumeStatus } from '../fetchers/useFetchGestionVolumes';

interface VolumeDialogProps {
    open: boolean;
    onClose: () => void;
    onSave: (volume: Partial<Volume>) => void;
    volume?: Volume;
}

interface FormData {
    title: string;
    year: number;
    status: VolumeStatus;
    description: string;
}

const defaultValues: FormData = {
    title: '',
    year: new Date().getFullYear(),
    status: 'DRAFT',
    description: '',
};

export default function VolumeDialog({
    open,
    onClose,
    onSave,
    volume,
}: VolumeDialogProps) {
    const [formData, setFormData] = useState<FormData>(defaultValues);
    const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

    useEffect(() => {
        if (open) {
            if (volume) {
                setFormData({
                    title: volume.title,
                    year: volume.year,
                    status: volume.status,
                    description: volume.description || '',
                });
            } else {
                setFormData(defaultValues);
            }
            setErrors({});
        }
    }, [volume, open]);

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
        if (!formData.year) newErrors.year = "L'année est requise";
        if (!formData.status) newErrors.status = 'Le statut est requis';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        onSave({
            ...volume,
            ...formData,
        });
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                {volume ? 'Modifier le volume' : 'Créer un nouveau volume'}
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
                                label="Année"
                                type="number"
                                fullWidth
                                value={formData.year}
                                onChange={(e) => handleChange('year', parseInt(e.target.value) || '')}
                                error={!!errors.year}
                                helperText={errors.year}
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
