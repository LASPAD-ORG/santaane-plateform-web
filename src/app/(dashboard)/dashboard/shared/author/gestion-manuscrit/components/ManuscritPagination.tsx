'use client';

import {
  Box,
  Pagination,
  FormControl,
  Select,
  MenuItem,
  Typography,
  Paper
} from '@mui/material';

interface ManuscritPaginationProps {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (itemsPerPage: number) => void;
  startItem: number;
  endItem: number;
}

const ITEMS_PER_PAGE_OPTIONS = [6, 12, 24, 48];

export default function ManuscritPagination({
  currentPage,
  totalPages,
  itemsPerPage,
  totalItems,
  onPageChange,
  onItemsPerPageChange,
  startItem,
  endItem
}: ManuscritPaginationProps) {
  if (totalItems === 0) {
    return null;
  }

  return (
    <Paper sx={{ p: 2, mt: 3 }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 2 
      }}>
        {/* Informations sur les résultats */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Affichage de {startItem} à {endItem} sur {totalItems} manuscrit{totalItems > 1 ? 's' : ''}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Éléments par page :
            </Typography>
            <FormControl size="small" sx={{ minWidth: 80 }}>
              <Select
                value={itemsPerPage}
                onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
                variant="outlined"
              >
                {ITEMS_PER_PAGE_OPTIONS.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Box>

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={(event, page) => onPageChange(page)}
            color="primary"
            shape="rounded"
            showFirstButton
            showLastButton
            sx={{
              '& .MuiPaginationItem-root': {
                borderRadius: 1,
              }
            }}
          />
        )}
      </Box>
    </Paper>
  );
}