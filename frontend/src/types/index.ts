export interface User {
  _id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  createdAt: string;
}

export interface Ticket {
  _id: string;
  subject: string;
  description: string;
  status: 'new' | 'open' | 'closed';
  priority: 'low' | 'medium' | 'high';
  category: string;
  aiCategory?: string;
  aiConfidence?: number;
  aiPriority?: string;
  aiPriorityScore?: number;
  aiRecommendations?: string[];
  similarTickets?: SimilarTicket[];
  user: User;
  assignedTo?: User;
  solution?: string;
  attachments?: Attachment[];
  createdAt: string;
  updatedAt: string;
  closedAt?: string;
}

export interface Note {
  _id: string;
  text: string;
  user: User;
  ticket: string;
  isStaff: boolean;
  createdAt: string;
}

export interface Attachment {
  _id?: string;
  filename: string;
  originalName: string;
  path: string;
  url?: string;
  publicId?: string;
  size: number;
  mimetype: string;
  uploadedAt: string;
}

export interface SimilarTicket {
  ticketId: string;
  similarity: number;
  matchingWords: string[];
  ticket?: {
    _id: string;
    subject: string;
  };
}

export interface Pagination {
  currentPage: number;
  totalPages: number;
  totalTickets: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface TicketsResponse {
  tickets: Ticket[];
  pagination: Pagination;
}

export interface DashboardAnalytics {
  overview: {
    totalTickets: number;
    openTickets: number;
    closedTickets: number;
    newTickets: number;
  };
  charts: {
    ticketsByStatus: Array<{ _id: string; count: number }>;
    ticketsByPriority: Array<{ _id: string; count: number }>;
    ticketsByCategory: Array<{ _id: string; count: number }>;
    ticketsOverTime: Array<{ _id: { year: number; month: number; day: number }; count: number }>;
  };
  metrics: {
    avgResolutionTime: number;
    avgResponseTime: number;
    totalUsers: number;
    resolvedTickets: number;
  };
  topUsers: Array<{
    _id: string;
    name: string;
    email: string;
    ticketCount: number;
  }>;
  recentActivity: {
    recentTickets: Ticket[];
    recentNotes: Note[];
  };
}

export interface CreateTicketData {
  subject: string;
  description: string;
  category?: string;
  priority?: string;
}

export interface UpdateTicketData {
  status?: string;
  priority?: string;
  category?: string;
  assignedTo?: string;
  solution?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}
