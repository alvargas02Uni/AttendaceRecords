import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow, Paper, CircularProgress, Box, Card, Typography } from '@mui/material';

const AttendanceRecords = ({ attendances, loading }) => {
  return (
    <>
      <Typography variant="h6" sx={{ marginTop: 2, backgroundColor: '#d82626', padding: 1, color: '#ffffff' }}>
        Attendance Records
      </Typography>
      <Card sx={{ backgroundColor: '#ff4d4d', p: 3, mb: 5, boxShadow: 3, marginTop: 2 }}>
        <Paper sx={{ overflow: 'hidden', mb: 2 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#d82626' }}>
                <TableCell sx={{ color: 'white' }}>User Name</TableCell>
                <TableCell sx={{ color: 'white' }}>Lab Name</TableCell>
                <TableCell sx={{ color: 'white' }}>Start Time</TableCell>
                <TableCell sx={{ color: 'white' }}>End Time</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {attendances.map((attendance) => (
                <TableRow key={attendance.att_id} sx={{ '&:nth-of-type(even)': { backgroundColor: '#ffe6e6' } }}>
                  <TableCell>{attendance.user_name} {attendance.user_surname}</TableCell>
                  <TableCell>{attendance.lab_name}</TableCell>
                  <TableCell>{new Date(attendance.att_time).toLocaleString()}</TableCell>
                  <TableCell>{attendance.att_end_time ? new Date(attendance.att_end_time).toLocaleString() : 'Pending...'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 2 }}>
            <CircularProgress />
          </Box>
        ) : null}
      </Card>
    </>
  );
};

export default AttendanceRecords;