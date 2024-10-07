import React, { useState } from "react";
import AuthTextInput from "./styled/AuthTextInput";
import { Box, Button, Grid, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import styles from "../App.module.css";

export default function LoginForm({ submit }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const onSubmit = (e) => {
    e.preventDefault();
    submit(email, password);
  };
  return (
    <form onSubmit={onSubmit}>
      <Typography color="grey" gutterBottom variant="h4">
        Login
      </Typography>
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
      <AuthTextInput
        type="password"
        label="Password"
        size="small"
        margin="normal"
        required
        fullWidth
        value={password}
        onChange={(e) => setPassword(e.target.value)}
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
          Login
        </Button>
      </Box>
      <br />
      <Grid item xs={12}>
        <Grid item container direction="column" alignItems="center" xs={12}>
          <Typography variant="subtitle1" sx={{ textDecoration: "none" }}>
            <span>
              Don't have an account yet?{" "}
              <Link to="/register" className={styles.regoRedirectLink}>
                Register Now
              </Link>
            </span>
          </Typography>
        </Grid>
        <Grid item container direction="column" alignItems="center" xs={12}>
          <Typography variant="subtitle1" sx={{ textDecoration: "none" }}>
            <span>
              <Link to="/forget-pwd" className={styles.regoRedirectLink}>
                Forget Password?
              </Link>
            </span>
          </Typography>
        </Grid>
      </Grid>
    </form>
  );
}
