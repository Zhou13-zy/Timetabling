import React, { useState } from "react";
import AuthTextInput from "./styled/AuthTextInput";
import { Box, Button, Grid, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import styles from "../App.module.css";

const isValidEmail = (email) => {
  return /\S+@\S+\.\S+/.test(email) || email.length === 0;
};

const isValidName = (name) => {
  return name.length < 15 || name.length === 0;
};

const isValidPassword = (password) => {
  const uppercaseRegExp = /(?=.*?[A-Z])/;
  const lowercaseRegExp = /(?=.*?[a-z])/;
  const digitsRegExp = /(?=.*?[0-9])/;
  const specialCharRegExp = /(?=.*?[#?!@$%^&*-])/;
  const minLengthRegExp = /.{10,}/;

  return (
    (uppercaseRegExp.test(password) &&
      lowercaseRegExp.test(password) &&
      (digitsRegExp.test(password) || specialCharRegExp.test(password)) &&
      minLengthRegExp.test(password)) ||
    password.length === 0
  );
};

export default function RegisterForm({ submit }) {
  const [email, setEmail] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [admin, setIsAdmin] = useState(true);

  const onSubmit = (e) => {
    e.preventDefault();
    submit(admin, firstname, lastname, email, password);
  };

  return (
    <form onSubmit={onSubmit}>
      <Typography color="grey" gutterBottom variant="h4">
        Sign up
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
            value={firstname}
            onChange={(e) => setFirstname(e.target.value)}
            error={!isValidName(firstname)}
            helperText={
              !isValidName(firstname)
                ? "name must be less than 15 characters"
                : null
            }
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
            value={lastname}
            onChange={(e) => setLastname(e.target.value)}
            error={!isValidName(lastname)}
            helperText={
              !isValidName(lastname)
                ? "name must be less than 15 characters"
                : null
            }
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
        error={!isValidEmail(email)}
        helperText={
          !isValidEmail(email) ? "email must be in the correct format" : null
        }
      />
      <AuthTextInput
        type="password"
        label="Password"
        size="small"
        margin="normal"
        required
        fullWidth
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={!isValidPassword(password)}
        helperText={
          !isValidPassword(password)
            ? "password must be at least 10 characters, one uppercase, one lowercase, one digit or special character"
            : null
        }
      />
      <AuthTextInput
        type="password"
        label="Confirm Password"
        size="small"
        margin="normal"
        required
        fullWidth
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        error={password !== confirmPassword}
        helperText={
          password !== confirmPassword ? "Passwords must match" : null
        }
      />
      <Box sx={{ ml: 1, mt: 1 }}>
        <input
          type="checkbox"
          id="admin"
          checked={admin}
          onChange={(e) => setIsAdmin(e.target.checked)}
        />
        <label htmlFor="admin">Admin</label>
      </Box>
      <br />
      <Box sx={{ mt: 5 }}>
        <Button
          type="submit"
          variant="contained"
          fullWidth
          size="large"
          color="primary"
          className="mb-5"
        >
          Register
        </Button>
      </Box>
      <br />
      <Grid item xs={12}>
        <Grid item container direction="column" alignItems="center" xs={12}>
          <Typography variant="subtitle1" sx={{ textDecoration: "none" }}>
            <span>
              Already have login and password?{" "}
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
