import React from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Container, 
  Grid, 
  Paper,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CodeIcon from '@mui/icons-material/Code';
import BugReportIcon from '@mui/icons-material/BugReport';
import StyleIcon from '@mui/icons-material/Style';
import SpeedIcon from '@mui/icons-material/Speed';
import SecurityIcon from '@mui/icons-material/Security';
import { motion } from 'framer-motion';
import ThreeDBackground from '../components/ThreeDBackground';

function Home() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const features = [
    {
      icon: <BugReportIcon sx={{ fontSize: 40, color: '#fff' }} />,
      title: 'Bug Detection',
      description: 'Identify potential bugs and errors in your code',
      color: '#ff4d4d'
    },
    {
      icon: <StyleIcon sx={{ fontSize: 40, color: '#fff' }} />,
      title: 'Code Style',
      description: 'Ensure consistent coding style and best practices',
      color: '#2196F3'
    },
    {
      icon: <SpeedIcon sx={{ fontSize: 40, color: '#fff' }} />,
      title: 'Performance',
      description: 'Optimize your code for better performance',
      color: '#ffb74d'
    },
    {
      icon: <SecurityIcon sx={{ fontSize: 40, color: '#fff' }} />,
      title: 'Security',
      description: 'Detect security vulnerabilities in your code',
      color: '#ff4d4d'
    }
  ];

  return (
    <Box sx={{ 
      position: 'relative',
      minHeight: '100vh',
      overflow: 'hidden',
    }}>
      <ThreeDBackground />
      
      <Container maxWidth="lg">
        <Box
          component={motion.div}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          sx={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
            zIndex: 1,
          }}
        >
          <Typography
            component={motion.h1}
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            variant="h2"
            sx={{
              mb: 4,
              textAlign: 'center',
              color: '#fff',
              fontWeight: 'bold',
              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 0 20px rgba(33, 150, 243, 0.3)',
            }}
          >
            Welcome to Code Analyzer
          </Typography>

          <Typography
            component={motion.p}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            variant="h5"
            sx={{
              mb: 6,
              textAlign: 'center',
              color: 'rgba(255, 255, 255, 0.8)',
              maxWidth: '800px',
            }}
          >
            Analyze your code for bugs, style issues, performance problems, and security vulnerabilities
            with our advanced AI-powered analysis tool.
          </Typography>

          <Box
            component={motion.div}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            sx={{
              display: 'flex',
              gap: 3,
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}
          >
            <Button
              component={motion.button}
              whileHover={{ scale: 1.05, rotateX: 5, rotateY: 5 }}
              whileTap={{ scale: 0.95 }}
              variant="contained"
              size="large"
              startIcon={<CodeIcon />}
              onClick={() => navigate('/analyze')}
              sx={{
                background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                color: 'white',
                padding: '12px 32px',
                fontSize: '1.2rem',
                borderRadius: '12px',
                boxShadow: '0 8px 32px rgba(33, 150, 243, 0.3)',
                transformStyle: 'preserve-3d',
                perspective: '1000px',
                '&:hover': {
                  background: 'linear-gradient(45deg, #1976D2 30%, #1E88E5 90%)',
                  boxShadow: '0 12px 40px rgba(33, 150, 243, 0.4)',
                }
              }}
            >
              Start Analyzing
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default Home; 