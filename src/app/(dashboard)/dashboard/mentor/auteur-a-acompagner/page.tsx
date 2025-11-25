'use client';

import { useEffect, useState } from 'react';
import { Box, Typography, Button, Grid, Skeleton } from '@mui/material';
import { Person as PersonIcon, Add as AddIcon } from '@mui/icons-material';
import { useFetchAuteurAAcompagner } from './fetchers/useFetchAuteurAAcompagner';
import AuteurAAcompagnerCard from './components/AuteurAAcompagnerCard';
import AuteurFilters, { type FilterOptions } from './components/AuteurFilters';
import AuteurPagination from './components/AuteurPagination';
import AuteurSortOptions, { type SortOptions } from './components/AuteurSortOptions';
import { useAuteurFilters, useAuteurPagination, getAvailableSpecialites, useAuteurSorting } from './hooks/useAuteurFilters';
import { useRouter } from 'next/navigation';

export default function AuteurAAcompagnerPage() {
  const router = useRouter();
  const { data: items, loading, fetch } = useFetchAuteurAAcompagner();
  const [loadingCards, setLoadingCards] = useState(true);
  
  // États pour les filtres et la pagination
  const [filters, setFilters] = useState<FilterOptions>({
    searchTerm: '',
    statut: '',
    specialite: '',
    nombreManuscritsMin: null,
    nombreManuscritsMax: null,
    dernierContactDays: null,
    statutManuscrit: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const [sortOptions, setSortOptions] = useState<SortOptions>({
    field: 'nom',
    direction: 'asc'
  });

  // Filtrage, tri et pagination
  const filteredItems = useAuteurFilters(items, filters);
  const sortedItems = useAuteurSorting(filteredItems, sortOptions);
  const paginationData = useAuteurPagination(sortedItems, currentPage, itemsPerPage);
  const availableSpecialites = getAvailableSpecialites(items);

  useEffect(() => {
    const loadData = async () => {
      setLoadingCards(true);
      await fetch();
      // Simulate additional loading time for smooth UX
      setTimeout(() => {
        setLoadingCards(false);
      }, 300);
    };
    loadData();
  }, []);

  // Handlers
  const handleView = (item: any) => {
    router.push(`/dashboard/mentor/auteur-a-acompagner/${item.id}`);
  };

  const handleCreate = () => {
    router.push(`/dashboard/mentor/auteur-a-acompagner/new`);
  };

  const handleFiltersChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page when items per page changes
  };

  const handleSortChange = (newSortOptions: SortOptions) => {
    setSortOptions(newSortOptions);
    setCurrentPage(1); // Reset to first page when sort changes
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
            Auteurs à Accompagner
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Gérez vos auteurs et suivez leurs manuscrits
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreate}
          color="primary"
          sx={{ 
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 600,
            px: 3
          }}
        >
          Ajouter un auteur
        </Button>
      </Box>

      {/* Loading state */}
      {loadingCards && (
        <Grid container spacing={3}>
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <Grid key={item} size={{ xs: 12, md: 6, lg: 4 }}>
              <AuteurAAcompagnerCard
                item={{} as any}
                loading={true}
              />
            </Grid>
          ))}
        </Grid>
      )}

      {/* Filtres et tri */}
      {!loadingCards && items && items.length > 0 && (
        <>
          <AuteurFilters
            onFiltersChange={handleFiltersChange}
            totalResults={paginationData.totalItems}
            availableSpecialites={availableSpecialites}
          />
          
          {paginationData.totalItems > 0 && (
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              mb: 3,
              px: 1
            }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {paginationData.totalItems} auteur{paginationData.totalItems > 1 ? 's' : ''} trouvé{paginationData.totalItems > 1 ? 's' : ''}
              </Typography>
              
              <AuteurSortOptions
                sortOptions={sortOptions}
                onSortChange={handleSortChange}
              />
            </Box>
          )}
        </>
      )}

      {/* Empty state - no data */}
      {!loadingCards && items?.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <PersonIcon sx={{ fontSize: 80, color: 'text.disabled', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Aucun auteur à accompagner
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 400, mx: 'auto' }}>
            Vous n'avez actuellement aucun auteur assigné. Les nouveaux auteurs à accompagner apparaîtront ici.
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreate}
            color="primary"
            sx={{ 
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600
            }}
          >
            Ajouter le premier auteur
          </Button>
        </Box>
      )}

      {/* Empty state - no results from filters */}
      {!loadingCards && items && items.length > 0 && paginationData.totalItems === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <PersonIcon sx={{ fontSize: 80, color: 'text.disabled', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Aucun auteur trouvé
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 400, mx: 'auto' }}>
            Aucun auteur ne correspond aux critères de recherche actuels. Essayez de modifier ou supprimer certains filtres.
          </Typography>
        </Box>
      )}

      {/* Content grid */}
      {!loadingCards && items && items.length > 0 && paginationData.totalItems > 0 && (
        <Box>
          <Grid container spacing={3}>
            {paginationData.items.map((item) => (
              <Grid key={item.id} size={{ xs: 12, md: 6, lg: 4 }}>
                <AuteurAAcompagnerCard
                  item={item}
                  onView={handleView}
                />
              </Grid>
            ))}
          </Grid>

          {/* Pagination */}
          <AuteurPagination
            currentPage={currentPage}
            totalPages={paginationData.totalPages}
            itemsPerPage={itemsPerPage}
            totalItems={paginationData.totalItems}
            onPageChange={handlePageChange}
            onItemsPerPageChange={handleItemsPerPageChange}
            startItem={paginationData.startItem}
            endItem={paginationData.endItem}
          />
        </Box>
      )}
    </Box>
  );
}
