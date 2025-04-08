import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
} from '@mui/material';
import ThreeDBackground from '../components/ThreeDBackground';
import { motion } from 'framer-motion';

function Home() {
  const navigate = useNavigate();

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
      
      <Box
        component={motion.div}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        sx={{
          position: 'relative',
          zIndex: 1,
          p: 3,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
        }}
      >
        <Typography
          variant="h3"
          component={motion.h1}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          sx={{
            mb: 2,
            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 0 20px rgba(33, 150, 243, 0.3)',
            fontWeight: 'bold',
            textAlign: 'center',
          }}
        >
          Welcome to Cognitia AI
        </Typography>
        <Typography
          variant="h6"
          component={motion.p}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          sx={{
            color: 'rgba(255, 255, 255, 0.7)',
            mb: 4,
            textAlign: 'center',
            maxWidth: '600px',
          }}
        >
          Analyze your code with AI-powered tools for bugs, style, performance, and security.
        </Typography>
        <Button
          component={motion.button}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          variant="contained"
          size="large"
          onClick={() => navigate('/analyze')}
          sx={{
            py: 1.5,
            px: 4,
            fontSize: '1.1rem',
            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
            boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
            '&:hover': {
              background: 'linear-gradient(45deg, #1976D2 30%, #1E88E5 90%)',
              transform: 'translateY(-2px)',
            },
          }}
        >
          Start Analyzing
        </Button>
      </Box>
    </Box>
  );
}

export default Home; 