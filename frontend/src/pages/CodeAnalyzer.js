import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Grid,
  CircularProgress,
  Tabs,
  Tab,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import axios from 'axios';

function TabPanel({ children, value, index }) {
  return (
    <div hidden={value !== index} style={{ padding: '20px 0' }}>
      {value === index && children}
    </div>
  );
}

function CodeAnalyzer() {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('');
  const [teamConventions, setTeamConventions] = useState('');
  const [context, setContext] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState({
    bug: null,
    style: null,
    performance: null,
    security: null,
  });
  const [activeTab, setActiveTab] = useState(0);

  const handleAnalyze = async (type) => {
    setLoading(true);
    try {
      const response = await axios.post(`http://localhost:5000/analyze/${type}`, {
        code,
        language,
        ...(type === 'style' && { team_conventions: teamConventions }),
        ...(type === 'performance' && { context }),
      });
      setResults((prev) => ({ ...prev, [type]: response.data.result }));
      setActiveTab(['bug', 'style', 'performance', 'security'].indexOf(type));
    } catch (error) {
      console.error('Analysis error:', error);
    }
    setLoading(false);
  };

  const languages = [
    'Python',
    'JavaScript',
    'TypeScript',
    'Java',
    'C++',
    'C#',
    'Go',
    'Ruby',
    'PHP',
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Code Analysis
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Input Code
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={10}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Paste your code here..."
              variant="outlined"
              sx={{ mb: 2 }}
            />
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Language</InputLabel>
              <Select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                label="Language"
              >
                {languages.map((lang) => (
                  <MenuItem key={lang} value={lang}>
                    {lang}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              value={teamConventions}
              onChange={(e) => setTeamConventions(e.target.value)}
              placeholder="Team conventions (optional)"
              variant="outlined"
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="Additional context (optional)"
              variant="outlined"
              sx={{ mb: 2 }}
            />
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="contained"
                onClick={() => handleAnalyze('bug')}
                disabled={loading || !code}
              >
                Analyze Bugs
              </Button>
              <Button
                variant="contained"
                onClick={() => handleAnalyze('style')}
                disabled={loading || !code}
              >
                Analyze Style
              </Button>
              <Button
                variant="contained"
                onClick={() => handleAnalyze('performance')}
                disabled={loading || !code}
              >
                Analyze Performance
              </Button>
              <Button
                variant="contained"
                onClick={() => handleAnalyze('security')}
                disabled={loading || !code}
              >
                Analyze Security
              </Button>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Analysis Results
            </Typography>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress />
              </Box>
            ) : (
              <>
                <Tabs
                  value={activeTab}
                  onChange={(e, newValue) => setActiveTab(newValue)}
                  sx={{ borderBottom: 1, borderColor: 'divider' }}
                >
                  <Tab label="Bugs" />
                  <Tab label="Style" />
                  <Tab label="Performance" />
                  <Tab label="Security" />
                </Tabs>

                <TabPanel value={activeTab} index={0}>
                  {results.bug ? (
                    <Box sx={{ whiteSpace: 'pre-wrap' }}>{results.bug}</Box>
                  ) : (
                    <Typography color="text.secondary">
                      Run bug analysis to see results
                    </Typography>
                  )}
                </TabPanel>
                <TabPanel value={activeTab} index={1}>
                  {results.style ? (
                    <Box sx={{ whiteSpace: 'pre-wrap' }}>{results.style}</Box>
                  ) : (
                    <Typography color="text.secondary">
                      Run style analysis to see results
                    </Typography>
                  )}
                </TabPanel>
                <TabPanel value={activeTab} index={2}>
                  {results.performance ? (
                    <Box sx={{ whiteSpace: 'pre-wrap' }}>{results.performance}</Box>
                  ) : (
                    <Typography color="text.secondary">
                      Run performance analysis to see results
                    </Typography>
                  )}
                </TabPanel>
                <TabPanel value={activeTab} index={3}>
                  {results.security ? (
                    <Box sx={{ whiteSpace: 'pre-wrap' }}>{results.security}</Box>
                  ) : (
                    <Typography color="text.secondary">
                      Run security analysis to see results
                    </Typography>
                  )}
                </TabPanel>
              </>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default CodeAnalyzer; 