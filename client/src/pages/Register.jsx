import React from "react";
import RegisterForm from "../components/RegisterForm";
import styles from "../App.module.css";
import { Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { apiCall } from "../utils/ApiCall";
import { AuthRedirect } from "../utils/AuthRedirect";
import NavbarUnauth from "../components/NavbarUnauth";
import Footer from "../components/Footer";

export default function Register() {
  AuthRedirect();
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
            <RegisterForm
              submit={async (admin, firstname, lastname, email, password) => {
                const {
                  statusCode,
                  data: { message = ""}
                } = await apiCall(
                  "POST",
                  headers,
                  { admin, firstname, lastname, email, password },
                  "user"
                );
                if (statusCode === 201) {
                  navigate("/registered");
                } else {
                  alert(message);
                }
                
              }}
            />
          </Grid>
        </div>
      </Grid>
    </div>
  );
}
