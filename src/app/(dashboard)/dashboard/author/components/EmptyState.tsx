import { Box, Typography, Button, Paper } from '@mui/material';
import { Add as AddIcon, ArticleOutlined as EmptyIcon } from '@mui/icons-material';
import Link from 'next/link';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  actionUrl?: string;
  variant?: 'full' | 'compact';
}

export default function EmptyState({ 
  icon, 
  title, 
  description, 
  actionLabel, 
  actionUrl,
  variant = 'compact'
}: EmptyStateProps) {
  const isCompact = variant === 'compact';

  return (
    <Paper 
      variant="outlined" 
      sx={{ 
        p: isCompact ? 3 : 6, 
        textAlign: 'center',
        bgcolor: 'background.paper'
      }}
    >
      <Box sx={{ mb: 2 }}>
        {icon || <EmptyIcon sx={{ fontSize: isCompact ? 48 : 64, color: 'text.secondary', opacity: 0.5 }} />}
      </Box>
      
      <Typography 
        variant={isCompact ? "h6" : "h5"} 
        gutterBottom 
        color="text.primary"
        sx={{ fontWeight: 600 }}
      >
        {title}
      </Typography>
      
      <Typography 
        variant="body2" 
        color="text.secondary" 
        sx={{ mb: actionLabel ? 3 : 0, maxWidth: 400, mx: 'auto' }}
      >
        {description}
      </Typography>

      {actionLabel && actionUrl && (
        <Link href={actionUrl} style={{ textDecoration: 'none' }}>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            size={isCompact ? "medium" : "large"}
          >
            {actionLabel}
          </Button>
        </Link>
      )}
    </Paper>
  );
}