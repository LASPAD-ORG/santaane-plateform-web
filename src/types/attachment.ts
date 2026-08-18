export interface Attachment {
  id: number;
  manuscriptId: number;
  title: string;
  description?: string | null;
  originalFilename: string;
  contentType?: string | null;
  fileSize?: number | null;
  uploadedById: number;
  uploadedByRole: string;
  visibleToAuthor: boolean;
  attachmentType: string;
  requestId?: number | null;
  createdAt: string;
}

export interface AttachmentRequest {
  id: number;
  manuscriptId: number;
  title: string;
  description?: string | null;
  requestedById: number;
  status: string;
  fulfilledByAttachmentId?: number | null;
  createdAt: string;
  fulfilledAt?: string | null;
}