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
  Stack,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
} from '@mui/material';
import BugReportIcon from '@mui/icons-material/BugReport';
import StyleIcon from '@mui/icons-material/Style';
import SpeedIcon from '@mui/icons-material/Speed';
import SecurityIcon from '@mui/icons-material/Security';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import axios from 'axios';
import CodeIcon from '@mui/icons-material/Code';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import { motion, AnimatePresence } from 'framer-motion';
import ThreeDBackground from '../components/ThreeDBackground';

function TabPanel({ children, value, index }) {
  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      role="tabpanel"
      hidden={value !== index}
      id={`analysis-tabpanel-${index}`}
      aria-labelledby={`analysis-tab-${index}`}
      sx={{
        height: '100%',
        overflow: 'auto',
        '&::-webkit-scrollbar': {
          width: '6px',
          height: '6px',
        },
        '&::-webkit-scrollbar-track': {
          background: 'transparent',
          borderRadius: '3px',
        },
        '&::-webkit-scrollbar-thumb': {
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '3px',
          transition: 'all 0.3s ease',
          '&:hover': {
            background: 'rgba(255, 255, 255, 0.2)',
          },
        },
      }}
    >
      {value === index && (
        <Box sx={{ p: 2 }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </Box>
      )}
    </Box>
  );
}

