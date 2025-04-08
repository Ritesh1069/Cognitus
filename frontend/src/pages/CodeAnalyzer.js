import React, { useState, useEffect } from 'react';
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
  AppBar,
  Toolbar,
  IconButton,
  Divider,
} from '@mui/material';
import { TreeView, TreeItem } from '@mui/x-tree-view';
import { motion, AnimatePresence } from 'framer-motion';
import ThreeDBackground from '../components/ThreeDBackground';
import CodeAssistant from '../components/CodeAssistant';
import ContextReview from '../components/ContextReview';
import CodeDashboard from '../components/CodeDashboard';
import {
  BugReport as BugReportIcon,
  Style as StyleIcon,
  Speed as SpeedIcon,
  Security as SecurityIcon,
  Home as HomeIcon,
  Code as CodeIcon,
  Analytics as AnalyticsIcon,
  Lightbulb as LightbulbIcon,
  Folder as FolderIcon,
  InsertDriveFile as FileIcon,
  ChevronRight as ChevronRightIcon,
  ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

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
          <AnimatePresence mode="popLayout">
            <motion.div
              key={`tab-${index}`}
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

function FileExplorer({ files, onFileSelect, selectedFile }) {
  const renderTree = (nodes) => {
    if (nodes.type === 'file') {
      return (
        <TreeItem
          key={nodes.path}
          itemId={nodes.path}
          label={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <FileIcon sx={{ fontSize: 16 }} />
              <Typography variant="body2">{nodes.name}</Typography>
            </Box>
          }
          onClick={() => onFileSelect(nodes)}
          sx={{
            '& .MuiTreeItem-content': {
              padding: '4px 8px',
              borderRadius: '4px',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
              },
              '&.Mui-selected': {
                backgroundColor: 'rgba(33, 150, 243, 0.1)',
                '&:hover': {
                  backgroundColor: 'rgba(33, 150, 243, 0.15)',
                },
              },
            },
          }}
        />
      );
    }

    return (
      <TreeItem
        key={nodes.path}
        itemId={nodes.path}
        label={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <FolderIcon sx={{ fontSize: 16 }} />
            <Typography variant="body2">{nodes.name}</Typography>
          </Box>
        }
      >
        {Array.isArray(nodes.children) ? nodes.children.map((node) => renderTree(node)) : null}
      </TreeItem>
    );
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        height: '100%',
        background: 'rgba(26, 32, 44, 0.7)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '12px',
      }}
    >
      <Typography variant="h6" sx={{ mb: 2, color: '#fff' }}>
        Files
      </Typography>
      <TreeView
        aria-label="file system navigator"
        sx={{
          height: '100%',
          flexGrow: 1,
          maxWidth: 400,
          overflowY: 'auto',
          color: '#fff',
          '& .MuiTreeItem-content': {
            color: 'rgba(255, 255, 255, 0.7)',
          },
        }}
      >
        {files.map((file) => renderTree(file))}
      </TreeView>
    </Paper>
  );
}

