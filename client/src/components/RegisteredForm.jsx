import React from "react";
import { Typography } from "@mui/material";
import { Link } from "react-router-dom";
import styles from "../App.module.css";

export default function RegisteredForm() {
  return (
    <form>
      <Typography variant="h5" component="h2" gutterBottom>
        Registration Successful.
      </Typography>
      <Typography variant="h5" component="h2" gutterBottom>
        Welcome!
      </Typography>
      <Typography variant="h5" component="h2" gutterBottom>
        Please go to{" "}
        <Link to="/login" className={styles.regoRedirectLink}>
          Login
        </Link>{" "}
        page.
      </Typography>
    </form>
  );
}
