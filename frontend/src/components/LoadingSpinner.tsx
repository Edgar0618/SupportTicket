import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

const LoadingSpinner: React.FC = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: 'background.default',
      }}
    >
      <CircularProgress 
        size={60} 
        sx={{ 
          color: 'primary.main',
          mb: 2 
        }} 
      />
      <Typography 
        variant="h6" 
        sx={{ 
          color: 'text.secondary',
          fontWeight: 500 
        }}
      >
        Loading Support Desk...
      </Typography>
    </Box>
  );
};

export default LoadingSpinner;
