export type AnnotationType = 'highlight' | 'drawing' | 'note';

export interface BaseAnnotation {
    id: string;
    pageNumber: number;
    type: AnnotationType;
    author: string;
    createdAt: string;
}

export interface HighlightAnnotation extends BaseAnnotation {
    type: 'highlight';
    rects: { x: number; y: number; width: number; height: number }[];
    text?: string;
}

export interface DrawingAnnotation extends BaseAnnotation {
    type: 'drawing';
    points: { x: number; y: number }[];
    color: string;
    thickness: number;
}

export interface NoteAnnotation extends BaseAnnotation {
    type: 'note';
    x: number;
    y: number;
    content: string;
}

export type Annotation = HighlightAnnotation | DrawingAnnotation | NoteAnnotation;

export type Tool = 'cursor' | 'highlight' | 'pen' | 'note';
