import React from "react";
import NavbarUnauth from "../components/NavbarUnauth";
import timetable from "../assets/timetable.png";
import { AuthRedirect } from "../utils/AuthRedirect";
import { Button, Container, Box, Typography, Grid } from "@mui/material";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";

function HomePage() {
  AuthRedirect();

  return (
    <div>
      <NavbarUnauth />

      {/* Combined Hero and Feature Section */}
      <Box
        sx={{
          backgroundColor: "#F4EEB5",
          minHeight: "80vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          paddingX: 2,
          paddingY: 6,
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant="h3"
            sx={{
              fontWeight: "bold",
              marginBottom: "20px",
            }}
          >
            Simplify Your Scheduling
          </Typography>
          <Typography
            variant="body1"
            sx={{
              marginBottom: "30px",
              color: "rgba(0, 0, 0, 0.7)",
            }}
          >
            Create, manage, and optimize your timetable effortlessly with Classy
            Clock. Stay organized and save time.
          </Typography>

          {/* Image and Call to Action */}
          <Grid container justifyContent="center" spacing={4}>
            <Grid item xs={12} sm={6}>
              <img
                src={timetable}
                alt="Timetable"
                style={{
                  maxWidth: "100%",
                  height: "auto",
                  marginBottom: "20px",
                }}
              />
            </Grid>
            <Grid
              item
              xs={12}
              sm={6}
              display="flex"
              flexDirection="column"
              justifyContent="center"
            >
              <Button
                variant="contained"
                component={Link}
                to="/register"
                sx={{
                  backgroundColor: "#FFA726",
                  "&:hover": { backgroundColor: "#FB8C00" },
                  color: "#000",
                  padding: "10px 30px",
                  marginBottom: "20px",
                }}
              >
                Get Started
              </Button>
              <Button
                variant="contained"
                component={Link}
                to="/register"
                sx={{
                  backgroundColor: "#1E88E5",
                  "&:hover": { backgroundColor: "#1565C0" },
                  color: "#fff",
                  padding: "10px 30px",
                }}
              >
                Learn More
              </Button>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Footer />
    </div>
  );
}

export default HomePage;
