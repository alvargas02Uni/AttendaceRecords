import React from 'react';
import { Box, Typography } from '@mui/material';

const WelcomeMessage = () => {
  return (
    <Box sx={{ backgroundColor: '#ff3333', p: 4, borderRadius: 5, textAlign: 'center', color: 'white' }}>
      <Typography variant="h3" gutterBottom>
        Welcome to the Attendance Management System
      </Typography>
      <Typography variant="h5" gutterBottom>
        Please login to continue
      </Typography>
    </Box>
  );
};

export default WelcomeMessage;
