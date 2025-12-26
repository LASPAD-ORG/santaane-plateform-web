/**
 * Public API service for fetching published manuscripts
 * No authentication required
 */

export interface PublicAuthor {
  id: number;
  fullName: string;
  orcidId?: string;
  bio?: string;
  position?: string;
  institution?: string;
}

export interface PublicManuscriptSummary {
  id: number;
  title: string;
  abstract?: string;
  keywords?: string;
  themeName?: string;
  sectionName: string;
  languageName: string;
  authorName: string;
  authorId: number;
  publishedAt?: string;
  createdAt: string;
}

export interface PublicManuscriptDetail {
  id: number;
  title: string;
  abstract?: string;
  keywords?: string;
  themeId?: number;
  themeName?: string;
  sectionId: number;
  sectionName: string;
  languageId: number;
  languageName: string;
  pdfFilename: string;
  author: PublicAuthor;
  publishedAt?: string;
  createdAt: string;
}

export interface PublicManuscriptListResponse {
  manuscripts: PublicManuscriptSummary[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface PublicAuthorDetail {
  id: number;
  fullName: string;
  orcidId?: string;
  bio?: string;
  position?: string;
  institution?: string;
  publicationsCount: number;
  manuscripts: PublicManuscriptSummary[];
}

export interface FilterOption {
  id: number;
  name: string;
}

export interface FilterOptions {
  themes: FilterOption[];
  sections: FilterOption[];
  languages: FilterOption[];
}

export interface PublicStats {
  publishedManuscripts: number;
  authors: number;
  themes: number;
}

export interface SearchParams {
  q?: string;
  themeId?: number;
  sectionId?: number;
  languageId?: number;
  authorId?: number;
  page?: number;
  pageSize?: number;
}

class PublicApiService {
  private baseUrl = '/api/public';

  async searchManuscripts(params: SearchParams = {}): Promise<PublicManuscriptListResponse> {
    const searchParams = new URLSearchParams();
    
    if (params.q) searchParams.set('q', params.q);
    if (params.themeId) searchParams.set('themeId', params.themeId.toString());
    if (params.sectionId) searchParams.set('sectionId', params.sectionId.toString());
    if (params.languageId) searchParams.set('languageId', params.languageId.toString());
    if (params.authorId) searchParams.set('authorId', params.authorId.toString());
    if (params.page) searchParams.set('page', params.page.toString());
    if (params.pageSize) searchParams.set('pageSize', params.pageSize.toString());
    
    const response = await fetch(`${this.baseUrl}/manuscripts?${searchParams.toString()}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch manuscripts');
    }
    
    return response.json();
  }

  async getRecentPublications(limit: number = 10): Promise<PublicManuscriptSummary[]> {
    const response = await fetch(`${this.baseUrl}/manuscripts/recent?limit=${limit}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch recent publications');
    }
    
    return response.json();
  }

  async getManuscriptDetail(id: number): Promise<PublicManuscriptDetail> {
    const response = await fetch(`${this.baseUrl}/manuscripts/${id}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Manuscript not found');
      }
      throw new Error('Failed to fetch manuscript');
    }
    
    return response.json();
  }

  async getAuthorProfile(id: number): Promise<PublicAuthorDetail> {
    const response = await fetch(`${this.baseUrl}/authors/${id}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Author not found');
      }
      throw new Error('Failed to fetch author');
    }
    
    return response.json();
  }

  async getFilterOptions(): Promise<FilterOptions> {
    const response = await fetch(`${this.baseUrl}/filters`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch filters');
    }
    
    return response.json();
  }

  async getStats(): Promise<PublicStats> {
    const response = await fetch(`${this.baseUrl}/stats`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch stats');
    }
    
    return response.json();
  }

  async getActiveThemes(): Promise<ActiveTheme[]> {
    const response = await fetch('/api/public/themes');
    
    if (!response.ok) {
      throw new Error('Failed to fetch themes');
    }
    
    return response.json();
  }
}

export interface ActiveTheme {
  id: number;
  title: string;
  description: string | null;
  date_limite: string | null;
  created_at: string;
  updated_at: string;
}

export const publicApiService = new PublicApiService();
