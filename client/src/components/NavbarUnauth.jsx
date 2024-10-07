import React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import styles from "../App.module.css";
import { Link } from "react-router-dom";
import appLogo from "../assets/logo.png";

export default function NavbarUnauth() {
  return (
    <Box sx={{ flexGrow: 1, zIndex: 1000 }} className={styles.navBar}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <Link to="/">
              <img
                className={styles.icon}
                src={appLogo}
                alt="task management logo"
              />
            </Link>
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Timetabling
          </Typography>
          <Button color="inherit" href="/register">
            Register
          </Button>
          <Button color="inherit" href="/login">
            Login
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
