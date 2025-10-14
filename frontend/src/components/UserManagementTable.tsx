import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  MoreVert,
  Edit,
  Delete,
  AdminPanelSettings,
  Person,
} from '@mui/icons-material';
import { User } from '../types';

interface UserManagementTableProps {
  users: User[];
  loading: boolean;
  onUpdateUser: (user: User) => void;
  onDeleteUser: (userId: string) => void;
  onToggleAdmin: (userId: string, isAdmin: boolean) => void;
}

const UserManagementTable: React.FC<UserManagementTableProps> = ({
  users,
  loading,
  onUpdateUser,
  onDeleteUser,
  onToggleAdmin,
}) => {
  const [anchorEl, setAnchorEl] = useState<{ [key: string]: HTMLElement | null }>({});

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, userId: string) => {
    setAnchorEl(prev => ({ ...prev, [userId]: event.currentTarget }));
  };

  const handleMenuClose = (userId: string) => {
    setAnchorEl(prev => ({ ...prev, [userId]: null }));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (users.length === 0) {
    return (
      <Card>
        <CardContent sx={{ textAlign: 'center', py: 6 }}>
          <Person sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" sx={{ mb: 1 }}>
            No users found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Users will appear here once they register.
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 500 }}>
          User Management
        </Typography>
        
        <TableContainer component={Paper} sx={{ backgroundColor: 'background.default' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>User</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Joined</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user._id}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                        {user.name.charAt(0).toUpperCase()}
                      </Avatar>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {user.name}
                      </Typography>
                    </Box>
                  </TableCell>
                  
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {user.email}
                    </Typography>
                  </TableCell>
                  
                  <TableCell>
                    <Chip
                      label={user.isAdmin ? 'Admin' : 'User'}
                      size="small"
                      color={user.isAdmin ? 'primary' : 'default'}
                      variant="outlined"
                      icon={user.isAdmin ? <AdminPanelSettings /> : <Person />}
                    />
                  </TableCell>
                  
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {formatDate(user.createdAt)}
                    </Typography>
                  </TableCell>
                  
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      onClick={(e) => handleMenuOpen(e, user._id)}
                    >
                      <MoreVert />
                    </IconButton>
                    
                    <Menu
                      anchorEl={anchorEl[user._id]}
                      open={Boolean(anchorEl[user._id])}
                      onClose={() => handleMenuClose(user._id)}
                      anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                      }}
                      transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                      }}
                    >
                      <MenuItem onClick={() => {
                        onUpdateUser(user);
                        handleMenuClose(user._id);
                      }}>
                        <Edit fontSize="small" sx={{ mr: 1 }} />
                        Edit User
                      </MenuItem>
                      
                      <MenuItem onClick={() => {
                        onToggleAdmin(user._id, !user.isAdmin);
                        handleMenuClose(user._id);
                      }}>
                        {user.isAdmin ? (
                          <>
                            <Person fontSize="small" sx={{ mr: 1 }} />
                            Remove Admin
                          </>
                        ) : (
                          <>
                            <AdminPanelSettings fontSize="small" sx={{ mr: 1 }} />
                            Make Admin
                          </>
                        )}
                      </MenuItem>
                      
                      <MenuItem 
                        onClick={() => {
                          onDeleteUser(user._id);
                          handleMenuClose(user._id);
                        }}
                        sx={{ color: 'error.main' }}
                      >
                        <Delete fontSize="small" sx={{ mr: 1 }} />
                        Delete User
                      </MenuItem>
                    </Menu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
};

export default UserManagementTable;
