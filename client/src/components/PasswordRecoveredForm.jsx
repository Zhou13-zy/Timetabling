import React from "react";
import { Typography } from "@mui/material";
import { Link } from "react-router-dom";
import styles from "../App.module.css";

export default function PasswordRecoveredForm() {
  return (
    <form>
      <Typography variant="h5" component="h2" gutterBottom>
        Password Reset Successful.
      </Typography>
      <Typography variant="h5" component="h2">
        Please back to{" "}
        <Link to="/login" className={styles.regoRedirectLink}>
          Login
        </Link>{" "}
        page.
      </Typography>
    </form>
  );
}
