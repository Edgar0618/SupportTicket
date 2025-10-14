import React from 'react';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Grid,
  Chip,
} from '@mui/material';
import { Search, FilterList, Clear } from '@mui/icons-material';

interface TicketFiltersProps {
  search: string;
  status: string;
  priority: string;
  category: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onPriorityChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onClearFilters: () => void;
}

const TicketFilters: React.FC<TicketFiltersProps> = ({
  search,
  status,
  priority,
  category,
  onSearchChange,
  onStatusChange,
  onPriorityChange,
  onCategoryChange,
  onClearFilters,
}) => {
  const hasActiveFilters = search || status || priority || category;

  return (
    <Box sx={{ mb: 3, p: 2, backgroundColor: 'background.paper', borderRadius: 2 }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            placeholder="Search tickets..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            InputProps={{
              startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'background.default',
              },
            }}
          />
        </Grid>

        <Grid item xs={12} md={2}>
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              value={status}
              label="Status"
              onChange={(e) => onStatusChange(e.target.value)}
              sx={{ backgroundColor: 'background.default' }}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="new">New</MenuItem>
              <MenuItem value="open">Open</MenuItem>
              <MenuItem value="closed">Closed</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={2}>
          <FormControl fullWidth>
            <InputLabel>Priority</InputLabel>
            <Select
              value={priority}
              label="Priority"
              onChange={(e) => onPriorityChange(e.target.value)}
              sx={{ backgroundColor: 'background.default' }}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="low">Low</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="high">High</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={2}>
          <FormControl fullWidth>
            <InputLabel>Category</InputLabel>
            <Select
              value={category}
              label="Category"
              onChange={(e) => onCategoryChange(e.target.value)}
              sx={{ backgroundColor: 'background.default' }}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="Bug Report">Bug Report</MenuItem>
              <MenuItem value="Feature Request">Feature Request</MenuItem>
              <MenuItem value="Performance">Performance</MenuItem>
              <MenuItem value="Authentication">Authentication</MenuItem>
              <MenuItem value="General">General</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={2}>
          <Button
            fullWidth
            variant="outlined"
            onClick={onClearFilters}
            disabled={!hasActiveFilters}
            startIcon={<Clear />}
          >
            Clear
          </Button>
        </Grid>
      </Grid>

      {hasActiveFilters && (
        <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {search && (
            <Chip
              label={`Search: "${search}"`}
              onDelete={() => onSearchChange('')}
              color="primary"
              variant="outlined"
            />
          )}
          {status && (
            <Chip
              label={`Status: ${status}`}
              onDelete={() => onStatusChange('')}
              color="primary"
              variant="outlined"
            />
          )}
          {priority && (
            <Chip
              label={`Priority: ${priority}`}
              onDelete={() => onPriorityChange('')}
              color="primary"
              variant="outlined"
            />
          )}
          {category && (
            <Chip
              label={`Category: ${category}`}
              onDelete={() => onCategoryChange('')}
              color="primary"
              variant="outlined"
            />
          )}
        </Box>
      )}
    </Box>
  );
};

export default TicketFilters;
