import AccessTimeIcon from '@mui/icons-material/AccessTime';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ShieldIcon from '@mui/icons-material/Shield';
import WarningIcon from '@mui/icons-material/Warning';
import {
    Box,
    Button,
    Chip,
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from '@mui/material';
import React, { useEffect, useState } from 'react';

interface Log {
  id: number;
  timestamp: string;
  query: string;
  risk: number;
  ip: string;
  status: 'Blocked' | 'Allowed';
}

const AttackLogs: React.FC = () => {
  const [logs, setLogs] = useState<Log[]>([]);
  const [adminEmail, setAdminEmail] = useState('admin@example.com');

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      const newLog: Log = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        query: generateRandomQuery(),
        risk: Math.floor(Math.random() * 100),
        ip: generateRandomIP(),
        status: 'Allowed'
      };

      // Update status based on risk score
      newLog.status = newLog.risk > 50 ? 'Blocked' : 'Allowed';

      // Send email notification if risk score is high
      if (newLog.risk > 50) {
        sendEmailNotification(newLog);
      }

      setLogs(prev => [newLog, ...prev].slice(0, 100));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const sendEmailNotification = (log: Log) => {
    // In a real application, this would call your email service
    console.log(`Sending email to ${adminEmail} about high-risk query:
      Query: ${log.query}
      Risk Score: ${log.risk}%
      IP: ${log.ip}
      Timestamp: ${new Date(log.timestamp).toLocaleString()}
    `);
  };

  const generateRandomQuery = (): string => {
    const queries = [
      "SELECT * FROM users WHERE id = '1' OR '1'='1'",
      "SELECT * FROM products WHERE category = 'electronics'",
      "INSERT INTO logs (user_id, action) VALUES (1, 'login')",
      "SELECT * FROM orders WHERE status = 'pending'",
      "UPDATE users SET last_login = NOW() WHERE id = 1",
    ];
    return queries[Math.floor(Math.random() * queries.length)];
  };

  const generateRandomIP = (): string => {
    return `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" fontWeight="bold">
          Attack Logs
        </Typography>
        <Stack direction="row" spacing={2} alignItems="center">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AccessTimeIcon color="primary" />
            <Typography variant="body2">Real-time Updates</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <NotificationsIcon sx={{ color: 'warning.main' }} />
            <Typography variant="body2">Email: {adminEmail}</Typography>
          </Box>
          <Button variant="contained" color="primary">
            Export Logs
          </Button>
        </Stack>
      </Box>

      <TableContainer component={Paper} sx={{ 
        borderRadius: 2, 
        overflow: 'hidden',
        bgcolor: theme => theme.palette.mode === 'dark' ? 'rgba(30,30,30,0.9)' : 'background.paper',
      }}>
        <Table sx={{ minWidth: 650 }} size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: 'rgba(30,30,30,0.6)' }}>
              <TableCell sx={{ fontWeight: 'medium' }}>Timestamp</TableCell>
              <TableCell sx={{ fontWeight: 'medium' }}>Query</TableCell>
              <TableCell sx={{ fontWeight: 'medium' }}>Risk Score</TableCell>
              <TableCell sx={{ fontWeight: 'medium' }}>IP Address</TableCell>
              <TableCell sx={{ fontWeight: 'medium' }}>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {logs.map((log) => (
              <TableRow 
                key={log.id}
                sx={{ 
                  '&:hover': { 
                    bgcolor: 'rgba(30,30,30,0.4)' 
                  },
                  borderBottom: '1px solid rgba(81, 81, 81, 0.3)'
                }}
              >
                <TableCell>
                  {new Date(log.timestamp).toLocaleString()}
                </TableCell>
                <TableCell sx={{ fontFamily: 'monospace' }}>{log.query}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {log.risk > 50 ? (
                      <WarningIcon sx={{ fontSize: 16, color: 'error.main' }} />
                    ) : (
                      <ShieldIcon sx={{ fontSize: 16, color: 'success.main' }} />
                    )}
                    <Typography 
                      variant="body2" 
                      sx={{ color: log.risk > 50 ? 'error.main' : 'success.main' }}
                    >
                      {log.risk}%
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>{log.ip}</TableCell>
                <TableCell>
                  <Chip 
                    size="small"
                    label={log.status} 
                    color={log.status === 'Blocked' ? 'error' : 'success'}
                    sx={{ 
                      fontSize: '0.7rem', 
                      bgcolor: log.status === 'Blocked' ? 'rgba(255,0,0,0.1)' : 'rgba(0,255,0,0.1)'
                    }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AttackLogs; 