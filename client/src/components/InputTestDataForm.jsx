import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Alert,
  Box,
} from "@mui/material";
import { apiCall } from "../utils/ApiCall"; // Importing the apiCall utility
import { useNavigate } from "react-router-dom";

const InputTestDataForm = () => {
  const [formData, setFormData] = useState({
    number_of_cohorts: "",
    number_of_faculties: "",
    number_of_disciplines: "",
    number_of_staffs: "",
    number_of_venues: "",
    number_of_units: "",
    number_of_unit_sessions: "",
    number_of_sets: "",
  });

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();
  // Set headers for API call
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError(""); // Reset error on input change
  };

  const validateInput = () => {
    const restrictions = {
      number_of_cohorts: [1, 20],
      number_of_faculties: [1, 20],
      number_of_disciplines: [1, 20],
      number_of_staffs: [1, 100],
      number_of_venues: [1, 100],
      number_of_units: [1, 100],
      number_of_unit_sessions: [1, 1000],
      number_of_sets: [1, 100],
    };

    for (const field in restrictions) {
      const value = parseInt(formData[field], 10); // Convert input to integer
      const [min, max] = restrictions[field];

      if (isNaN(value) || value < min || value > max) {
        return `Value for ${field.replace(
          /_/g,
          " "
        )} must be between ${min} and ${max}.`;
      }
    }
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateInput();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      // Convert form data fields to integers before submitting to the API
      const numericFormData = {};
      for (const field in formData) {
        numericFormData[field] = parseInt(formData[field], 10); // Ensure integer conversion
      }

      // Call the API to insert stress data
      const response = await apiCall(
        "POST",
        headers,
        numericFormData, // Use numeric form data
        "insert-stress-data"
      );

      // Assuming the API response has 'statusCode' and 'data'
      const { statusCode, data } = response;

      if (statusCode === 200) {
        setSuccessMessage("Data inserted successfully.");
        setFormData({
          number_of_cohorts: "",
          number_of_faculties: "",
          number_of_disciplines: "",
          number_of_staffs: "",
          number_of_venues: "",
          number_of_units: "",
          number_of_unit_sessions: "",
          number_of_sets: "",
        });
        alert("Data inserted successfully.");
        navigate("/generate");
      } else {
        setError(data.message || "Failed to insert data.");
      }
    } catch (error) {
      setError("An error occurred while submitting the form.");
      console.error("Error during API call:", error);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Input Data Form
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}
      {successMessage && <Alert severity="success">{successMessage}</Alert>}
      <form onSubmit={handleSubmit}>
        {Object.keys(formData).map((field) => (
          <TextField
            key={field}
            label={field.replace(/_/g, " ").toUpperCase()}
            name={field}
            type="number"
            value={formData[field]}
            onChange={handleChange}
            required
            fullWidth
            margin="normal"
            inputProps={{ min: 1 }} // Set minimum value
          />
        ))}
        <Box textAlign="center" sx={{ mt: 2 }}>
          <Button variant="contained" color="primary" type="submit">
            Submit
          </Button>
        </Box>
      </form>
    </Container>
  );
};

export default InputTestDataForm;
