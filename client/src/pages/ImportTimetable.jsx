import React, { useState } from "react";
import {
  Button,
  Typography,
  Container,
  Box,
  Alert,
  Card,
  CircularProgress,
  Paper,
  Grid,
  Code,
} from "@mui/material";
import NavbarAuth from "../components/NavbarAuth";
import { Link } from "react-router-dom";
import { useTimetable } from "../utils/TimetableContext";
import { UnAuthRedirect } from "../utils/UnAuthRedirect";
import { apiCall } from "../utils/ApiCall";
import Footer from "../components/Footer";

export default function ImportTimetable() {
  UnAuthRedirect();

  const [selectedFile, setSelectedFile] = useState(null);
  const {
    timetable,
    setTimetable,
    setGoodnessScore,
    setGoodnessBreakdown,
    setInvalidSession,
    fetchAndSetTimetable,

  } = useTimetable();
  const [importSuccess, setImportSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setImportSuccess(false);
    setErrorMessage("");
  };

  const handleImportClick = async () => {
    if (!selectedFile) {
      setErrorMessage("No file selected. Please choose a file to import.");
      return;
    }

    setLoading(true);
    setErrorMessage("");
    setImportSuccess(false);

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const fileContent = JSON.parse(e.target.result);

        if (
          !fileContent ||
          (Array.isArray(fileContent) && fileContent.length === 0)
        ) {
          throw new Error("The file is empty or not in the correct format.");
        }

        const { statusCode, data } = await apiCall(
          "POST",
          {},
          fileContent,
          `session_import`
        );

        if (statusCode === 207) {
          if (data.invalid_sessions.length === fileContent[0].length) {
            setErrorMessage(
              "All sessions failed to import. Please check your file."
            );
          } else {
            setErrorMessage(
              "Some sessions failed to import. Check if your file is outdated or you can handle invalid sessions on Manage page."
            );
            setInvalidSession(data.invalid_sessions);
            await fetchAndSetTimetable();
          }
        } else if (statusCode === 200) {
          setErrorMessage("");
          setInvalidSession([]);
          setImportSuccess(true);
        } else {
          setErrorMessage(
            `Timetable import failed with status code ${statusCode}.`
          );
        }
      } catch (error) {
        if (error instanceof SyntaxError) {
          setErrorMessage(
            "File processing error: Please ensure the file is in correct JSON format."
          );
        } else {
          setErrorMessage(
            "The file is not in the correct format. Please check your JSON file."
          );
        }
      } finally {
        setLoading(false);
      }
    };
    reader.readAsText(selectedFile);
  };

  // Example JSON structure to display
  const jsonExample = `{
  "sessions": [
    {
      "day_of_week": "Monday",
      "start_time": "08:00",
      "end_time": "10:00",
      "session_type": "Tutorial",
      "venue": "Conference Room 1",
      "unit_code": "CS101",
      "staff_name": "No staff assigned",
      "session_name": "Introduction to Programming",
      "week_number": 1,
      "equipment_required": ["Projector", "Whiteboard"],
      "session_description": "An introductory tutorial on basic programming concepts."
    },
    {
      "day_of_week": "Tuesday",
      "start_time": "09:00",
      "end_time": "11:00",
      "session_type": "Lecture",
      "venue": "Lecture Hall A",
      "unit_code": "CS102",
      "staff_name": "Dr. Jane Smith",
      "session_name": "Data Structures",
      "week_number": 2,
      "equipment_required": ["Microphone", "Projector"],
      "session_description": "Lecture on data structures and algorithms."
    }
  ]
}`;

  return (
    <div>
      <NavbarAuth />
      <Container component="main" maxWidth="md" sx={{ mb: 30 }}>
        <Card sx={{ mt: 10, p: 4, textAlign: "center", boxShadow: 3 }}>
          <Typography component="h1" variant="h4" gutterBottom>
            Import Existing Timetable
          </Typography>
          <Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>
            Upload your existing timetable in JSON format to review or modify
            it. Ensure that your file follows the required structure as shown
            below.
          </Typography>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <input
              type="file"
              accept=".json"
              style={{ display: "none" }}
              id="file-input"
              onChange={handleFileChange}
            />
            <label htmlFor="file-input">
              <Button
                variant="contained"
                component="span"
                sx={{
                  backgroundColor: "#FFA726",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "#FB8C00",
                  },
                  mb: 2,
                }}
              >
                Choose File
              </Button>
            </label>

            {selectedFile && (
              <Typography variant="body1" sx={{ mt: 1, fontStyle: "italic" }}>
                Selected File: {selectedFile.name}
              </Typography>
            )}

            <Button
              onClick={handleImportClick}
              variant="contained"
              sx={{
                mt: 3,
                backgroundColor: "#1E88E5",
                color: "white",
                "&:hover": {
                  backgroundColor: "#1565C0",
                },
                width: "100%",
                maxWidth: 300,
                py: 1.5,
              }}
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Import Timetable"
              )}
            </Button>

            {errorMessage && (
              <Alert severity="error" sx={{ mt: 3 }}>
                {errorMessage}
              </Alert>
            )}

            {importSuccess && (
              <Alert severity="success" sx={{ mt: 3 }}>
                Timetable imported successfully!
              </Alert>
            )}

            {timetable && (
              <Box sx={{ mt: 4 }}>
                <Typography variant="h6" gutterBottom>
                  View Your Timetable
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    gap: 2,
                    flexWrap: "wrap",
                  }}
                >
                  <Button
                    component={Link}
                    to="/schedule-by-day"
                    variant="contained"
                    sx={{ mb: 2 }}
                  >
                    View Schedule by Day
                  </Button>
                  <Button
                    component={Link}
                    to="/schedule-by-venue"
                    variant="contained"
                    sx={{ mb: 2 }}
                  >
                    View Schedule by Venue
                  </Button>
                  <Button
                    component={Link}
                    to="/pipeline"
                    variant="contained"
                    sx={{ mb: 2 }}
                  >
                    View Pipeline
                  </Button>
                </Box>
              </Box>
            )}
          </Box>

          {/* JSON Example Section */}
          <Box sx={{ mt: 5, textAlign: "left" }}>
            <Typography variant="h5" gutterBottom>
              Required JSON Structure Example
            </Typography>
            <Paper sx={{ p: 2, backgroundColor: "#f5f5f5", overflow: "auto" }}>
              <pre>{jsonExample}</pre>
            </Paper>
          </Box>
        </Card>
      </Container>
      <Footer />
    </div>
  );
}
