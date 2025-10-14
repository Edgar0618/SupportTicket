import { Theme } from '@mui/material/styles';

export const responsiveStyles = {
  // Container styles
  container: (theme: Theme) => ({
    padding: { xs: theme.spacing(2), sm: theme.spacing(3), md: theme.spacing(4) },
    maxWidth: '100%',
  }),

  // Card styles
  card: (theme: Theme) => ({
    marginBottom: theme.spacing(2),
    borderRadius: theme.spacing(2),
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: theme.shadows[8],
    },
  }),

  // Grid responsive spacing
  gridSpacing: (theme: Theme) => ({
    spacing: { xs: 2, sm: 3, md: 4 },
  }),

  // Typography responsive
  heading: (theme: Theme) => ({
    fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
    fontWeight: 600,
    lineHeight: 1.2,
  }),

  subheading: (theme: Theme) => ({
    fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem' },
    fontWeight: 500,
    lineHeight: 1.3,
  }),

  // Button responsive
  button: (theme: Theme) => ({
    padding: { xs: theme.spacing(1, 2), sm: theme.spacing(1.5, 3) },
    fontSize: { xs: '0.875rem', sm: '1rem' },
    minHeight: { xs: 40, sm: 48 },
  }),

  // Form responsive
  formField: (theme: Theme) => ({
    marginBottom: { xs: theme.spacing(2), sm: theme.spacing(3) },
  }),

  // Table responsive
  tableContainer: (theme: Theme) => ({
    overflowX: 'auto',
    '& .MuiTable-root': {
      minWidth: 600,
    },
  }),

  // Drawer responsive
  drawer: (theme: Theme) => ({
    width: { xs: 280, sm: 320 },
    flexShrink: 0,
    '& .MuiDrawer-paper': {
      width: { xs: 280, sm: 320 },
      boxSizing: 'border-box',
    },
  }),

  // AppBar responsive
  appBar: (theme: Theme) => ({
    zIndex: theme.zIndex.drawer + 1,
  }),

  // Main content responsive
  mainContent: (theme: Theme) => ({
    flexGrow: 1,
    padding: { xs: theme.spacing(2), sm: theme.spacing(3), md: theme.spacing(4) },
    marginTop: { xs: 56, sm: 64 },
    minHeight: { xs: 'calc(100vh - 56px)', sm: 'calc(100vh - 64px)' },
    backgroundColor: theme.palette.background.default,
  }),

  // Stats cards responsive
  statsCard: (theme: Theme) => ({
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: { xs: theme.spacing(2), sm: theme.spacing(3) },
    textAlign: 'center',
  }),

  // Fab responsive
  fab: (theme: Theme) => ({
    position: 'fixed',
    bottom: { xs: theme.spacing(2), sm: theme.spacing(3) },
    right: { xs: theme.spacing(2), sm: theme.spacing(3) },
    display: { xs: 'flex', sm: 'none' },
  }),
};

export const breakpoints = {
  xs: 0,
  sm: 600,
  md: 960,
  lg: 1280,
  xl: 1920,
};

export const mediaQueries = {
  mobile: `@media (max-width: ${breakpoints.sm - 1}px)`,
  tablet: `@media (min-width: ${breakpoints.sm}px) and (max-width: ${breakpoints.md - 1}px)`,
  desktop: `@media (min-width: ${breakpoints.md}px)`,
  mobileAndTablet: `@media (max-width: ${breakpoints.md - 1}px)`,
  tabletAndDesktop: `@media (min-width: ${breakpoints.sm}px)`,
};

export default responsiveStyles;
