import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  CircularProgress,
  Paper,
  Chip,
} from '@mui/material';
import {
  BugReport as BugReportIcon,
  Style as StyleIcon,
  Speed as SpeedIcon,
  Security as SecurityIcon,
  History as HistoryIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

function ContextReview({ code, language, projectContext }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [previousSuggestions, setPreviousSuggestions] = useState([]);

  useEffect(() => {
    if (code && code.length > 10) {
      fetchReviews();
      fetchPreviousSuggestions();
    }
  }, [code, language, projectContext]);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      // This is a placeholder. In a real application, you would make an API call here
      // const response = await axios.post('http://localhost:5000/analyze/context-review', {
      //   code,
      //   language,
      //   projectContext,
      // });
      // setReviews(response.data.reviews);
      
      // For now, we'll use mock data
      setTimeout(() => {
        setReviews([
          {
            id: 1,
            type: 'security',
            title: 'Potential XSS Vulnerability',
            description: 'User input should be sanitized before rendering to prevent XSS attacks.',
          },
          {
            id: 2,
            type: 'performance',
            title: 'Optimize State Updates',
            description: 'Consider using useCallback for memoizing the event handler.',
          },
          {
            id: 3,
            type: 'style',
            title: 'Code Organization',
            description: 'Move utility functions to a separate file for better maintainability.',
          },
        ]);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setLoading(false);
    }
  };

  const fetchPreviousSuggestions = async () => {
    try {
      // This is a placeholder. In a real application, you would make an API call here
      // const response = await axios.get('http://localhost:5000/analyze/previous-suggestions');
      // setPreviousSuggestions(response.data.suggestions);
      
      // For now, we'll use mock data
      setPreviousSuggestions([
        'Consider using TypeScript for better type safety',
        'Add unit tests for critical functions',
        'Implement error boundaries for better error handling',
      ]);
    } catch (error) {
      console.error('Error fetching previous suggestions:', error);
    }
  };

  const getReviewIcon = (type) => {
    switch (type) {
      case 'security':
        return <SecurityIcon sx={{ color: '#ff4d4d' }} />;
      case 'performance':
        return <SpeedIcon sx={{ color: '#ffb74d' }} />;
      case 'style':
        return <StyleIcon sx={{ color: '#2196F3' }} />;
      case 'bug':
        return <BugReportIcon sx={{ color: '#ff4d4d' }} />;
      default:
        return <HistoryIcon sx={{ color: '#2196F3' }} />;
    }
  };

  return (
    <Box>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress sx={{ color: '#2196F3' }} />
        </Box>
      ) : (
        <AnimatePresence>
          <List sx={{ p: 0 }}>
            {reviews.map((review) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
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
                  <ListItem>
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      {getReviewIcon(review.type)}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="subtitle1" sx={{ color: '#fff' }}>
                            {review.title}
                          </Typography>
                          <Chip
                            label={review.type}
                            size="small"
                            sx={{
                              backgroundColor:
                                review.type === 'security'
                                  ? 'rgba(255, 77, 77, 0.2)'
                                  : review.type === 'performance'
                                  ? 'rgba(255, 183, 77, 0.2)'
                                  : 'rgba(33, 150, 243, 0.2)',
                              color:
                                review.type === 'security'
                                  ? '#ff4d4d'
                                  : review.type === 'performance'
                                  ? '#ffb74d'
                                  : '#2196F3',
                            }}
                          />
                        </Box>
                      }
                      secondary={
                        <Typography
                          variant="body2"
                          sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                        >
                          {review.description}
                        </Typography>
                      }
                    />
                  </ListItem>
                </Paper>
              </motion.div>
            ))}
          </List>

          {previousSuggestions.length > 0 && (
            <Box sx={{ mt: 4 }}>
              <Typography
                variant="h6"
                sx={{
                  mb: 2,
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                <HistoryIcon sx={{ color: '#2196F3' }} />
                Previous Suggestions
              </Typography>
              <List sx={{ p: 0 }}>
                {previousSuggestions.map((suggestion, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Paper
                      elevation={0}
                      sx={{
                        mb: 2,
                        background: 'rgba(255, 255, 255, 0.03)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.05)',
                        borderRadius: '12px',
                      }}
                    >
                      <ListItem>
                        <ListItemIcon sx={{ minWidth: 40 }}>
                          <HistoryIcon sx={{ color: 'rgba(255, 255, 255, 0.5)' }} />
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Typography
                              variant="body2"
                              sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                            >
                              {suggestion}
                            </Typography>
                          }
                        />
                      </ListItem>
                    </Paper>
                  </motion.div>
                ))}
              </List>
            </Box>
          )}
        </AnimatePresence>
      )}

      {!loading && reviews.length === 0 && (
        <Typography
          variant="body1"
          sx={{ color: 'rgba(255, 255, 255, 0.7)', textAlign: 'center', py: 4 }}
        >
          No reviews available. Try writing more code.
        </Typography>
      )}
    </Box>
  );
}

export default ContextReview; 