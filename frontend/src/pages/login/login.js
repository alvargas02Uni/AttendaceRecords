import React, { useState } from 'react';
import { Container, Box, Typography } from '@mui/material';
import LoginForm from './components/loginForm';
import LoginError from './components/loginError';

const Login = () => {
  const [errorMessage, setErrorMessage] = useState('');
  const [openError, setOpenError] = useState(false);

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 5, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Login
        </Typography>
        <LoginForm setErrorMessage={setErrorMessage} setOpenError={setOpenError} />
        <LoginError openError={openError} setOpenError={setOpenError} errorMessage={errorMessage} />
      </Box>
    </Container>
  );
};

export default Login;