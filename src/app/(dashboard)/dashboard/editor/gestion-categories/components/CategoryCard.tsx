'use client';

import {
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  Stack,
  Typography,
} from '@mui/material';
import CategoryIcon from '@mui/icons-material/Category';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

interface CategoryCardProps {
  category: {
    id: string;
    name: string;
    description?: string;
    isActive: boolean;
    manuscriptCount: number;
    createdAt: string;
  };
  childrenCount?: number;
  parentName?: string;
  onRefresh?: () => void;
}

export function CategoryCard({
  category,
  childrenCount,
  parentName,
  onRefresh,
}: CategoryCardProps) {
  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.2s',
        opacity: category.isActive ? 1 : 0.6,
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4,
        },
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Stack direction="row" spacing={1} alignItems="center" mb={2}>
          <CategoryIcon color="primary" />
          <Chip
            label={category.isActive ? 'Active' : 'Inactive'}
            color={category.isActive ? 'success' : 'default'}
            size="small"
          />
        </Stack>

        <Typography variant="h6" component="h3" gutterBottom>
          {category.name}
        </Typography>

        {parentName && (
          <Typography variant="caption" color="text.secondary" gutterBottom display="block">
            Parent: {parentName}
          </Typography>
        )}

        {category.description && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 2,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {category.description}
          </Typography>
        )}

        <Stack spacing={1}>
          <Typography variant="body2" color="text.secondary">
            Manuscrits: {category.manuscriptCount}
          </Typography>

          {childrenCount !== undefined && childrenCount > 0 && (
            <Typography variant="body2" color="text.secondary">
              Sous-catégories: {childrenCount}
            </Typography>
          )}

          <Typography variant="caption" color="text.secondary">
            Créée le: {new Date(category.createdAt).toLocaleDateString('fr-FR')}
          </Typography>
        </Stack>
      </CardContent>

      <CardActions sx={{ p: 2, pt: 0 }}>
        <Button size="small" startIcon={<EditIcon />}>
          Modifier
        </Button>
        {category.isActive && (
          <Button size="small" startIcon={<DeleteIcon />} color="error">
            Désactiver
          </Button>
        )}
      </CardActions>
    </Card>
  );
}
