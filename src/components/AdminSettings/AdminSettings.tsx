import NotificationsIcon from '@mui/icons-material/Notifications';
import SecurityIcon from '@mui/icons-material/Security';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import StorageIcon from '@mui/icons-material/Storage';
import {
  Box,
  Divider,
  InputAdornment,
  Paper,
  Slider,
  Switch,
  TextField,
  Typography
} from '@mui/material';
import React, { useState } from 'react';

const AdminSettings: React.FC = () => {
  const [settings, setSettings] = useState({
    riskThreshold: 70,
    autoBlock: true,
    notifications: true,
    learningMode: true,
    honeypotEnabled: true,
    maxQueryLength: 1000,
    apiRateLimit: 100
  });

  const handleChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: 'bold' }}>
        Admin Settings
      </Typography>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
        {/* Security Settings */}
        <Box sx={{ flex: '1 1 calc(50% - 16px)', minWidth: { xs: '100%', md: '45%' } }}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 3, 
              borderRadius: 2,
              bgcolor: theme => theme.palette.mode === 'dark' ? 'rgba(30,30,30,0.9)' : 'background.paper',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 1 }}>
              <SecurityIcon sx={{ color: 'primary.main' }} />
              <Typography variant="h6" sx={{ fontWeight: 'medium' }}>
                Security Settings
              </Typography>
            </Box>
            <Divider sx={{ mb: 3 }} />

            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" gutterBottom>
                Risk Score Threshold
              </Typography>
              <Slider
                value={settings.riskThreshold}
                onChange={(_, value) => handleChange('riskThreshold', value)}
                aria-labelledby="risk-threshold-slider"
                valueLabelDisplay="auto"
                sx={{ color: 'primary.main' }}
              />
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                mt: 1,
                color: 'text.secondary',
                fontSize: '0.75rem'
              }}>
                <span>Low Risk</span>
                <span>{settings.riskThreshold}%</span>
                <span>High Risk</span>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="subtitle2">
                Automatic Blocking
              </Typography>
              <Switch
                checked={settings.autoBlock}
                onChange={(e) => handleChange('autoBlock', e.target.checked)}
                color="primary"
              />
            </Box>
          </Paper>
        </Box>

        {/* Notification Settings */}
        <Box sx={{ flex: '1 1 calc(50% - 16px)', minWidth: { xs: '100%', md: '45%' } }}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 3, 
              borderRadius: 2,
              bgcolor: theme => theme.palette.mode === 'dark' ? 'rgba(30,30,30,0.9)' : 'background.paper',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 1 }}>
              <NotificationsIcon sx={{ color: 'primary.main' }} />
              <Typography variant="h6" sx={{ fontWeight: 'medium' }}>
                Notification Settings
              </Typography>
            </Box>
            <Divider sx={{ mb: 3 }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="subtitle2">
                Email Notifications
              </Typography>
              <Switch
                checked={settings.notifications}
                onChange={(e) => handleChange('notifications', e.target.checked)}
                color="primary"
              />
            </Box>
          </Paper>
        </Box>

        {/* Database Protection */}
        <Box sx={{ flex: '1 1 calc(50% - 16px)', minWidth: { xs: '100%', md: '45%' } }}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 3, 
              borderRadius: 2,
              bgcolor: theme => theme.palette.mode === 'dark' ? 'rgba(30,30,30,0.9)' : 'background.paper',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 1 }}>
              <StorageIcon sx={{ color: 'primary.main' }} />
              <Typography variant="h6" sx={{ fontWeight: 'medium' }}>
                Database Protection
              </Typography>
            </Box>
            <Divider sx={{ mb: 3 }} />

            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" gutterBottom>
                Maximum Query Length
              </Typography>
              <TextField
                type="number"
                value={settings.maxQueryLength}
                onChange={(e) => handleChange('maxQueryLength', parseInt(e.target.value, 10))}
                fullWidth
                variant="outlined"
                size="small"
                sx={{ mt: 1 }}
              />
            </Box>

            <Box>
              <Typography variant="subtitle2" gutterBottom>
                API Rate Limit
              </Typography>
              <TextField
                type="number"
                value={settings.apiRateLimit}
                onChange={(e) => handleChange('apiRateLimit', parseInt(e.target.value, 10))}
                fullWidth
                variant="outlined"
                size="small"
                sx={{ mt: 1 }}
                InputProps={{
                  endAdornment: <InputAdornment position="end">requests/minute</InputAdornment>,
                }}
              />
            </Box>
          </Paper>
        </Box>

        {/* AI Settings */}
        <Box sx={{ flex: '1 1 calc(50% - 16px)', minWidth: { xs: '100%', md: '45%' } }}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 3, 
              borderRadius: 2,
              bgcolor: theme => theme.palette.mode === 'dark' ? 'rgba(30,30,30,0.9)' : 'background.paper',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 1 }}>
              <SmartToyIcon sx={{ color: 'primary.main' }} />
              <Typography variant="h6" sx={{ fontWeight: 'medium' }}>
                AI Settings
              </Typography>
            </Box>
            <Divider sx={{ mb: 3 }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="subtitle2">
                Learning Mode
              </Typography>
              <Switch
                checked={settings.learningMode}
                onChange={(e) => handleChange('learningMode', e.target.checked)}
                color="primary"
              />
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="subtitle2">
                Honeypot System
              </Typography>
              <Switch
                checked={settings.honeypotEnabled}
                onChange={(e) => handleChange('honeypotEnabled', e.target.checked)}
                color="primary"
              />
            </Box>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default AdminSettings; 