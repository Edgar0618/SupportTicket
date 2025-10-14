import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Pagination,
  Fab,
} from '@mui/material';
import { Add, SupportAgent, TrendingUp, CheckCircle } from '@mui/icons-material';
import { ticketsAPI } from '../services/api';
import { Ticket, TicketsResponse } from '../types';
import TicketCard from '../components/TicketCard';
import TicketFilters from '../components/TicketFilters';

const Dashboard: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalTickets: 0,
  });
  
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    priority: '',
    category: '',
  });

  const navigate = useNavigate();

  const fetchTickets = async (page = 1) => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: 10,
        ...filters,
      };
      
      const response = await ticketsAPI.getTickets(params);
      const data: TicketsResponse = response.data;
      
      setTickets(data.tickets);
      setPagination(data.pagination);
    } catch (err: any) {
      setError('Failed to load tickets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets(1);
  }, [filters]);

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    fetchTickets(page);
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      status: '',
      priority: '',
      category: '',
    });
  };

  const getStats = () => {
    const total = pagination.totalTickets;
    const open = tickets.filter(t => t.status === 'open').length;
    const closed = tickets.filter(t => t.status === 'closed').length;
    const newTickets = tickets.filter(t => t.status === 'new').length;

    return { total, open, closed, newTickets };
  };

  const stats = getStats();

  if (loading && tickets.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'space-between', 
        alignItems: { xs: 'stretch', sm: 'center' },
        gap: { xs: 2, sm: 0 },
        mb: 3 
      }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 600, textAlign: { xs: 'center', sm: 'left' } }}>
          My Support Tickets
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => navigate('/create-ticket')}
          sx={{ fontWeight: 600, minWidth: { xs: '100%', sm: 'auto' } }}
        >
          New Ticket
        </Button>
      </Box>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <SupportAgent sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 600 }}>
                {stats.total}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Tickets
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <TrendingUp sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 600 }}>
                {stats.open}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Open Tickets
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <CheckCircle sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
              <Typography variant="h4" sx={{ fontWeight: 600 }}>
                {stats.closed}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Closed Tickets
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 600, color: 'primary.main' }}>
                {stats.newTickets}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                New Tickets
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <TicketFilters
        search={filters.search}
        status={filters.status}
        priority={filters.priority}
        category={filters.category}
        onSearchChange={(value) => handleFilterChange('search', value)}
        onStatusChange={(value) => handleFilterChange('status', value)}
        onPriorityChange={(value) => handleFilterChange('priority', value)}
        onCategoryChange={(value) => handleFilterChange('category', value)}
        onClearFilters={clearFilters}
      />

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : tickets.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 6 }}>
            <SupportAgent sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" sx={{ mb: 1 }}>
              No tickets found
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {Object.values(filters).some(f => f) 
                ? 'Try adjusting your filters or create a new ticket.'
                : 'Create your first support ticket to get started.'
              }
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => navigate('/create-ticket')}
            >
              Create Ticket
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {tickets.map((ticket) => (
            <TicketCard key={ticket._id} ticket={ticket} />
          ))}

          {pagination.totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={pagination.totalPages}
                page={pagination.currentPage}
                onChange={handlePageChange}
                color="primary"
                size="large"
              />
            </Box>
          )}
        </>
      )}

      <Fab
        color="primary"
        aria-label="add"
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          display: { xs: 'flex', sm: 'none' },
        }}
        onClick={() => navigate('/create-ticket')}
      >
        <Add />
      </Fab>
    </Box>
  );
};

export default Dashboard;