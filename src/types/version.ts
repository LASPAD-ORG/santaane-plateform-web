export interface ManuscriptVersion {
  id: number;
  manuscriptId: number;
  versionNumber: number;
  pdfFilename: string;
  docxFilename?: string | null;
  initialDocxFilename?: string | null;
  title: string;
  abstract?: string | null;
  keywords?: string | null;
  createdAt: string;
  archivedAt: string;
}

export interface ArchivedGrid {
  id: number;
  versionId: number;
  evaluatorId: number;
  evaluatorKind?: string | null;
  originalityOfIdeas?: string | null;
  methodologyRigor?: string | null;
  theoreticalApproach?: string | null;
  presentationClarity?: string | null;
  strengths?: string | null;
  weaknesses?: string | null;
  suggestions?: string | null;
  editorialLineFit?: string | null;
  globalOpinion?: string | null;
  recommendation?: string | null;
  submittedAt?: string | null;
}

export interface ArchivedAnnotation {
  id: number;
  versionId: number;
  evaluatorId: number;
  evaluatorKind?: string | null;
  annotationType?: string | null;
  createdByRole?: string | null;
  pageNumber?: number | null;
  xPosition?: number | null;
  yPosition?: number | null;
  positionData?: string | null;
  comment?: string | null;
  contentData?: string | null;
  createdAt?: string | null;
}