import React, { useState } from "react";
import {
  Typography,
  Box,
  TextField,
  Button,
} from "@mui/material";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

const ViewAttendance = () => {
  const [attendanceData, setAttendanceData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [name, setName] = useState("");
  const [rollNumber, setRollNumber] = useState("");

  const handleViewAttendance = async () => {
    if (!name || !rollNumber) {
      alert("Please provide both Name and Roll Number.");
      return;
    }

    setLoading(true);
    setError(null);
    setAttendanceData({});

    try {
      const response = await fetch(
        `http://127.0.0.1:5000/api/viewattendance?name=${encodeURIComponent(name)}&roll_number=${encodeURIComponent(rollNumber)}`
      );

      if (response.ok) {
        const data = await response.json();
        setAttendanceData(data.attendance);
      } else {
        const errorData = await response.json();
        setError(errorData.error || "No attendance records found.");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("An error occurred while fetching the attendance.");
    } finally {
      setLoading(false);
    }
  };

  const calculateAttendancePercentage = () => {
    const totalDays = Object.keys(attendanceData).length;
    if (totalDays === 0) return 0;

    const presentDays = Object.values(attendanceData).filter(
      (status) => status === "Present"
    ).length;

    return ((presentDays / totalDays) * 100).toFixed(2);
  };

  const formatBarGraphData = () => {
    const presentDays = Object.values(attendanceData).filter(
      (status) => status === "Present"
    ).length;
    const absentDays = Object.values(attendanceData).filter(
      (status) => status === "Absent"
    ).length;

    return [
      { name: "Present", days: presentDays },
      { name: "Absent", days: absentDays },
    ];
  };

  const attendancePercentage = parseFloat(calculateAttendancePercentage());

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", mt: 4, p: 2 }}>
      <Typography variant="h5" gutterBottom>
        View Attendance
      </Typography>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField
          fullWidth
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Roll Number"
          value={rollNumber}
          onChange={(e) => setRollNumber(e.target.value)}
          margin="normal"
        />
        <Button
          variant="contained"
          onClick={handleViewAttendance}
          sx={{ mt: 2 }}
        >
          View Attendance
        </Button>
      </Box>

      {error && (
        <Typography variant="body1" color="error" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}

      {Object.keys(attendanceData).length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Attendance Percentage: {attendancePercentage}%
          </Typography>

          {/* Warning for low attendance */}
          {attendancePercentage < 65 && (
            <Typography variant="body1" sx={{ color: "warning.main", mb: 2 }}>
              ⚠️ Warning: Your attendance is below 65%. Please be regular!
            </Typography>
          )}

          {/* Bar Graph */}
          <Typography variant="h6" gutterBottom>
            Attendance Bar Graph
          </Typography>
          <BarChart
            width={600}
            height={300}
            data={formatBarGraphData()}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="days" fill="#8884d8" name="Days" />
          </BarChart>
        </Box>
      )}
    </Box>
  );
};

export default ViewAttendance;
