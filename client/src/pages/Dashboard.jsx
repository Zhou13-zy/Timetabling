import React from "react";
import { Container, Grid, Card, Typography, Button } from "@mui/material";
import NavbarAuth from "../components/NavbarAuth";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import { UnAuthRedirect } from "../utils/UnAuthRedirect";

export default function Dashboard() {
  UnAuthRedirect();

  return (
    <div>
      <NavbarAuth />
      <Container  component="main" maxWidth="lg" sx={{ mt: 10, mb: 30 }}>
        <Grid
          container
          spacing={4}
          sx={{
            marginTop: "80px",
            paddingX: "20px",
          }}
        >
          <Grid item xs={12}>
            <Card
              sx={{
                padding: "40px 20px",
                textAlign: "center",
                boxShadow: "none",
                borderRadius: "10px",
              }}
            >
              <Typography
                variant="h4"
                fontWeight="bold"
                gutterBottom
                sx={{ color: "#333" }}
              >
                Welcome to Timetable Generator
              </Typography>
              <Typography variant="subtitle1" color="textSecondary">
                Follow the steps below to generate or import your timetable
                efficiently.
              </Typography>
            </Card>
          </Grid>

          {/* Introduction to Steps */}
          <Grid item xs={12}>
            <Typography
              variant="h5"
              fontWeight="bold"
              gutterBottom
              sx={{ color: "#333" }}
            >
              The Timetable Generation Process
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={3}>
                <Card
                  sx={{
                    padding: "20px",
                    textAlign: "center",
                    backgroundColor: "#FFF",
                    borderRadius: "10px",
                  }}
                >
                  <Typography variant="h6" gutterBottom>
                    Step 1: Prepare Data (Optional)
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Upload your CSV files or input test data to start the
                    process.
                  </Typography>
                </Card>
              </Grid>
              <Grid item xs={12} sm={3}>
                <Card
                  sx={{
                    padding: "20px",
                    textAlign: "center",
                    backgroundColor: "#FFF",
                    borderRadius: "10px",
                  }}
                >
                  <Typography variant="h6" gutterBottom>
                    Step 2: Timetable Configuration
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Adjust weights and select the algorithm for timetable
                    generation.
                  </Typography>
                </Card>
              </Grid>
              <Grid item xs={12} sm={3}>
                <Card
                  sx={{
                    padding: "20px",
                    textAlign: "center",
                    backgroundColor: "#FFF",
                    borderRadius: "10px",
                  }}
                >
                  <Typography variant="h6" gutterBottom>
                    Step 3: Generating Timetable
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    The timetable will be generated based on your configuration.
                  </Typography>
                </Card>
              </Grid>
              <Grid item xs={12} sm={3}>
                <Card
                  sx={{
                    padding: "20px",
                    textAlign: "center",
                    backgroundColor: "#FFF",
                    borderRadius: "10px",
                  }}
                >
                  <Typography variant="h6" gutterBottom>
                    Step 4: Review Results
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Review your generated timetable and export it as needed.
                  </Typography>
                </Card>
              </Grid>
            </Grid>
          </Grid>

          {/* Button to start the process */}
          <Grid item xs={12} sx={{ textAlign: "center", marginTop: "40px" }}>
            <Button
              variant="contained"
              component={Link}
              to="/generate"
              sx={{
                padding: "10px 40px",
                fontSize: "16px",
                backgroundColor: "#1E88E5",
              }}
            >
              Start the Process
            </Button>
          </Grid>

          {/* Section for importing existing timetable */}
          <Grid item xs={12} sx={{ textAlign: "center", marginTop: "40px" }}>
            <Typography
              variant="h5"
              fontWeight="bold"
              gutterBottom
              sx={{ color: "#333" }}
            >
              Or Import an Existing Timetable
            </Typography>
            <Card
              sx={{
                padding: "20px",
                textAlign: "center",
                backgroundColor: "#FFF",
                borderRadius: "10px",
                margin: "0 auto",
              }}
            >
              <Typography variant="body2" color="textSecondary">
                Already have a timetable? Import it directly into the system to
                review and adjust it.
              </Typography>
              <Button
                variant="contained"
                component={Link}
                to="/import-timetable"
                sx={{
                  marginTop: "20px",
                  padding: "10px 40px",
                  backgroundColor: "#FFA726",
                  "&:hover": {
                    backgroundColor: "#FB8C00",
                  },
                }}
              >
                Import Timetable
              </Button>
            </Card>
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </div>
  );
}
