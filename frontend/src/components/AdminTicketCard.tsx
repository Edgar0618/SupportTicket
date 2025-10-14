import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Box,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  ArrowForward,
  MoreVert,
  Edit,
  Delete,
  Person,
  Assignment,
} from '@mui/icons-material';
import { Ticket } from '../types';

interface AdminTicketCardProps {
  ticket: Ticket;
  onUpdateTicket: (ticket: Ticket) => void;
  onDeleteTicket: (ticketId: string) => void;
}

const AdminTicketCard: React.FC<AdminTicketCardProps> = ({ 
  ticket, 
  onUpdateTicket, 
  onDeleteTicket 
}) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    handleMenuClose();
    onUpdateTicket(ticket);
  };

  const handleDelete = () => {
    handleMenuClose();
    onDeleteTicket(ticket._id);
  };

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
    <>
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
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconButton size="small" sx={{ color: 'primary.main' }}>
                <ArrowForward />
              </IconButton>
              <IconButton size="small" onClick={handleMenuOpen}>
                <MoreVert />
              </IconButton>
            </Box>
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

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Person sx={{ fontSize: 16, color: 'text.secondary' }} />
                <Typography variant="caption" color="text.secondary">
                  {ticket.user.name}
                </Typography>
              </Box>
              
              {ticket.assignedTo && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Assignment sx={{ fontSize: 16, color: 'primary.main' }} />
                  <Typography variant="caption" color="primary.main">
                    {ticket.assignedTo.name}
                  </Typography>
                </Box>
              )}
            </Box>

            <Typography variant="caption" color="text.secondary">
              {formatDate(ticket.createdAt)}
            </Typography>
          </Box>
        </CardContent>
      </Card>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={handleEdit}>
          <Edit fontSize="small" sx={{ mr: 1 }} />
          Edit Ticket
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <Delete fontSize="small" sx={{ mr: 1 }} />
          Delete Ticket
        </MenuItem>
      </Menu>
    </>
  );
};

export default AdminTicketCard;
