import React, { useState } from "react";
import AuthTextInput from "./styled/AuthTextInput";
import { Box, Button, Grid, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import styles from "../App.module.css";

export default function PasswordRecoveryForm({ submit }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const onSubmit = (e) => {
    e.preventDefault();
    submit(firstName, lastName, email);
  };
  return (
    <form onSubmit={onSubmit}>
      <Typography color="grey" gutterBottom variant="h4">
        Forget Password
      </Typography>
      <Grid container spacing={2} justifyContent="center">
        <Grid item xs={12} sm={6}>
          <AuthTextInput
            type="text"
            label="First Name"
            size="small"
            margin="normal"
            fullWidth
            required
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <AuthTextInput
            type="text"
            label="Last Name"
            size="small"
            margin="normal"
            fullWidth
            required
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </Grid>
      </Grid>
      <AuthTextInput
        type="email"
        label="Email"
        size="small"
        margin="normal"
        required
        fullWidth
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Box sx={{ mt: 5 }}>
        <Button
          type="submit"
          variant="contained"
          fullWidth
          size="large"
          color="primary"
          className="mb-5"
        >
          Send Code
        </Button>
      </Box>
      <br />
      <Grid item xs={12}>
        <Grid item container direction="column" alignItems="center" xs={12}>
          <Typography variant="subtitle1" sx={{ textDecoration: "none" }}>
            <span>
              Go back to the login page{" "}
              <Link to="/login" className={styles.regoRedirectLink}>
                Login
              </Link>
            </span>
          </Typography>
        </Grid>
      </Grid>
    </form>
  );
}
