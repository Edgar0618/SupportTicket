import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
} from '@mui/material';
import {
  TrendingUp,
} from '@mui/icons-material';

interface AdminStatsCardProps {
  title: string;
  value: number;
  subtitle?: string;
  icon: React.ReactNode;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  progress?: number;
  trend?: 'up' | 'down' | 'neutral';
}

const AdminStatsCard: React.FC<AdminStatsCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  color = 'primary',
  progress,
  trend = 'neutral',
}) => {
  const getColorValue = () => {
    switch (color) {
      case 'success': return 'success.main';
      case 'warning': return 'warning.main';
      case 'error': return 'error.main';
      case 'secondary': return 'secondary.main';
      default: return 'primary.main';
    }
  };

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: 2,
                backgroundColor: `${getColorValue()}20`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 2,
              }}
            >
              <Box sx={{ fontSize: 24, color: getColorValue() }}>
                {icon}
              </Box>
            </Box>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 600, lineHeight: 1 }}>
                {value.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {title}
              </Typography>
            </Box>
          </Box>
          
          {trend !== 'neutral' && (
            <TrendingUp
              sx={{
                fontSize: 20,
                color: trend === 'up' ? 'success.main' : 'error.main',
                transform: trend === 'down' ? 'rotate(180deg)' : 'none',
              }}
            />
          )}
        </Box>

        {subtitle && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            {subtitle}
          </Typography>
        )}

        {progress !== undefined && (
          <Box sx={{ mt: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="caption" color="text.secondary">
                Progress
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {progress}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                height: 6,
                borderRadius: 3,
                backgroundColor: 'background.default',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: getColorValue(),
                },
              }}
            />
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminStatsCard;
