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
  const [labFilter, setLabFilter] = useState('');
  const [isNearFilter, setIsNearFilter] = useState('');
  const [zipcode, setZipcode] = useState('');
  const [zipcodeError, setZipcodeError] = useState('');
  const [degrees, setDegrees] = useState([]);
  const [newDegree, setNewDegree] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [firstAttendanceDate, setFirstAttendanceDate] = useState(null);
  const [offset, setOffset] = useState(0);

  // Estadísticas
  const [averageAge, setAverageAge] = useState(0);
  const [genderDistribution, setGenderDistribution] = useState({ male: 0, female: 0, non_binary: 0 });
  const [nearPercentage, setNearPercentage] = useState(0);
  const [labFollowers, setLabFollowers] = useState({});

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const hours = Array.from({ length: 13 }, (_, i) => i + 8);

  useEffect(() => {
    const fetchData = async () => {
        await fetchUniversityInfo(); // Obtener el zipcode de la universidad primero
        await fetchUsers();           // Obtener la lista de usuarios
        await fetchLabs();            // Obtener la lista de laboratorios y calcular seguidores
        await fetchAttendances();     // Obtener los registros de asistencia
    };

    if (admin?.token) {
        fetchData();
    }
}, [admin?.token]); // Dependencia en el token para asegurar que se ejecute cuando esté disponible

  useEffect(() => {
    calculateStatistics();
  }, [users, labs]); // Dependencia en `users` y `labs` para recalcular estadísticas cuando estos cambien

  const fetchUniversityInfo = async () => {
    try {
      const response = await fetch('https://localhost:5000/university', {
        headers: {
          'Authorization': `Bearer ${admin?.token}`,
        },
      });
      const data = await response.json();
      setZipcode(data.zipcode);
      setDegrees(data.degrees);

      fetchUsers(data.zipcode);
    } catch (error) {
      console.error('Error fetching university info:', error);
      if (error.message === 'Failed to fetch university info') {
        logout();
      }
    }
  };

  const fetchUsers = async (universityZipcode) => {
    try {
        if (!admin?.token) return;

        // Realizamos la solicitud para obtener los usuarios
        const response = await fetch(`https://localhost:5000/user/users`, {
            headers: {
                'Authorization': `Bearer ${admin.token}`,
            },
        });
        if (!response.ok) throw new Error('Failed to fetch users');
        const usersData = await response.json();


        // Mapeamos usuarios para agregar la distancia y cualquier otra propiedad
        const updatedUsers = usersData.map(user => {
            const userZipcode = parseInt(user.user_zipcode);
            user.user_isnear = Math.abs(universityZipcode - userZipcode) <= 50;
            return user;
        });


        setUsers(updatedUsers);
        setFilteredUsers(updatedUsers);
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
      setAttendances(data);  // Asegúrate de que `data` tenga el formato correcto
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
          'Authorization': `Bearer ${admin?.token}`, // Asegúrate de que el token esté correcto
        },
      });
  
  
      if (!response.ok) {
        console.error('Failed to fetch labs:', response.statusText);
        throw new Error('Failed to fetch labs');
      }
  
      const labsData = await response.json();
  
      // Para cada laboratorio, obtenemos la cantidad de seguidores
      const labsWithFollowers = await Promise.all(labsData.map(async lab => {
  
        // Verificar que el lab_code es válido
        if (!lab.lab_code || isNaN(lab.lab_code)) {
          console.error(`Invalid lab code for lab: ${lab.lab_name}`);
          return { ...lab, followers_count: 0 };
        }
  
        try {
  
          const followersResponse = await fetch(`https://localhost:5000/labs/${lab.lab_code}/followers/count`, {
            headers: {
              'Authorization': `Bearer ${admin?.token}`, // Asegúrate de que el token esté correcto
            },
          });
  
  
          if (!followersResponse.ok) {
            console.error(`Failed to fetch followers for lab ${lab.lab_code}:`, followersResponse.status, followersResponse.statusText);
            throw new Error(`Failed to fetch followers for lab ${lab.lab_code}: ${followersResponse.status}`);
          }
  
          const followersData = await followersResponse.json();
  
          return { ...lab, followers_count: followersData.count };
  
        } catch (error) {
          console.error(`Error fetching followers for lab ${lab.lab_code}:`, error.message);
          return { ...lab, followers_count: 0 }; // En caso de error, devolvemos 0 seguidores
        }
      }));
  
      setLabs(labsWithFollowers);
  
    } catch (error) {
      console.error('Error fetching labs:', error.message);
      if (error.message === 'Failed to fetch labs') {
        logout();  // Desconectar si la solicitud falla
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

      const labCount = labs.reduce((acc, lab) => {
        acc[lab.lab_name] = lab.followers_count || 0;
        return acc;
      }, {});
      setLabFollowers(labCount);

    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    filterUsers(e.target.value, genderFilter, degreeFilter, labFilter, isNearFilter);
  };

  const handleGenderChange = (e) => {
    setGenderFilter(e.target.value);
    filterUsers(searchTerm, e.target.value, degreeFilter, labFilter, isNearFilter);
  };

  const handleDegreeChange = (e) => {
    setDegreeFilter(e.target.value);
    filterUsers(searchTerm, genderFilter, e.target.value, labFilter, isNearFilter);
  };

  const handleLabChange = (e) => {
    setLabFilter(e.target.value);
    filterUsers(searchTerm, genderFilter, degreeFilter, e.target.value, isNearFilter);
  };

  const handleIsNearChange = (e) => {
    setIsNearFilter(e.target.value);
    filterUsers(searchTerm, genderFilter, degreeFilter, labFilter, e.target.value);
  };

  const filterUsers = (search, gender, degree, lab, isNear) => {
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

    if (lab) {
      filtered = filtered.filter(user => user.lab_followers.includes(parseInt(lab)));
    }

    if (isNear) {
      const isNearBoolean = isNear === 'true';
      filtered = filtered.filter(user => user.user_isnear === isNearBoolean);
    }

    setFilteredUsers(filtered);
  };

  const handleShowMore = () => {
    setOffset(prevOffset => prevOffset + 20);
  };

  const handlePrevDay = () => {
    setCurrentDate(prev => new Date(prev.setDate(prev.getDate() - 1)));
  };

  const handleNextDay = () => {
    setCurrentDate(prev => new Date(prev.setDate(prev.getDate() + 1)));
  };

  const isSameDay = (date1, date2) => date1.toDateString() === date2.toDateString();

  const calculateOccupancyStyle = (start, end, hour) => {
    const startTime = new Date(start);
    const endTime = end ? new Date(end) : new Date();
    const minutesInHour = 60;
  
    if (startTime.getHours() === hour && endTime.getHours() === hour) {
      // La ocupación comienza y termina dentro de la misma hora
      const startMinutes = startTime.getMinutes();
      const endMinutes = endTime.getMinutes();
      const occupiedPercentage = ((endMinutes - startMinutes) / minutesInHour) * 100;
  
      return {
        left: `${(startMinutes / minutesInHour) * 100}%`,
        width: `${occupiedPercentage}%`,
        backgroundColor: '#ff9999',
        height: '100%',
        position: 'absolute'
      };
    } else if (startTime.getHours() === hour) {
      // La ocupación comienza en esta hora pero termina después
      const startMinutes = startTime.getMinutes();
      const occupiedPercentage = ((minutesInHour - startMinutes) / minutesInHour) * 100;
  
      return {
        left: `${(startMinutes / minutesInHour) * 100}%`,
        width: `${occupiedPercentage}%`,
        backgroundColor: '#ff9999',
        height: '100%',
        position: 'absolute'
      };
    } else if (endTime.getHours() === hour) {
      // La ocupación comenzó antes pero termina en esta hora
      const endMinutes = endTime.getMinutes();
      const occupiedPercentage = (endMinutes / minutesInHour) * 100;
  
      return {
        left: '0%',
        width: `${occupiedPercentage}%`,
        backgroundColor: '#ff9999',
        height: '100%',
        position: 'absolute'
      };
    } else if (startTime.getHours() < hour && endTime.getHours() > hour) {
      // La ocupación cubre toda esta hora
      return {
        left: '0%',
        width: '100%',
        backgroundColor: '#ff9999',
        height: '100%',
        position: 'absolute'
      };
    }
  
    return null;
  };  

  const handleZipcodeChange = (e) => {
    const danishZipCodes = /^(1000|1[0-4]\d{2}|1500|15[0-9]\d{2}|1600|1[6-9]\d{2}|2000|2[0-4]\d{2}|2500|2[5-9]\d{2}|3000|3[0-9]\d{2}|4000|4[0-9]\d{2}|5000|5[0-9]\d{2}|6000|6[0-9]\d{2}|7000|7[0-9]\d{2}|8000|8[0-9]\d{2}|9000|9[0-9]\d{2}|9990)$/;
    const value = e.target.value;
    setZipcode(value);
    if (!danishZipCodes.test(value)) {
      setZipcodeError('Invalid Danish Zipcode');
    } else {
      setZipcodeError('');
    }
    setZipcode(value);
  };

  const handleAddDegree = () => {
    if (newDegree && !degrees.includes(newDegree)) {
      setDegrees([...degrees, newDegree]);
      setNewDegree('');
    }
  };

  const handleRemoveDegree = (degree) => {
    setDegrees(degrees.filter(d => d !== degree));
  };

  const handleSaveUniversityInfo = async () => {
    try {
      await fetch('https://localhost:5000/university', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${admin?.token}`,
        },
        body: JSON.stringify({ zipcode, degrees }),
      });
    } catch (error) {
      console.error('Error updating university info:', error);
      if (error.message === 'Failed to update university info') {
        logout();
      }
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 5, mb: 5 }}>
    <Card sx={{ backgroundColor: '#ff4d4d', p: 3, mb: 5, boxShadow: 3 }}>
      <Typography variant="h3" color="white" align="center" gutterBottom>
        Admin Dashboard
      </Typography>
    </Card>

    {/* University Info Section */}
    <Typography variant="h6" sx={{ marginTop: 2, color: '#d82626' }}>
      University Information
    </Typography>
    <Card sx={{ borderColor: '#d82626', borderWidth: 2, borderStyle: 'solid', p: 3, mb: 5 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, marginRight: 1 }}>
        <TextField
          label="University Zipcode"
          variant="outlined"
          value={zipcode}
          onChange={handleZipcodeChange}
          error={!!zipcodeError}
          helperText={zipcodeError}
          sx={{ width: '150px' }}
        />
        <FormControl fullWidth sx={{ ml: 2 }}>  {/* Aquí se añadió ml: 2 para añadir margen a la izquierda */}
          <TextField
            label="Add Degree"
            value={newDegree}
            onChange={(e) => setNewDegree(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleAddDegree();
                e.preventDefault();
              }
            }}
          />
        </FormControl>
        <Button
          onClick={handleAddDegree}
          variant="contained"
          sx={{
            backgroundColor: '#d82626',
            '&:hover': { backgroundColor: '#b32424' },
            ml: 2,
          }}
        >
          Add
        </Button>
      </Box>
      <Box sx={{ maxHeight: 150, overflow: 'auto', mb: 3 }}>
        <Typography variant="h6" sx={{ color: '#d82626', mb: 1 }}>
          Current Degrees:
        </Typography>
        {degrees.map(degree => (
          <Box key={degree} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1 }}>
            <Typography>{degree}</Typography>
            <Button color="error" onClick={() => handleRemoveDegree(degree)}>Remove</Button>
          </Box>
        ))}
      </Box>
      <Button variant="contained" onClick={handleSaveUniversityInfo} sx={{ backgroundColor: '#d82626', '&:hover': { backgroundColor: '#b32424' } }}>
        Save University Info
      </Button>
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
                <TableRow key={attendance.id} sx={{ '&:nth-of-type(even)': { backgroundColor: '#ffe6e6' } }}>
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

      {/* Lab Occupancy Section */}
    <Typography variant="h6" sx={{ marginTop: 2, backgroundColor: '#d82626', padding: 1, color: '#ffffff' }}>
      Lab Occupancy Calendar for {currentDate.toDateString()}
    </Typography>
    <Card sx={{ backgroundColor: '#ff4d4d', p: 3, mb: 5, boxShadow: 3, marginTop: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <IconButton
          onClick={handlePrevDay}
          disabled={firstAttendanceDate && isSameDay(currentDate, firstAttendanceDate)}
          sx={{ color: 'white' }}
        >
          <ArrowBack />
        </IconButton>
        <IconButton
          onClick={handleNextDay}
          disabled={isSameDay(currentDate, today)}
          sx={{ color: 'white' }}
        >
          <ArrowForward />
        </IconButton>
      </Box>
      <Paper>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#d82626' }}>
              <TableCell sx={{ color: 'white', border: '1px solid #d82626' }}>Lab Name</TableCell>
              {hours.map(hour => (
                <TableCell key={hour} align="center" sx={{ color: 'white', border: '1px solid #d82626' }}>
                  {hour}:00
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {labs.map(lab => (
              <TableRow key={lab.lab_code}>
                <TableCell sx={{ border: '1px solid #d82626' }}>{lab.lab_name}</TableCell>
                {hours.map(hour => {
                  const attendance = attendances.find(att => {
                    const attStart = new Date(att.att_time);
                    const attEnd = att.att_end_time ? new Date(att.att_end_time) : new Date();
                    return (
                      isSameDay(attStart, currentDate) &&
                      att.lab_code === lab.lab_code &&
                      attStart.getHours() <= hour &&
                      (attEnd.getHours() >= hour || !att.att_end_time)
                    );
                  });

                  const style = attendance
                    ? calculateOccupancyStyle(attendance.att_time, attendance.att_end_time, hour)
                    : {};

                  return (
                    <TableCell
                      key={hour}
                      align="center"
                      sx={{ position: 'relative', height: '40px', padding: 0, border: '1px solid #d82626' }}
                    >
                      <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
                        {style && (
                          <Box sx={style}></Box>
                        )}
                      </Box>
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>

        </Table>
      </Paper>
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
          <Grid item xs={12} sm={4}>
            <Box sx={{ backgroundColor: '#ff6666', padding: 2, borderRadius: 1, minWidth: '200px' }}>
              <Typography variant="h6" sx={{ color: '#ffffff' }}>
                Near University
              </Typography>
              <Typography variant="h4" sx={{ color: '#ffffff' }}>
                {nearPercentage}%
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box sx={{ backgroundColor: '#ff6666', padding: 2, borderRadius: 1, minWidth: '200px' }}>
              <Typography variant="h6" sx={{ color: '#ffffff' }}>
                Far from University
              </Typography>
              <Typography variant="h4" sx={{ color: '#ffffff' }}>
                {(100 - nearPercentage).toFixed(2)}%
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" sx={{ color: '#d82626', mb: 2 }}>
          Lab Followers
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          {Object.entries(labFollowers).map(([lab, count]) => (
            <Box key={lab} sx={{ backgroundColor: '#ff9999', padding: 2, borderRadius: 1, minWidth: '150px' }}>
              <Typography variant="h6" sx={{ color: '#ffffff' }}>
                {lab}
              </Typography>
              <Typography variant="h4" sx={{ color: '#ffffff' }}>
                {count}
              </Typography>
            </Box>
          ))}
        </Box>
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
              {degrees.map(degree => (
                <MenuItem key={degree} value={degree}>{degree}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>Lab</InputLabel>
            <Select
              value={labFilter}
              onChange={handleLabChange}
              label="Lab"
            >
              <MenuItem value="">All</MenuItem>
              {labs.map(lab => (
                <MenuItem key={lab.lab_code} value={lab.lab_code}>{lab.lab_name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>Proximity</InputLabel>
            <Select
              value={isNearFilter}
              onChange={handleIsNearChange}
              label="Proximity"
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="true">Near</MenuItem>
              <MenuItem value="false">Far</MenuItem>
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
                <TableCell>Lab Follows</TableCell>
                <TableCell>Proximity</TableCell>
                <TableCell>Age</TableCell> {/* Mostrar la edad calculada */}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.map(user => (
                <TableRow key={user.user_code}>
                  <TableCell>{user.user_name} {user.user_surname}</TableCell>
                  <TableCell>{user.user_email}</TableCell>
                  <TableCell>{user.user_degree}</TableCell>
                  <TableCell>{Array.isArray(user.lab_followers) ? user.lab_followers.join(', ') : 'No followers'}</TableCell>
                  <TableCell>{user.user_isnear ? 'Near' : 'Far'}</TableCell>
                  <TableCell>{user.user_age} years</TableCell> {/* Calcular y mostrar la edad */}
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