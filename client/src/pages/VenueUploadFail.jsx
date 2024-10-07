import React from "react";
import styles from "../App.module.css";
import { Grid, Typography } from "@mui/material";
import { Link } from "react-router-dom";

export default function VenueUploadFail() {
  return (
    <div className={styles.homeUnauth}>
      <Grid container spacing={3} alignItems="center" justifyContent="center">
        <div className={styles.authForm}>
          <Grid item xs={12}>
            <form>
              <Typography variant="h5" component="h2" gutterBottom>
                Venue CSV File Upload Failed
              </Typography>
              <Typography variant="h5" component="h2">
                Please upload again on {" "}
                <Link to="/venue-csv-upload" className={styles.regoRedirectLink}>
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
