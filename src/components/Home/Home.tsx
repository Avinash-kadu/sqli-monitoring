import QueryStatsIcon from '@mui/icons-material/QueryStats';
import SchoolIcon from '@mui/icons-material/School';
import SecurityIcon from '@mui/icons-material/Security';
import ShieldIcon from '@mui/icons-material/Shield';
import {
  Box,
  Card,
  CardContent,
  Container,
  Paper,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';

// Import Components
import QueryAnalysis from '../QueryAnalysis/QueryAnalysis';

// Chart colors
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

// Initial stats values
const initialStats = [
  {
    title: 'Prevention',
    value: '97%',
    description: 'Success rate in preventing attacks',
    icon: <ShieldIcon fontSize="large" color="primary" />,
    numericValue: 97
  },
  {
    title: 'Detection',
    value: '99.2%',
    description: 'Accuracy in detecting SQLI attempts',
    icon: <SecurityIcon fontSize="large" color="secondary" />,
    numericValue: 99.2
  },
  {
    title: 'Real-time',
    value: '<100ms',
    description: 'Average response time for analysis',
    icon: <QueryStatsIcon fontSize="large" color="success" />,
    numericValue: 86
  },
  {
    title: 'Learning',
    value: '24/7',
    description: 'Continuous learning and improvement',
    icon: <SchoolIcon fontSize="large" color="info" />,
    numericValue: 100
  }
];

// Initial attack types data
const initialAttackTypeData = [
  { name: 'Union Based', value: 8 },
  { name: 'Error Based', value: 5 },
  { name: 'Boolean Based', value: 3 },
  { name: 'Time Based', value: 2 },
  { name: 'Batch Query', value: 1 }
];

const Home: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // State for stats
  const [statsCards, setStatsCards] = useState(initialStats);
  const [attackTypeData, setAttackTypeData] = useState(initialAttackTypeData);
  const [queryTimeData, setQueryTimeData] = useState<Array<{time: string, queries: number, attacks: number}>>([
    { time: '00:00', queries: 0, attacks: 0 }
  ]);
  const [totalQueries, setTotalQueries] = useState(0);
  const [blockedAttacks, setBlockedAttacks] = useState(0);
  const [detectionRate, setDetectionRate] = useState(0);
  const [responseMetricsData, setResponseMetricsData] = useState<Array<{name: string, value: number}>>([
    { name: 'Total Queries', value: 0 },
    { name: 'Blocked Attacks', value: 0 },
    { name: 'Detection Rate (%)', value: 0 }
  ]);
  
  // Add event listener for query analysis updates
  useEffect(() => {
    // Function to handle query analysis events
    const handleQueryAnalyzed = (event: CustomEvent) => {
      const { query, isAttack, attackType } = event.detail;
      
      // Update stats
      const newTotalQueries = totalQueries + 1;
      const newBlockedAttacks = isAttack ? blockedAttacks + 1 : blockedAttacks;
      const newDetectionRate = parseFloat(((newBlockedAttacks / newTotalQueries) * 100).toFixed(1));
      
      setTotalQueries(newTotalQueries);
      setBlockedAttacks(newBlockedAttacks);
      setDetectionRate(newDetectionRate);
      
      // Update stats cards
      const updatedStatsCards = [...statsCards];
      updatedStatsCards[0] = {
        ...updatedStatsCards[0],
        value: `${Math.round((newBlockedAttacks / newTotalQueries) * 100)}%`,
        numericValue: Math.round((newBlockedAttacks / newTotalQueries) * 100)
      };
      
      updatedStatsCards[1] = {
        ...updatedStatsCards[1],
        value: `${newDetectionRate}%`,
        numericValue: newDetectionRate
      };
      
      setStatsCards(updatedStatsCards);
      
      // Update attack type distribution
      if (isAttack && attackType) {
        const updatedAttackTypeData = [...attackTypeData];
        const existingTypeIndex = updatedAttackTypeData.findIndex(item => item.name === attackType);
        
        if (existingTypeIndex >= 0) {
          updatedAttackTypeData[existingTypeIndex] = {
            ...updatedAttackTypeData[existingTypeIndex],
            value: updatedAttackTypeData[existingTypeIndex].value + 1
          };
        } else {
          updatedAttackTypeData.push({ name: attackType, value: 1 });
        }
        
        setAttackTypeData(updatedAttackTypeData);
      }
      
      // Update time series data
      const currentTime = new Date();
      const timeString = `${currentTime.getHours()}:${currentTime.getMinutes().toString().padStart(2, '0')}`;
      
      const updatedTimeData = [...queryTimeData];
      const lastEntry = updatedTimeData[updatedTimeData.length - 1];
      
      // If last entry is recent, update it; otherwise add new entry
      if (lastEntry.time === timeString) {
        lastEntry.queries += 1;
        if (isAttack) lastEntry.attacks += 1;
      } else {
        updatedTimeData.push({
          time: timeString,
          queries: 1,
          attacks: isAttack ? 1 : 0
        });
        
        // Keep only the last 10 time points
        if (updatedTimeData.length > 10) {
          updatedTimeData.shift();
        }
      }
      
      setQueryTimeData(updatedTimeData);
      
      // Update response metrics data
      const newResponseMetricsData = [
        { name: 'Total Queries', value: newTotalQueries },
        { name: 'Blocked Attacks', value: newBlockedAttacks },
        { name: 'Detection Rate (%)', value: newDetectionRate }
      ];
      setResponseMetricsData(newResponseMetricsData);
    };
    
    // Add event listener
    window.addEventListener('queryAnalyzed', handleQueryAnalyzed as EventListener);
    
    // Clean up event listener on component unmount
    return () => {
      window.removeEventListener('queryAnalyzed', handleQueryAnalyzed as EventListener);
    };
  }, [totalQueries, blockedAttacks, detectionRate, statsCards, attackTypeData, queryTimeData]);

  return (
    <Box sx={{ flexGrow: 1, overflowX: 'hidden' }}>
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        {/* Header Section */}
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="h3" component="h1" gutterBottom>
           {/* SQL Injection Prevention */}
          </Typography>
          <Typography variant="h6" color="textSecondary" sx={{ mb: 4 }}>
            Analyze, detect, and learn about SQL injection attacks
          </Typography>
        </Box>

        {/* Stats Cards */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 4 }}>
          {statsCards.map((card, index) => (
            <Box key={index} sx={{ 
              flex: '1 1 calc(25% - 24px)',
              minWidth: { xs: '100%', sm: '45%', md: '22%' } 
            }}>
              <Card 
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 2,
                  transition: 'transform 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: 4
                  }
                }}
              >
                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Box sx={{ mb: 2 }}>
                    {card.icon}
                  </Box>
                  <Typography variant="h5" component="h2" align="center" gutterBottom>
                    {card.title}
                  </Typography>
                  <Typography variant="h4" color="primary" align="center" sx={{ mb: 1 }}>
                    {card.value}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" align="center">
                    {card.description}
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          ))}
        </Box>
        
        {/* Custom Charts */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 4 }}>
          {/* Queries and Attacks Over Time */}
          <Box sx={{ 
            flex: '1 1 calc(50% - 16px)',
            minWidth: { xs: '100%', md: '45%' }
          }}>
            <Paper sx={{ p: 2, height: 300, borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom>
                Queries & Attacks Over Time
              </Typography>
              <ResponsiveContainer width="100%" height="80%">
                <LineChart data={queryTimeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="queries" stroke="#82ca9d" activeDot={{ r: 8 }} />
                  <Line type="monotone" dataKey="attacks" stroke="#ff7300" />
                </LineChart>
              </ResponsiveContainer>
            </Paper>
          </Box>
          
          {/* Response Metrics */}
          <Box sx={{ 
            flex: '1 1 calc(50% - 16px)',
            minWidth: { xs: '100%', md: '45%' } 
          }}>
            <Paper sx={{ p: 2, height: 300, borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom>
                Protection Metrics
              </Typography>
              <ResponsiveContainer width="100%" height="80%">
                <LineChart 
                  data={queryTimeData.map(entry => ({
                    time: entry.time,
                    'Total Queries': entry.queries,
                    'Blocked Attacks': entry.attacks,
                    'Detection Rate': entry.queries > 0 ? Math.round((entry.attacks / entry.queries) * 100) : 0
                  }))}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis yAxisId="left" orientation="left" />
                  <YAxis yAxisId="right" orientation="right" unit="%" domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="Total Queries" stroke="#8884d8" />
                  <Line yAxisId="left" type="monotone" dataKey="Blocked Attacks" stroke="#ff7300" />
                  <Line yAxisId="right" type="monotone" dataKey="Detection Rate" stroke="#82ca9d" />
                </LineChart>
              </ResponsiveContainer>
            </Paper>
          </Box>
        </Box>

        {/* Main Content Grid */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          {/* Query Analysis Section */}
          <Box sx={{ 
            flex: '1 1 100%',
            minWidth: { xs: '100%' } 
          }}>
            <Paper 
              elevation={3} 
              sx={{ 
                borderRadius: 2, 
                overflow: 'hidden',
                height: '100%',
                minHeight: 600
              }}
            >
              <QueryAnalysis simplified={true} />
            </Paper>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Home; 