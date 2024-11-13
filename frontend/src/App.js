import React from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./common/navbar";
import Home from './pages/home/home';
import Login from './pages/login/login';
import Register from './pages/register';
import Dashboard from './pages/dashboard/dashboard';
import AttendanceRegister from './pages/attendanceRegister/attendanceRegister';
import PrivateRoute from './common/PrivateRoute';
import { AuthProvider } from './common/authContext';
import { Container } from "@mui/material";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <Container>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<PrivateRoute><Register /></PrivateRoute>} />
            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/attendance/register" element={<PrivateRoute><AttendanceRegister /></PrivateRoute>} />
          </Routes>
        </Container>
      </AuthProvider>
    </BrowserRouter>
  );
}