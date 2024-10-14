import React from 'react';
import { AppBar, Box, Button, Toolbar, Typography, Container } from "@mui/material";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../middleware/authContext";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, admin, logout } = useAuth(); // Acceder a `user` y `admin` desde el contexto de autenticación

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const adminNavLinks = [
    { path: "/admin-dashboard", label: "Dashboard" },
    { path: "/labs/manage", label: "Manage Labs" }
  ];

  const studentNavLinks = [
    { path: "/labs", label: "View Labs" },
    { path: "/attendance/register", label: "Register Attendance" }
  ];

  return (
    <AppBar position="static" sx={{ background: '#a00000', margin: 0, padding: 0, width: '100%' }}>
      <Container maxWidth="xl">
        <Toolbar sx={{ justifyContent: "space-between", alignItems: "center", width: "100%" }}>
          <Typography variant="h6" noWrap>
            <Link to="/" style={{ textDecoration: "none", color: "white" }}>
              Attendance App
            </Link>
          </Typography>
          {(user || admin) ? (
            <Button
              variant="contained"
              onClick={handleLogout}
              sx={{
                backgroundColor: "#ff3333",
                "&:hover": { backgroundColor: "#e60000" },
                marginLeft: 'auto',
              }}
            >
              Logout
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={() => navigate("/login")}
              sx={{
                backgroundColor: "#ff3333",
                "&:hover": { backgroundColor: "#e60000" },
                marginLeft: 'auto',
              }}
            >
              Login
            </Button>
          )}
        </Toolbar>
      </Container>

      {(admin || user) && location.pathname !== "/" && (
        <Box sx={{ backgroundColor: "#a00000", display: "flex", justifyContent: "center", alignItems: "center", width: "100%" }}>
          {(admin ? adminNavLinks : studentNavLinks).map((link, index) => (
            <Box
              key={index}
              sx={{
                px: 3,
                py: 1,
                "&:hover": {
                  backgroundColor: "#cc4c4c",
                },
              }}
            >
              <Typography
                component={Link}
                to={link.path}
                sx={{
                  textDecoration: "none",
                  color: "white",
                  display: "block",
                  textAlign: "center",
                }}
              >
                {link.label}
              </Typography>
            </Box>
          ))}
        </Box>
      )}
    </AppBar>
  );
}
