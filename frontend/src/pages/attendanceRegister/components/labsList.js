import React from 'react';
import { Container, Typography, Card, CardContent, Grid2, Button } from '@mui/material';

const LabList = ({ labs, activeLab, handleRegisterAttendance, handleEndAttendance }) => {
  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Typography variant="h4" gutterBottom>Available Labs</Typography>
      <Grid2 container spacing={3}>
        {labs.map((lab) => (
          <Grid2 item xs={12} sm={6} md={4} key={lab.lab_id}>
            <Card sx={{ backgroundColor: activeLab === lab.lab_id ? '#b2b2b2' : '#ff4d4d', color: 'white' }}>
              <CardContent>
                <Typography variant="h6">{lab.lab_name}</Typography>
                <Typography variant="body2">{lab.lab_description}</Typography>
                {activeLab === null && (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleRegisterAttendance(lab.lab_id)}
                    sx={{ mt: 2 }}
                  >
                    Register Attendance
                  </Button>
                )}
                {activeLab === lab.lab_id && (
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleEndAttendance}
                    sx={{ mt: 2 }}
                  >
                    End Attendance
                  </Button>
                )}
              </CardContent>
            </Card>
          </Grid2>
        ))}
      </Grid2>
    </Container>
  );
};

export default LabList;
