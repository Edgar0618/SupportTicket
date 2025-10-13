import React from 'react';
import { Typography, Box } from '@mui/material';

const CreateTicket: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Create New Ticket
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Create a new support ticket form will appear here.
      </Typography>
    </Box>
  );
};

export default CreateTicket;
