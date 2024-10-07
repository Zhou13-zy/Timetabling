import React from "react";
import {
  Button,
  Typography,
  Container,
  Box,
  Divider,
  Grid,
  Paper,
  Alert,
} from "@mui/material";
import { Link } from "react-router-dom";
import { useTimetable } from "../utils/TimetableContext";
import Footer from "../components/Footer";
import NavbarAuth from "../components/NavbarAuth";

export default function ReviewResultsPage() {
  const { timetable, goodnessScore, goodnessBreakdown } = useTimetable();

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
      <Container component="main" maxWidth="md" sx={{ mt: 10, mb: 30 }}>
        <Typography component="h1" variant="h3" align="center" sx={{ mb: 4 }}>
          Timetable Overview
        </Typography>

        <Paper elevation={3} sx={{ p: 4 }}>
          {!timetable && (
            <Alert severity="warning" sx={{ mb: 4 }}>
              No timetable data available. You can either{" "}
              <Link to="/generate" style={{ fontWeight: "bold" }}>
                generate a new timetable
              </Link>{" "}
              or{" "}
              <Link to="/import-timetable" style={{ fontWeight: "bold" }}>
                import an existing timetable
              </Link>{" "}
              to review results.
            </Alert>
          )}

          {timetable && (
            <>
              <Typography component="h2" variant="h5" gutterBottom>
                Goodness Score Overview
              </Typography>
              <Typography variant="body1" color="textSecondary" sx={{ mb: 2 }}>
                The overall quality of your timetable is assessed by the
                goodness score. Below is the breakdown of the contributing
                factors:
              </Typography>

              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 4 }}
              >
                <Typography variant="body1">
                  <strong>Goodness Score:</strong> {goodnessScore || "N/A"}
                </Typography>
                <Typography variant="body1">
                  <strong>Venue Optimization Score:</strong>{" "}
                  {goodnessBreakdown?.venue_optimization_final_score || "N/A"}
                </Typography>
                <Typography variant="body1">
                  <strong>Unit Conflict Score:</strong>{" "}
                  {goodnessBreakdown?.unit_conflict_final_score || "N/A"}
                </Typography>
              </Box>

              <Divider sx={{ mb: 4 }} />

              <Typography component="h2" variant="h5" gutterBottom>
                View Your Schedule
              </Typography>
              <Typography variant="body1" color="textSecondary" sx={{ mb: 4 }}>
                Select one of the options below to view your generated
                timetable:
              </Typography>

              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Button
                    component={Link}
                    to="/schedule-by-day"
                    variant="contained"
                    fullWidth
                    sx={{ py: 2 }}
                  >
                    View by Day
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Button
                    component={Link}
                    to="/schedule-by-venue"
                    variant="contained"
                    fullWidth
                    sx={{ py: 2 }}
                  >
                    View by Venue
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Button
                    component={Link}
                    to="/schedule-by-unit"
                    variant="contained"
                    fullWidth
                    sx={{ py: 2 }}
                  >
                    View by Unit
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Button
                    component={Link}
                    to="/pipeline"
                    variant="contained"
                    fullWidth
                    sx={{ py: 2 }}
                  >
                    View Pipeline
                  </Button>
                </Grid>
              </Grid>

              <Divider sx={{ my: 4 }} />

              <Typography component="h2" variant="h5" gutterBottom>
                Export Your Timetable
              </Typography>
              <Typography variant="body1" color="textSecondary" sx={{ mb: 4 }}>
                You can export your generated timetable as a JSON file:
              </Typography>

              <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
                <Button
                  onClick={handleExport}
                  variant="contained"
                  sx={{
                    backgroundColor: "orange",
                    color: "white",
                    "&:hover": { backgroundColor: "darkred" },
                  }}
                >
                  Export Timetable
                </Button>
              </Box>
            </>
          )}
        </Paper>
      </Container>
      <Footer />
    </div>
  );
}
