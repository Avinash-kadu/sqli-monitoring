import BugReportIcon from '@mui/icons-material/BugReport';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SecurityIcon from '@mui/icons-material/Security';
import {
    Alert,
    Box,
    Button,
    Collapse,
    Paper,
    Stack,
    TextField,
    Typography,
    useTheme
} from '@mui/material';
import React, { useState } from 'react';

// Types for Query results
interface QueryResult {
  isSafe: boolean;
  message: string;
  severity: 'error' | 'warning' | 'info' | 'success';
  details?: string;
  attackType?: string;
}

// Mock SQLI detection function
const detectSQLInjection = (query: string): QueryResult => {
  // Simple SQLI patterns for demonstration
  const sqlInjectionPatterns = [
    { pattern: /'\s*OR\s*'1'\s*=\s*'1/i, type: 'Union Based' },
    { pattern: /'\s*OR\s*1\s*=\s*1/i, type: 'Union Based' },
    { pattern: /'\s*;\s*DROP\s+TABLE/i, type: 'Batch Query' },
    { pattern: /'\s*UNION\s+SELECT/i, type: 'Union Based' },
    { pattern: /'\s*;\s*SELECT/i, type: 'Batch Query' },
    { pattern: /'\s*OR\s*1\s*=\s*1\s*--/i, type: 'Comment Based' },
    { pattern: /SLEEP\(\d+\)/i, type: 'Time Based' },
    { pattern: /BENCHMARK\(/i, type: 'Time Based' },
    { pattern: /WAITFOR\s+DELAY/i, type: 'Time Based' },
    { pattern: /INTO\s+OUTFILE/i, type: 'File Based' }
  ];

  // Check for SQL injection patterns
  for (const pattern of sqlInjectionPatterns) {
    if (pattern.pattern.test(query)) {
      return {
        isSafe: false,
        message: 'Potential SQL Injection detected!',
        severity: 'error',
        details: 'This query contains patterns commonly used in SQL injection attacks.',
        attackType: pattern.type
      };
    }
  }

  // If no patterns matched, consider it safe
  return {
    isSafe: true,
    message: 'Query appears to be safe.',
    severity: 'success'
  };
};

export interface QueryAnalysisProps {
  simplified?: boolean;
}

const QueryAnalysis: React.FC<QueryAnalysisProps> = ({ simplified = false }) => {
  const theme = useTheme();
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<QueryResult | null>(null);
  const [history, setHistory] = useState<Array<{ query: string, result: QueryResult }>>([]);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const handleAnalyzeClick = () => {
    if (!query.trim()) return;
    
    const analysisResult = detectSQLInjection(query);
    setResult(analysisResult);
    
    // Add to history
    setHistory([{ query, result: analysisResult }, ...history].slice(0, 10));
    
    // Dispatch event for Dashboard to update
    const event = new CustomEvent('queryAnalyzed', {
      detail: {
        query: query,
        isAttack: !analysisResult.isSafe,
        attackType: analysisResult.attackType || 'Unknown'
      }
    });
    window.dispatchEvent(event);
  };

  return (
    <Box
      sx={{
        flexGrow: 1,
        width: '100%',
        p: simplified ? 0 : 3,
      }}
    >
      {!simplified && (
        <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
          SQL Query Analysis
        </Typography>
      )}
      
      <Paper 
        elevation={3} 
        sx={{
          p: 3,
          mb: 3
        }}
      >
        <TextField
          label="Enter SQL Query"
          multiline
          rows={4}
          value={query}
          onChange={handleQueryChange}
          fullWidth
          variant="outlined"
          placeholder="SELECT * FROM users WHERE username = 'input';"
          sx={{ mb: 2 }}
        />
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleAnalyzeClick}
            startIcon={<PlayArrowIcon />}
          >
            Analyze Query
          </Button>
          <Button 
            variant="outlined" 
            color="secondary"
            startIcon={<BugReportIcon />}
            onClick={() => setQuery("SELECT * FROM users WHERE username = 'admin' OR '1'='1'")}
          >
            Test Injection
          </Button>
        </Box>
      </Paper>
      
      {/* Results */}
      <Collapse in={result !== null}>
        {result && (
          <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
            <Stack spacing={2}>
              <Alert 
                severity={result.severity}
                icon={result.isSafe ? <SecurityIcon /> : <BugReportIcon />}
              >
                <Typography variant="subtitle1">{result.message}</Typography>
                {result.details && (
                  <Typography variant="body2">{result.details}</Typography>
                )}
                {result.attackType && (
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    Attack Type: {result.attackType}
                  </Typography>
                )}
              </Alert>
              
              {!result.isSafe && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Prevention Tips:
                  </Typography>
                  <Typography variant="body2">
                    • Use parameterized queries or prepared statements<br />
                    • Implement proper input validation and sanitization<br />
                    • Apply the principle of least privilege for database accounts<br />
                    • Consider using an ORM (Object-Relational Mapping) library
                  </Typography>
                </Box>
              )}
            </Stack>
          </Paper>
        )}
      </Collapse>
      
      {/* Query History (shown only in full mode) */}
      {!simplified && history.length > 0 && (
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Recent Queries
          </Typography>
          <Stack spacing={2}>
            {history.map((item, index) => (
              <Alert 
                key={index} 
                severity={item.result.isSafe ? 'success' : 'error'}
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center'
                }}
              >
                <Box sx={{ flexGrow: 1 }}>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontFamily: 'monospace',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                  >
                    {item.query.length > 50 ? `${item.query.substring(0, 50)}...` : item.query}
                  </Typography>
                </Box>
                {!item.result.isSafe && item.result.attackType && (
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      ml: 2,
                      fontWeight: 'bold' 
                    }}
                  >
                    {item.result.attackType}
                  </Typography>
                )}
              </Alert>
            ))}
          </Stack>
        </Paper>
      )}
    </Box>
  );
};

export default QueryAnalysis; 