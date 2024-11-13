import React from 'react';
import { Container } from '@mui/material';
import { useAuth } from '../../common/authContext';
import AdminDashboard from './components/adminDashboard';
import UserDashboard from './components/userDashboard';
import WelcomeMessage from './components/welcomeMessage';

const Home = () => {
  const { user, admin } = useAuth();

  return (
    <Container maxWidth="lg" sx={{ mt: 5 }}>
      {admin ? (
        <AdminDashboard admin={admin} />
      ) : user ? (
        <UserDashboard user={user} />
      ) : (
        <WelcomeMessage />
      )}
    </Container>
  );
};

export default Home;