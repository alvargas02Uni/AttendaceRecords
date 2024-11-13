import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, TextField } from '@mui/material';
import { useAuth } from '../../../common/authContext';

const LoginForm = ({ setErrorMessage, setOpenError }) => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    user_email: '',
    user_password: ''
  });

  const [errors, setErrors] = useState({
    user_email: '',
    user_password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Validación básica
    if (name === 'user_email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      setErrors({ ...errors, user_email: emailRegex.test(value) ? '' : 'Invalid email address' });
    } else if (name === 'user_password') {
      setErrors({ ...errors, user_password: value ? '' : 'Password cannot be empty' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!errors.user_email && !errors.user_password) {
      try {
        const response = await fetch('https://localhost:5000/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        });
        const data = await response.json();

        if (response.ok) {
          login(data.token);

          // Redirección basada en el rol del usuario
          if (data.isAdmin) {
            navigate('/admin-dashboard');
          } else {
            navigate('/student-dashboard');
          }
        } else {
          setErrorMessage(
            response.status === 404 ? 'Email not found' :
            response.status === 401 ? 'Incorrect password' :
            'Login failed. Please try again.'
          );
          setOpenError(true);
        }
      } catch (error) {
        console.error('Error logging in:', error);
        setErrorMessage('Error logging in. Please try again later.');
        setOpenError(true);
      }
    }
  };

  const isFormValid = formData.user_email && formData.user_password && !errors.user_email && !errors.user_password;

  return (
    <Box>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Email"
          name="user_email"
          value={formData.user_email}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
          error={!!errors.user_email}
          helperText={errors.user_email}
          sx={{
            '& .MuiInputLabel-root': { color: '#ff3333' },
            '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': { borderColor: '#ff3333' },
            '&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': { borderColor: '#e60000' },
            '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#ff3333' }
          }}
        />
        <TextField
          label="Password"
          name="user_password"
          type="password"
          value={formData.user_password}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
          error={!!errors.user_password}
          helperText={errors.user_password}
          sx={{
            '& .MuiInputLabel-root': { color: '#ff3333' },
            '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': { borderColor: '#ff3333' },
            '&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': { borderColor: '#e60000' },
            '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#ff3333' }
          }}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={!isFormValid}
          sx={{ mt: 2, backgroundColor: isFormValid ? '#ff3333' : '#cccccc', '&:hover': { backgroundColor: isFormValid ? '#e60000' : '#cccccc' } }}
        >
          Login
        </Button>
      </form>
    </Box>
  );
};

export default LoginForm;