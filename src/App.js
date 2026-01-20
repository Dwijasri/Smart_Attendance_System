import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Admin from "./pages/Admin";
import AdminLogin from "./components/AdminLogin";
import RegisterStudent from "./components/RegisterStudent";
import AttendanceCamera from "./components/AttendanceCamera";
import ViewAttendance from "./components/ViewAttendance";

const App = () => {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  const handleLogout = () => {
    setIsAdminLoggedIn(false); // Reset the admin login state
  };

  return (
    <Router>
      <Navbar isAdminLoggedIn={isAdminLoggedIn} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/admin"
          element={
            isAdminLoggedIn ? (
              <Admin onLogout={handleLogout} />
            ) : (
              <AdminLogin onLogin={() => setIsAdminLoggedIn(true)} />
            )
          }
        />
        {isAdminLoggedIn && (
          <>
            <Route path="/register" element={<RegisterStudent />} />
            <Route path="/attendance" element={<AttendanceCamera />} />
          </>
        )}
        <Route path="/view-attendance" element={<ViewAttendance />} />
      </Routes>
    </Router>
  );
};

export default App;