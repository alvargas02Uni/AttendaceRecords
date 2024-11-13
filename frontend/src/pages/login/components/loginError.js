import React from 'react';
import { Snackbar, Alert } from '@mui/material';

const LoginError = ({ openError, setOpenError, errorMessage }) => {
  return (
    <Snackbar open={openError} autoHideDuration={6000} onClose={() => setOpenError(false)}>
      <Alert onClose={() => setOpenError(false)} severity="error" sx={{ width: '100%' }}>
        {errorMessage}
      </Alert>
    </Snackbar>
  );
};

export default LoginError;