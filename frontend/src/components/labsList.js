import React, { useState, useEffect } from 'react';
import { Container, Typography, Card, CardContent, CircularProgress, Grid, Box } from '@mui/material';
import { useAuth } from '../util/authContext';

const LabList = () => {
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

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Typography variant="h4" gutterBottom>Available Labs</Typography>
      <Grid container spacing={3}>
        {labs.map((lab) => (
          <Grid item xs={12} sm={6} md={4} key={lab.lab_id}>
            <Card sx={{ backgroundColor: '#ff4d4d', color: 'white' }}>
              <CardContent>
                <Typography variant="h6">{lab.lab_name}</Typography>
                <Typography variant="body2">{lab.lab_description}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default LabList;