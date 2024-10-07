import React from "react";
import styles from "../App.module.css";
import { Grid } from "@mui/material";
import PasswordResetForm from "../components/PasswordResetForm";
import { useNavigate } from "react-router-dom";
import { apiCall } from "../utils/ApiCall";

export default function PasswordReset() {
  const navigate = useNavigate();
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    Origin: "http://localhost:3000",
  };
  return (
    <div className={styles.homeUnauth}>
      <Grid container spacing={3} alignItems="center" justifyContent="center">
        <div className={styles.authForm}>
          <Grid item xs={12}>
            <PasswordResetForm
              submit={async (password) => {
                const { statusCode, data: {message='', error=''} } = await apiCall(
                  "POST",
                  headers,
                  { password },
                  `reset_password/${localStorage.getItem("resetPwdToken")}`
                );
                if (statusCode === 201) {
                  localStorage.removeItem("resetPwdToken");
                  alert(message);
                  navigate("/pwd-recovered");
                } else {
                  alert(error);
                }
              }}
            />
          </Grid>
        </div>
      </Grid>
    </div>
  );
}
