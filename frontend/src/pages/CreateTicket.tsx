import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Chip,
  Paper,
  IconButton,
} from '@mui/material';
import {
  ArrowBack,
  SmartToy,
  AttachFile,
  CloudUpload,
  Close,
} from '@mui/icons-material';
import { ticketsAPI } from '../services/api';
import { CreateTicketData } from '../types';

const CreateTicket: React.FC = () => {
  const [formData, setFormData] = useState<CreateTicketData>({
    subject: '',
    description: '',
    category: '',
    priority: '',
  });
  
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!formData.subject || !formData.description) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    try {
      const response = await ticketsAPI.createTicket(formData);
      const ticket = response.data;

      if (files.length > 0) {
        const formDataUpload = new FormData();
        files.forEach(file => {
          formDataUpload.append('files', file);
        });
        await ticketsAPI.uploadFile(ticket._id, formDataUpload);
      }

      if (ticket.aiRecommendations) {
        setAiSuggestions(ticket.aiRecommendations);
      }

      navigate(`/tickets/${ticket._id}`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create ticket');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={() => navigate('/dashboard')} sx={{ mr: 2 }}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
          Create New Ticket
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <form onSubmit={handleSubmit}>
                {error && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                  </Alert>
                )}

                <TextField
                  fullWidth
                  label="Subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  sx={{ mb: 2 }}
                />

                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  multiline
                  rows={6}
                  required
                  placeholder="Please provide a detailed description of your issue..."
                  sx={{ mb: 2 }}
                />

                <Grid container spacing={2} sx={{ mb: 2 }}>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Category</InputLabel>
                      <Select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        label="Category"
                      >
                        <MenuItem value="">Auto-detect</MenuItem>
                        <MenuItem value="Bug Report">Bug Report</MenuItem>
                        <MenuItem value="Feature Request">Feature Request</MenuItem>
                        <MenuItem value="Performance">Performance</MenuItem>
                        <MenuItem value="Authentication">Authentication</MenuItem>
                        <MenuItem value="General">General</MenuItem>
                        <MenuItem value="Other">Other</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Priority</InputLabel>
                      <Select
                        name="priority"
                        value={formData.priority}
                        onChange={handleChange}
                        label="Priority"
                      >
                        <MenuItem value="">Auto-detect</MenuItem>
                        <MenuItem value="low">Low</MenuItem>
                        <MenuItem value="medium">Medium</MenuItem>
                        <MenuItem value="high">High</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500 }}>
                    Attachments (Optional)
                  </Typography>
                  
                  <input
                    accept="image/*,.pdf,.doc,.docx,.txt"
                    style={{ display: 'none' }}
                    id="file-upload"
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                  />
                  
                  <label htmlFor="file-upload">
                    <Button
                      variant="outlined"
                      component="span"
                      startIcon={<CloudUpload />}
                      sx={{ mb: 2 }}
                    >
                      Upload Files
                    </Button>
                  </label>

                  {files.length > 0 && (
                    <Box>
                      {files.map((file, index) => (
                        <Chip
                          key={index}
                          label={file.name}
                          onDelete={() => removeFile(index)}
                          deleteIcon={<Close />}
                          sx={{ mr: 1, mb: 1 }}
                        />
                      ))}
                    </Box>
                  )}
                </Box>

                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={loading}
                  sx={{ py: 1.5, fontSize: '1.1rem', fontWeight: 600 }}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    'Create Ticket'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, mb: 2, backgroundColor: 'background.paper' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <SmartToy sx={{ color: 'primary.main', mr: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: 500 }}>
                Smart Features
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Our system will automatically:
            </Typography>
            <ul style={{ paddingLeft: '20px', margin: 0 }}>
              <li>Analyze and categorize your ticket</li>
              <li>Set appropriate priority level</li>
              <li>Provide solution suggestions</li>
              <li>Find similar existing tickets</li>
            </ul>
          </Paper>

          {aiSuggestions.length > 0 && (
            <Paper sx={{ p: 2, backgroundColor: 'background.paper' }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 500 }}>
                AI Suggestions
              </Typography>
              {aiSuggestions.map((suggestion, index) => (
                <Chip
                  key={index}
                  label={suggestion}
                  sx={{ mb: 1, mr: 1, display: 'block' }}
                  variant="outlined"
                />
              ))}
            </Paper>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default CreateTicket;