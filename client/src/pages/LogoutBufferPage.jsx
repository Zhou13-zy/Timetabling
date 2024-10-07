import React from 'react'
import styles from "../App.module.css";
import { Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { Grid } from "@mui/material";
import { AuthRedirect } from "../utils/AuthRedirect";

export default function LogoutBufferPage() {
    AuthRedirect();
    return (

        <div className={styles.homeUnauth}>
            <Grid container spacing={3} alignItems="center" justifyContent="center">
                <div className={styles.authForm}>
                    <Grid item xs={12}>
                        <form>
                            <Typography variant="h5" component="h2" gutterBottom>
                                Logout Successfully!
                            </Typography>
                            <Typography variant="h5" component="h2">
                                Please back to{" "}
                                <Link to="/login" className={styles.regoRedirectLink}>
                                    Login
                                </Link>{" "}
                                page.
                            </Typography>
                        </form>
                    </Grid>
                </div>
            </Grid>
        </div>

    )
}
