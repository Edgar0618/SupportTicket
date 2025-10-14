import React from 'react';
import { Box, CircularProgress, Typography, useTheme, useMediaQuery } from '@mui/material';

interface LoadingSpinnerProps {
  message?: string;
  size?: number;
  fullHeight?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  message = 'Loading Support Desk...', 
  size,
  fullHeight = true 
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const spinnerSize = size || (isMobile ? 40 : 60);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: fullHeight ? '100vh' : '200px',
        backgroundColor: 'background.default',
        gap: { xs: 1.5, sm: 2 },
        padding: { xs: 2, sm: 3 },
      }}
    >
      <CircularProgress 
        size={spinnerSize} 
        sx={{ 
          color: 'primary.main',
          filter: 'drop-shadow(0 0 8px rgba(255, 107, 53, 0.3))'
        }} 
      />
      <Typography 
        variant={isMobile ? 'body1' : 'h6'} 
        sx={{ 
          color: 'text.secondary',
          fontWeight: 500,
          textAlign: 'center',
        }}
      >
        {message}
      </Typography>
    </Box>
  );
};

export default LoadingSpinner;
