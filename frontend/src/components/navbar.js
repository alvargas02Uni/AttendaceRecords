import React from 'react';
import { AppBar, Box, Button, Toolbar, Typography, Container } from "@mui/material";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../middleware/authContext";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { admin, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const navLinks = [
    { path: "/news", label: "Show News" },
    { path: "/news/create", label: "Create News" },
    { path: "/department", label: "Department" },
    { path: "/department/edit", label: "Edit Department" },
    { path: "/labs", label: "Labs" },
    { path: "/dashboard", label: "Dashboard" },
  ];

  return (
    <AppBar position="static" sx={{ background: '#a00000', margin: 0, padding: 0, width: '100%' }}>
      <Container maxWidth="xl"> {/* Contenedor para asegurar márgenes adecuados */}
        <Toolbar sx={{ justifyContent: "space-between", alignItems: "center", width: "100%" }}>
          <Typography variant="h6" noWrap>
            <Link to="/" style={{ textDecoration: "none", color: "white" }}>
              ABR App for admins
            </Link>
          </Typography>
          {admin ? (
            <Button
              variant="contained"
              onClick={handleLogout}
              sx={{
                backgroundColor: "#ff3333",
                "&:hover": { backgroundColor: "#e60000" },
                marginLeft: 'auto', // Asegura que el botón de Logout esté alineado a la derecha
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
      {admin && location.pathname !== "/" && (
        <Box sx={{ backgroundColor: "#a00000", display: "flex", justifyContent: "center", alignItems: "center", width: "100%" }}>
          {navLinks.map((link, index) => (
            <Box
              key={index}
              sx={{
                px: 3,
                py: 1,
                "&:hover": {
                  backgroundColor: "#cc4c4c", // Slightly darker red for hover
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
          {admin.is_superadmin && (
            <Box
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
                to="/register"
                sx={{
                  textDecoration: "none",
                  color: "white",
                  display: "block",
                  textAlign: "center",
                }}
              >
                Register
              </Typography>
            </Box>
          )}
        </Box>
      )}
    </AppBar>
  );
}