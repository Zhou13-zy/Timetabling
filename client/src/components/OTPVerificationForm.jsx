import React, { useState } from "react";
import AuthTextInput from "./styled/AuthTextInput";
import { Box, Button, Grid, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import styles from "../App.module.css";

export default function OTPVerificationForm({ submit }) {
  const [otp, setOTP] = useState("");
  const email = localStorage.getItem("email");
  const onSubmit = (e) => {
    e.preventDefault();
    submit(email, otp);
  };
  return (
    <form onSubmit={onSubmit}>
      <Typography color="grey" gutterBottom variant="h4">
        Check your email
      </Typography>
      <Typography gutterBottom variant="h6">
        Please enter your 6-digit code.
      </Typography>
      <AuthTextInput
        type="text"
        label="6-digit code"
        size="small"
        margin="normal"
        required
        fullWidth
        value={otp}
        onChange={(e) => setOTP(e.target.value)}
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
          Verify OTP
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
