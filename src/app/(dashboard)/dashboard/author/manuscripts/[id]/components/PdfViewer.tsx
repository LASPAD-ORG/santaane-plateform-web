'use client';

import '@/lib/pdfjs-polyfill';
import { useState, useMemo } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Box, IconButton, Typography, CircularProgress, Paper } from '@mui/material';
import { ZoomIn, ZoomOut, NavigateBefore, NavigateNext } from '@mui/icons-material';

// Configure PDF.js worker - use the worker from react-pdf package
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PdfViewerProps {
  pdfUrl: string;
}

export default function PdfViewer({ pdfUrl }: PdfViewerProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);
  const [loading, setLoading] = useState<boolean>(true);

  // Memoize file object to prevent unnecessary reloads
  const file = useMemo(() => ({ url: pdfUrl }), [pdfUrl]);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setLoading(false);
  }

  function onDocumentLoadError(error: Error) {
    console.error('Error loading PDF:', error);
    setLoading(false);
  }

  const changePage = (offset: number) => {
    setPageNumber((prevPageNumber) => {
      const newPage = prevPageNumber + offset;
      return Math.min(Math.max(1, newPage), numPages);
    });
  };

  const zoomIn = () => {
    setScale((prevScale) => Math.min(prevScale + 0.2, 3.0));
  };

  const zoomOut = () => {
    setScale((prevScale) => Math.max(prevScale - 0.2, 0.5));
  };

  return (
    <Box>
      {/* Contrôles */}
      <Paper
        elevation={1}
        sx={{
          p: 2,
          mb: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        {/* Navigation pages */}
        <Box display="flex" alignItems="center" gap={1}>
          <IconButton
            onClick={() => changePage(-1)}
            disabled={pageNumber <= 1}
            size="small"
          >
            <NavigateBefore />
          </IconButton>
          <Typography variant="body2">
            Page {pageNumber} / {numPages || '?'}
          </Typography>
          <IconButton
            onClick={() => changePage(1)}
            disabled={pageNumber >= numPages}
            size="small"
          >
            <NavigateNext />
          </IconButton>
        </Box>

        {/* Contrôles zoom */}
        <Box display="flex" alignItems="center" gap={1}>
          <IconButton onClick={zoomOut} size="small" disabled={scale <= 0.5}>
            <ZoomOut />
          </IconButton>
          <Typography variant="body2">{Math.round(scale * 100)}%</Typography>
          <IconButton onClick={zoomIn} size="small" disabled={scale >= 3.0}>
            <ZoomIn />
          </IconButton>
        </Box>
      </Paper>

      {/* Viewer PDF */}
      <Box
        sx={{
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 1,
          overflow: 'auto',
          maxHeight: '800px',
          display: 'flex',
          justifyContent: 'center',
          bgcolor: 'grey.100',
          p: 2,
        }}
      >
        {loading && (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="400px"
          >
            <CircularProgress />
          </Box>
        )}

        <Document
          file={file}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={onDocumentLoadError}
          loading={<CircularProgress />}
        >
          <Page
            pageNumber={pageNumber}
            scale={scale}
            renderTextLayer={false}
            renderAnnotationLayer={false}
          />
        </Document>
      </Box>
    </Box>
  );
}
