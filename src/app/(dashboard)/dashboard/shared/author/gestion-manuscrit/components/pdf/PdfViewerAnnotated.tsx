'use client';

import React, { useState, useEffect } from 'react';
import { Document, pdfjs } from 'react-pdf';
import { Box, CircularProgress, Typography, Alert } from '@mui/material';
import { PdfPage } from './PdfPage';
import { Toolbar } from './Toolbar';
import { Annotation, Tool } from './types';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Configure worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PdfViewerAnnotatedProps {
    fileUrl: string;
    initialAnnotations?: Annotation[];
    onSaveAnnotations?: (annotations: Annotation[]) => void;
    readOnly?: boolean;
}

export const PdfViewerAnnotated: React.FC<PdfViewerAnnotatedProps> = ({
    fileUrl,
    initialAnnotations = [],
    onSaveAnnotations,
    readOnly = false
}) => {
    const [numPages, setNumPages] = useState<number | null>(null);
    const [annotations, setAnnotations] = useState<Annotation[]>(initialAnnotations);
    const [activeTool, setActiveTool] = useState<Tool>('cursor');
    const [scale, setScale] = useState(1.0);
    const [isSaving, setIsSaving] = useState(false);

    // History for undo
    const [history, setHistory] = useState<Annotation[][]>([initialAnnotations]);
    const [historyIndex, setHistoryIndex] = useState(0);

    const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
        setNumPages(numPages);
    };

    const handleAddAnnotation = (annotation: Annotation) => {
        if (readOnly) return;

        const newAnnotations = [...annotations, annotation];
        setAnnotations(newAnnotations);

        // Update history
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push(newAnnotations);
        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
    };

    const handleUndo = () => {
        if (historyIndex > 0) {
            const newIndex = historyIndex - 1;
            setHistoryIndex(newIndex);
            setAnnotations(history[newIndex]);
        }
    };

    const handleSave = async () => {
        if (onSaveAnnotations) {
            setIsSaving(true);
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            onSaveAnnotations(annotations);
            setIsSaving(false);
        }
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 2 }}>
            {!readOnly && (
                <Toolbar
                    activeTool={activeTool}
                    onToolChange={setActiveTool}
                    onUndo={handleUndo}
                    onSave={handleSave}
                    canUndo={historyIndex > 0}
                    isSaving={isSaving}
                />
            )}

            <Box
                sx={{
                    flexGrow: 1,
                    overflow: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    bgcolor: 'grey.100',
                    p: 4,
                    borderRadius: 2
                }}
            >
                <Document
                    file={fileUrl}
                    onLoadSuccess={onDocumentLoadSuccess}
                    loading={<CircularProgress />}
                    error={
                        <Alert severity="error">
                            Impossible de charger le document PDF. Vérifiez l'URL ou le format.
                        </Alert>
                    }
                >
                    {Array.from(new Array(numPages), (el, index) => (
                        <PdfPage
                            key={`page_${index + 1}`}
                            pageNumber={index + 1}
                            scale={scale}
                            annotations={annotations.filter(a => a.pageNumber === index + 1)}
                            activeTool={readOnly ? 'cursor' : activeTool}
                            onAddAnnotation={handleAddAnnotation}
                        />
                    ))}
                </Document>
            </Box>
        </Box>
    );
};
