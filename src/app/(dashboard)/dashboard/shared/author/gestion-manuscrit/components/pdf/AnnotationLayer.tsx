import React, { useRef, useState, useEffect } from 'react';
import { Box, Tooltip, Typography } from '@mui/material';
import { StickyNote2 as StickyNoteIcon } from '@mui/icons-material';
import { Annotation, Tool, DrawingAnnotation, HighlightAnnotation, NoteAnnotation } from './types';
import { v4 as uuidv4 } from 'uuid';
import { NoteDialog } from './NoteDialog';

interface AnnotationLayerProps {
    pageNumber: number;
    annotations: Annotation[];
    activeTool: Tool;
    onAddAnnotation: (annotation: Annotation) => void;
    scale: number;
}

export const AnnotationLayer: React.FC<AnnotationLayerProps> = ({
    pageNumber,
    annotations,
    activeTool,
    onAddAnnotation,
    scale
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [currentPath, setCurrentPath] = useState<{ x: number; y: number }[]>([]);
    const [startPoint, setStartPoint] = useState<{ x: number; y: number } | null>(null);
    const [currentRect, setCurrentRect] = useState<{ x: number; y: number; width: number; height: number } | null>(null);

    // Note dialog state
    const [noteDialogOpen, setNoteDialogOpen] = useState(false);
    const [selectedNote, setSelectedNote] = useState<NoteAnnotation | null>(null);
    const [pendingNotePosition, setPendingNotePosition] = useState<{ x: number; y: number } | null>(null);

    const getCoordinates = (e: React.MouseEvent) => {
        if (!containerRef.current) return { x: 0, y: 0 };
        const rect = containerRef.current.getBoundingClientRect();
        return {
            x: (e.clientX - rect.left) / scale,
            y: (e.clientY - rect.top) / scale
        };
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        if (activeTool === 'cursor') return;

        const { x, y } = getCoordinates(e);

        // For notes, we use click instead of drag
        if (activeTool === 'note') {
            // Use the same coordinate system as drawings/highlights
            setPendingNotePosition({ x, y });
            setSelectedNote(null);
            setNoteDialogOpen(true);
            return;
        }

        setIsDrawing(true);
        setStartPoint({ x, y });

        if (activeTool === 'pen') {
            setCurrentPath([{ x, y }]);
        } else if (activeTool === 'highlight') {
            setCurrentRect({ x, y, width: 0, height: 0 });
        }
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDrawing) return;

        const { x, y } = getCoordinates(e);

        if (activeTool === 'pen') {
            setCurrentPath(prev => [...prev, { x, y }]);
        } else if (activeTool === 'highlight' && startPoint) {
            setCurrentRect({
                x: Math.min(startPoint.x, x),
                y: Math.min(startPoint.y, y),
                width: Math.abs(x - startPoint.x),
                height: Math.abs(y - startPoint.y)
            });
        }
    };

    const handleMouseUp = (e: React.MouseEvent) => {
        if (!isDrawing) return;
        setIsDrawing(false);

        if (activeTool === 'pen' && currentPath.length > 1) {
            const newAnnotation: DrawingAnnotation = {
                id: uuidv4(),
                pageNumber,
                type: 'drawing',
                points: currentPath,
                color: 'red',
                thickness: 2,
                author: 'Me',
                createdAt: new Date().toISOString()
            };
            onAddAnnotation(newAnnotation);
        } else if (activeTool === 'highlight' && currentRect && currentRect.width > 0 && currentRect.height > 0) {
            const newAnnotation: HighlightAnnotation = {
                id: uuidv4(),
                pageNumber,
                type: 'highlight',
                rects: [currentRect],
                author: 'Me',
                createdAt: new Date().toISOString()
            };
            onAddAnnotation(newAnnotation);
        }

        setCurrentPath([]);
        setCurrentRect(null);
        setStartPoint(null);
    };

    const handleNoteClick = (note: NoteAnnotation) => {
        setSelectedNote(note);
        setPendingNotePosition(null);
        setNoteDialogOpen(true);
    };

    const handleNoteDialogSave = (content: string) => {
        if (selectedNote) {
            // Edit existing note
            const updatedNote: NoteAnnotation = {
                ...selectedNote,
                content
            };
            // In a real implementation, we would update the annotation
            // For now, we'll just create a new one (the parent component should handle updates)
            onAddAnnotation(updatedNote);
        } else if (pendingNotePosition) {
            // Create new note
            const newAnnotation: NoteAnnotation = {
                id: uuidv4(),
                pageNumber,
                type: 'note',
                x: pendingNotePosition.x,
                y: pendingNotePosition.y,
                content,
                author: 'Me',
                createdAt: new Date().toISOString()
            };
            onAddAnnotation(newAnnotation);
        }
        setNoteDialogOpen(false);
        setSelectedNote(null);
        setPendingNotePosition(null);
    };

    const handleNoteDialogClose = () => {
        setNoteDialogOpen(false);
        setSelectedNote(null);
        setPendingNotePosition(null);
    };

    return (
        <Box
            ref={containerRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: 10,
                cursor: activeTool === 'cursor' ? 'default' : 'crosshair',
                pointerEvents: activeTool === 'cursor' ? 'none' : 'auto'
            }}
        >
            <svg
                width="100%"
                height="100%"
                style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}
            >
                {/* Render existing annotations */}
                {annotations.map(ann => {
                    if (ann.type === 'drawing') {
                        const pathData = `M ${ann.points.map(p => `${p.x * scale} ${p.y * scale}`).join(' L ')}`;
                        return (
                            <path
                                key={ann.id}
                                d={pathData}
                                stroke={ann.color}
                                strokeWidth={ann.thickness * scale}
                                fill="none"
                            />
                        );
                    } else if (ann.type === 'highlight') {
                        return ann.rects.map((r, i) => (
                            <rect
                                key={`${ann.id}-${i}`}
                                x={r.x * scale}
                                y={r.y * scale}
                                width={r.width * scale}
                                height={r.height * scale}
                                fill="yellow"
                                fillOpacity={0.4}
                            />
                        ));
                    }
                    return null;
                })}

                {/* Render current drawing/highlight */}
                {isDrawing && activeTool === 'pen' && (
                    <path
                        d={`M ${currentPath.map(p => `${p.x * scale} ${p.y * scale}`).join(' L ')}`}
                        stroke="red"
                        strokeWidth={2 * scale}
                        fill="none"
                    />
                )}
                {isDrawing && activeTool === 'highlight' && currentRect && (
                    <rect
                        x={currentRect.x * scale}
                        y={currentRect.y * scale}
                        width={currentRect.width * scale}
                        height={currentRect.height * scale}
                        fill="yellow"
                        fillOpacity={0.4}
                    />
                )}

                {/* Render Notes inside SVG using foreignObject */}
                {annotations.map(ann => {
                    if (ann.type === 'note') {
                        return (
                            <foreignObject
                                key={ann.id}
                                x={ann.x * scale - 14}
                                y={ann.y * scale - 14}
                                width={28}
                                height={28}
                                style={{ overflow: 'visible', pointerEvents: 'auto' }}
                            >
                                <Tooltip
                                    title={
                                        <Box>
                                            <Typography variant="caption" fontWeight={600} display="block">
                                                {ann.author}
                                            </Typography>
                                            <Typography variant="body2" sx={{ mt: 0.5 }}>
                                                {ann.content}
                                            </Typography>
                                        </Box>
                                    }
                                    arrow
                                >
                                    <Box
                                        onClick={() => handleNoteClick(ann)}
                                        sx={{
                                            width: 28,
                                            height: 28,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            cursor: 'pointer',
                                            transition: 'transform 0.2s',
                                            '&:hover': {
                                                transform: 'scale(1.1)'
                                            }
                                        }}
                                    >
                                        <StickyNoteIcon
                                            sx={{
                                                fontSize: 28,
                                                color: 'warning.main',
                                                filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.2))'
                                            }}
                                        />
                                    </Box>
                                </Tooltip>
                            </foreignObject>
                        );
                    }
                    return null;
                })}
            </svg>

            <NoteDialog
                open={noteDialogOpen}
                note={selectedNote}
                onClose={handleNoteDialogClose}
                onSave={handleNoteDialogSave}
            />
        </Box>
    );
};
