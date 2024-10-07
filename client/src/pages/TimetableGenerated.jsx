import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  Typography,
  Container,
  Box,
  CircularProgress,
} from "@mui/material";
import { Link, useLocation } from "react-router-dom"; // Import useLocation
import { useTimetable } from "../utils/TimetableContext";
import { apiCall } from "../utils/ApiCall";
import Footer from "../components/Footer";
import NavbarAuth from "../components/NavbarAuth";
import { UnAuthRedirect } from "../utils/UnAuthRedirect";

export default function TimetableGenerated() {
  UnAuthRedirect();
  const { timetable, setTimetable, setGoodnessScore, setGoodnessBreakdown } =
    useTimetable();
  const didMountRef = useRef(false);
  const [isGenerating, setIsGenerating] = useState(true);

  const location = useLocation(); // Get the passed state
  const { weights, algorithm } = location.state || {}; // Destructure weights and algorithm from state

  useEffect(() => {
    const generateTimetableAndCalculateGoodness = async () => {
      try {
        // Step 1: Call the appropriate /generate API based on the selected algorithm
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

          // Step 2: Call the /calculate-goodness-score API
          const { statusCode: goodnessSC, data } = await apiCall(
            "POST",
            {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            weights, // Pass the weights received from the previous page
            `calculate-goodness-score`
          );
          if (goodnessSC === 200) {
            setGoodnessScore(data.goodness_score || 0);
            setGoodnessBreakdown({
              unit_conflict_final_score: data.unit_conflict_final_score || 0,
              venue_optimization_final_score:
                data.venue_optimization_final_score || 0,
            });

            // Step 3: Call the /fetch-timetable API to retrieve the timetable
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

    if (!didMountRef.current) {
      generateTimetableAndCalculateGoodness();
      didMountRef.current = true;
    }
  }, [
    algorithm,
    weights,
    setTimetable,
    setGoodnessScore,
    setGoodnessBreakdown,
  ]);

  // For exporting timetable
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
      <Container component="main" maxWidth="sm">
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {isGenerating ? (
            <>
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
            </>
          ) : (
            <>
              <Typography
                component="h1"
                variant="h4"
                align="center"
                sx={{ mt: 4 }}
              >
                Timetable Generated Successfully!
              </Typography>
              <Typography
                component="p"
                variant="subtitle1"
                align="center"
                sx={{ mt: 2 }}
              >
                The timetable has been generated. Please choose one of the
                following options to view the schedule:
              </Typography>
              <Box
                sx={{
                  mt: 4,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
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
                  to="/schedule-by-unit"
                  variant="contained"
                  sx={{ mb: 2 }}
                >
                  View Schedule by Unit
                </Button>
                <Button
                  component={Link}
                  to="/pipeline"
                  variant="contained"
                  sx={{ mb: 2 }}
                >
                  View Pipeline
                </Button>
                <Button
                  onClick={handleExport}
                  variant="contained"
                  sx={{
                    mb: 2,
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
        </Box>
      </Container>
      <Footer />
    </div>
  );
}
