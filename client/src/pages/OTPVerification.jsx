import React from "react";
import styles from "../App.module.css";
import { Grid } from "@mui/material";
import OTPVerificationForm from "../components/OTPVerificationForm";
import { apiCall } from "../utils/ApiCall";
import { useNavigate } from "react-router-dom";

export default function OTPVerification() {
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
            <OTPVerificationForm
              submit={async (email, otp) => {
                const { statusCode, data: {token} } = await apiCall(
                  "POST",
                  headers,
                  { email, otp },
                  "verifying-otp"
                );

                if (statusCode === 200) {
                  localStorage.setItem("resetPwdToken", token);
                  navigate("/reset-pwd");
                } else {
                  alert("incorrect email / code, please try again");
                }
              }}
            />
          </Grid>
        </div>
      </Grid>
    </div>
  );
}
