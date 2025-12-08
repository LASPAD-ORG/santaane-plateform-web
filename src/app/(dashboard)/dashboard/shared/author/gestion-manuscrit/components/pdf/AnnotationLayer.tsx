import React, { useRef, useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { Annotation, Tool, DrawingAnnotation, HighlightAnnotation } from './types';
import { v4 as uuidv4 } from 'uuid';

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
        } else if (activeTool === 'note') {
            const { x, y } = getCoordinates(e);
            // For note, we might want to open a dialog or just place it.
            // For simplicity, let's just place a marker.
            const newAnnotation: Annotation = {
                id: uuidv4(),
                pageNumber,
                type: 'note',
                x,
                y,
                content: 'Nouvelle note',
                author: 'Me',
                createdAt: new Date().toISOString()
            };
            onAddAnnotation(newAnnotation);
        }

        setCurrentPath([]);
        setCurrentRect(null);
        setStartPoint(null);
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
            </svg>

            {/* Render Notes */}
            {annotations.map(ann => {
                if (ann.type === 'note') {
                    return (
                        <Box
                            key={ann.id}
                            sx={{
                                position: 'absolute',
                                left: ann.x * scale,
                                top: ann.y * scale,
                                width: 20,
                                height: 20,
                                bgcolor: 'warning.main',
                                borderRadius: '50%',
                                transform: 'translate(-50%, -50%)',
                                cursor: 'pointer',
                                pointerEvents: 'auto'
                            }}
                            title={ann.content}
                        />
                    );
                }
                return null;
            })}
        </Box>
    );
};
