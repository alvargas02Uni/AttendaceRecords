import React from 'react';
import { Box, Container, Typography, Grid, Card, CardContent } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../middleware/authContext';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ScienceIcon from '@mui/icons-material/Science';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import ClassIcon from '@mui/icons-material/Class';

const Home = () => {
  const { user, admin } = useAuth(); // Acceder a `user` y `admin` desde el contexto de autenticación
  const navigate = useNavigate();

  // Definir botones específicos para administradores y estudiantes
  const adminButtons = [
    { path: "/admin-dashboard", label: "Admin Dashboard", icon: <DashboardIcon /> },
    { path: "/labs/manage", label: "Manage Labs", icon: <ScienceIcon /> }
  ];

  const studentButtons = [
    { path: "/labs", label: "View Labs", icon: <ClassIcon /> },
    { path: "/attendance/register", label: "Register Attendance", icon: <AssignmentTurnedInIcon /> }
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 5 }}>
      {admin ? (
        // Si el usuario es un administrador
        <Box>
          <Typography
            variant="h2"
            gutterBottom
            sx={{
              textAlign: 'center',
              mb: 4,
              fontWeight: 'bold',
              color: '#ffffff',
              backgroundColor: '#d82626',
              padding: '20px',
              borderRadius: '10px',
              boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
            }}
          >
            Welcome, {admin.user_name}
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            {adminButtons.map((button, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card
                  onClick={() => navigate(button.path)}
                  sx={{
                    backgroundColor: '#ff3333',
                    color: 'white',
                    '&:hover': { backgroundColor: '#e60000', cursor: 'pointer' },
                    height: '150px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <CardContent sx={{ textAlign: 'center' }}>
                    {button.icon}
                    <Typography variant="h6" sx={{ mt: 2 }}>
                      {button.label}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      ) : user ? (
        // Si el usuario es un estudiante
        <Box>
          <Typography
            variant="h2"
            gutterBottom
            sx={{
              textAlign: 'center',
              mb: 4,
              fontWeight: 'bold',
              color: '#ffffff',
              backgroundColor: '#d82626',
              padding: '20px',
              borderRadius: '10px',
              boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
            }}
          >
            Welcome, {user.user_name}
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            {studentButtons.map((button, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card
                  onClick={() => navigate(button.path)}
                  sx={{
                    backgroundColor: '#ff3333',
                    color: 'white',
                    '&:hover': { backgroundColor: '#e60000', cursor: 'pointer' },
                    height: '150px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <CardContent sx={{ textAlign: 'center' }}>
                    {button.icon}
                    <Typography variant="h6" sx={{ mt: 2 }}>
                      {button.label}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      ) : (
        // Si el usuario no ha iniciado sesión
        <Box sx={{ backgroundColor: '#ff3333', p: 4, borderRadius: 5, textAlign: 'center', color: 'white' }}>
          <Typography variant="h3" gutterBottom>
            Welcome to the Attendance Management System
          </Typography>
          <Typography variant="h5" gutterBottom>
            Please login to continue
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default Home;
