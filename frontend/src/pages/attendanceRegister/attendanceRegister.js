import React, { useState, useEffect } from 'react';
import { Container, Typography, CircularProgress } from '@mui/material';
import { useAuth } from '../../common/authContext';
import LabList from './components/labsList';
import { registerAttendance, endAttendance } from './components/attendanceServices';

const AttendanceRegister = () => {
  const { user } = useAuth();
  const [labs, setLabs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeLab, setActiveLab] = useState(null);

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
    await registerAttendance(labId, user);
    setActiveLab(labId);
  };

  const handleEndAttendance = async () => {
    await endAttendance(activeLab, user);
    setActiveLab(null);
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Typography variant="h4" gutterBottom>Register Attendance</Typography>
      <LabList labs={labs} activeLab={activeLab} handleRegisterAttendance={handleRegisterAttendance} handleEndAttendance={handleEndAttendance} />
    </Container>
  );
};

export default AttendanceRegister;