import React from 'react';
import { Page } from 'react-pdf';
import { Box } from '@mui/material';
import { AnnotationLayer } from './AnnotationLayer';
import { Annotation, Tool } from './types';

interface PdfPageProps {
    pageNumber: number;
    scale: number;
    annotations: Annotation[];
    activeTool: Tool;
    onAddAnnotation: (annotation: Annotation) => void;
}

export const PdfPage: React.FC<PdfPageProps> = ({
    pageNumber,
    scale,
    annotations,
    activeTool,
    onAddAnnotation
}) => {
    return (
        <Box sx={{ position: 'relative', mb: 2, boxShadow: 3 }}>
            <Page
                pageNumber={pageNumber}
                scale={scale}
                renderTextLayer={false}
                renderAnnotationLayer={false}
            />
            <AnnotationLayer
                pageNumber={pageNumber}
                annotations={annotations}
                activeTool={activeTool}
                onAddAnnotation={onAddAnnotation}
                scale={scale}
            />
        </Box>
    );
};
