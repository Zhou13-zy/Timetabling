import React from "react";
import LoginForm from "../components/LoginForm";
import styles from "../App.module.css";
import { Grid } from "@mui/material";
import { apiCall } from "../utils/ApiCall";
import { useNavigate } from "react-router-dom";
import { AuthRedirect } from "../utils/AuthRedirect";
import NavbarUnauth from "../components/NavbarUnauth";
import Footer from "../components/Footer";

export default function Login() {
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
            <LoginForm
              submit={async (email, password) => {
                const { statusCode, data: {access_token, user_identity} } = await apiCall(
                  "POST",
                  headers,
                  { email, password },
                  "authentication"
                );
                if (statusCode === 200) {
                  localStorage.setItem("token", access_token);
                  localStorage.setItem("email", user_identity);
                  navigate("/dashboard");
                } else {
                  alert("incorrect email or password, please try again");
                  navigate("/login");
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