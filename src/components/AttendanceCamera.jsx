import React, { useState, useRef, useEffect } from "react";
import { Button, Box, Typography } from "@mui/material";
import Webcam from "react-webcam";

const AttendanceCamera = () => {
  const [status, setStatus] = useState("Waiting to start attendance...");
  const [isRunning, setIsRunning] = useState(false);
  const webcamRef = useRef(null);

  // Function to mark attendance
  const markAttendance = async () => {
    try {
      const photo = webcamRef.current.getScreenshot();

      const response = await fetch("http://127.0.0.1:5000/api/markattendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ photo }),
      });

      if (response.ok) {
        setStatus("Attendance marked successfully."); // Generic success message
      } else {
        setStatus("Failed to mark attendance."); // Generic failure message
      }
    } catch (error) {
      console.error("Error:", error);
      setStatus("An error occurred while marking attendance.");
    }
  };

  // Start attendance process
  const handleStartAttendance = () => {
    setStatus("Starting attendance...");
    setIsRunning(true);
  };

  // Stop attendance process
  const handleStopAttendance = () => {
    setStatus("Attendance stopped.");
    setIsRunning(false);
  };

  // Mark attendance at intervals when running
  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        markAttendance();
      }, 2000); // Every 2 seconds
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", mt: 4, p: 2 }}>
      <Typography variant="h5" gutterBottom>
        Attendance System
      </Typography>
      <Typography variant="body1" gutterBottom>
        {status}
      </Typography>
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        width="100%"
      />
      {!isRunning ? (
        <Button variant="contained" onClick={handleStartAttendance} sx={{ mt: 2 }}>
          Start Attendance
        </Button>
      ) : (
        <Button variant="contained" color="error" onClick={handleStopAttendance} sx={{ mt: 2 }}>
          Stop Attendance
        </Button>
      )}
    </Box>
  );
};

export default AttendanceCamera;
