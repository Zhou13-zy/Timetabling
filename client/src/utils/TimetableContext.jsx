import React, { createContext, useContext, useState, useEffect } from "react";

// Create a context
const TimetableContext = createContext();

// Create a provider component
export function TimetableProvider({ children }) {
  const [timetable, setTimetable] = useState(null);
  const [goodnessScore, setGoodnessScore] = useState(null);
  const [goodnessBreakdown, setGoodnessBreakdown] = useState({
    unit_conflict_final_score: 0,
    venue_optimization_final_score: 0,
  });

  useEffect(() => {
    console.log("TimetableProvider mounted");
  }, []);

  const updateTimetable = (newTimetable) => {
    console.log("Updating timetable: ", newTimetable);
    setTimetable(newTimetable);
  };

  const updateGoodnessScore = (score) => {
    console.log("Updating goodness score: ", score);
    setGoodnessScore(score);
  };

  const updateGoodnessBreakdown = (breakdown) => {
    console.log("Updating goodness breakdown: ", breakdown);
    setGoodnessBreakdown(breakdown);
  };

  const [invalidSession, setInvalidSession] = useState(() => {
    const savedInvalidSession = localStorage.getItem("invalidSession");
    return savedInvalidSession ? JSON.parse(savedInvalidSession) : [];
  });

  useEffect(() => {
    console.log("Updated invalid session: ", invalidSession);
    localStorage.setItem("invalidSession", JSON.stringify(invalidSession)); // save in local storage
  }, [invalidSession]);

  const updateInvalidSession = (newInvalidSession) => {
    console.log("Updating invalid session: ", newInvalidSession);
    setInvalidSession(newInvalidSession);
  };

  return (
    <TimetableContext.Provider
      value={{
        timetable,
        setTimetable: updateTimetable,
        goodnessScore,
        setGoodnessScore: updateGoodnessScore,
        goodnessBreakdown,
        setGoodnessBreakdown: updateGoodnessBreakdown,
        invalidSession,
        setInvalidSession: updateInvalidSession,
      }}
    >
      {children}
    </TimetableContext.Provider>
  );
}

// Custom hook to use the timetable context
export function useTimetable() {
  return useContext(TimetableContext);
}
