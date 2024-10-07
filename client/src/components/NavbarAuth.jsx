import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box"; 
import styles from "../App.module.css";
import LogoutBtn from "./LogoutBtn";
import Logo from "../assets/logo.svg";
import { Link } from "react-router-dom";

export default function NavbarAuth() {
  return (
    <AppBar position="sticky">
      <Toolbar>
        <Link to="/">
          <img
            className={styles.icon}
            src={Logo}
            alt="task management logo"
          />
        </Link>
        <Box sx={{ flexGrow: 0.05 }} /> 
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Timetabling
        </Typography>
        <Button component={Link} to="/generate" color="inherit">
          Generate
        </Button>
        <Button component={Link} to="/review-results" color="inherit">
          Timetable
        </Button>
        <Button component={Link} to="/manage-property" color="inherit">
          Manage
        </Button>
        <Button component={Link} to="/profile" color="inherit">
          Profile
        </Button>
        <LogoutBtn />
      </Toolbar>
    </AppBar>
  );
}
