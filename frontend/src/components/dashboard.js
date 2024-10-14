import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow, Paper, Typography, Container, Button, CircularProgress, Box, IconButton, Card, TextField, MenuItem, Select, FormControl, InputLabel, Grid, Divider } from '@mui/material';
import { ArrowBack, ArrowForward } from '@mui/icons-material';
import { useAuth } from '../middleware/authContext';

const Dashboard = () => {
  const { admin, logout } = useAuth();
  const [attendances, setAttendances] = useState([]);
  const [labs, setLabs] = useState([]);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [genderFilter, setGenderFilter] = useState('');
  const [degreeFilter, setDegreeFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [offset, setOffset] = useState(0);

  // Estadísticas
  const [averageAge, setAverageAge] = useState(0);
  const [genderDistribution, setGenderDistribution] = useState({ male: 0, female: 0, non_binary: 0 });
  const [nearPercentage, setNearPercentage] = useState(0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  useEffect(() => {
    const fetchData = async () => {
      await fetchUsers();           // Obtener la lista de usuarios
      await fetchLabs();            // Obtener la lista de laboratorios
      await fetchAttendances();     // Obtener los registros de asistencia
    };

    if (admin?.token) {
      fetchData();
    }
  }, [admin?.token]); // Dependencia en el token para asegurar que se ejecute cuando esté disponible

  useEffect(() => {
    calculateStatistics();
  }, [users, labs]); // Dependencia en `users` y `labs` para recalcular estadísticas cuando estos cambien

  const fetchUsers = async () => {
    try {
      if (!admin?.token) return;

      const response = await fetch(`https://localhost:5000/user/users`, {
        headers: {
          'Authorization': `Bearer ${admin.token}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch users');
      const usersData = await response.json();

      setUsers(usersData);
      setFilteredUsers(usersData);
    } catch (error) {
      console.error('Error fetching users:', error.message);
      alert(`Error fetching users: ${error.message}`);
      if (error.message === 'Failed to fetch users') {
        logout();
      }
    }
  };

  const fetchAttendances = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://localhost:5000/attendance?offset=0', {
        headers: {
          'Authorization': `Bearer ${admin?.token}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch attendances');
      const data = await response.json();
      setAttendances(data);
    } catch (error) {
      console.error('Error fetching attendances:', error);
      if (error.message === 'Failed to fetch attendances') {
        logout();
      }
    }
    setLoading(false);
  };

  const fetchLabs = async () => {
    try {
      const response = await fetch('https://localhost:5000/labs', {
        headers: {
          'Authorization': `Bearer ${admin?.token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch labs');
      const labsData = await response.json();
      setLabs(labsData);
    } catch (error) {
      console.error('Error fetching labs:', error.message);
      if (error.message === 'Failed to fetch labs') {
        logout();
      }
    }
  };

  const calculateStatistics = () => {
    if (users.length > 0) {
      const totalAge = users.reduce((sum, user) => sum + (user.user_age || 0), 0);
      const averageAge = totalAge / users.length;
      setAverageAge(averageAge.toFixed(2));

      const genderCount = users.reduce((acc, user) => {
        acc[user.user_gender] = (acc[user.user_gender] || 0) + 1;
        return acc;
      }, { male: 0, female: 0, non_binary: 0 });
      setGenderDistribution(genderCount);

      const nearCount = users.filter(user => user.user_isnear).length;
      setNearPercentage(((nearCount / users.length) * 100).toFixed(2));
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    filterUsers(e.target.value, genderFilter, degreeFilter);
  };

  const handleGenderChange = (e) => {
    setGenderFilter(e.target.value);
    filterUsers(searchTerm, e.target.value, degreeFilter);
  };

  const handleDegreeChange = (e) => {
    setDegreeFilter(e.target.value);
    filterUsers(searchTerm, genderFilter, e.target.value);
  };

  const filterUsers = (search, gender, degree) => {
    let filtered = users;

    if (search) {
      filtered = filtered.filter(user =>
        `${user.user_name} ${user.user_surname}`.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (gender) {
      filtered = filtered.filter(user => user.user_gender === gender);
    }

    if (degree) {
      filtered = filtered.filter(user => user.user_degree === degree);
    }

    setFilteredUsers(filtered);
  };

  const handleShowMore = () => {
    setOffset(prevOffset => prevOffset + 20);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 5, mb: 5 }}>
      <Card sx={{ backgroundColor: '#ff4d4d', p: 3, mb: 5, boxShadow: 3 }}>
        <Typography variant="h3" color="white" align="center" gutterBottom>
          Admin Dashboard
        </Typography>
      </Card>

      {/* Attendance Records Section */}
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
        {hasMore && (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 2 }}>
            {loading ? (
              <CircularProgress />
            ) : (
              <Button variant="contained" onClick={handleShowMore} sx={{ backgroundColor: '#ff3333', '&:hover': { backgroundColor: '#b32424' } }}>
                Show More
              </Button>
            )}
          </Box>
        )}
      </Card>

      {/* User Statistics Section */}
      <Typography variant="h6" sx={{ marginTop: 2, color: '#d82626' }}>
        User Statistics
      </Typography>
      <Card sx={{ borderColor: '#d82626', borderWidth: 2, borderStyle: 'solid', p: 3, mb: 5 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <Box sx={{ backgroundColor: '#ff6666', padding: 2, borderRadius: 1, minWidth: '200px' }}>
              <Typography variant="h6" sx={{ color: '#ffffff' }}>
                Total Users
              </Typography>
              <Typography variant="h4" sx={{ color: '#ffffff' }}>
                {users.length}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box sx={{ backgroundColor: '#ff6666', padding: 2, borderRadius: 1, minWidth: '200px' }}>
              <Typography variant="h6" sx={{ color: '#ffffff' }}>
                Average Age
              </Typography>
              <Typography variant="h4" sx={{ color: '#ffffff' }}>
                {averageAge} years
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box sx={{ backgroundColor: '#ff6666', padding: 2, borderRadius: 1, minWidth: '200px' }}>
              <Typography variant="h6" sx={{ color: '#ffffff' }}>
                Gender Distribution
              </Typography>
              <Typography variant="body1" sx={{ color: '#ffffff' }}>
                Male: {genderDistribution.male} ({((genderDistribution.male / users.length) * 100).toFixed(2)}%)
              </Typography>
              <Typography variant="body1" sx={{ color: '#ffffff' }}>
                Female: {genderDistribution.female} ({((genderDistribution.female / users.length) * 100).toFixed(2)}%)
              </Typography>
              <Typography variant="body1" sx={{ color: '#ffffff' }}>
                Non-binary: {genderDistribution.non_binary} ({((genderDistribution.non_binary / users.length) * 100).toFixed(2)}%)
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Card>

      {/* User Search and Filter Section */}
      <Typography variant="h6" sx={{ marginTop: 2, color: '#d82626' }}>
        User Search and Filters
      </Typography>
      <Card sx={{ borderColor: '#d82626', borderWidth: 2, borderStyle: 'solid', p: 3, mb: 5 }}>
        <Box sx={{ mb: 3 }}>
          <TextField
            label="Search by Name"
            variant="outlined"
            fullWidth
            value={searchTerm}
            onChange={handleSearch}
          />
        </Box>
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <FormControl fullWidth>
            <InputLabel>Gender</InputLabel>
            <Select
              value={genderFilter}
              onChange={handleGenderChange}
              label="Gender"
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="Male">Male</MenuItem>
              <MenuItem value="Female">Female</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>Degree</InputLabel>
            <Select
              value={degreeFilter}
              onChange={handleDegreeChange}
              label="Degree"
            >
              <MenuItem value="">All</MenuItem>
              {[...new Set(users.map(user => user.user_degree))].map(degree => (
                <MenuItem key={degree} value={degree}>{degree}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Paper sx={{ maxHeight: 200, overflow: 'auto' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Degree</TableCell>
                <TableCell>Proximity</TableCell>
                <TableCell>Age</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.map(user => (
                <TableRow key={user.user_id}>
                  <TableCell>{user.user_name} {user.user_surname}</TableCell>
                  <TableCell>{user.user_email}</TableCell>
                  <TableCell>{user.user_degree}</TableCell>
                  <TableCell>{user.user_isnear ? 'Near' : 'Far'}</TableCell>
                  <TableCell>{user.user_age} years</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </Card>
    </Container>
  );
};

export default Dashboard;
