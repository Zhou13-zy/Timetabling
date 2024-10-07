import React, { useEffect, useState } from "react";
import styles from "../App.module.css";
import { apiCall } from "../utils/ApiCall";
import NavbarAuth from "../components/NavbarAuth";
import { UnAuthRedirect } from "../utils/UnAuthRedirect";
import Footer from "../components/Footer";

export default function ScheduleByUnit() {
  UnAuthRedirect();

  const [timetableData, setTimetableData] = useState([]);
  const [unitsData, setUnitsData] = useState([]);
  const [sessionsInfo, setSessionsInfo] = useState({
    actual_sessions_allocated: 0,
    total_sessions_needed: 0,
  });

  const headers = {
    Accept: "application/json",
    Origin: "http://localhost:3000",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  const processTimetableData = (rawData) => {
    let structuredData = {};
    let sessionSet = new Set();

    rawData.forEach((venueTimeslot) => {
      venueTimeslot.forEach((session) => {
        if (session && session.unitCode) {
          const sessionKey = `${session.unitCode}-${session.dayOfWeek}-${session.startTime}-${session.endTime}-${session.sessionType}-${session.staffName}-${session.venueName}-${session.venueLocation}`;
          if (!sessionSet.has(sessionKey)) {
            sessionSet.add(sessionKey);

            if (!structuredData[session.unitCode]) {
              structuredData[session.unitCode] = [];
            }

            structuredData[session.unitCode].push({
              dayOfWeek: session.dayOfWeek,
              startTime: session.startTime,
              endTime: session.endTime,
              sessionType: session.sessionType,
              staffName: session.staffName || "No staff assigned",
              venueName: session.venueName,
              venueLocation: session.venueLocation,
            });
          }
        }
      });
    });

    return structuredData;
  };

  useEffect(() => {
    const fetchTimetables = async () => {
      try {
        const {
          statusCode,
          data: { actual_sessions_allocated, total_sessions_needed, timetable },
        } = await apiCall("GET", headers, {}, `fetch-timetable`);
        if (statusCode === 200 && timetable.length > 0) {
          setTimetableData(processTimetableData(timetable));
          setSessionsInfo({
            actual_sessions_allocated,
            total_sessions_needed,
          });
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    const fetchUnits = async () => {
      try {
        const {
          statusCode,
          data: { data },
        } = await apiCall("GET", headers, {}, `units`);
        if (statusCode === 200) {
          const processedData = data.map((unit) => {
            const sessionsRequired = unit.sessions.map((session) => {
              const requiredNumber = Math.ceil(unit.quota / session.capacity);
              return {
                ...session,
                requiredNumber,
              };
            });
            return {
              ...unit,
              sessions: sessionsRequired,
            };
          });
          setUnitsData(processedData);
        }
      } catch (error) {
        console.error("Failed to fetch units data:", error);
      }
    };

    fetchTimetables();
    fetchUnits();
  }, []);

  const mergeData = (units, timetable) => {
    return units.map((unit) => {
      return {
        ...unit,
        timetableSessions: timetable[unit.code] || [],
      };
    });
  };

  const mergedData = mergeData(unitsData, timetableData);

  return (
    <div className={styles.home}>
      <NavbarAuth />
      <div className={styles.homepageMainBox}>
        <div className={styles.unitsContainer}>
          <div className={styles.headerRow}>
            <p>
              <strong>Actual Sessions Allocated:</strong>{" "}
              {sessionsInfo.actual_sessions_allocated}
            </p>
            <p>
              <strong>Total Sessions Needed:</strong>{" "}
              {sessionsInfo.total_sessions_needed}
            </p>
          </div>
          <h2>All Units</h2>
          {mergedData.map((unit) => (
            <div key={unit.id} className={styles.unitBox}>
              <h3>{unit.code}</h3>
              <p>{unit.title}</p>
              <p>
                <strong>Credit: </strong> {unit.credit}
              </p>
              <p>
                <strong>Quota: </strong> {unit.quota}
              </p>
              <div>
                <strong>Sessions:</strong>
                {unit.sessions.map((session, index) => (
                  <p key={index}>
                    {session.type} - {session.duration_hours} hours, Capacity:{" "}
                    {session.capacity}, Required: {session.requiredNumber}
                  </p>
                ))}
              </div>
              <div className={styles.timetableContainer}>
                {unit.timetableSessions.length > 0 ? (
                  unit.timetableSessions.map((session, index) => (
                    <div key={index} className={styles.sessionBox}>
                      <p>{session.sessionType.toUpperCase()}</p>
                      <p>{session.dayOfWeek.toUpperCase()}</p>
                      <p>
                        <strong>Time: </strong> {session.startTime} -{" "}
                        {session.endTime}
                      </p>
                      <p>
                        <strong>Venue: </strong> {session.venueName} @{" "}
                        {session.venueLocation}
                      </p>
                      <p>
                        <strong>Staff: </strong> {session.staffName}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className={styles.noSessions}>
                    No timetable sessions available
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
