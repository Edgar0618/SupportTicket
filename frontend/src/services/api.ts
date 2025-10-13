import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData: { name: string; email: string; password: string }) =>
    api.post('/api/users', userData),
  login: (credentials: { email: string; password: string }) =>
    api.post('/api/users/login', credentials),
  getMe: () => api.get('/api/users/me'),
};

// Tickets API
export const ticketsAPI = {
  getTickets: (params?: any) => api.get('/api/tickets', { params }),
  getTicket: (id: string) => api.get(`/api/tickets/${id}`),
  createTicket: (ticketData: any) => api.post('/api/tickets', ticketData),
  updateTicket: (id: string, ticketData: any) => api.put(`/api/tickets/${id}`, ticketData),
  deleteTicket: (id: string) => api.delete(`/api/tickets/${id}`),
  getAIRecommendations: (id: string) => api.get(`/api/tickets/${id}/ai-recommendations`),
  getAllTickets: (params?: any) => api.get('/api/tickets/admin/all', { params }),
  uploadFile: (id: string, formData: FormData) => 
    api.post(`/api/tickets/${id}/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
  deleteFile: (ticketId: string, attachmentId: string) =>
    api.delete(`/api/tickets/${ticketId}/attachments/${attachmentId}`),
};

// Notes API
export const notesAPI = {
  getNotes: (ticketId: string) => api.get(`/api/tickets/${ticketId}/notes`),
  addNote: (ticketId: string, noteData: { text: string }) =>
    api.post(`/api/tickets/${ticketId}/notes`, noteData),
  deleteNote: (noteId: string) => api.delete(`/api/notes/${noteId}`),
};

// Admin API
export const adminAPI = {
  getAllUsers: () => api.get('/api/users/admin/all'),
  getUser: (id: string) => api.get(`/api/users/admin/${id}`),
  updateUser: (id: string, userData: any) => api.put(`/api/users/admin/${id}`, userData),
  deleteUser: (id: string) => api.delete(`/api/users/admin/${id}`),
};

// Analytics API
export const analyticsAPI = {
  getDashboard: (params?: any) => api.get('/api/analytics/dashboard', { params }),
  getTicketAnalytics: (params?: any) => api.get('/api/analytics/tickets', { params }),
  getUserAnalytics: () => api.get('/api/analytics/users'),
};

export default api;
