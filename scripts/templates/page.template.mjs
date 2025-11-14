export default function getPageTemplate(featureName, featureNamePascal, iconName) {
  return `'use client';

import { useEffect } from 'react';
import { Box, Typography, Button, CircularProgress, Grid } from '@mui/material';
import { ${iconName} } from '@mui/icons-material';
import { useFetch${featureNamePascal} } from './fetchers/useFetch${featureNamePascal}';
import ${featureNamePascal}Card from './components/${featureNamePascal}Card';
import { useRouter } from 'next/navigation';

export default function ${featureNamePascal}Page() {
  const router = useRouter();
  const { data: items, loading, fetch } = useFetch${featureNamePascal}();

  useEffect(() => {
    fetch();
  }, []);

  const handleView = (item: any) => {
    router.push(\`/dashboard/${featureName}/\${item.id}\`);
  };

  const handleCreate = () => {
    router.push(\`/dashboard/${featureName}/new\`);
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          ${featureNamePascal}
        </Typography>
        <Button
          variant="contained"
          startIcon={<${iconName} />}
          onClick={handleCreate}
        >
          Créer
        </Button>
      </Box>

      {/* Loading state */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Empty state */}
      {!loading && items?.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <${iconName} sx={{ fontSize: 80, color: 'text.disabled', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Aucun élément trouvé
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Commencez par créer votre premier élément
          </Typography>
          <Button
            variant="contained"
            startIcon={<${iconName} />}
            onClick={handleCreate}
          >
            Créer le premier élément
          </Button>
        </Box>
      )}

      {/* Content grid */}
      {!loading && items && items.length > 0 && (
        <Grid container spacing={3}>
          {items.map((item) => (
            <Grid key={item.id} size={{ xs: 12, md: 6, lg: 4 }}>
              <${featureNamePascal}Card
                item={item}
                onView={handleView}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
`;
}
