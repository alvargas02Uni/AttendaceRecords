import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './authContext';

const PrivateRoute = ({ children }) => {
  const { admin, user } = useAuth();

  if (!admin && !user) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default PrivateRoute;