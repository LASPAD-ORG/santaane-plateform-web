'use client';

import { useEffect, useState } from 'react';
import { Box, Typography, Button, Grid, Skeleton } from '@mui/material';
import { Add as AddIcon, Description as DescriptionIcon } from '@mui/icons-material';
import { useFetchGestionManuscrit } from './fetchers/useFetchGestionManuscrit';
import GestionManuscritCard from './components/GestionManuscritCard';
import ManuscritFilters, { type ManuscritFilterOptions } from './components/ManuscritFilters';
import ManuscritPagination from './components/ManuscritPagination';
import ManuscritSortOptionsComponent, { type ManuscritSortOptions } from './components/ManuscritSortOptions';
import {
  useManuscritFilters,
  useManuscritSorting,
  useManuscritPagination,
  getAvailableAuthors,
  getAvailableSpecialites
} from './hooks/useManuscritFilters';
import { useRouter } from 'next/navigation';

export default function GestionManuscritPage() {
  const router = useRouter();
  const { data: items, loading, fetch } = useFetchGestionManuscrit();
  const [loadingCards, setLoadingCards] = useState(true);

  // États pour les filtres et la pagination
  const [filters, setFilters] = useState<ManuscritFilterOptions>({
    searchTerm: '',
    status: '',
    auteur: '',
    specialite: '',
    nombreCommentairesMin: null,
    nombreCommentairesMax: null,
    periodeCreation: '',
    volumeMin: null,
    volumeMax: null
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const [sortOptions, setSortOptions] = useState<ManuscritSortOptions>({
    field: 'updatedAt',
    direction: 'desc'
  });

  // Filtrage, tri et pagination
  const filteredItems = useManuscritFilters(items, filters);
  const sortedItems = useManuscritSorting(filteredItems, sortOptions);
  const paginationData = useManuscritPagination(sortedItems, currentPage, itemsPerPage);

  // Options pour les filtres
  const availableAuthors = getAvailableAuthors(items);
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
    router.push(`/dashboard/shared/author/gestion-manuscrit/${item.id}`);
  };

  // const handleCreate = () => {
  //   router.push(`/dashboard/shared/author/gestion-manuscrit/new`);
  // };

  const handleFiltersChange = (newFilters: ManuscritFilterOptions) => {
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

  const handleSortChange = (newSortOptions: ManuscritSortOptions) => {
    setSortOptions(newSortOptions);
    setCurrentPage(1); // Reset to first page when sort changes
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
            Gestion des Manuscrits
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Consultez et commentez les manuscrits soumis par les auteurs
          </Typography>
        </Box>
        {/* <Button
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
          Nouveau manuscrit
        </Button> */}
      </Box>

      {/* Loading state */}
      {loadingCards && (
        <Grid container spacing={3}>
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <Grid key={item} size={{ xs: 12, md: 6, lg: 4 }}>
              <GestionManuscritCard
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
          <ManuscritFilters
            onFiltersChange={handleFiltersChange}
            totalResults={paginationData.totalItems}
            availableAuthors={availableAuthors}
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
                {paginationData.totalItems} manuscrit{paginationData.totalItems > 1 ? 's' : ''} trouvé{paginationData.totalItems > 1 ? 's' : ''}
              </Typography>

              <ManuscritSortOptionsComponent
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
          <DescriptionIcon sx={{ fontSize: 80, color: 'text.disabled', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Aucun manuscrit trouvé
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 400, mx: 'auto' }}>
            Il n'y a actuellement aucun manuscrit à examiner. Les nouveaux manuscrits soumis par les auteurs apparaîtront ici.
          </Typography>
          {/* <Button
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
            Créer un manuscrit
          </Button> */}
        </Box>
      )}

      {/* Empty state - no results from filters */}
      {!loadingCards && items && items.length > 0 && paginationData.totalItems === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <DescriptionIcon sx={{ fontSize: 80, color: 'text.disabled', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Aucun manuscrit trouvé
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 400, mx: 'auto' }}>
            Aucun manuscrit ne correspond aux critères de recherche actuels. Essayez de modifier ou supprimer certains filtres.
          </Typography>
        </Box>
      )}

      {/* Content grid */}
      {!loadingCards && items && items.length > 0 && paginationData.totalItems > 0 && (
        <Box>
          <Grid container spacing={3}>
            {paginationData.items.map((item) => (
              <Grid key={item.id} size={{ xs: 12, md: 6, lg: 4 }}>
                <GestionManuscritCard
                  item={item}
                  onView={handleView}
                />
              </Grid>
            ))}
          </Grid>

          {/* Pagination */}
          <ManuscritPagination
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
