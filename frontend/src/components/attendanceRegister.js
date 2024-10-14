import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, CircularProgress, Box } from '@mui/material';
import { useAuth } from '../util/authContext';

const AttendanceRegister = () => {
  const { user } = useAuth();
  const [labs, setLabs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLabs = async () => {
      try {
        const response = await fetch('https://localhost:5000/labs', {
          headers: {
            'Authorization': `Bearer ${user?.token}`,
          },
        });
        if (!response.ok) throw new Error('Failed to fetch labs');
        const data = await response.json();
        setLabs(data);
      } catch (error) {
        console.error('Error fetching labs:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchLabs();
    }
  }, [user]);

  const handleRegisterAttendance = async (labId) => {
    try {
      const response = await fetch(`https://localhost:5000/attendance/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}`,
        },
        body: JSON.stringify({ lab_id: labId, user_id: user.user_id }),
      });
      if (!response.ok) throw new Error('Failed to register attendance');
      alert('Attendance registered successfully');
    } catch (error) {
      console.error('Error registering attendance:', error);
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Typography variant="h4" gutterBottom>Register Attendance</Typography>
      {labs.map((lab) => (
        <Box key={lab.lab_id} sx={{ mb: 3 }}>
          <Typography variant="h6">{lab.lab_name}</Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleRegisterAttendance(lab.lab_id)}
            sx={{ mt: 1 }}
          >
            Register Attendance
          </Button>
        </Box>
      ))}
    </Container>
  );
};

export default AttendanceRegister;