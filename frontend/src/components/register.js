import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Container, TextField, Typography, Checkbox, FormControlLabel, Snackbar, Alert, Card, CardContent, CircularProgress, Divider, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { useAuth } from '../middleware/authContext';

const Register = () => {
  const [formData, setFormData] = useState({
    user_name: '',
    user_surname: '',
    user_email: '',
    user_password: '', // Nuevo campo para la contraseña
    is_superadmin: false
  });
  const [admins, setAdmins] = useState([]);
  const [updatedAdmins, setUpdatedAdmins] = useState({});
  const navigate = useNavigate();
  const { admin } = useAuth();

  const [errors, setErrors] = useState({
    user_name: '',
    user_surname: '',
    user_email: '',
    user_password: '' // Añadir validación para la contraseña
  });

  const [successMessage, setSuccessMessage] = useState('');
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('https://localhost:5000/auth/admins', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setAdmins(response.data.admins);
      } catch (error) {
        console.error('Error fetching admins:', error);
      }
    };
    fetchAdmins();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });

    // Validación básica
    if (name === 'user_email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      setErrors({ ...errors, user_email: emailRegex.test(value) ? '' : 'Invalid email address' });
    } else if (name === 'user_password') {
      setErrors({ ...errors, user_password: value.length >= 8 ? '' : 'Password must be at least 8 characters' });
    } else {
      setErrors({ ...errors, [name]: value ? '' : 'This field is required' });
    }
  };

  const handleAdminChange = (index, field, value) => {
    const updatedAdmin = { ...admins[index], [field]: value };
    const newAdmins = [...admins];
    newAdmins[index] = updatedAdmin;
    setAdmins(newAdmins);
    setUpdatedAdmins({ ...updatedAdmins, [updatedAdmin.user_code]: true });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Object.values(errors).every((error) => error === '')) {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        await axios.post('https://localhost:5000/auth/register', formData, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        setSuccessMessage('Registration successful!');
        setOpen(true);
        setLoading(false);
        setTimeout(() => {
          navigate('/');
        }, 3000);
      } catch (error) {
        console.error('Error registering:', error);
        setLoading(false);
      }
    }
  };

  const handleSaveChanges = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put('https://localhost:5000/auth/admins', { admins }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setSuccessMessage('Changes saved successfully!');
      setOpen(true);
      setUpdatedAdmins({});
    } catch (error) {
      console.error('Error saving changes:', error);
    }
  };

  const isFormValid = formData.user_name && formData.user_surname && formData.user_email && formData.user_password && !errors.user_name && !errors.user_surname && !errors.user_email && !errors.user_password;

  if (!admin || !admin.is_superadmin) {
    return <Typography variant="h6" color="error">Access denied. Superadmin privileges required.</Typography>;
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 5, textAlign: 'center' }}>
        <Card sx={{ backgroundColor: '#ff4d4d', padding: '1rem', mt: 5 }}>
          <Typography variant="h5" textAlign="center" color="white">
            Admin Register
          </Typography>
          <CardContent>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <TextField
                variant="filled"
                label="First Name"
                name="user_name"
                value={formData.user_name}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
                error={!!errors.user_name}
                helperText={errors.user_name}
                inputProps={{ style: { color: 'white' } }}
                InputLabelProps={{ style: { color: 'white' } }}
              />
              <TextField
                variant="filled"
                label="Last Name"
                name="user_surname"
                value={formData.user_surname}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
                error={!!errors.user_surname}
                helperText={errors.user_surname}
                inputProps={{ style: { color: 'white' } }}
                InputLabelProps={{ style: { color: 'white' } }}
              />
              <TextField
                variant="filled"
                label="Email"
                name="user_email"
                value={formData.user_email}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
                error={!!errors.user_email}
                helperText={errors.user_email}
                inputProps={{ style: { color: 'white' } }}
                InputLabelProps={{ style: { color: 'white' } }}
                sx={{ minWidth: '300px', mx: 1 }} // Aumenta el ancho del campo de email y reduce los márgenes laterales
              />
              <TextField
                variant="filled"
                label="Password"
                type="password"
                name="user_password"
                value={formData.user_password}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
                error={!!errors.user_password}
                helperText={errors.user_password}
                inputProps={{ style: { color: 'white' } }}
                InputLabelProps={{ style: { color: 'white' } }}
                sx={{ minWidth: '300px', mx: 1 }} // Aumenta el ancho del campo de contraseña y reduce los márgenes laterales
              />
              <FormControlLabel
                control={
                  <Checkbox
                    name="is_superadmin"
                    checked={formData.is_superadmin}
                    onChange={handleChange}
                    sx={{ color: '#ffffff' }}
                  />
                }
                label="Superadmin"
                sx={{ color: 'white' }}
              />
              <Button
                type="submit"
                variant="contained"
                disabled={!isFormValid || loading}
                sx={{ mt: 2, backgroundColor: isFormValid ? '#ff3333' : '#cccccc', '&:hover': { backgroundColor: isFormValid ? '#e60000' : '#cccccc' } }}
              >
                {loading ? <CircularProgress color="inherit" size={24} /> : 'Register'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Box sx={{ border: '1px solid red', padding: '1rem', mt: 5, mb: 10 }}>
          <Typography variant="h6" color="red" gutterBottom>
            Admin Management
          </Typography>
          <TableContainer component={Paper} sx={{ overflowX: 'auto' }}>
            <Table sx={{ tableLayout: 'fixed' }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ width: '15%' }}>First Name</TableCell>
                  <TableCell sx={{ width: '15%' }}>Last Name</TableCell>
                  <TableCell sx={{ width: '25%' }}>Email</TableCell>
                  <TableCell sx={{ width: '25%' }}>Password</TableCell>
                  <TableCell sx={{ width: '10%' }}>Superadmin</TableCell>
                  <TableCell sx={{ width: '10%' }}>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {admins.map((admin, index) => (
                  <TableRow key={admin.user_code}>
                    <TableCell>
                      <TextField
                        value={admin.user_name}
                        onChange={(e) => handleAdminChange(index, 'user_name', e.target.value)}
                        fullWidth
                        margin="dense"
                        sx={{ mx: 1 }} // Reduce los márgenes laterales
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        value={admin.user_surname}
                        onChange={(e) => handleAdminChange(index, 'user_surname', e.target.value)}
                        fullWidth
                        margin="dense"
                        sx={{ mx: 1 }} // Reduce los márgenes laterales
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        value={admin.user_email}
                        onChange={(e) => handleAdminChange(index, 'user_email', e.target.value)}
                        fullWidth
                        margin="dense"
                        sx={{ mx: 1 }} // Reduce los márgenes laterales
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        type="password"
                        value={admin.new_password || ''}
                        onChange={(e) => handleAdminChange(index, 'new_password', e.target.value)}
                        fullWidth
                        margin="dense"
                        placeholder="Leave blank to keep current password"
                        sx={{ mx: 1 }} // Reduce los márgenes laterales
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Checkbox
                        checked={admin.is_superadmin}
                        onChange={(e) => handleAdminChange(index, 'is_superadmin', e.target.checked)}
                      />
                    </TableCell>
                    <TableCell align="center">
                      {updatedAdmins[admin.user_code] && (
                        <Typography variant="body2" color="red">
                          Modified
                        </Typography>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Button
            variant="contained"
            onClick={handleSaveChanges}
            disabled={Object.keys(updatedAdmins).length === 0}
            sx={{ mt: 2, backgroundColor: '#ff3333', '&:hover': { backgroundColor: '#e60000' } }}
          >
            Save Changes
          </Button>
        </Box>

        <Snackbar open={open} autoHideDuration={6000} onClose={() => setOpen(false)}>
          <Alert onClose={() => setOpen(false)} severity="success" sx={{ width: '100%' }}>
            {successMessage}
          </Alert>
        </Snackbar>
      </Box>
    </Container>
  );
};

export default Register;