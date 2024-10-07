import React from "react";
import styles from "../App.module.css";
import { Grid, Typography } from "@mui/material";
import { Link } from "react-router-dom";

export default function VenueUploadSucceed() {
  return (
    <div className={styles.homeUnauth}>
      <Grid container spacing={3} alignItems="center" justifyContent="center">
        <div className={styles.authForm}>
          <Grid item xs={12}>
            <form>
              <Typography variant="h5" component="h2" gutterBottom>
                Venue CSV File Successfully Uploaded!
              </Typography>
              <Typography variant="h5" component="h2">
                Please process to upload unit csv file {" "}
                <Link to="/unit-csv-upload" className={styles.regoRedirectLink}>
                  UPLOAD FILE
                </Link>
              </Typography>
            </form>
          </Grid>
        </div>
      </Grid>
    </div>
  );
}
