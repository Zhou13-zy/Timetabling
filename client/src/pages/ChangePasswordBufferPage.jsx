import React from 'react'
import styles from "../App.module.css";
import { Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { Grid } from "@mui/material";

export default function ChangePasswordBufferPage() {
  return (
    <div className={styles.homeUnauth}>
      <Grid container spacing={3} alignItems="center" justifyContent="center">
        <div className={styles.authForm}>
          <Grid item xs={12}>
            <form>
              <Typography variant="h5" component="h2" gutterBottom>
                Password changed successfully!
              </Typography>
              <Typography variant="h5" component="h2">
                Please back to{" "}
                <Link to="/dashboard" className={styles.regoRedirectLink}>
                  Dashboard
                </Link>{" "}
              </Typography>
            </form>
          </Grid>
        </div>
      </Grid>
    </div>
  )
}
