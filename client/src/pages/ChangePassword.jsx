import React from "react";
import styles from "../App.module.css";
import { Grid } from "@mui/material";
import PasswordChangeForm from "../components/PasswordChangeForm";
import { useNavigate } from "react-router-dom";
import { apiCall } from "../utils/ApiCall";
import { UnAuthRedirect } from "../utils/UnAuthRedirect";
import NavbarAuth from "../components/NavbarAuth";
import Footer from "../components/Footer";

export default function ChangePassword() {
  UnAuthRedirect();
  const navigate = useNavigate();

  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
    Origin: "http://localhost:3000",
  };

  return (
    <div style={{ margin: 0, padding: 0 }}>
      <NavbarAuth />
      <div className={styles.homeUnauth}>
        <Grid container spacing={3} alignItems="center" justifyContent="center">
          <div className={styles.authForm}>
            <Grid item xs={12}>
              <PasswordChangeForm
                submit={async (old_password, new_password) => {
                  const {
                    statusCode,
                    data: { message = "", error = "" },
                  } = await apiCall(
                    "POST",
                    headers,
                    { old_password, new_password },
                    "change-pwd"
                  );
                  if (statusCode === 201) {
                    alert(message);
                    navigate("/change-password-buffer-page");
                  } else {
                    alert(error);
                  }
                }}
              />
            </Grid>
          </div>
        </Grid>
      </div>
      <Footer />
    </div>
  );
}
