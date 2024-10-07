import React from "react";
import PasswordRecoveryForm from "../components/PasswordRecoveryForm";
import styles from "../App.module.css";
import { Grid } from "@mui/material";
import { apiCall } from "../utils/ApiCall";
import { useNavigate } from "react-router-dom";
import NavbarUnauth from "../components/NavbarUnauth";
import Footer from "../components/Footer";

export default function PasswordRecovery() {
  const navigate = useNavigate();
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    Origin: "http://localhost:3000",
  };
  return (
    <div className={styles.homeUnauth}>
      <NavbarUnauth />
      <Grid container spacing={3} alignItems="center" justifyContent="center">
        <div className={styles.authForm}>
          <Grid item xs={12}>
            <PasswordRecoveryForm
              submit={async (firstname, lastname, email) => {
                const { statusCode } = await apiCall(
                  "POST",
                  headers,
                  { firstname, lastname, email },
                  "forget-pwd"
                );
                if (statusCode === 201) {
                  localStorage.setItem("email", email);
                  navigate("/verify-otp");
                } else {
                  alert("incorrect email, please try again");
                }
              }}
            />
          </Grid>
        </div>
      </Grid>
      <Footer />
    </div>
  );
}
