import React from 'react';
import { Box, Typography, Grid2, Card, CardContent } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ScienceIcon from '@mui/icons-material/Science';

const AdminDashboard = ({ admin }) => {
  const navigate = useNavigate();
  const adminButtons = [
    { path: "/admin-dashboard", label: "Admin Dashboard", icon: <DashboardIcon /> },
    { path: "/labs/manage", label: "Manage Labs", icon: <ScienceIcon /> }
  ];

  return (
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
      <Grid2 container spacing={4} justifyContent="center">
        {adminButtons.map((button, index) => (
          <Grid2 item xs={12} sm={6} md={4} key={index}>
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
          </Grid2>
        ))}
      </Grid2>
    </Box>
  );
};

export default AdminDashboard;