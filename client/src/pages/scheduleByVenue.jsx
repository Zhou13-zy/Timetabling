import React, { useState, useEffect } from "react";
import styles from "../App.module.css";
import NavbarAuth from "../components/NavbarAuth";
import { UnAuthRedirect } from "../utils/UnAuthRedirect";
import { useTimetable } from "../utils/TimetableContext";
import Footer from "../components/Footer";

export default function ScheduleByVenue() {
  UnAuthRedirect();

  const { timetable, goodnessScore, goodnessBreakdown } = useTimetable();
  const [venueTimetableData, setVenueTimetableData] = useState({});
  const [selectedVenue, setSelectedVenue] = useState("");

  useEffect(() => {
    if (timetable) {
      setVenueTimetableData(processTimetableData(timetable));
    }
  }, [timetable]);

  const processTimetableData = (rawData) => {
    const daysOfWeek = ["monday", "tuesday", "wednesday", "thursday", "friday"];
    let structuredData = {};

    rawData.forEach((venueTimeslot) => {
      venueTimeslot.forEach((session) => {
        if (session && session.venueName) {
          const venueKey = `${session.venueName} @ ${session.venueLocation}`;
          if (!structuredData[venueKey]) {
            structuredData[venueKey] = {};
            daysOfWeek.forEach((day) => {
              structuredData[venueKey][day] = {};
              Array.from({ length: 13 }, (_, i) => `${8 + i}:00`).forEach(
                (hour) => {
                  structuredData[venueKey][day][hour] = [];
                }
              );
            });
          }
          let startHour = parseInt(session.startTime.split(":")[0]);
          const endHour = parseInt(session.endTime.split(":")[0]);

          while (startHour < endHour) {
            const hourKey = `${startHour}:00`;
            if (
              !structuredData[venueKey][session.dayOfWeek.toLowerCase()][
                hourKey
              ].some(
                (s) =>
                  s.startTime === session.startTime &&
                  s.endTime === session.endTime
              )
            ) {
              structuredData[venueKey][session.dayOfWeek.toLowerCase()][
                hourKey
              ].push(session);
            }
            startHour++;
          }
        }
      });
    });
    return structuredData;
  };

  const handleVenueSelect = (event) => {
    setSelectedVenue(event.target.value);
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
        <select
          onChange={handleVenueSelect}
          value={selectedVenue}
          className={styles.dropdown}
        >
          <option value="">Select a Venue</option>
          {Object.keys(venueTimetableData).map((venue, index) => (
            <option key={index} value={venue}>
              {venue}
            </option>
          ))}
        </select>
        {selectedVenue && (
          <>
            <h2 className={styles.venueHeader}>{selectedVenue}</h2>
            <div className={styles.timetableContainer}>
              {Object.entries(venueTimetableData[selectedVenue]).map(
                ([day, hoursData]) => (
                  <div key={day} className={styles.dayColumn}>
                    <h3 className={styles.dayHeader}>
                      {day.charAt(0).toUpperCase() + day.slice(1)}
                    </h3>
                    {Object.keys(hoursData).map((hour) => (
                      <div key={hour} className={styles.hourSlot}>
                        <strong>{hour}</strong>
                        {hoursData[hour].map((session, index) => (
                          <div key={index} className={styles.sessionBox}>
                            <p>
                              {session.sessionType.toUpperCase()} -{" "}
                              {session.unitCode}
                            </p>
                            <p>
                              {session.startTime} - {session.endTime}
                            </p>
                            <p>{session.staffName || "No staff assigned"}</p>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                )
              )}
            </div>
          </>
        )}
      </div>
      <Footer />
    </div>
  );
}
