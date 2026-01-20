import React from "react";
import { Link } from "react-router-dom";
import { AppBar, Toolbar, Button } from "@mui/material";

const Navbar = ({ isAdminLoggedIn }) => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Button color="inherit" component={Link} to="/">
          Home
        </Button>
        {isAdminLoggedIn && (
          <>
            <Button color="inherit" component={Link} to="/register">
              Register Student
            </Button>
            <Button color="inherit" component={Link} to="/attendance">
              Start Attendance
            </Button>
          </>
        )}
        <Button color="inherit" component={Link} to="/view-attendance">
          View Attendance
        </Button>
        <Button color="inherit" component={Link} to="/admin">
          {isAdminLoggedIn ? "Admin Dashboard" : "Admin Login"}
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;