import React from "react";
import { Typography, Box } from "@mui/material";

const Home = () => {
  return (
    <Box sx={{ textAlign: "center", mt: 4 }}>
      <Typography variant="h3" gutterBottom>
        Welcome to
      </Typography>
      <Typography variant="h3" gutterBottom>
        Smart Attendance System
      </Typography>
      <Typography variant="body1" paragraph>
        This system allows you to manage student attendance using facial recognition.
      </Typography>
      <Typography variant="body1" paragraph>
        Use the navigation bar to access different features.
      </Typography>
    </Box>
  );
};

export default Home;