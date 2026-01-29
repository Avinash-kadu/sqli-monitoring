import InfoIcon from '@mui/icons-material/Info';
import PersonIcon from '@mui/icons-material/Person';
import SendIcon from '@mui/icons-material/Send';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import {
    Avatar,
    Box,
    Card,
    CardContent,
    Chip,
    Divider,
    IconButton,
    InputAdornment,
    Paper,
    TextField,
    Typography
} from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  code?: string;
}

// Database of SQL injection related questions and answers
const sqlInjectionQA: Record<string, { answer: string; code?: string }> = {
  "what is sql injection": {
    answer: "SQL Injection is a code injection technique that exploits vulnerabilities in an application's software by inserting malicious SQL statements into entry fields for execution. It allows attackers to manipulate databases, access sensitive data, modify data, and in some cases take control of the server."
  },
  "how does sql injection work": {
    answer: "SQL injection works by inserting or 'injecting' malicious SQL code into input fields that are later used in SQL queries to a database. When this input is not properly validated or sanitized, the injected SQL becomes part of the executed query, allowing attackers to bypass security measures and interact directly with the database."
  },
  "what are common types of sql injection": {
    answer: "Common types of SQL injection include: 1) Error-based: exploits error messages, 2) Union-based: uses UNION SQL operator to combine result sets, 3) Boolean-based (blind): tests boolean conditions to extract data, 4) Time-based (blind): uses time delays to extract information, and 5) Out-of-band: extracts data using alternative channels."
  },
  "how to prevent sql injection": {
    answer: "To prevent SQL injection, you should: 1) Use parameterized queries or prepared statements, 2) Implement input validation, 3) Escape user inputs, 4) Use stored procedures, 5) Apply the principle of least privilege, 6) Use an ORM (Object-Relational Mapping) library, and 7) Keep your database systems updated.",
    code: "// Example of a parameterized query in Node.js\nconst sql = 'SELECT * FROM users WHERE username = ?';\nconnection.query(sql, [userInput], function (error, results) {\n  // handle results\n});"
  },
  "what is a parameterized query": {
    answer: "A parameterized query (or prepared statement) is a technique where placeholders are used for parameters in SQL statements. The database parses, compiles, and optimizes the SQL statement template, and then executes it with the actual parameters. This prevents SQL injection because the parameter values are transmitted separately from the SQL command text.",
    code: "// Java example with PreparedStatement\nString query = \"SELECT * FROM users WHERE username = ? AND password = ?\";\nPreparedStatement stmt = connection.prepareStatement(query);\nstmt.setString(1, username);\nstmt.setString(2, password);\nResultSet rs = stmt.executeQuery();"
  },
  "what is union based sql injection": {
    answer: "UNION-based SQL injection is a technique that uses the UNION SQL operator to combine the results of two or more SELECT statements into a single result set. Attackers use this to extract data from different database tables. For this to work, the individual queries must return the same number of columns with compatible data types.",
    code: "-- Example of a UNION-based SQL injection\n' UNION SELECT username, password FROM users--"
  },
  "what is blind sql injection": {
    answer: "Blind SQL injection is a type of SQL injection attack where the attacker doesn't receive direct error messages or query results. Instead, they must infer information by observing differences in application behavior. There are two main types: Boolean-based (where the application responds differently based on whether a condition is true or false) and Time-based (where the attacker introduces time delays to determine if a condition is true)."
  },
  "how to detect sql injection attacks": {
    answer: "To detect SQL injection attacks, you can: 1) Monitor database logs for suspicious queries, 2) Implement Web Application Firewalls (WAF), 3) Use intrusion detection systems, 4) Conduct regular security audits, 5) Analyze HTTP requests for SQL patterns, and 6) Monitor for unusual database activity or unexpected query patterns."
  },
  "what are sql injection tools": {
    answer: "Common SQL injection tools include: 1) SQLmap (automated SQL injection detection and exploitation), 2) Havij (automated SQL injection tool), 3) SQLninja (targets Microsoft SQL Server), 4) BSQL Hacker (blind SQL injection), and 5) NoSQLMap (for NoSQL databases). Note that these should only be used for ethical testing with proper authorization.",
  },
  "examples of sql injection attacks": {
    answer: "Here are some examples of SQL injection attack patterns:",
    code: "-- Basic authentication bypass\n' OR '1'='1\n\n-- Extracting data using UNION\n' UNION SELECT username, password FROM users--\n\n-- Blind SQL injection\n' AND (SELECT 1 FROM users WHERE username='admin' AND LENGTH(password)>5)--\n\n-- Database schema discovery\n' UNION SELECT table_name, column_name FROM information_schema.columns--\n\n-- Adding a backdoor admin\nINSERT INTO users (username, password, role) VALUES ('hacker', 'password123', 'admin')--"
  }
};

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm the SQL Injection Prevention Assistant. How can I help you learn about SQL injection attacks and prevention?",
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([
    "What is SQL Injection?",
    "How to prevent SQL Injection?",
    "Examples of SQL Injection attacks",
    "What are common types of SQL Injection?",
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (!input.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    const userInput = input.toLowerCase().trim();
    setInput('');
    
    // Process the message and generate a response
    setTimeout(() => {
      let botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm not sure about that. Try asking about SQL injection attacks, prevention techniques, or common examples.",
        sender: 'bot',
        timestamp: new Date(),
      };
      
      // Check for matches in our QA database
      for (const [question, response] of Object.entries(sqlInjectionQA)) {
        if (userInput.includes(question) || question.includes(userInput)) {
          botResponse.text = response.answer;
          if (response.code) botResponse.code = response.code;
          break;
        }
      }
      
      // Special case for greetings
      if (userInput.match(/^(hi|hello|hey|greetings)/i)) {
        botResponse.text = "Hello! How can I help you learn about SQL injection today?";
      }
      
      // Add bot response
      setMessages((prev) => [...prev, botResponse]);
      
      // Update suggestions based on context
      if (userInput.includes("prevent")) {
        setSuggestions([
          "What is a parameterized query?",
          "How to implement input validation?",
          "What is an ORM?",
        ]);
      } else if (userInput.includes("type")) {
        setSuggestions([
          "What is Union based SQL injection?",
          "What is Blind SQL injection?",
          "What is Error based injection?",
        ]);
      } else if (userInput.includes("detect") || userInput.includes("protect")) {
        setSuggestions([
          "How to detect SQL injection attacks?",
          "What are SQL injection tools?",
          "Best practices for database security",
        ]);
      }
    }, 600); // Simulated processing time
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };
  
  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
  };

  return (
    <Box sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 2 }}>
        Chatbot Assistant
      </Typography>
      
      <Paper 
        elevation={3} 
        sx={{ 
          p: 0, 
          flexGrow: 1, 
          display: 'flex', 
          flexDirection: 'column',
          borderRadius: 2,
          overflow: 'hidden',
          height: 'calc(100vh - 180px)',
          bgcolor: theme => theme.palette.mode === 'dark' ? 'rgba(30,30,30,0.9)' : 'background.paper',
        }}
      >
        {/* Chat Header */}
        <Box sx={{ 
          p: 2, 
          bgcolor: 'primary.main', 
          color: 'white',
          display: 'flex',
          alignItems: 'center'
        }}>
          <SmartToyIcon sx={{ mr: 1 }} />
          <Typography variant="h6">
            SQLI Prevention Assistant
          </Typography>
        </Box>
        
        <Divider />
        
        {/* Chat Messages */}
        <Box sx={{ 
          flexGrow: 1, 
          overflow: 'auto', 
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 2
        }}>
          {messages.map((message) => (
            <Box 
              key={message.id} 
              sx={{ 
                display: 'flex', 
                flexDirection: message.sender === 'user' ? 'row-reverse' : 'row',
                alignItems: 'flex-start'
              }}
            >
              <Avatar 
                sx={{ 
                  bgcolor: message.sender === 'user' ? 'secondary.main' : 'primary.main',
                  width: 36,
                  height: 36,
                  mr: message.sender === 'user' ? 0 : 1,
                  ml: message.sender === 'user' ? 1 : 0,
                }}
              >
                {message.sender === 'user' ? <PersonIcon /> : <SmartToyIcon />}
              </Avatar>
              
              <Card sx={{ 
                maxWidth: '80%', 
                borderRadius: 2,
                bgcolor: message.sender === 'user' ? 'secondary.light' : 'background.paper'
              }}>
                <CardContent sx={{ py: 1, '&:last-child': { pb: 1 } }}>
                  <Typography variant="body1">{message.text}</Typography>
                  
                  {message.code && (
                    <Paper 
                      sx={{ 
                        mt: 1, 
                        p: 1, 
                        bgcolor: 'rgba(0,0,0,0.85)', 
                        borderRadius: 1,
                        fontFamily: 'monospace',
                        overflow: 'auto'
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          color: '#89ddff',
                          whiteSpace: 'pre-wrap',
                          fontSize: '0.85rem'
                        }}
                      >
                        {message.code}
                      </Typography>
                    </Paper>
                  )}
                  
                  <Typography 
                    variant="caption" 
                    color="text.secondary" 
                    sx={{ display: 'block', mt: 0.5, textAlign: message.sender === 'user' ? 'right' : 'left' }}
                  >
                    {message.timestamp.toLocaleTimeString()}
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          ))}
          <div ref={messagesEndRef} />
        </Box>
        
        <Divider />
        
        {/* Suggestions */}
        {suggestions.length > 0 && (
          <Box sx={{ p: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {suggestions.map((suggestion, index) => (
              <Chip
                key={index}
                label={suggestion}
                onClick={() => handleSuggestionClick(suggestion)}
                sx={{ cursor: 'pointer' }}
                size="small"
                icon={<InfoIcon fontSize="small" />}
              />
            ))}
          </Box>
        )}
        
        <Divider />
        
        {/* Input Area */}
        <Box sx={{ p: 2, display: 'flex', gap: 1 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Ask about SQL injection..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            size="small"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton 
                    onClick={handleSendMessage}
                    disabled={!input.trim()}
                    color="primary"
                  >
                    <SendIcon />
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
        </Box>
      </Paper>
    </Box>
  );
};

export default Chatbot; 