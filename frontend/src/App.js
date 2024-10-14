import React from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./components/navbar";
import Home from './components/home';
import Login from './components/login';
import Register from './components/register';
import Dashboard from './components/dashboard';
import LabList from './components/labsList';
import AttendanceRegister from './components/attendanceRegister';
import PrivateRoute from './util/PrivateRoute';
import { AuthProvider } from './util/authContext';
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
            <Route path="/labs" element={<PrivateRoute><LabList /></PrivateRoute>} />
            <Route path="/attendance/register" element={<PrivateRoute><AttendanceRegister /></PrivateRoute>} />
          </Routes>
        </Container>
      </AuthProvider>
    </BrowserRouter>
  );
}