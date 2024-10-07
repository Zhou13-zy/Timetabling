import React from "react";
import styles from "../App.module.css";
import { Grid } from "@mui/material";
import PasswordRecoveredForm from "../components/PasswordRecoveredForm";

export default function PasswordRecovered() {
  return (
    <div className={styles.homeUnauth}>
      <Grid container spacing={3} alignItems="center" justifyContent="center">
        <div className={styles.authForm}>
          <Grid item xs={12}>
            <PasswordRecoveredForm />
          </Grid>
        </div>
      </Grid>
    </div>
  );
}
