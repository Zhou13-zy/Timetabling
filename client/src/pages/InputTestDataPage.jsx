import React from "react";
import InputTestDataForm from "../components/InputTestDataForm";
import styles from "../App.module.css";
import { Grid } from "@mui/material";
import { UnAuthRedirect } from "../utils/UnAuthRedirect";
import NavbarAuth from "../components/NavbarAuth";


export default function InputTestDataPage() {
  UnAuthRedirect();
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    Origin: "http://localhost:3000",
  };
  return (
    
    <div style={{ margin: 0, padding: 0 }}>
      <NavbarAuth />
      <Grid container spacing={3} alignItems="center" justifyContent="center">
        <div className={styles.authForm}>
          <Grid item xs={12}>
            <InputTestDataForm/>
          </Grid>
        </div>
      </Grid>
    </div>
  );
}