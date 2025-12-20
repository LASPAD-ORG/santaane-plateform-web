import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Box,
    Typography
} from '@mui/material';
import { NoteAnnotation } from './types';

interface NoteDialogProps {
    open: boolean;
    note: NoteAnnotation | null;
    onClose: () => void;
    onSave: (content: string) => void;
}

export const NoteDialog: React.FC<NoteDialogProps> = ({
    open,
    note,
    onClose,
    onSave
}) => {
    const [content, setContent] = useState('');

    useEffect(() => {
        if (note) {
            setContent(note.content);
        } else {
            setContent('');
        }
    }, [note, open]);

    const handleSave = () => {
        if (content.trim()) {
            onSave(content.trim());
            setContent('');
        }
    };

    const handleClose = () => {
        setContent('');
        onClose();
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        // Ctrl+Enter ou Cmd+Enter pour sauvegarder rapidement
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            handleSave();
        }
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 2
                }
            }}
        >
            <DialogTitle sx={{ fontWeight: 600 }}>
                {note ? 'Modifier la note' : 'Nouvelle note'}
            </DialogTitle>
            <DialogContent>
                {note && (
                    <Box sx={{ mb: 2, p: 1.5, bgcolor: 'grey.50', borderRadius: 1 }}>
                        <Typography variant="caption" color="text.secondary" display="block">
                            Auteur : {note.author}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            Date : {new Date(note.createdAt).toLocaleString('fr-FR', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </Typography>
                    </Box>
                )}
                <TextField
                    autoFocus
                    multiline
                    rows={6}
                    fullWidth
                    label="Contenu de la note"
                    placeholder="Saisissez le contenu de votre note..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    onKeyDown={handleKeyDown}
                    variant="outlined"
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            borderRadius: 2
                        }
                    }}
                />
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                    Astuce : Utilisez Ctrl+Entrée pour enregistrer rapidement
                </Typography>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button
                    onClick={handleClose}
                    variant="outlined"
                    sx={{
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 600
                    }}
                >
                    Annuler
                </Button>
                <Button
                    onClick={handleSave}
                    variant="contained"
                    disabled={!content.trim()}
                    sx={{
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 600
                    }}
                >
                    Enregistrer
                </Button>
            </DialogActions>
        </Dialog>
    );
};
