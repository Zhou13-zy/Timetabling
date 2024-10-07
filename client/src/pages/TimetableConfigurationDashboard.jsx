import React, { useState } from "react";
import {
  Button,
  TextField,
  Typography,
  Container,
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import NavbarAuth from "../components/NavbarAuth";

export default function TimetableConfigurationDashboard() {
  const [venueOptimizationWeight, setVenueOptimizationWeight] = useState(0.4);
  const [unitConflictWeight, setUnitConflictWeight] = useState(0.6);
  const [algorithm, setAlgorithm] = useState("Brute Force"); // Default to Brute Force
  const navigate = useNavigate();

  const handleSubmit = () => {
    navigate("/timetable-generated", {
      state: {
        weights: {
          venue_optimization_weight: venueOptimizationWeight,
          unit_conflict_weight: unitConflictWeight,
        },
        algorithm,
      },
    });
  };

  return (
    <div>
      <NavbarAuth />
      <Container component="main" maxWidth="sm">
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography component="h1" variant="h4" align="center" sx={{ mt: 4 }}>
            Timetable Configuration Dashboard
          </Typography>
          <Typography
            component="p"
            variant="subtitle1"
            align="center"
            sx={{ mt: 2 }}
          >
            Adjust the weights for the goodness score calculation:
          </Typography>
          <Box sx={{ mt: 4, width: "100%" }}>
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

            <Typography
              component="p"
              variant="subtitle1"
              align="center"
              sx={{ mt: 4 }}
            >
              Choose the algorithm to use:
            </Typography>

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

            <Button
              variant="contained"
              onClick={handleSubmit}
              sx={{ mt: 4 }}
              fullWidth
            >
              Submit
            </Button>
          </Box>
        </Box>
      </Container>
    </div>
  );
}
