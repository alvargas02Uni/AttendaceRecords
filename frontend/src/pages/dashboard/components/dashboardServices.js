import axios from 'axios';

const BASE_URL = process.env.REACT_APP_BACKEND_URL;

export const fetchUsers = async (admin, setUsers, setFilteredUsers, logout) => {
  try {
    const response = await axios.get(`${BASE_URL}/user/users`, {
      headers: { Authorization: `Bearer ${admin?.token}` },
    });
    setUsers(response.data);
    setFilteredUsers(response.data);
  } catch (error) {
    console.error('Error fetching users:', error.message);
    if (error.response && error.response.status === 401) logout();
  }
};

export const fetchAttendances = async (admin, setAttendances, setLoading, logout) => {
  setLoading(true);
  try {
    const response = await axios.get(`${BASE_URL}/attendance`, {
      headers: { Authorization: `Bearer ${admin?.token}` },
    });
    setAttendances(response.data);
  } catch (error) {
    console.error('Error fetching attendances:', error.message);
    if (error.response && error.response.status === 401) logout();
  } finally {
    setLoading(false);
  }
};

export const calculateStatistics = (users, setStatistics) => {
  if (users.length === 0) return;

  const totalAge = users.reduce((sum, user) => sum + (user.user_age || 0), 0);
  const averageAge = totalAge / users.length;

  const genderDistribution = users.reduce((acc, user) => {
    acc[user.user_gender] = (acc[user.user_gender] || 0) + 1;
    return acc;
  }, { male: 0, female: 0, non_binary: 0 });

  const nearPercentage = (
    (users.filter((user) => user.user_isnear).length / users.length) *
    100
  ).toFixed(2);

  setStatistics({
    averageAge: averageAge.toFixed(2),
    genderDistribution,
    nearPercentage,
  });
};
