'use client';

import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Chip,
    Tooltip,
    Box,
    Typography,
} from '@mui/material';
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
    LibraryBooks as IssuesIcon,
} from '@mui/icons-material';
import { Volume } from '../fetchers/useFetchGestionVolumes';

interface VolumeListProps {
    volumes: Volume[];
    onEdit: (volume: Volume) => void;
    onDelete: (volume: Volume) => void;
    onManageIssues: (volume: Volume) => void;
}

export default function VolumeList({
    volumes,
    onEdit,
    onDelete,
    onManageIssues,
}: VolumeListProps) {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PUBLISHED':
                return 'success';
            case 'DRAFT':
                return 'warning';
            case 'ARCHIVED':
                return 'default';
            default:
                return 'default';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'PUBLISHED':
                return 'Publié';
            case 'DRAFT':
                return 'Brouillon';
            case 'ARCHIVED':
                return 'Archivé';
            default:
                return status;
        }
    };

    return (
        <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
            <Table sx={{ minWidth: 650 }} aria-label="volume table">
                <TableHead>
                    <TableRow>
                        <TableCell>Titre</TableCell>
                        <TableCell>Année</TableCell>
                        <TableCell>Statut</TableCell>
                        <TableCell align="center">Numéros</TableCell>
                        <TableCell align="right">Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {volumes.map((volume) => (
                        <TableRow
                            key={volume.id}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row">
                                <Box>
                                    <Typography variant="subtitle2">{volume.title}</Typography>
                                    {volume.description && (
                                        <Typography variant="caption" color="text.secondary">
                                            {volume.description}
                                        </Typography>
                                    )}
                                </Box>
                            </TableCell>
                            <TableCell>{volume.year}</TableCell>
                            <TableCell>
                                <Chip
                                    label={getStatusLabel(volume.status)}
                                    color={getStatusColor(volume.status)}
                                    size="small"
                                    variant="outlined"
                                />
                            </TableCell>
                            <TableCell align="center">
                                <Chip label={volume.issues.length} size="small" />
                            </TableCell>
                            <TableCell align="right">
                                <Tooltip title="Gérer les numéros">
                                    <IconButton onClick={() => onManageIssues(volume)} color="primary" size="small">
                                        <IssuesIcon />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Modifier">
                                    <IconButton onClick={() => onEdit(volume)} size="small">
                                        <EditIcon />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Supprimer">
                                    <IconButton onClick={() => onDelete(volume)} color="error" size="small">
                                        <DeleteIcon />
                                    </IconButton>
                                </Tooltip>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
