import { Coauthor } from './manuscript';

export interface AuthorInfo {
  email: string;
  fullName: string;
  orcidId: string;
  bio: string;
  position: string;
  institution: string;
}

export interface ManuscriptDetail {
  id: number;
  title: string;
  abstract: string;
  keywords: string;
  themeId: number | null;
  themeName: string | null;
  sectionId: number;
  sectionName: string;
  languageId: number;
  languageName: string;
  status: string;
  pdfFilename: string;
  docxFilename?: string | null;
  author: AuthorInfo;
  coauthors?: Coauthor[];
  createdAt: string;
  updatedAt: string;
}
