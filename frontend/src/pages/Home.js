import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
} from '@mui/material';
import BugReportIcon from '@mui/icons-material/BugReport';
import StyleIcon from '@mui/icons-material/Style';
import SpeedIcon from '@mui/icons-material/Speed';
import SecurityIcon from '@mui/icons-material/Security';

function Home() {
  const navigate = useNavigate();

  const features = [
    {
      title: 'Bug Detection',
      description: 'Identify potential bugs and issues in your code with AI-powered analysis.',
      icon: <BugReportIcon sx={{ fontSize: 40 }} />,
    },
    {
      title: 'Style Analysis',
      description: 'Ensure your code follows best practices and style guidelines.',
      icon: <StyleIcon sx={{ fontSize: 40 }} />,
    },
    {
      title: 'Performance Optimization',
      description: 'Find performance bottlenecks and get optimization suggestions.',
      icon: <SpeedIcon sx={{ fontSize: 40 }} />,
    },
    {
      title: 'Security Review',
      description: 'Detect security vulnerabilities and get secure coding recommendations.',
      icon: <SecurityIcon sx={{ fontSize: 40 }} />,
    },
  ];

  return (
    <Box>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Welcome to Code Analyzer
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph>
          Analyze your code with AI-powered tools for bugs, style, performance, and security.
        </Typography>
        <Button
          variant="contained"
          size="large"
          onClick={() => navigate('/analyze')}
          sx={{ mt: 2 }}
        >
          Start Analyzing
        </Button>
      </Box>

      <Grid container spacing={4}>
        {features.map((feature, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                <Typography gutterBottom variant="h5" component="h2">
                  {feature.title}
                </Typography>
                <Typography color="text.secondary">
                  {feature.description}
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                <Button size="small" onClick={() => navigate('/analyze')}>
                  Learn More
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default Home; 