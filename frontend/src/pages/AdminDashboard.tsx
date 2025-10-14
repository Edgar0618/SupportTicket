import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
} from '@mui/material';
import {
  Dashboard,
  People,
  SupportAgent,
  TrendingUp,
  CheckCircle,
  AdminPanelSettings,
  Person,
} from '@mui/icons-material';
import { analyticsAPI, adminAPI, ticketsAPI } from '../services/api';
import { DashboardAnalytics, User, Ticket } from '../types';
import AdminStatsCard from '../components/AdminStatsCard';
import AdminTicketCard from '../components/AdminTicketCard';
import UserManagementTable from '../components/UserManagementTable';
import TicketFilters from '../components/TicketFilters';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
};

const AdminDashboard: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [analytics, setAnalytics] = useState<DashboardAnalytics | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editDialog, setEditDialog] = useState<{ open: boolean; user?: User; ticket?: Ticket }>({ open: false });

  const [ticketFilters, setTicketFilters] = useState({
    search: '',
    status: '',
    priority: '',
    category: '',
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [analyticsRes, usersRes] = await Promise.all([
        analyticsAPI.getDashboard(),
        adminAPI.getAllUsers(),
      ]);
      
      setAnalytics(analyticsRes.data);
      setUsers(usersRes.data);
    } catch (err) {
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const fetchTickets = async () => {
    try {
      const response = await ticketsAPI.getAllTickets({ ...ticketFilters, limit: 20 });
      setTickets(response.data.tickets);
    } catch (err) {
      setError('Failed to load tickets');
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (tabValue === 1) {
      fetchTickets();
    }
  }, [tabValue, ticketFilters]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleUpdateUser = (user: User) => {
    setEditDialog({ open: true, user });
  };

  const handleUpdateTicket = (ticket: Ticket) => {
    setEditDialog({ open: true, ticket });
  };

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await adminAPI.deleteUser(userId);
        setUsers(users.filter(u => u._id !== userId));
      } catch (err) {
        setError('Failed to delete user');
      }
    }
  };

  const handleDeleteTicket = async (ticketId: string) => {
    if (window.confirm('Are you sure you want to delete this ticket?')) {
      try {
        await ticketsAPI.deleteTicket(ticketId);
        setTickets(tickets.filter(t => t._id !== ticketId));
      } catch (err) {
        setError('Failed to delete ticket');
      }
    }
  };

  const handleToggleAdmin = async (userId: string, isAdmin: boolean) => {
    try {
      await adminAPI.updateUser(userId, { isAdmin });
      setUsers(users.map(u => u._id === userId ? { ...u, isAdmin } : u));
    } catch (err) {
      setError('Failed to update user role');
    }
  };

  if (loading && !analytics) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <AdminPanelSettings sx={{ fontSize: 32, color: 'primary.main', mr: 2 }} />
        <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
          Admin Dashboard
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab icon={<Dashboard />} label="Analytics" />
          <Tab icon={<People />} label="Users" />
          <Tab icon={<SupportAgent />} label="Tickets" />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        {analytics && (
          <>
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={6} md={3}>
                <AdminStatsCard
                  title="Total Tickets"
                  value={analytics.overview.totalTickets}
                  icon={<SupportAgent />}
                  color="primary"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <AdminStatsCard
                  title="Open Tickets"
                  value={analytics.overview.openTickets}
                  icon={<TrendingUp />}
                  color="warning"
                  progress={Math.round((analytics.overview.openTickets / analytics.overview.totalTickets) * 100)}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <AdminStatsCard
                  title="Closed Tickets"
                  value={analytics.overview.closedTickets}
                  icon={<CheckCircle />}
                  color="success"
                  progress={Math.round((analytics.overview.closedTickets / analytics.overview.totalTickets) * 100)}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <AdminStatsCard
                  title="Total Users"
                  value={analytics.metrics.totalUsers}
                  icon={<Person />}
                  color="secondary"
                />
              </Grid>
            </Grid>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 500 }}>
                      Performance Metrics
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        Average Resolution Time
                      </Typography>
                      <Typography variant="h4" color="primary.main" sx={{ fontWeight: 600 }}>
                        {analytics.metrics.avgResolutionTime} days
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        Average Response Time
                      </Typography>
                      <Typography variant="h4" color="success.main" sx={{ fontWeight: 600 }}>
                        {analytics.metrics.avgResponseTime} min
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 500 }}>
                      Top Users
                    </Typography>
                    {analytics.topUsers.slice(0, 5).map((user, index) => (
                      <Box key={user._id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="body2">
                          {user.name}
                        </Typography>
                        <Chip label={`${user.ticketCount} tickets`} size="small" />
                      </Box>
                    ))}
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </>
        )}
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <UserManagementTable
          users={users}
          loading={loading}
          onUpdateUser={handleUpdateUser}
          onDeleteUser={handleDeleteUser}
          onToggleAdmin={handleToggleAdmin}
        />
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <TicketFilters
          search={ticketFilters.search}
          status={ticketFilters.status}
          priority={ticketFilters.priority}
          category={ticketFilters.category}
          onSearchChange={(value) => setTicketFilters(prev => ({ ...prev, search: value }))}
          onStatusChange={(value) => setTicketFilters(prev => ({ ...prev, status: value }))}
          onPriorityChange={(value) => setTicketFilters(prev => ({ ...prev, priority: value }))}
          onCategoryChange={(value) => setTicketFilters(prev => ({ ...prev, category: value }))}
          onClearFilters={() => setTicketFilters({ search: '', status: '', priority: '', category: '' })}
        />

        {tickets.length === 0 ? (
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 6 }}>
              <SupportAgent sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" sx={{ mb: 1 }}>
                No tickets found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Try adjusting your filters.
              </Typography>
            </CardContent>
          </Card>
        ) : (
          tickets.map((ticket) => (
            <AdminTicketCard
              key={ticket._id}
              ticket={ticket}
              onUpdateTicket={handleUpdateTicket}
              onDeleteTicket={handleDeleteTicket}
            />
          ))
        )}
      </TabPanel>

      <Dialog open={editDialog.open} onClose={() => setEditDialog({ open: false })} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editDialog.user ? 'Edit User' : 'Edit Ticket'}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            Edit functionality coming soon...
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialog({ open: false })}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminDashboard;