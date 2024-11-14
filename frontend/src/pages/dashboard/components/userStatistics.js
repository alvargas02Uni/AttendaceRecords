import React from 'react';
import { Card, Box, Typography, Grid2 } from '@mui/material';

const UserStatistics = ({ statistics, totalUsers }) => {
  const { averageAge, genderDistribution } = statistics;

  return (
    <>
      <Typography variant="h6" sx={{ marginTop: 2, color: '#d82626' }}>
        User Statistics
      </Typography>
      <Card sx={{ borderColor: '#d82626', borderWidth: 2, borderStyle: 'solid', p: 3, mb: 5 }}>
        <Grid2 container spacing={2}>
          <Grid2 item xs={12} sm={4}>
            <Box sx={{ backgroundColor: '#ff6666', padding: 2, borderRadius: 1, minWidth: '200px' }}>
              <Typography variant="h6" sx={{ color: '#ffffff' }}>
                Total Users
              </Typography>
              <Typography variant="h4" sx={{ color: '#ffffff' }}>
                {totalUsers}
              </Typography>
            </Box>
          </Grid2>
          <Grid2 item xs={12} sm={4}>
            <Box sx={{ backgroundColor: '#ff6666', padding: 2, borderRadius: 1, minWidth: '200px' }}>
              <Typography variant="h6" sx={{ color: '#ffffff' }}>
                Average Age
              </Typography>
              <Typography variant="h4" sx={{ color: '#ffffff' }}>
                {averageAge} years
              </Typography>
            </Box>
          </Grid2>
          <Grid2 item xs={12} sm={4}>
            <Box sx={{ backgroundColor: '#ff6666', padding: 2, borderRadius: 1, minWidth: '200px' }}>
              <Typography variant="h6" sx={{ color: '#ffffff' }}>
                Gender Distribution
              </Typography>
              <Typography variant="body1" sx={{ color: '#ffffff' }}>
                Male: {genderDistribution.male || 0} ({((genderDistribution.male / totalUsers) * 100).toFixed(2)}%)
              </Typography>
              <Typography variant="body1" sx={{ color: '#ffffff' }}>
                Female: {genderDistribution.female || 0} ({((genderDistribution.female / totalUsers) * 100).toFixed(2)}%)
              </Typography>
              <Typography variant="body1" sx={{ color: '#ffffff' }}>
                Non-binary: {genderDistribution.non_binary || 0} ({((genderDistribution.non_binary / totalUsers) * 100).toFixed(2)}%)
              </Typography>
            </Box>
          </Grid2>
        </Grid2>
      </Card>
    </>
  );
};

export default UserStatistics;