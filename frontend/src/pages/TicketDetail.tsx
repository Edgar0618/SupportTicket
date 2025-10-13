import React from 'react';
import { Typography, Box } from '@mui/material';

const TicketDetail: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Ticket Details
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Ticket details and conversation will appear here.
      </Typography>
    </Box>
  );
};

export default TicketDetail;
