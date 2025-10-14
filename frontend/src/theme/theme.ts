import { createTheme, responsiveFontSizes } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#ff6b35', // Orange accent
      light: '#ff8c5a',
      dark: '#e55a2b',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#6c757d', // Grey
      light: '#8e9297',
      dark: '#495057',
      contrastText: '#ffffff',
    },
    background: {
      default: '#0a0a0a', // Very dark black
      paper: '#1a1a1a', // Dark grey
    },
    text: {
      primary: '#ffffff',
      secondary: '#b0b0b0',
    },
    error: {
      main: '#ff4757',
    },
    warning: {
      main: '#ffa502',
    },
    success: {
      main: '#2ed573',
    },
    info: {
      main: '#3742fa',
    },
    divider: '#333333',
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 500,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 500,
      lineHeight: 1.4,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 500,
      lineHeight: 1.5,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
    },
  },
  shape: {
    borderRadius: 12,
  },
  spacing: 8,
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarColor: '#6b7280 #1f2937',
          '&::-webkit-scrollbar, & *::-webkit-scrollbar': {
            backgroundColor: '#1f2937',
            width: '8px',
          },
          '&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb': {
            borderRadius: 8,
            backgroundColor: '#6b7280',
            minHeight: 24,
          },
          '&::-webkit-scrollbar-thumb:focus, & *::-webkit-scrollbar-thumb:focus': {
            backgroundColor: '#9ca3af',
          },
          '&::-webkit-scrollbar-thumb:active, & *::-webkit-scrollbar-thumb:active': {
            backgroundColor: '#9ca3af',
          },
          '&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover': {
            backgroundColor: '#9ca3af',
          },
          '&::-webkit-scrollbar-corner, & *::-webkit-scrollbar-corner': {
            backgroundColor: '#1f2937',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: 'none',
          fontWeight: 600,
          padding: '10px 24px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(255, 107, 53, 0.3)',
          },
        },
        contained: {
          '&:hover': {
            boxShadow: '0 4px 12px rgba(255, 107, 53, 0.4)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#1a1a1a',
          border: '1px solid #333333',
          borderRadius: 16,
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3)',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            boxShadow: '0 10px 25px -3px rgba(0, 0, 0, 0.4)',
            transform: 'translateY(-2px)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: '#2a2a2a',
            borderRadius: 12,
            '& fieldset': {
              borderColor: '#404040',
            },
            '&:hover fieldset': {
              borderColor: '#ff6b35',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#ff6b35',
            },
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#0a0a0a',
          borderBottom: '1px solid #333333',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.3)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#1a1a1a',
          borderRight: '1px solid #333333',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
        },
      },
    },
    MuiFab: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 12px rgba(255, 107, 53, 0.3)',
          '&:hover': {
            boxShadow: '0 6px 16px rgba(255, 107, 53, 0.4)',
          },
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          border: '1px solid',
        },
      },
    },
    MuiPagination: {
      styleOverrides: {
        root: {
          '& .MuiPaginationItem-root': {
            color: '#b0b0b0',
            '&.Mui-selected': {
              backgroundColor: '#ff6b35',
              color: '#ffffff',
            },
            '&:hover': {
              backgroundColor: 'rgba(255, 107, 53, 0.1)',
            },
          },
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-head': {
            backgroundColor: '#2a2a2a',
            fontWeight: 600,
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid #333333',
        },
      },
    },
  },
});

export const responsiveTheme = responsiveFontSizes(theme);

export default theme;
