import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
} from '@mui/material';
import CodeIcon from '@mui/icons-material/Code';

function Navbar() {
  return (
    <AppBar position="static">
      <Toolbar>
        <CodeIcon sx={{ mr: 2 }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Code Analyzer
        </Typography>
        <Box>
          <Button color="inherit" component={RouterLink} to="/">
            Home
          </Button>
          <Button color="inherit" component={RouterLink} to="/analyze">
            Analyze Code
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar; 