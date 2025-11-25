import { useMemo } from 'react';
import type { GestionManuscritItem } from '../fetchers/useFetchGestionManuscrit';
import type { ManuscritFilterOptions } from '../components/ManuscritFilters';
import type { ManuscritSortOptions } from '../components/ManuscritSortOptions';

export function useManuscritFilters(
  items: GestionManuscritItem[] | null,
  filters: ManuscritFilterOptions
) {
  return useMemo(() => {
    if (!items) return [];

    return items.filter((item) => {
      // Filtre par terme de recherche
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        const matchesSearch = 
          item.title.toLowerCase().includes(searchLower) ||
          (item.description && item.description.toLowerCase().includes(searchLower)) ||
          (item.contenu && item.contenu.toLowerCase().includes(searchLower)) ||
          `${item.auteurPrenom} ${item.auteurNom}`.toLowerCase().includes(searchLower);
        
        if (!matchesSearch) return false;
      }

      // Filtre par statut
      if (filters.status && item.status !== filters.status) {
        return false;
      }

      // Filtre par auteur
      if (filters.auteur && item.authorId !== filters.auteur) {
        return false;
      }

      // Filtre par spécialité
      if (filters.specialite && item.metadata?.specialites) {
        const hasSpecialite = item.metadata.specialites.some(spec => 
          spec.toLowerCase().includes(filters.specialite.toLowerCase())
        );
        if (!hasSpecialite) return false;
      }


      // Filtre par nombre de commentaires (minimum)
      if (filters.nombreCommentairesMin !== null && 
          item.nombreCommentaires < filters.nombreCommentairesMin) {
        return false;
      }

      // Filtre par nombre de commentaires (maximum)
      if (filters.nombreCommentairesMax !== null && 
          item.nombreCommentaires > filters.nombreCommentairesMax) {
        return false;
      }

      // Filtre par période de création
      if (filters.periodeCreation) {
        const now = new Date();
        const creationDate = new Date(item.createdAt);
        const daysDiff = Math.floor((now.getTime() - creationDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysDiff > Number(filters.periodeCreation)) return false;
      }

      // Filtre par volume (minimum)
      if (filters.volumeMin !== null && item.metadata?.volume && 
          item.metadata.volume < filters.volumeMin) {
        return false;
      }

      // Filtre par volume (maximum)
      if (filters.volumeMax !== null && item.metadata?.volume && 
          item.metadata.volume > filters.volumeMax) {
        return false;
      }

      return true;
    });
  }, [items, filters]);
}

export function useManuscritSorting(
  items: GestionManuscritItem[],
  sortOptions: ManuscritSortOptions
) {
  return useMemo(() => {
    const sortedItems = [...items];
    
    sortedItems.sort((a, b) => {
      let valueA: any;
      let valueB: any;
      
      switch (sortOptions.field) {
        case 'title':
          valueA = a.title.toLowerCase();
          valueB = b.title.toLowerCase();
          break;
        case 'createdAt':
          valueA = new Date(a.createdAt).getTime();
          valueB = new Date(b.createdAt).getTime();
          break;
        case 'updatedAt':
          valueA = new Date(a.updatedAt).getTime();
          valueB = new Date(b.updatedAt).getTime();
          break;
        case 'status':
          // Ordre de priorité : en_attente > brouillon > publie > archive
          const statusOrder = { 'en_attente': 1, 'brouillon': 2, 'publie': 3, 'archive': 4 };
          valueA = statusOrder[a.status as keyof typeof statusOrder] || 5;
          valueB = statusOrder[b.status as keyof typeof statusOrder] || 5;
          break;
        case 'authorId':
          valueA = `${a.auteurPrenom} ${a.auteurNom}`.toLowerCase();
          valueB = `${b.auteurPrenom} ${b.auteurNom}`.toLowerCase();
          break;
        case 'nombreCommentaires':
          valueA = a.nombreCommentaires;
          valueB = b.nombreCommentaires;
          break;
        case 'volume':
          valueA = a.metadata?.volume || 0;
          valueB = b.metadata?.volume || 0;
          break;
        default:
          return 0;
      }
      
      if (valueA < valueB) {
        return sortOptions.direction === 'asc' ? -1 : 1;
      }
      if (valueA > valueB) {
        return sortOptions.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
    
    return sortedItems;
  }, [items, sortOptions]);
}

export function useManuscritPagination(
  filteredItems: GestionManuscritItem[],
  currentPage: number,
  itemsPerPage: number
) {
  return useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedItems = filteredItems.slice(startIndex, endIndex);
    
    return {
      items: paginatedItems,
      totalPages: Math.ceil(filteredItems.length / itemsPerPage),
      startItem: filteredItems.length > 0 ? startIndex + 1 : 0,
      endItem: Math.min(endIndex, filteredItems.length),
      totalItems: filteredItems.length
    };
  }, [filteredItems, currentPage, itemsPerPage]);
}

export function getAvailableAuthors(items: GestionManuscritItem[] | null): Array<{id: string, nom: string, prenom: string}> {
  if (!items) return [];
  
  const authorsMap = new Map();
  
  items.forEach(item => {
    if (!authorsMap.has(item.authorId)) {
      authorsMap.set(item.authorId, {
        id: item.authorId,
        nom: item.auteurNom,
        prenom: item.auteurPrenom
      });
    }
  });
  
  return Array.from(authorsMap.values()).sort((a, b) => 
    `${a.prenom} ${a.nom}`.localeCompare(`${b.prenom} ${b.nom}`)
  );
}

export function getAvailableSpecialites(items: GestionManuscritItem[] | null): string[] {
  if (!items) return [];
  
  const specialitesSet = new Set<string>();
  
  items.forEach(item => {
    if (item.metadata?.specialites) {
      item.metadata.specialites.forEach(spec => specialitesSet.add(spec));
    }
  });
  
  return Array.from(specialitesSet).sort();
}

