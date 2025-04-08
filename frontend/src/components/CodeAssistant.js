import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  CircularProgress,
  IconButton,
  Paper,
  Tooltip,
} from '@mui/material';
import {
  LightbulbOutlined as LightbulbIcon,
  Check as CheckIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

function CodeAssistant({ code, language }) {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedSuggestions, setSelectedSuggestions] = useState([]);

  useEffect(() => {
    if (code && code.length > 10) {
      fetchSuggestions();
    }
  }, [code, language]);

  const fetchSuggestions = async () => {
    setLoading(true);
    try {
      // This is a placeholder. In a real application, you would make an API call here
      // const response = await axios.post('http://localhost:5000/analyze/suggestions', {
      //   code,
      //   language,
      // });
      // setSuggestions(response.data.suggestions);
      
      // For now, we'll use mock data
      setTimeout(() => {
        setSuggestions([
          {
            id: 1,
            type: 'refactor',
            title: 'Extract Method',
            description: 'Consider extracting this logic into a separate method for better reusability.',
          },
          {
            id: 2,
            type: 'completion',
            title: 'Add Error Handling',
            description: 'Add try-catch block to handle potential errors in async operations.',
          },
          {
            id: 3,
            type: 'optimization',
            title: 'Use Memoization',
            description: 'Consider using useMemo for expensive calculations.',
          },
        ]);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setLoading(false);
    }
  };

  const handleApplySuggestion = (suggestionId) => {
    setSelectedSuggestions((prev) => [...prev, suggestionId]);
  };

  return (
    <Box>
      <Typography
        variant="h6"
        sx={{
          mb: 3,
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <LightbulbIcon sx={{ color: '#FFC107' }} />
        Intelligent Suggestions
      </Typography>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress sx={{ color: '#2196F3' }} />
        </Box>
      ) : (
        <List sx={{ p: 0 }}>
          <AnimatePresence>
            {suggestions.map((suggestion) => (
              <motion.div
                key={suggestion.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    mb: 2,
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateX(4px)',
                      background: 'rgba(255, 255, 255, 0.08)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                    },
                  }}
                >
                  <ListItem
                    secondaryAction={
                      <Tooltip title="Apply Suggestion">
                        <IconButton
                          edge="end"
                          onClick={() => handleApplySuggestion(suggestion.id)}
                          disabled={selectedSuggestions.includes(suggestion.id)}
                          sx={{
                            color: selectedSuggestions.includes(suggestion.id)
                              ? '#4CAF50'
                              : '#2196F3',
                            '&:hover': {
                              backgroundColor: 'rgba(33, 150, 243, 0.1)',
                            },
                          }}
                        >
                          {selectedSuggestions.includes(suggestion.id) ? (
                            <CheckIcon />
                          ) : (
                            <LightbulbIcon />
                          )}
                        </IconButton>
                      </Tooltip>
                    }
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 40,
                        color: '#FFC107',
                      }}
                    >
                      <LightbulbIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="subtitle1" sx={{ color: '#fff' }}>
                          {suggestion.title}
                        </Typography>
                      }
                      secondary={
                        <Typography
                          variant="body2"
                          sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                        >
                          {suggestion.description}
                        </Typography>
                      }
                    />
                  </ListItem>
                </Paper>
              </motion.div>
            ))}
          </AnimatePresence>
        </List>
      )}

      {!loading && suggestions.length === 0 && (
        <Typography
          variant="body1"
          sx={{ color: 'rgba(255, 255, 255, 0.7)', textAlign: 'center', py: 4 }}
        >
          No suggestions available. Try writing more code.
        </Typography>
      )}
    </Box>
  );
}

export default CodeAssistant; 