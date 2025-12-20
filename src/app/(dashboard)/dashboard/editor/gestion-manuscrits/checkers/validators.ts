export interface ValidationError {
  field: string;
  message: string;
}

export interface ManuscritPayload {
  title: string;
  abstract?: string;
  keywords?: string;
  authorId: string;
  authorName: string;
  categoryId?: string;
  categoryName?: string;
  status: string;
  submittedAt?: string;
}

export function validateTitle(title: string): ValidationError | null {
  if (!title || title.trim().length === 0) {
    return { field: 'title', message: 'Le titre est requis' };
  }
  if (title.length > 500) {
    return {
      field: 'title',
      message: 'Le titre ne peut pas dépasser 500 caractères',
    };
  }
  return null;
}

export function validateAbstract(abstract?: string): ValidationError | null {
  if (abstract && abstract.length > 5000) {
    return {
      field: 'abstract',
      message: 'Le résumé ne peut pas dépasser 5000 caractères',
    };
  }
  return null;
}

export function validateStatus(status: string): ValidationError | null {
  const validStatuses = [
    'DRAFT',
    'SUBMITTED',
    'UNDER_REVIEW',
    'REVISION_REQUESTED',
    'REVISED',
    'ACCEPTED',
    'REJECTED',
    'PUBLISHED',
    'WITHDRAWN',
  ];

  if (!validStatuses.includes(status)) {
    return {
      field: 'status',
      message: 'Statut invalide',
    };
  }
  return null;
}

export function validateReviewerEmail(email: string): ValidationError | null {
  if (!email || email.trim().length === 0) {
    return { field: 'email', message: "L'email de l'évaluateur est requis" };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { field: 'email', message: "Format d'email invalide" };
  }

  return null;
}

export function validateMentorEmail(email: string): ValidationError | null {
  if (!email || email.trim().length === 0) {
    return { field: 'email', message: 'L\'email du mentor est requis' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { field: 'email', message: "Format d'email invalide" };
  }

  return null;
}

export function validateManuscrit(payload: ManuscritPayload): ValidationError[] {
  const errors: ValidationError[] = [];

  const titleError = validateTitle(payload.title);
  if (titleError) errors.push(titleError);

  const abstractError = validateAbstract(payload.abstract);
  if (abstractError) errors.push(abstractError);

  const statusError = validateStatus(payload.status);
  if (statusError) errors.push(statusError);

  return errors;
}

export function canEditManuscrit(manuscritStatus: string, userRole: string): boolean {
  // Seul l'éditeur peut modifier les manuscrits en révision ou soumis
  if (userRole !== 'EDITOR') return false;

  const editableStatuses = ['SUBMITTED', 'UNDER_REVIEW', 'REVISION_REQUESTED'];
  return editableStatuses.includes(manuscritStatus);
}

export function canMakeDecision(manuscritStatus: string, userRole: string): boolean {
  // Seul l'EVALUATOR peut prendre une décision éditoriale
  if (userRole !== 'EVALUATOR') return false;

  return manuscritStatus === 'UNDER_REVIEW';
}

export function canAssignReviewer(manuscritStatus: string, userRole: string): boolean {
  // L'éditeur peut assigner des évaluateurs aux manuscrits soumis ou en révision
  if (userRole !== 'EDITOR') return false;

  const assignableStatuses = ['SUBMITTED', 'UNDER_REVIEW', 'REVISION_REQUESTED'];
  return assignableStatuses.includes(manuscritStatus);
}

export function canAssignMentor(userRole: string): boolean {
  // Seul l'éditeur peut assigner des mentors
  return userRole === 'EDITOR';
}

export function canViewManuscrit(userRole: string): boolean {
  // L'éditeur peut voir tous les manuscrits de son laboratoire
  const allowedRoles = ['EDITOR', 'SUPER_ADMIN'];
  return allowedRoles.includes(userRole);
}
