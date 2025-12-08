import React from 'react';
import { Box, ToggleButton, ToggleButtonGroup, Tooltip } from '@mui/material';
import {
    NearMe as CursorIcon,
    BorderColor as HighlightIcon,
    Brush as PenIcon,
    NoteAdd as NoteIcon,
    Undo as UndoIcon,
    Save as SaveIcon
} from '@mui/icons-material';
import { Tool } from './types';

interface ToolbarProps {
    activeTool: Tool;
    onToolChange: (tool: Tool) => void;
    onUndo: () => void;
    onSave: () => void;
    canUndo: boolean;
    isSaving: boolean;
}

export const Toolbar: React.FC<ToolbarProps> = ({
    activeTool,
    onToolChange,
    onUndo,
    onSave,
    canUndo,
    isSaving
}) => {
    const handleToolChange = (
        event: React.MouseEvent<HTMLElement>,
        newTool: Tool | null
    ) => {
        if (newTool !== null) {
            onToolChange(newTool);
        }
    };

    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                p: 1,
                bgcolor: 'background.paper',
                borderBottom: '1px solid',
                borderColor: 'divider'
            }}
        >
            <ToggleButtonGroup
                value={activeTool}
                exclusive
                onChange={handleToolChange}
                aria-label="annotation tools"
                size="small"
            >
                <ToggleButton value="cursor" aria-label="cursor">
                    <Tooltip title="Sélectionner">
                        <CursorIcon fontSize="small" />
                    </Tooltip>
                </ToggleButton>
                <ToggleButton value="highlight" aria-label="highlight">
                    <Tooltip title="Surligner">
                        <HighlightIcon fontSize="small" />
                    </Tooltip>
                </ToggleButton>
                <ToggleButton value="pen" aria-label="pen">
                    <Tooltip title="Dessiner">
                        <PenIcon fontSize="small" />
                    </Tooltip>
                </ToggleButton>
                <ToggleButton value="note" aria-label="note">
                    <Tooltip title="Ajouter une note">
                        <NoteIcon fontSize="small" />
                    </Tooltip>
                </ToggleButton>
            </ToggleButtonGroup>

            <Box sx={{ flexGrow: 1 }} />

            <Tooltip title="Annuler">
                <span>
                    <ToggleButton
                        value="undo"
                        selected={false}
                        onChange={onUndo}
                        disabled={!canUndo}
                        size="small"
                        sx={{ border: '1px solid rgba(0, 0, 0, 0.12)' }}
                    >
                        <UndoIcon fontSize="small" />
                    </ToggleButton>
                </span>
            </Tooltip>

            <Tooltip title="Sauvegarder">
                <span>
                    <ToggleButton
                        value="save"
                        selected={false}
                        onChange={onSave}
                        disabled={isSaving}
                        size="small"
                        sx={{ border: '1px solid rgba(0, 0, 0, 0.12)' }}
                    >
                        <SaveIcon fontSize="small" />
                    </ToggleButton>
                </span>
            </Tooltip>
        </Box>
    );
};
