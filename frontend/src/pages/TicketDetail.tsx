import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Button,
  Grid,
  Avatar,
  Divider,
  TextField,
  Alert,
  CircularProgress,
  IconButton,
  Tooltip,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import {
  ArrowBack,
  SmartToy,
  AttachFile,
  Download,
  Send,
  Schedule,
  Person,
  Category,
  Flag,
  CheckCircle,
  Cancel,
} from '@mui/icons-material';
import { ticketsAPI, notesAPI } from '../services/api';
import { Ticket, Note } from '../types';
import { useAuth } from '../context/AuthContext';

const TicketDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newNote, setNewNote] = useState('');
  const [submittingNote, setSubmittingNote] = useState(false);

  useEffect(() => {
    if (id) {
      fetchTicket();
      fetchNotes();
    }
  }, [id]);

  const fetchTicket = async () => {
    try {
      const response = await ticketsAPI.getTicket(id!);
      setTicket(response.data);
    } catch (err) {
      setError('Failed to load ticket');
    }
  };

  const fetchNotes = async () => {
    try {
      const response = await notesAPI.getNotes(id!);
      setNotes(response.data);
    } catch (err) {
      console.error('Failed to load notes');
    } finally {
      setLoading(false);
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    setSubmittingNote(true);
    try {
      const response = await notesAPI.addNote(id!, { text: newNote });
      setNotes(prev => [...prev, response.data]);
      setNewNote('');
    } catch (err) {
      setError('Failed to add note');
    } finally {
      setSubmittingNote(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
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

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !ticket) {
    return (
      <Box>
        <Alert severity="error">{error || 'Ticket not found'}</Alert>
        <Button onClick={() => navigate('/dashboard')} sx={{ mt: 2 }}>
          Back to Dashboard
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={() => navigate('/dashboard')} sx={{ mr: 2 }}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 600, flexGrow: 1 }}>
          {ticket.subject}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Chip
            label={ticket.status.toUpperCase()}
            color={getStatusColor(ticket.status)}
            variant="outlined"
          />
          <Chip
            label={ticket.priority.toUpperCase()}
            color={getPriorityColor(ticket.priority)}
            variant="outlined"
          />
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 500 }}>
                Description
              </Typography>
              <Typography variant="body1" sx={{ mb: 3, whiteSpace: 'pre-wrap' }}>
                {ticket.description}
              </Typography>

              {ticket.attachments && ticket.attachments.length > 0 && (
                <Box>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 500 }}>
                    Attachments
                  </Typography>
                  {ticket.attachments.map((attachment, index) => (
                    <Chip
                      key={index}
                      icon={<AttachFile />}
                      label={attachment.originalName}
                      onClick={() => window.open(attachment.url, '_blank')}
                      sx={{ mr: 1, mb: 1, cursor: 'pointer' }}
                    />
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>

          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 500 }}>
                Conversation
              </Typography>

              {notes.length === 0 ? (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
                  No notes yet. Be the first to add a comment!
                </Typography>
              ) : (
                <List>
                  {notes.map((note, index) => (
                    <React.Fragment key={note._id}>
                      <ListItem alignItems="flex-start" sx={{ px: 0 }}>
                        <ListItemIcon>
                          <Avatar sx={{ width: 32, height: 32, bgcolor: note.isStaff ? 'primary.main' : 'secondary.main' }}>
                            {note.user.name.charAt(0).toUpperCase()}
                          </Avatar>
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                              <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>
                                {note.user.name}
                              </Typography>
                              {note.isStaff && (
                                <Chip label="Staff" size="small" color="primary" />
                              )}
                              <Typography variant="caption" color="text.secondary">
                                {formatDate(note.createdAt)}
                              </Typography>
                            </Box>
                          }
                          secondary={
                            <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                              {note.text}
                            </Typography>
                          }
                        />
                      </ListItem>
                      {index < notes.length - 1 && <Divider variant="inset" component="li" />}
                    </React.Fragment>
                  ))}
                </List>
              )}

              <Divider sx={{ my: 2 }} />

              <form onSubmit={handleAddNote}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  placeholder="Add a note..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  sx={{ mb: 2 }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<Send />}
                  disabled={!newNote.trim() || submittingNote}
                >
                  {submittingNote ? <CircularProgress size={20} /> : 'Add Note'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 500 }}>
                Ticket Details
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Person sx={{ fontSize: 16, mr: 1 }} />
                  Created by
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {ticket.user.name}
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Category sx={{ fontSize: 16, mr: 1 }} />
                  Category
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {ticket.category}
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Flag sx={{ fontSize: 16, mr: 1 }} />
                  Priority
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Schedule sx={{ fontSize: 16, mr: 1 }} />
                  Created
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {formatDate(ticket.createdAt)}
                </Typography>
              </Box>

              {ticket.assignedTo && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Person sx={{ fontSize: 16, mr: 1 }} />
                    Assigned to
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {ticket.assignedTo.name}
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>

          {ticket.aiRecommendations && ticket.aiRecommendations.length > 0 && (
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <SmartToy sx={{ color: 'primary.main', mr: 1 }} />
                  <Typography variant="h6" sx={{ fontWeight: 500 }}>
                    AI Suggestions
                  </Typography>
                </Box>
                <List dense>
                  {ticket.aiRecommendations.map((suggestion, index) => (
                    <ListItem key={index} sx={{ px: 0 }}>
                      <ListItemIcon>
                        <CheckCircle sx={{ fontSize: 16, color: 'success.main' }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography variant="body2">
                            {suggestion}
                          </Typography>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default TicketDetail;