function cleanMarkdown(text) {
  if (!text) return '';
  return text
    .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
    .replace(/\*(.*?)\*/g, '$1')     // Remove italic
    .replace(/\`(.*?)\`/g, '$1')     // Remove code
    .replace(/\#(.*?)\n/g, '$1\n')   // Remove headers
    .replace(/\-\s/g, '')            // Remove bullet points
    .replace(/\>\s/g, '')            // Remove blockquotes
    .trim();
}

function formatAnalysisResult(result, type) {
  if (!result) return null;

  try {
    const lines = result.split('\n');
    const formattedResult = {
      summary: '',
      issues: [],
      recommendations: [],
    };

    let currentSection = '';
    let currentContent = '';

    for (const line of lines) {
      const trimmedLine = cleanMarkdown(line.trim());
      if (!trimmedLine) continue;

      if (trimmedLine.toLowerCase().includes('summary') || trimmedLine.toLowerCase().includes('overview')) {
        if (currentSection && currentContent) {
          if (currentSection === 'summary') {
            formattedResult.summary = currentContent.trim();
          } else if (currentSection === 'issues') {
            formattedResult.issues.push(currentContent.trim());
          } else if (currentSection === 'recommendations') {
            formattedResult.recommendations.push(currentContent.trim());
          }
        }
        currentSection = 'summary';
        currentContent = trimmedLine.replace(/summary:|overview:/i, '').trim();
      } else if (trimmedLine.toLowerCase().includes('issue') || trimmedLine.toLowerCase().includes('problem')) {
        if (currentSection && currentContent) {
          if (currentSection === 'summary') {
            formattedResult.summary = currentContent.trim();
          } else if (currentSection === 'issues') {
            formattedResult.issues.push(currentContent.trim());
          } else if (currentSection === 'recommendations') {
            formattedResult.recommendations.push(currentContent.trim());
          }
        }
        currentSection = 'issues';
        currentContent = trimmedLine.replace(/issue:|problem:/i, '').trim();
      } else if (trimmedLine.toLowerCase().includes('recommend') || trimmedLine.toLowerCase().includes('suggestion')) {
        if (currentSection && currentContent) {
          if (currentSection === 'summary') {
            formattedResult.summary = currentContent.trim();
          } else if (currentSection === 'issues') {
            formattedResult.issues.push(currentContent.trim());
          } else if (currentSection === 'recommendations') {
            formattedResult.recommendations.push(currentContent.trim());
          }
        }
        currentSection = 'recommendations';
        currentContent = trimmedLine.replace(/recommendation:|suggestion:/i, '').trim();
      } else {
        currentContent += (currentContent ? ' ' : '') + trimmedLine;
      }
    }

    // Handle the last section
    if (currentSection && currentContent) {
      if (currentSection === 'summary') {
        formattedResult.summary = currentContent.trim();
      } else if (currentSection === 'issues') {
        formattedResult.issues.push(currentContent.trim());
      } else if (currentSection === 'recommendations') {
        formattedResult.recommendations.push(currentContent.trim());
      }
    }

    // If no sections were found, treat the entire content as summary
    if (!formattedResult.summary && !formattedResult.issues.length && !formattedResult.recommendations.length) {
      formattedResult.summary = cleanMarkdown(result);
    }

    // Clean all the content
    formattedResult.summary = cleanMarkdown(formattedResult.summary);
    formattedResult.issues = formattedResult.issues.map(cleanMarkdown);
    formattedResult.recommendations = formattedResult.recommendations.map(cleanMarkdown);

    return formattedResult;
  } catch (error) {
    console.error('Error formatting result:', error);
    return {
      summary: cleanMarkdown(result),
      issues: [],
      recommendations: [],
    };
  }
}

function AnalysisResult({ result, type }) {
  if (!result) return null;

  const formattedResult = formatAnalysisResult(result, type);
  if (!formattedResult) return null;

  const getIcon = (type) => {
    switch (type) {
      case 'bug':
        return <BugReportIcon sx={{ fontSize: 28 }} color="error" />;
      case 'style':
        return <StyleIcon sx={{ fontSize: 28 }} color="primary" />;
      case 'performance':
        return <SpeedIcon sx={{ fontSize: 28 }} color="warning" />;
      case 'security':
        return <SecurityIcon sx={{ fontSize: 28 }} color="error" />;
      default:
        return null;
    }
  };

  const getColor = (type) => {
    switch (type) {
      case 'bug':
        return 'error';
      case 'style':
        return 'primary';
      case 'performance':
        return 'warning';
      case 'security':
        return 'error';
      default:
        return 'info';
    }
  };

  return (
    <Stack spacing={4}>
      {formattedResult.summary && (
        <Paper 
          elevation={0} 
          sx={{ 
            p: 3, 
            bgcolor: 'background.paper',
            borderLeft: 6,
            borderColor: `${getColor(type)}.main`,
            borderRadius: 2,
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            animation: 'slideIn 0.5s ease-out',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateX(4px)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            {getIcon(type)}
            <Typography variant="h6" sx={{ ml: 2, fontWeight: 'bold', color: `${getColor(type)}.main` }}>
              Analysis Summary
            </Typography>
          </Box>
          <Typography variant="body1" sx={{ 
            color: 'text.primary',
            lineHeight: 1.6,
            fontSize: '1.1rem'
          }}>
            {formattedResult.summary}
          </Typography>
        </Paper>
      )}

      {formattedResult.issues.length > 0 && (
        <Paper elevation={0} sx={{ 
          p: 3, 
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
          animation: 'slideIn 0.5s ease-out',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateX(4px)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }
        }}>
          <Typography variant="h6" sx={{ 
            fontWeight: 'bold', 
            mb: 3, 
            color: 'error.main',
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}>
            <BugReportIcon sx={{ fontSize: 24 }} />
            Issues Found
          </Typography>
          <List dense sx={{ p: 0 }}>
            {formattedResult.issues.map((issue, index) => (
              <ListItem 
                key={index}
                sx={{ 
                  mb: 2,
                  bgcolor: 'background.default',
                  borderRadius: 2,
                  p: 2,
                  alignItems: 'flex-start',
                  '&:hover': {
                    bgcolor: 'action.hover',
                    transform: 'translateX(4px)',
                    transition: 'all 0.2s ease'
                  }
                }}
              >
                <ListItemIcon sx={{ 
                  minWidth: 48,
                  mt: 0.5,
                  alignSelf: 'flex-start'
                }}>
                  <Chip
                    label={`${index + 1}`}
                    size="medium"
                    color={type === 'security' ? 'error' : 'warning'}
                    sx={{ 
                      width: 32,
                      height: 32,
                      borderRadius: '8px',
                      fontSize: '1rem',
                      fontWeight: 'bold',
                      '& .MuiChip-label': {
                        px: 0,
                      }
                    }}
                  />
                </ListItemIcon>
                <ListItemText 
                  primary={issue}
                  primaryTypographyProps={{
                    variant: 'body1',
                    sx: { 
                      color: 'text.primary',
                      fontSize: '1.1rem',
                      lineHeight: 1.5
                    }
                  }}
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      )}

      {formattedResult.recommendations.length > 0 && (
        <Paper elevation={0} sx={{ 
          p: 3, 
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
          animation: 'slideIn 0.5s ease-out',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateX(4px)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }
        }}>
          <Typography variant="h6" sx={{ 
            fontWeight: 'bold', 
            mb: 3, 
            color: 'success.main',
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}>
            <LightbulbIcon sx={{ fontSize: 24 }} />
            Recommendations
          </Typography>
          <List dense sx={{ p: 0 }}>
            {formattedResult.recommendations.map((rec, index) => (
              <ListItem 
                key={index}
                sx={{ 
                  mb: 2,
                  bgcolor: 'background.default',
                  borderRadius: 2,
                  p: 2,
                  alignItems: 'flex-start',
                  '&:hover': {
                    bgcolor: 'action.hover',
                    transform: 'translateX(4px)',
                    transition: 'all 0.2s ease'
                  }
                }}
              >
                <ListItemIcon sx={{ 
                  minWidth: 48,
                  mt: 0.5,
                  alignSelf: 'flex-start'
                }}>
                  <Chip
                    label={`${index + 1}`}
                    size="medium"
                    color="success"
                    sx={{ 
                      width: 32,
                      height: 32,
                      borderRadius: '8px',
                      fontSize: '1rem',
                      fontWeight: 'bold',
                      '& .MuiChip-label': {
                        px: 0,
                      }
                    }}
                  />
                </ListItemIcon>
                <ListItemText 
                  primary={rec}
                  primaryTypographyProps={{
                    variant: 'body1',
                    sx: { 
                      color: 'text.primary',
                      fontSize: '1.1rem',
                      lineHeight: 1.5
                    }
                  }}
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      )}
    </Stack>
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
    <Box sx={{ 
      position: 'relative',
      minHeight: '100vh',
      overflow: 'hidden',
    }}>
      <ThreeDBackground />
      
      <Box
        component={motion.div}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        sx={{ 
          maxWidth: '1800px', 
          margin: '0 auto', 
          p: 2,
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Typography 
          variant="h4" 
          gutterBottom 
          component={motion.h4}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          sx={{ 
            mb: 3, 
            textAlign: 'center',
            color: '#fff',
            fontWeight: 'bold',
            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 0 20px rgba(33, 150, 243, 0.3)',
          }}
        >
          Code Analysis
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={5}>
            <Paper 
              component={motion.div}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              sx={{ 
                p: 2, 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                background: 'rgba(26, 32, 44, 0.7)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                transformStyle: 'preserve-3d',
                perspective: '1000px',
                '&:hover': {
                  transform: 'translateY(-4px) rotateX(2deg) rotateY(2deg)',
                  boxShadow: '0 12px 40px rgba(0, 0, 0, 0.4)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                }
              }}
            >
              <Typography 
                variant="h6" 
                gutterBottom 
                sx={{ 
                  mb: 2,
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  '&:hover': {
                    color: '#2196F3',
                    transform: 'translateX(4px)',
                    transition: 'all 0.3s ease'
                  }
                }}
              >
                <CodeIcon sx={{ fontSize: 24 }} />
                Input Code
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={15}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Paste your code here..."
                variant="outlined"
                sx={{ 
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    fontFamily: 'monospace',
                    fontSize: '14px',
                    transition: 'all 0.3s ease',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    color: '#fff',
                    '& fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.1)',
                    },
                    '&:hover': {
                      '& fieldset': {
                        borderColor: '#2196F3',
                      }
                    },
                    '&.Mui-focused': {
                      '& fieldset': {
                        borderColor: '#2196F3',
                        borderWidth: 2,
                      }
                    }
                  },
                  '& .MuiInputBase-input': {
                    color: '#fff',
                  },
                  '& .MuiInputLabel-root': {
                    color: 'rgba(255, 255, 255, 0.7)',
                  }
                }}
              />
              
              <Stack spacing={2}>
                <FormControl fullWidth>
                  <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Programming Language</InputLabel>
                  <Select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    label="Programming Language"
                    sx={{
                      color: '#fff',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                      },
                      '&:hover': {
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#2196F3',
                        }
                      },
                      '& .MuiSelect-icon': {
                        color: 'rgba(255, 255, 255, 0.7)',
                      }
                    }}
                  >
                    {languages.map((lang) => (
                      <MenuItem 
                        key={lang} 
                        value={lang}
                        sx={{
                          color: '#fff',
                          backgroundColor: 'rgba(26, 32, 44, 0.7)',
                          '&:hover': {
                            backgroundColor: 'rgba(33, 150, 243, 0.2)',
                          }
                        }}
                      >
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
                  label="Team Conventions"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: '#fff',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      '& fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                      },
                      '&:hover': {
                        '& fieldset': {
                          borderColor: '#2196F3',
                        }
                      }
                    },
                    '& .MuiInputLabel-root': {
                      color: 'rgba(255, 255, 255, 0.7)',
                    }
                  }}
                />

                <TextField
                  fullWidth
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                  placeholder="Additional context (optional)"
                  variant="outlined"
                  label="Additional Context"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: '#fff',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      '& fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                      },
                      '&:hover': {
                        '& fieldset': {
                          borderColor: '#2196F3',
                        }
                      }
                    },
                    '& .MuiInputLabel-root': {
                      color: 'rgba(255, 255, 255, 0.7)',
                    }
                  }}
                />
              </Stack>

              <Box sx={{ 
                mt: 2, 
                display: 'flex', 
                gap: 1, 
                flexWrap: 'wrap',
                '& .MuiButton-root': {
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
                  }
                }
              }}>
                <Button
                  variant="contained"
                  onClick={() => handleAnalyze('bug')}
                  disabled={loading || !code}
                  startIcon={<BugReportIcon />}
                  sx={{ 
                    flex: '1 1 auto', 
                    minWidth: '120px',
                    background: 'linear-gradient(45deg, #ff4d4d 30%, #ff7676 90%)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #ff3333 30%, #ff6666 90%)',
                    }
                  }}
                >
                  Bugs
                </Button>
                <Button
                  variant="contained"
                  onClick={() => handleAnalyze('style')}
                  disabled={loading || !code}
                  startIcon={<StyleIcon />}
                  sx={{ 
                    flex: '1 1 auto', 
                    minWidth: '120px',
                    background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #1976D2 30%, #1E88E5 90%)',
                    }
                  }}
                >
                  Style
                </Button>
                <Button
                  variant="contained"
                  onClick={() => handleAnalyze('performance')}
                  disabled={loading || !code}
                  startIcon={<SpeedIcon />}
                  sx={{ 
                    flex: '1 1 auto', 
                    minWidth: '120px',
                    background: 'linear-gradient(45deg, #ffb74d 30%, #ffcc80 90%)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #ffa726 30%, #ffb74d 90%)',
                    }
                  }}
                >
                  Performance
                </Button>
                <Button
                  variant="contained"
                  onClick={() => handleAnalyze('security')}
                  disabled={loading || !code}
                  startIcon={<SecurityIcon />}
                  sx={{ 
                    flex: '1 1 auto', 
                    minWidth: '120px',
                    background: 'linear-gradient(45deg, #ff4d4d 30%, #ff7676 90%)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #ff3333 30%, #ff6666 90%)',
                    }
                  }}
                >
                  Security
                </Button>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={7}>
            <Paper 
              component={motion.div}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              sx={{ 
                p: 2, 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                background: 'rgba(26, 32, 44, 0.7)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                transformStyle: 'preserve-3d',
                perspective: '1000px',
                '&:hover': {
                  transform: 'translateY(-4px) rotateX(-2deg) rotateY(-2deg)',
                  boxShadow: '0 12px 40px rgba(0, 0, 0, 0.4)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                }
              }}
            >
              <Typography 
                variant="h6" 
                gutterBottom 
                sx={{ 
                  mb: 2,
                  animation: 'slideIn 0.5s ease-out',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  '&:hover': {
                    color: '#2196F3',
                    transform: 'translateX(4px)',
                    transition: 'all 0.3s ease'
                  }
                }}
              >
                <AnalyticsIcon sx={{ fontSize: 24 }} />
                Analysis Results
              </Typography>
              <Box sx={{ 
                flex: 1,
                overflow: 'auto',
                maxHeight: '600px',
                p: 2,
                bgcolor: 'rgba(26, 32, 44, 0.5)',
                borderRadius: 1,
                animation: 'fadeIn 0.5s ease-in',
                '& > *': {
                  mb: 2,
                },
                '&::-webkit-scrollbar': {
                  width: '6px',
                  height: '6px',
                },
                '&::-webkit-scrollbar-track': {
                  background: 'transparent',
                  borderRadius: '3px',
                },
                '&::-webkit-scrollbar-thumb': {
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '3px',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.2)',
                  },
                },
              }}>
                {loading ? (
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center',
                    minHeight: '300px'
                  }}>
                    <CircularProgress 
                      sx={{ 
                        animation: 'spin 1s linear infinite',
                        color: '#2196F3'
                      }} 
                    />
                  </Box>
                ) : (
                  <>
                    <Tabs
                      value={activeTab}
                      onChange={(e, newValue) => setActiveTab(newValue)}
                      variant="fullWidth"
                      sx={{ 
                        borderBottom: 1, 
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                        mb: 2,
                        '& .MuiTab-root': {
                          color: 'rgba(255, 255, 255, 0.7)',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            color: '#2196F3',
                            transform: 'scale(1.05)',
                            backgroundColor: 'rgba(33, 150, 243, 0.1)',
                          },
                          '&.Mui-selected': {
                            color: '#2196F3',
                            fontWeight: 'bold',
                          },
                        },
                      }}
                    >
                      <Tab 
                        label="Bugs" 
                        icon={<BugReportIcon />} 
                        iconPosition="start" 
                        sx={{
                          '& .MuiSvgIcon-root': {
                            color: '#ff4d4d',
                          },
                        }}
                      />
                      <Tab 
                        label="Style" 
                        icon={<StyleIcon />} 
                        iconPosition="start"
                        sx={{
                          '& .MuiSvgIcon-root': {
                            color: '#2196F3',
                          },
                        }}
                      />
                      <Tab 
                        label="Performance" 
                        icon={<SpeedIcon />} 
                        iconPosition="start"
                        sx={{
                          '& .MuiSvgIcon-root': {
                            color: '#ffb74d',
                          },
                        }}
                      />
                      <Tab 
                        label="Security" 
                        icon={<SecurityIcon />} 
                        iconPosition="start"
                        sx={{
                          '& .MuiSvgIcon-root': {
                            color: '#ff4d4d',
                          },
                        }}
                      />
                    </Tabs>

                    <AnimatePresence mode="wait">
                      <TabPanel value={activeTab} index={0}>
                        {results.bug ? (
                          <AnalysisResult result={results.bug} type="bug" />
                        ) : (
                          <Typography 
                            color="text.secondary" 
                            sx={{ 
                              textAlign: 'center', 
                              py: 4,
                              animation: 'fadeIn 0.5s ease-in'
                            }}
                          >
                            Run bug analysis to see results
                          </Typography>
                        )}
                      </TabPanel>
                      <TabPanel value={activeTab} index={1}>
                        {results.style ? (
                          <AnalysisResult result={results.style} type="style" />
                        ) : (
                          <Typography 
                            color="text.secondary" 
                            sx={{ 
                              textAlign: 'center', 
                              py: 4,
                              animation: 'fadeIn 0.5s ease-in'
                            }}
                          >
                            Run style analysis to see results
                          </Typography>
                        )}
                      </TabPanel>
                      <TabPanel value={activeTab} index={2}>
                        {results.performance ? (
                          <AnalysisResult result={results.performance} type="performance" />
                        ) : (
                          <Typography 
                            color="text.secondary" 
                            sx={{ 
                              textAlign: 'center', 
                              py: 4,
                              animation: 'fadeIn 0.5s ease-in'
                            }}
                          >
                            Run performance analysis to see results
                          </Typography>
                        )}
                      </TabPanel>
                      <TabPanel value={activeTab} index={3}>
                        {results.security ? (
                          <AnalysisResult result={results.security} type="security" />
                        ) : (
                          <Typography 
                            color="text.secondary" 
                            sx={{ 
                              textAlign: 'center', 
                              py: 4,
                              animation: 'fadeIn 0.5s ease-in'
                            }}
                          >
                            Run security analysis to see results
                          </Typography>
                        )}
                      </TabPanel>
                    </AnimatePresence>
                  </>
                )}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

export default CodeAnalyzer; 