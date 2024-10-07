import React from "react";
import styles from "../App.module.css";

export default function PageNotFound() {
  return (
    <div className={styles.pageNotFound}>
      <div className={styles.content}>
        <h1 className={styles.title}>404</h1>
        <p className={styles.subtitle}>Page Not Found</p>
        <p className={styles.description}>
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <a href="/" className={styles.link}>Go back </a>
      </div>
    </div>
  );
}
