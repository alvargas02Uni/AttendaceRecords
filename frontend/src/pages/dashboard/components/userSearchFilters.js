import React, { useState} from 'react';
import { Box, TextField, FormControl, InputLabel, Select, MenuItem, Paper, Table, TableHead, TableRow, TableCell, TableBody, Card, Typography } from '@mui/material';

const UserSearchFilters = ({ users, filteredUsers, setFilteredUsers }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [genderFilter, setGenderFilter] = useState('');
  const [degreeFilter, setDegreeFilter] = useState('');

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
    if (search) filtered = filtered.filter(user => `${user.user_name} ${user.user_surname}`.toLowerCase().includes(search.toLowerCase()));
    if (gender) filtered = filtered.filter(user => user.user_gender === gender);
    if (degree) filtered = filtered.filter(user => user.user_degree === degree);
    setFilteredUsers(filtered);
  };

  return (
    <>
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
    </>
  );
};

export default UserSearchFilters;
