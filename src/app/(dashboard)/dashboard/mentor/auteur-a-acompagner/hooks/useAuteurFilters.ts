import { useMemo } from 'react';
import type { AuteurAAcompagnerItem } from '../fetchers/useFetchAuteurAAcompagner';
import type { FilterOptions } from '../components/AuteurFilters';
import type { SortOptions } from '../components/AuteurSortOptions';

export function useAuteurFilters(
  items: AuteurAAcompagnerItem[] | null,
  filters: FilterOptions
) {
  return useMemo(() => {
    if (!items) return [];

    return items.filter((item) => {
      // Filtre par terme de recherche
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        const matchesSearch = 
          item.nom.toLowerCase().includes(searchLower) ||
          item.prenom.toLowerCase().includes(searchLower) ||
          item.email.toLowerCase().includes(searchLower);
        
        if (!matchesSearch) return false;
      }

      // Filtre par statut
      if (filters.statut && item.statut !== filters.statut) {
        return false;
      }

      // Filtre par spécialité
      if (filters.specialite && item.specialites) {
        const hasSpecialite = item.specialites.some(spec => 
          spec.toLowerCase().includes(filters.specialite.toLowerCase())
        );
        if (!hasSpecialite) return false;
      }

      // Filtre par nombre de manuscrits (minimum)
      if (filters.nombreManuscritsMin !== null && 
          item.nombreManuscrits < filters.nombreManuscritsMin) {
        return false;
      }

      // Filtre par nombre de manuscrits (maximum)
      if (filters.nombreManuscritsMax !== null && 
          item.nombreManuscrits > filters.nombreManuscritsMax) {
        return false;
      }

      // Filtre par dernier contact
      if (filters.dernierContactDays !== null) {
        const now = new Date();
        const contactDate = new Date(item.dernierContact);
        const daysDiff = Math.floor((now.getTime() - contactDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysDiff > filters.dernierContactDays) return false;
      }

      // Filtre par statut de manuscrit
      if (filters.statutManuscrit && item.manuscrits) {
        const hasMatchingManuscrit = item.manuscrits.some(manuscrit => 
          manuscrit.statut === filters.statutManuscrit
        );
        if (!hasMatchingManuscrit) return false;
      }

      return true;
    });
  }, [items, filters]);
}

export function useAuteurPagination(
  filteredItems: AuteurAAcompagnerItem[],
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

export function getAvailableSpecialites(items: AuteurAAcompagnerItem[] | null): string[] {
  if (!items) return [];
  
  const specialitesSet = new Set<string>();
  
  items.forEach(item => {
    if (item.specialites) {
      item.specialites.forEach(spec => specialitesSet.add(spec));
    }
  });
  
  return Array.from(specialitesSet).sort();
}

export function useAuteurSorting(
  items: AuteurAAcompagnerItem[],
  sortOptions: SortOptions
) {
  return useMemo(() => {
    const sortedItems = [...items];
    
    sortedItems.sort((a, b) => {
      let valueA: any;
      let valueB: any;
      
      switch (sortOptions.field) {
        case 'nom':
          valueA = `${a.prenom} ${a.nom}`.toLowerCase();
          valueB = `${b.prenom} ${b.nom}`.toLowerCase();
          break;
        case 'dateInscription':
          valueA = new Date(a.dateInscription).getTime();
          valueB = new Date(b.dateInscription).getTime();
          break;
        case 'dernierContact':
          valueA = new Date(a.dernierContact).getTime();
          valueB = new Date(b.dernierContact).getTime();
          break;
        case 'nombreManuscrits':
          valueA = a.nombreManuscrits;
          valueB = b.nombreManuscrits;
          break;
        case 'statut':
          valueA = a.statut;
          valueB = b.statut;
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