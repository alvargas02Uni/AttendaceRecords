import React, { useState, useEffect } from 'react'; 
import { Container, Card, Typography } from '@mui/material';
import { useAuth } from '../../common/authContext';
import AttendanceRecords from './components/attendanceRecords';
import UserStatistics from './components/userStatistics';
import UserSearchFilters from './components/userSearchFilters';
import { fetchUsers, fetchAttendances, calculateStatistics } from './components/dashboardServices';

const Dashboard = () => {
  const { admin, logout } = useAuth();
  const [attendances, setAttendances] = useState([]);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statistics, setStatistics] = useState({ averageAge: 0, genderDistribution: {}, nearPercentage: 0 });

  useEffect(() => {
    const fetchData = async () => {
      await fetchUsers(admin, setUsers, setFilteredUsers, logout);
      await fetchAttendances(admin, setAttendances, setLoading, logout);
    };
    if (admin?.token) fetchData();
  }, [admin, logout]);  

  useEffect(() => {
    calculateStatistics(users, setStatistics);
  }, [users]);

  return (
    <Container maxWidth="lg" sx={{ mt: 5, mb: 5 }}>
      <Card sx={{ backgroundColor: '#ff4d4d', p: 3, mb: 5, boxShadow: 3 }}>
        <Typography variant="h3" color="white" align="center" gutterBottom>
          Admin Dashboard
        </Typography>
      </Card>
      <AttendanceRecords attendances={attendances} loading={loading} />
      <UserStatistics statistics={statistics} totalUsers={users.length} />
      <UserSearchFilters
        users={users}
        filteredUsers={filteredUsers}
        setFilteredUsers={setFilteredUsers}
      />
    </Container>
  );
};

export default Dashboard;