function CodeAnalyzer() {
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState({
    bug: null,
    style: null,
    performance: null,
    security: null,
  });
  const [activeTab, setActiveTab] = useState(0);

  const handleFileSelect = (file) => {
    setSelectedFile(file);
    setCode(file.content || '');
    setLanguage(file.language || 'javascript');
  };

  const handleFileUpload = (event) => {
    const fileList = event.target.files;
    const newFiles = [];

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      const reader = new FileReader();

      reader.onload = (e) => {
        const content = e.target.result;
        const filePath = file.webkitRelativePath || file.name;
        const pathParts = filePath.split('/');
        
        let currentLevel = newFiles;
        for (let j = 0; j < pathParts.length - 1; j++) {
          const part = pathParts[j];
          let folder = currentLevel.find(item => item.name === part && item.type === 'directory');
          
          if (!folder) {
            folder = {
              name: part,
              path: pathParts.slice(0, j + 1).join('/'),
              type: 'directory',
              children: []
            };
            currentLevel.push(folder);
          }
          currentLevel = folder.children;
        }

        const fileName = pathParts[pathParts.length - 1];
        const extension = fileName.split('.').pop().toLowerCase();
        const languageMap = {
          'js': 'javascript',
          'ts': 'typescript',
          'py': 'python',
          'java': 'java',
          'cpp': 'c++',
          'cs': 'c#',
          'go': 'go',
          'rb': 'ruby',
          'php': 'php'
        };

        const newFile = {
          name: fileName,
          path: filePath,
          type: 'file',
          content: content,
          language: languageMap[extension] || 'javascript'
        };

        currentLevel.push(newFile);
        setFiles([...newFiles]);
      };

      reader.readAsText(file);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;
    
    setLoading(true);
    try {
      const analysisTypes = ['bug', 'style', 'performance', 'security'];
      const responses = await Promise.all(
        analysisTypes.map(type => 
          axios.post(`http://localhost:5000/analyze/${type}`, {
            code: selectedFile.content,
            language: selectedFile.language,
          })
        )
      );

      const newResults = {};
      analysisTypes.forEach((type, index) => {
        newResults[type] = responses[index].data.result;
      });
      setResults(newResults);
      setActiveTab(0);
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

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <ThreeDBackground />
      
      {/* Navigation Bar */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          background: 'rgba(26, 32, 44, 0.8)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          zIndex: 1200,
        }}
      >
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => navigate('/')}
            sx={{
              mr: 2,
              '&:hover': {
                transform: 'scale(1.1)',
                transition: 'transform 0.2s',
              },
            }}
          >
            <HomeIcon />
          </IconButton>
          <Typography
            variant="h6"
            component="div"
            sx={{
              flexGrow: 1,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              color: '#fff',
            }}
          >
            <CodeIcon />
            Cognitia
          </Typography>
          <IconButton
            color="inherit"
            onClick={() => navigate('/analyze')}
            sx={{
              mx: 1,
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                transform: 'scale(1.1)',
                transition: 'transform 0.2s',
              },
            }}
          >
            <AnalyticsIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box
        component={motion.div}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        sx={{
          position: 'relative',
          zIndex: 2,
          p: 3,
          mt: 8,
          minHeight: 'calc(100vh - 64px)', // Subtract AppBar height
          display: 'flex',
          flexDirection: 'column',
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

        <Grid container spacing={3} sx={{ flexGrow: 1, zIndex: 3 }}>
          <Grid item xs={12} md={3}>
            <FileExplorer 
              files={files} 
              onFileSelect={handleFileSelect} 
              selectedFile={selectedFile} 
            />
          </Grid>

          <Grid item xs={12} md={9}>
            <Stack spacing={3} sx={{ height: '100%' }}>
              <Paper 
                component={motion.div}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                sx={{ 
                  p: 2, 
                  background: 'rgba(26, 32, 44, 0.9)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  position: 'relative',
                  zIndex: 3,
                }}
              >
                <Stack spacing={2}>
                  <Button
                    variant="contained"
                    component="label"
                    sx={{
                      background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                      boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #1976D2 30%, #1E88E5 90%)',
                        transform: 'translateY(-2px)',
                      },
                    }}
                  >
                    Upload Project
                    <input
                      type="file"
                      hidden
                      webkitdirectory=""
                      directory=""
                      onChange={handleFileUpload}
                    />
                  </Button>

                  {selectedFile && (
                    <>
                      <TextField
                        fullWidth
                        multiline
                        rows={10}
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        placeholder="Enter your code here..."
                        variant="outlined"
                        label="Code"
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

                      <FormControl fullWidth>
                        <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Language</InputLabel>
                        <Select
                          value={language}
                          onChange={(e) => setLanguage(e.target.value)}
                          label="Language"
                          sx={{
                            color: '#fff',
                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
                            '& .MuiOutlinedInput-notchedOutline': {
                              borderColor: 'rgba(255, 255, 255, 0.1)',
                            },
                            '&:hover': {
                              '& .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#2196F3',
                              }
                            },
                            '& .MuiSvgIcon-root': {
                              color: 'rgba(255, 255, 255, 0.7)',
                            }
                          }}
                        >
                          {languages.map((lang) => (
                            <MenuItem key={lang} value={lang.toLowerCase()}>
                              {lang}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>

                      <Button
                        variant="contained"
                        onClick={handleAnalyze}
                        disabled={loading || !code.trim()}
                        sx={{
                          py: 1.5,
                          background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                          boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
                          '&:hover': {
                            background: 'linear-gradient(45deg, #1976D2 30%, #1E88E5 90%)',
                            transform: 'translateY(-2px)',
                          },
                          '&:disabled': {
                            background: 'rgba(255, 255, 255, 0.1)',
                            color: 'rgba(255, 255, 255, 0.3)',
                          }
                        }}
                      >
                        {loading ? (
                          <CircularProgress size={24} sx={{ color: '#fff' }} />
                        ) : (
                          'Analyze Code'
                        )}
                      </Button>
                    </>
                  )}
                </Stack>
              </Paper>

              {Object.values(results).some(result => result !== null) && (
                <Paper 
                  component={motion.div}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  sx={{ 
                    p: 3, 
                    background: 'rgba(26, 32, 44, 0.9)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    mt: 3,
                    position: 'relative',
                    zIndex: 3,
                    maxHeight: 'calc(100vh - 400px)',
                    overflowY: 'auto',
                  }}
                >
                  <Tabs
                    value={activeTab}
                    onChange={handleTabChange}
                    sx={{
                      mb: 3,
                      '& .MuiTabs-indicator': {
                        backgroundColor: '#2196F3',
                      },
                      '& .MuiTab-root': {
                        color: 'rgba(255, 255, 255, 0.7)',
                        '&.Mui-selected': {
                          color: '#2196F3',
                        },
                      },
                    }}
                  >
                    <Tab label="Bug Detection" />
                    <Tab label="Style Analysis" />
                    <Tab label="Performance" />
                    <Tab label="Security" />
                  </Tabs>

                  <Box sx={{ position: 'relative', minHeight: 200 }}>
                    <AnimatePresence mode="popLayout">
                      <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <TabPanel value={activeTab} index={0}>
                          <AnalysisResult result={results.bug} type="bug" />
                        </TabPanel>
                        <TabPanel value={activeTab} index={1}>
                          <AnalysisResult result={results.style} type="style" />
                        </TabPanel>
                        <TabPanel value={activeTab} index={2}>
                          <AnalysisResult result={results.performance} type="performance" />
                        </TabPanel>
                        <TabPanel value={activeTab} index={3}>
                          <AnalysisResult result={results.security} type="security" />
                        </TabPanel>
                      </motion.div>
                    </AnimatePresence>
                  </Box>
                </Paper>
              )}
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

export default CodeAnalyzer; 