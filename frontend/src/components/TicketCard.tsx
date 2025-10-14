import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Box,
  Avatar,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  ArrowForward,
  AttachFile,
  SmartToy,
  Schedule,
} from '@mui/icons-material';
import { Ticket } from '../types';

interface TicketCardProps {
  ticket: Ticket;
}

const TicketCard: React.FC<TicketCardProps> = ({ ticket }) => {
  const navigate = useNavigate();

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'primary';
      case 'open': return 'warning';
      case 'closed': return 'success';
      default: return 'default';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Card
      sx={{
        mb: 2,
        cursor: 'pointer',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: 3,
        },
      }}
      onClick={() => navigate(`/tickets/${ticket._id}`)}
    >
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Typography variant="h6" component="h2" sx={{ fontWeight: 600, flexGrow: 1 }}>
            {ticket.subject}
          </Typography>
          <IconButton size="small" sx={{ color: 'primary.main' }}>
            <ArrowForward />
          </IconButton>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, minHeight: '40px' }}>
          {ticket.description.length > 100 
            ? `${ticket.description.substring(0, 100)}...` 
            : ticket.description
          }
        </Typography>

        <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
          <Chip
            label={ticket.status.toUpperCase()}
            size="small"
            color={getStatusColor(ticket.status)}
            variant="outlined"
          />
          <Chip
            label={ticket.priority.toUpperCase()}
            size="small"
            color={getPriorityColor(ticket.priority)}
            variant="outlined"
          />
          <Chip
            label={ticket.category}
            size="small"
            variant="outlined"
          />
        </Box>

        {ticket.aiRecommendations && ticket.aiRecommendations.length > 0 && (
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <SmartToy sx={{ fontSize: 16, color: 'primary.main', mr: 1 }} />
            <Typography variant="caption" color="primary.main">
              Smart Bot Suggestions Available
            </Typography>
          </Box>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Avatar sx={{ width: 24, height: 24, bgcolor: 'secondary.main' }}>
              {ticket.user.name.charAt(0).toUpperCase()}
            </Avatar>
            <Typography variant="caption" color="text.secondary">
              {ticket.user.name}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {ticket.attachments && ticket.attachments.length > 0 && (
              <Tooltip title={`${ticket.attachments.length} attachment(s)`}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <AttachFile sx={{ fontSize: 16, color: 'text.secondary', mr: 0.5 }} />
                  <Typography variant="caption" color="text.secondary">
                    {ticket.attachments.length}
                  </Typography>
                </Box>
              </Tooltip>
            )}
            
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Schedule sx={{ fontSize: 16, color: 'text.secondary', mr: 0.5 }} />
              <Typography variant="caption" color="text.secondary">
                {formatDate(ticket.createdAt)}
              </Typography>
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default TicketCard;
