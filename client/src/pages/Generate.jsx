import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  Typography,
  Container,
  Box,
  Stepper,
  Step,
  StepLabel,
  Grid,
  ToggleButton,
  ToggleButtonGroup,
  CircularProgress,
  TextField,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Divider,
} from "@mui/material";
import NavbarAuth from "../components/NavbarAuth";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import { UploadFile, Build } from "@mui/icons-material";
import { useTimetable } from "../utils/TimetableContext";
import { apiCall } from "../utils/ApiCall";
import { UnAuthRedirect } from "../utils/UnAuthRedirect";

// Steps for the stepper
const steps = [
  "Prepare Data",
  "Timetable Configuration",
  "Generating Timetable",
  "Review Results",
];

export default function Generate() {
  UnAuthRedirect();

  const [activeStep, setActiveStep] = useState(0);
  const [view, setView] = useState("upload"); // Toggle state to switch between views
  const [venueOptimizationWeight, setVenueOptimizationWeight] = useState(0.4);
  const [unitConflictWeight, setUnitConflictWeight] = useState(0.6);
  const [algorithm, setAlgorithm] = useState("Brute Force");
  const {
    timetable,
    setTimetable,
    setGoodnessScore,
    setGoodnessBreakdown,
    setInvalidSession,
  } = useTimetable();
  const didMountRef = useRef(false);
  const [isGenerating, setIsGenerating] = useState(true);
  const navigate = useNavigate();

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleToggleView = (event, newView) => {
    if (newView !== null) {
      setView(newView);
    }
  };

  const handleSubmitConfiguration = () => {
    handleNext(); // Move to timetable generation step
  };

  // Timetable generation and calculation logic from TimetableGenerated
  useEffect(() => {
    const generateTimetableAndCalculateGoodness = async () => {
      try {
        const generateResponse = await apiCall(
          "POST",
          {},
          {},
          algorithm === "Genetic Algorithm"
            ? "generate-with-ga"
            : "generate-brute-force"
        );

        if (generateResponse.statusCode === 200) {
          console.log("Timetable generated successfully");
          setInvalidSession([]);

          const { statusCode: goodnessSC, data } = await apiCall(
            "POST",
            {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            {
              venue_optimization_weight: venueOptimizationWeight,
              unit_conflict_weight: unitConflictWeight,
            },
            `calculate-goodness-score`
          );
          if (goodnessSC === 200) {
            setGoodnessScore(data.goodness_score || 0);
            setGoodnessBreakdown({
              unit_conflict_final_score: data.unit_conflict_final_score || 0,
              venue_optimization_final_score:
                data.venue_optimization_final_score || 0,
            });

            const fetchResponse = await apiCall(
              "GET",
              {},
              {},
              `fetch-timetable`
            );
            if (fetchResponse.statusCode === 200) {
              const fetchedTimetable = fetchResponse.data.timetable;
              console.log("Fetched Timetable:", fetchedTimetable);
              setTimetable(fetchedTimetable);
              setIsGenerating(false); // timetable is ready
              handleNext(); // Move to the final step
            } else {
              console.error("Failed to fetch timetable:", fetchResponse);
            }
          } else {
            console.error("Failed to calculate goodness score:", goodnessSC);
          }
        } else {
          console.error("Failed to generate timetable:", generateResponse);
        }
      } catch (error) {
        console.error("An error occurred during timetable generation:", error);
      }
    };

    if (activeStep === 2 && !didMountRef.current) {
      generateTimetableAndCalculateGoodness();
      didMountRef.current = true;
    }
  }, [
    activeStep,
    algorithm,
    venueOptimizationWeight,
    unitConflictWeight,
    setTimetable,
    setGoodnessScore,
    setGoodnessBreakdown,
  ]);

  const handleExport = () => {
    if (timetable) {
      const json = JSON.stringify(timetable, null, 2); // Formatting JSON for readability
      const blob = new Blob([json], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "timetable.json";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      alert("Downloading just started!");
    } else {
      alert("No timetable data available to export.");
    }
  };

  return (
    <div>
      <NavbarAuth />
      <Container component="main" maxWidth="lg" sx={{ mt: 10, mb: 30 }}>
        <Typography component="h1" variant="h3" align="center" sx={{ mb: 6 }}>
          Generate Your Timetable
        </Typography>

        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label, index) => (
            <Step key={index}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {activeStep === 0 && (
          <Box sx={{ mt: 6 }}>
            {/* Step 1: Prepare Data */}
            <Typography variant="h5" gutterBottom>
              Step 1: Prepare Data (Optional)
            </Typography>
            <Typography variant="body1" color="textSecondary" sx={{ mb: 4 }}>
              Upload your CSV files or input test data.
            </Typography>
            <ToggleButtonGroup
              value={view}
              exclusive
              onChange={handleToggleView}
              aria-label="view toggle"
              sx={{ mb: 4 }}
            >
              <ToggleButton value="upload" aria-label="upload CSVs">
                Upload CSVs
              </ToggleButton>
              <ToggleButton value="input" aria-label="input test data">
                Input Test Data
              </ToggleButton>
            </ToggleButtonGroup>

            {view === "upload" && (
              <Box sx={{ mb: 6 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Upload CSV Files
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6} md={4}>
                    <Button
                      variant="contained"
                      startIcon={<UploadFile />}
                      component={Link}
                      to="/venue-csv-upload"
                      sx={{
                        width: "100%",
                        padding: "15px",
                        backgroundColor: "#1E88E5",
                      }}
                    >
                      Upload Venue CSV
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Button
                      variant="contained"
                      startIcon={<UploadFile />}
                      component={Link}
                      to="/unit-csv-upload"
                      sx={{
                        width: "100%",
                        padding: "15px",
                        backgroundColor: "#1E88E5",
                      }}
                    >
                      Upload Unit CSV
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Button
                      variant="contained"
                      startIcon={<UploadFile />}
                      component={Link}
                      to="/cfs-csv-upload"
                      sx={{
                        width: "100%",
                        padding: "15px",
                        backgroundColor: "#1E88E5",
                      }}
                    >
                      Upload CFS CSV
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Button
                      variant="contained"
                      startIcon={<UploadFile />}
                      component={Link}
                      to="/faculties-csv-upload"
                      sx={{
                        width: "100%",
                        padding: "15px",
                        backgroundColor: "#1E88E5",
                      }}
                    >
                      Upload Faculty CSV
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Button
                      variant="contained"
                      startIcon={<UploadFile />}
                      component={Link}
                      to="/cohorts-csv-upload"
                      sx={{
                        width: "100%",
                        padding: "15px",
                        backgroundColor: "#1E88E5",
                      }}
                    >
                      Upload Cohort CSV
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Button
                      variant="contained"
                      startIcon={<UploadFile />}
                      component={Link}
                      to="/staff-csv-upload"
                      sx={{
                        width: "100%",
                        padding: "15px",
                        backgroundColor: "#1E88E5",
                      }}
                    >
                      Upload Staff CSV
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Button
                      variant="contained"
                      startIcon={<UploadFile />}
                      component={Link}
                      to="/disciplines-csv-upload"
                      sx={{
                        width: "100%",
                        padding: "15px",
                        backgroundColor: "#1E88E5",
                      }}
                    >
                      Upload Discipline CSV
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Button
                      variant="contained"
                      startIcon={<UploadFile />}
                      component={Link}
                      to="/unit-session-csv-upload"
                      sx={{
                        width: "100%",
                        padding: "15px",
                        backgroundColor: "#1E88E5",
                      }}
                    >
                      Upload Unit Session CSV
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            )}

            {view === "input" && (
              <Box sx={{ mb: 6 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Input Test Data
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6} md={4}>
                    <Button
                      variant="contained"
                      startIcon={<Build />}
                      component={Link}
                      to="/input-test-data"
                      sx={{
                        width: "100%",
                        padding: "15px",
                        backgroundColor: "#43A047",
                      }}
                    >
                      Input Test Data
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            )}

            <Box
              sx={{ display: "flex", justifyContent: "flex-end", mt: 4, mb: 8 }}
            >
              <Button
                variant="contained"
                color="primary"
                onClick={handleNext}
                sx={{ ml: 1 }}
              >
                Next
              </Button>
            </Box>
          </Box>
        )}

        {activeStep === 1 && (
          <Box sx={{ mt: 6 }}>
            {/* Step 2: Timetable Configuration */}
            <Typography component="h5" gutterBottom>
              Step 2: Timetable Configuration
            </Typography>
            <Typography variant="body1" color="textSecondary" sx={{ mb: 4 }}>
              Adjust the weights for the goodness score calculation and select
              your algorithm.
            </Typography>

            <TextField
              fullWidth
              label="Venue Optimization Weight"
              type="number"
              value={venueOptimizationWeight}
              onChange={(e) =>
                setVenueOptimizationWeight(parseFloat(e.target.value))
              }
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Unit Conflict Weight"
              type="number"
              value={unitConflictWeight}
              onChange={(e) =>
                setUnitConflictWeight(parseFloat(e.target.value))
              }
              sx={{ mb: 2 }}
            />

            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel id="algorithm-select-label">Algorithm</InputLabel>
              <Select
                labelId="algorithm-select-label"
                id="algorithm-select"
                value={algorithm}
                label="Algorithm"
                onChange={(e) => setAlgorithm(e.target.value)}
              >
                <MenuItem value="Brute Force">Brute Force</MenuItem>
                <MenuItem value="Genetic Algorithm">Genetic Algorithm</MenuItem>
              </Select>
            </FormControl>

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mt: 4,
                mb: 8,
              }}
            >
              <Button variant="contained" onClick={handleBack}>
                Back
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmitConfiguration}
                sx={{ ml: 1 }}
              >
                Next
              </Button>
            </Box>
          </Box>
        )}

        {activeStep === 2 && (
          <Box sx={{ mt: 6 }}>
            {/* Step 3: Generate Timetable */}
            <Typography
              component="h1"
              variant="h4"
              align="center"
              sx={{ mt: 4 }}
            >
              The timetable is being generated...
              <br />
              <br />
            </Typography>
            <CircularProgress />
          </Box>
        )}

        {activeStep === 3 && (
          <Box sx={{ mt: 6 }}>
            {/* Step 4: Review Results */}
            <Typography
              component="h1"
              variant="h4"
              align="center"
              sx={{ mt: 4, fontWeight: "bold" }}
            >
              Timetable Generated Successfully!
            </Typography>
            <Typography
              component="p"
              variant="subtitle1"
              align="center"
              sx={{ mt: 2, color: "textSecondary" }}
            >
              The timetable has been generated. Please choose one of the
              following options to view the schedule:
            </Typography>

            <Box
              sx={{
                mt: 6,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                backgroundColor: "#f4f6f8",
                padding: "20px",
                borderRadius: "8px",
                boxShadow: 3,
              }}
            >
              <Typography variant="h6" align="center" gutterBottom>
                View Your Schedule:
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  flexWrap: "wrap",
                  justifyContent: "center",
                }}
              >
                <Button
                  component={Link}
                  to="/schedule-by-day"
                  variant="contained"
                  sx={{ mb: 2, minWidth: "200px" }}
                >
                  View by Day
                </Button>
                <Button
                  component={Link}
                  to="/schedule-by-venue"
                  variant="contained"
                  sx={{ mb: 2, minWidth: "200px" }}
                >
                  View by Venue
                </Button>
                <Button
                  component={Link}
                  to="/schedule-by-unit"
                  variant="contained"
                  sx={{ mb: 2, minWidth: "200px" }}
                >
                  View by Unit
                </Button>
                <Button
                  component={Link}
                  to="/pipeline"
                  variant="contained"
                  sx={{ mb: 2, minWidth: "200px" }}
                >
                  View Pipeline
                </Button>
              </Box>

              <Divider sx={{ mt: 4, mb: 4, width: "100%" }} />

              <Typography variant="h6" align="center" gutterBottom>
                Export Your Timetable:
              </Typography>
              <Button
                onClick={handleExport}
                variant="contained"
                sx={{
                  mb: 2,
                  backgroundColor: "orange",
                  color: "white",
                  "&:hover": { backgroundColor: "darkred" },
                  minWidth: "200px",
                }}
              >
                Export Timetable
              </Button>
            </Box>
          </Box>
        )}
      </Container>
      <Footer />
    </div>
  );
}
