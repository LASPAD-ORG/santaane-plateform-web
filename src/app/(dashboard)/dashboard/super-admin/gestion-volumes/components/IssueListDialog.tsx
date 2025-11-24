'use client';

import { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box,
    Typography,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    IconButton,
    Chip,
    Divider,
} from '@mui/material';
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
    Add as AddIcon,
} from '@mui/icons-material';
import { Volume, Issue } from '../fetchers/useFetchGestionVolumes';
import IssueDialog from './IssueDialog';

interface IssueListDialogProps {
    open: boolean;
    onClose: () => void;
    volume: Volume | null;
    onUpdateVolume: (updatedVolume: Volume) => void;
}

export default function IssueListDialog({
    open,
    onClose,
    volume,
    onUpdateVolume,
}: IssueListDialogProps) {
    const [issueDialogOpen, setIssueDialogOpen] = useState(false);
    const [selectedIssue, setSelectedIssue] = useState<Issue | undefined>(undefined);

    if (!volume) return null;

    const handleAddIssue = () => {
        setSelectedIssue(undefined);
        setIssueDialogOpen(true);
    };

    const handleEditIssue = (issue: Issue) => {
        setSelectedIssue(issue);
        setIssueDialogOpen(true);
    };

    const handleDeleteIssue = (issueId: string) => {
        const updatedIssues = volume.issues.filter((i) => i.id !== issueId);
        onUpdateVolume({ ...volume, issues: updatedIssues });
    };

    const handleSaveIssue = (issueData: Partial<Issue>) => {
        let updatedIssues: Issue[];
        if (selectedIssue) {
            // Edit existing issue
            const updatedIssues = volume.issues.map((i) =>
                i.id === selectedIssue.id ? { ...i, ...issueData } as Issue : i
            );
            onUpdateVolume({ ...volume, issues: updatedIssues });
        } else {
            // Create new issue
            const newIssue: Issue = {
                id: `new-${Date.now()}`,
                volumeId: volume.id,
                ...issueData,
            } as Issue;
            const updatedIssues = [...volume.issues, newIssue];
            onUpdateVolume({ ...volume, issues: updatedIssues });
        }
    };

    return (
        <>
            <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
                <DialogTitle>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="h6">
                            Numéros du {volume.title}
                        </Typography>
                        <Button
                            startIcon={<AddIcon />}
                            variant="contained"
                            size="small"
                            onClick={handleAddIssue}
                        >
                            Ajouter un numéro
                        </Button>
                    </Box>
                </DialogTitle>
                <DialogContent>
                    {volume.issues.length === 0 ? (
                        <Box sx={{ textAlign: 'center', py: 4 }}>
                            <Typography color="text.secondary">
                                Aucun numéro dans ce volume.
                            </Typography>
                        </Box>
                    ) : (
                        <List>
                            {volume.issues.map((issue, index) => (
                                <Box key={issue.id}>
                                    {index > 0 && <Divider />}
                                    <ListItem>
                                        <ListItemText
                                            primary={
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <Typography variant="subtitle1">{issue.title}</Typography>
                                                    <Chip
                                                        label={issue.status}
                                                        size="small"
                                                        color={issue.status === 'PUBLISHED' ? 'success' : 'default'}
                                                        variant="outlined"
                                                    />
                                                    {issue.isOpenAccess && (
                                                        <Chip
                                                            label="Open Access"
                                                            size="small"
                                                            color="info"
                                                            variant="outlined"
                                                        />
                                                    )}
                                                </Box>
                                            }
                                            secondary={
                                                <>
                                                    <Typography variant="body2" component="span" display="block">
                                                        Publié le : {issue.publicationDate}
                                                    </Typography>
                                                    {issue.description && (
                                                        <Typography variant="body2" color="text.secondary">
                                                            {issue.description}
                                                        </Typography>
                                                    )}
                                                </>
                                            }
                                        />
                                        <ListItemSecondaryAction>
                                            <IconButton edge="end" onClick={() => handleEditIssue(issue)} sx={{ mr: 1 }}>
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton edge="end" onClick={() => handleDeleteIssue(issue.id)} color="error">
                                                <DeleteIcon />
                                            </IconButton>
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                </Box>
                            ))}
                        </List>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Fermer</Button>
                </DialogActions>
            </Dialog>

            <IssueDialog
                open={issueDialogOpen}
                onClose={() => setIssueDialogOpen(false)}
                onSave={handleSaveIssue}
                issue={selectedIssue}
            />
        </>
    );
}
