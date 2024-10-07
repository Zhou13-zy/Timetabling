import React, { useEffect, useState } from "react";
import styles from "../App.module.css";
import NavbarAuth from "../components/NavbarAuth";
import { UnAuthRedirect } from "../utils/UnAuthRedirect";
import { useTimetable } from "../utils/TimetableContext";

const HOURS = [
  "8:00",
  "9:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
];

export default function ScheduleByDay() {
  UnAuthRedirect();

  const { timetable, goodnessScore, goodnessBreakdown } = useTimetable();
  const [structuredTimetable, setStructuredTimetable] = useState({});

  useEffect(() => {
    if (timetable) {
      setStructuredTimetable(processTimetableData(timetable));
    }
  }, [timetable]);

  const processTimetableData = (rawData) => {
    const daysOfWeek = ["monday", "tuesday", "wednesday", "thursday", "friday"];
    const hours = Array.from({ length: 13 }, (_, i) => `${8 + i}:00`); // from 8:00 AM to 9:00 PM

    // Initialize timetable structure
    let structuredData = {};
    daysOfWeek.forEach((day) => {
      structuredData[day] = {};
      hours.forEach((hour) => {
        structuredData[day][hour] = [];
      });
    });

    // A helper function to create a unique identifier for a session
    const createSessionIdentifier = (session) => {
      return `${session.unitCode}-${session.staffName}`;
    };

    // To store session identifiers and prevent duplicates
    let sessionIdentifiers = {};

    rawData.forEach((venueTimeslot) => {
      venueTimeslot.forEach((session) => {
        if (session && daysOfWeek.includes(session.dayOfWeek.toLowerCase())) {
          const startTime = session.startTime;
          const endTime = session.endTime;
          let startHour = parseInt(startTime.split(":")[0]);
          let endHour = parseInt(endTime.split(":")[0]);

          // Generate the session identifier
          const sessionID = createSessionIdentifier(session);

          while (startHour < endHour) {
            const timeKey = `${startHour}:00`;
            if (structuredData[session.dayOfWeek.toLowerCase()][timeKey]) {
              // Only add the session if it hasn't been added for this timeslot
              if (
                !sessionIdentifiers[
                  `${session.dayOfWeek.toLowerCase()}-${timeKey}-${sessionID}`
                ]
              ) {
                structuredData[session.dayOfWeek.toLowerCase()][timeKey].push({
                  ...session,
                  venueName: session.venueName,
                  venueLocation: session.venueLocation,
                });
                // Mark this session as added for this timeslot
                sessionIdentifiers[
                  `${session.dayOfWeek.toLowerCase()}-${timeKey}-${sessionID}`
                ] = true;
              }
            }
            startHour++;
          }
        }
      });
    });

    return structuredData;
  };

  return (
    <div className={styles.home}>
      <NavbarAuth />
      <div className={styles.homepageMainBox}>
        <div className={styles.headerRow}>
          <div className={styles.goodnessSummaryBox}>
            <div className={styles.goodnessValueBox}>
              Timetable Goodness:{" "}
              <span className={styles.goodnessValue}>
                {goodnessScore ? `${goodnessScore.toFixed(2)}` : "N/A"}
              </span>
            </div>
            <div className={styles.goodnessBreakdownBox}>
              <h4>Goodness Score Breakdown</h4>
              <div className={styles.breakdownContainer}>
                <div className={styles.breakdownItem}>
                  <label>Venue Optimization:</label>
                  <div className={styles.breakdownBar}>
                    {goodnessBreakdown.venue_optimization_final_score.toFixed(
                      2
                    )}{" "}
                    / 40
                  </div>
                </div>
                <div className={styles.breakdownItem}>
                  <label>Unit Conflict:</label>
                  <div className={styles.breakdownBar}>
                    {goodnessBreakdown.unit_conflict_final_score.toFixed(2)} /
                    60
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.timetableContainer}>
          {Object.entries(structuredTimetable).map(([day, hoursData]) => (
            <div key={day} className={styles.dayColumn}>
              <h3 className={styles.dayHeader}>
                {day.charAt(0).toUpperCase() + day.slice(1)}
              </h3>
              {HOURS.map((hour) => (
                <div key={hour} className={styles.hourSlot}>
                  <strong>{hour}</strong>
                  {hoursData[hour] && hoursData[hour].length > 0 ? (
                    hoursData[hour].map((session, index) => (
                      <div key={index} className={styles.sessionBox}>
                        <p>
                          {session.sessionType.toUpperCase()} -{" "}
                          {session.unitCode}
                        </p>
                        <p>
                          {session.startTime} - {session.endTime}
                        </p>
                        <p>
                          <strong>Venue: </strong> {session.venueName} @{" "}
                          {session.venueLocation}
                        </p>
                        <p>{session.staffName || "No staff assigned"}</p>
                      </div>
                    ))
                  ) : (
                    <div className={styles.noSessions}>
                      <p>No sessions at this time.</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
