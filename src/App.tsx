import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';

// Import components
import AdminSettings from './components/AdminSettings/AdminSettings';
import AttackLogs from './components/AttackLogs/AttackLogs';
import Chatbot from './components/Chatbot/Chatbot';
import Home from './components/Home/Home';
import Layout from './components/Layout/Layout';
import QueryAnalysis from './components/QueryAnalysis/QueryAnalysis';

// Create theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#2196f3',
    },
    secondary: {
      main: '#f50057',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    h1: {
      fontWeight: 500,
    },
    h2: {
      fontWeight: 500,
    },
    h3: {
      fontWeight: 500,
    },
    h4: {
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/query-analysis" element={<QueryAnalysis />} />
            <Route path="/attack-logs" element={<AttackLogs />} />
            <Route path="/chatbot" element={<Chatbot />} />
            <Route path="/admin-settings" element={<AdminSettings />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default App;
