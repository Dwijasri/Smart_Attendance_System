import React from "react";
import { Typography, Box, Button, Grid } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

const Admin = ({ onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout(); // Call the onLogout prop to update the state in App.js
    navigate("/"); // Redirect to the home page
  };

  return (
    <Box sx={{ textAlign: "center", mt: 4 }}>
      <Typography variant="h3" gutterBottom>
        Admin Dashboard
      </Typography>
      <Typography variant="body1" paragraph>
        Manage the attendance system from here.
      </Typography>

      <Grid container spacing={2} justifyContent="center" sx={{ mt: 4 }}>
        <Grid item>
          <Button
            variant="contained"
            color="primary"
            component={Link}
            to="/register"
          >
            Register New Student
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            color="secondary"
            component={Link}
            to="/attendance"
          >
            Start Attendance
          </Button>
        </Grid>
      </Grid>

      <Button
        variant="contained"
        color="error"
        onClick={handleLogout}
        sx={{ mt: 4 }}
      >
        Logout
      </Button>
    </Box>
  );
};

export default Admin;