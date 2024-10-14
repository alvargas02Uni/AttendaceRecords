import React from 'react';

import { BrowserRouter, Route, Routes } from "react-router-dom";
import NewsList from "./components/newsList"; 
import NewsForm from "./components/newsForm"; 
import NewsDetail from "./components/newsDetail"; 
import Navbar from "./components/navbar"; 
import Department from "./components/department";
import DepartmentEdit from "./components/departmentEdit"; 
import LabList from "./components/labLists";
import LabDetail from "./components/labDetail";
import EditLab from "./components/labEdit"; 
import Login from './components/login';
import Register from './components/register';
import Dashboard from './components/dashboard';
import PrivateRoute from './middleware/PrivateRoute';
import { AuthProvider } from './middleware/authContext';
import { Container } from "@mui/material";
import Home from './components/home';

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
            <Route path="/news" element={<PrivateRoute><NewsList /></PrivateRoute>} />
            <Route path="/news/create" element={<PrivateRoute><NewsForm /></PrivateRoute>} />
            <Route path="/news/:id" element={<PrivateRoute><NewsDetail /></PrivateRoute>} /> 
            <Route path="/news/:id/edit" element={<PrivateRoute><NewsForm /></PrivateRoute>} />
            <Route path="/department" element={<PrivateRoute><Department /></PrivateRoute>} />
            <Route path="/department/edit" element={<PrivateRoute><DepartmentEdit /></PrivateRoute>} />
            <Route path="/labs" element={<PrivateRoute><LabList /></PrivateRoute>} />
            <Route path="/labs/create" element={<PrivateRoute><EditLab /></PrivateRoute>} />
            <Route path="/labs/:labId" element={<PrivateRoute><LabDetail /></PrivateRoute>} />
            <Route path="/labs/:labId/edit" element={<PrivateRoute><EditLab /></PrivateRoute>} /> 
          </Routes>
        </Container>
      </AuthProvider>
    </BrowserRouter>
  );
}