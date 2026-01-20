import React, { useState, useRef } from "react";
import { TextField, Button, Box, Typography } from "@mui/material";
import Webcam from "react-webcam";

const RegisterStudent = () => {
  const [name, setName] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [photos, setPhotos] = useState([]);
  const webcamRef = useRef(null);

  const capturePhoto = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setPhotos([...photos, imageSrc]);
  };

  const handleRegister = async () => {
    if (!name || !rollNumber || photos.length < 5) {
      alert("Name, Roll Number, and at least 5 photos are required");
      return;
    }

    try {
      // Send the registration data to the backend
      const response = await fetch("http://127.0.0.1:5000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, roll_number: rollNumber, photos }),
      });

      if (response.ok) {
        alert("Student registered successfully!");
        setName("");
        setRollNumber("");
        setPhotos([]);
      } else {
        const errorData = await response.json();
        alert(errorData.error || "Registration failed.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while registering the student.");
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: "auto", mt: 4, p: 2 }}>
      <Typography variant="h5" gutterBottom>
        Register New Student
      </Typography>
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
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        width="100%"
      />
      <Button variant="contained" onClick={capturePhoto} sx={{ mt: 2 }}>
        Capture Photo
      </Button>
      <Button variant="contained" onClick={handleRegister} sx={{ mt: 2 }}>
        Register
      </Button>
      <Box sx={{ mt: 2 }}>
        {photos.map((photo, index) => (
          <img
            key={index}
            src={photo}
            alt={`Photo ${index + 1}`}
            style={{ width: "100px", margin: "5px" }}
          />
        ))}
      </Box>
    </Box>
  );
};

export default RegisterStudent;