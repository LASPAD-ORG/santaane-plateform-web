export interface Role {
  id: number;
  name: string;
  description: string;
}

export interface Evaluator {
  id: number;
  email: string;
  fullName: string;
  orcidId: string;
  bio: string;
  position: string;
  institution: string;
  emailVerified: boolean;
  isActive: boolean;
  profilePhoto: string;
  roles: Role[];
  created_at: string;
  updated_at: string;
}

export interface EvaluatorListResponse {
  items: Evaluator[];
  total: number;
  skip: number;
  limit: number;
  has_more: boolean;
}

export interface CreateEvaluatorRequest {
  email: string;
  fullName: string;
  orcidId?: string;
  bio?: string;
  position?: string;
  institution?: string;
}
