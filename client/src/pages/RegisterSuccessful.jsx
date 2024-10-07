import React from "react";
import styles from "../App.module.css";
import { Grid } from "@mui/material";
import RegisteredForm from "../components/RegisteredForm";

export default function RegisterSuccessful() {
  return (
    <div className={styles.homeUnauth}>
      <Grid container spacing={3} alignItems="center" justifyContent="center">
        <div className={styles.authForm}>
          <Grid item xs={12}>
            <RegisteredForm />
          </Grid>
        </div>
      </Grid>
    </div>
  );
}
