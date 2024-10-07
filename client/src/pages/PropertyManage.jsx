import React, { useEffect, useState } from "react";
import {
  Button,
  Modal,
  Box,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Checkbox,
  ListItemText,
  OutlinedInput,
  Tabs,
  Tab,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import styles from "../App.module.css";
import NavbarAuth from "../components/NavbarAuth";
import { apiCall } from "../utils/ApiCall";
import { UnAuthRedirect } from "../utils/UnAuthRedirect";
import { style } from "@mui/system";
import Footer from "../components/Footer";
import VenuesTab from "../components/PropertyManage/VenuesTab";
import StaffTab from "../components/PropertyManage/StaffTab";
import DisciplinesTab from "../components/PropertyManage/DisciplinesTab";
import CfsTab from "../components/PropertyManage/CfsTab";
import UnitsTab from "../components/PropertyManage/UnitsTab";
import UnitSessionTab from "../components/PropertyManage/UnitSessionTab";
import SessionTab from "../components/PropertyManage/SessionTab";
import { useTimetable } from "../utils/TimetableContext";

export default function PropertyManage() {
  UnAuthRedirect();
  const navigate = useNavigate();

  const [unitData, setUnitData] = useState([]);
  const [venueData, setVenueData] = useState([]);
  const [staffData, setStaffData] = useState([]);
  const [disciplineData, setDisciplineData] = useState([]);
  const [cfsData, setCfsData] = useState([]);
  const [cohortData, setCohortData] = useState([]);
  const [unitSessionData, setUnitSessionData] = useState([]);
  const [tabValue, setTabValue] = useState(0);
  const [sessionData, setSessionData] = useState([]);

  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
    Origin: "http://localhost:3000",
  };

  useEffect(() => {
    getUnits();
    getVenues();
    getStaff();
    getDisciplines();
    getCFS();
    getCohorts();
    getUnitsessions();
    getSession();
  }, []);
  const getUnitsessions = async () => {
    const { data } = await apiCall("GET", {}, {}, "unit_sessions");
    setUnitSessionData(data.data);
  };
  const getUnits = async () => {
    const { data } = await apiCall("GET", headers, {}, "units");
    setUnitData(data.data);
  };
  const getCohorts = async () => {
    const { data } = await apiCall("GET", headers, {}, "cohorts");
    setCohortData(data.data);
  };
  const getVenues = async () => {
    const { data } = await apiCall("GET", headers, {}, "venues");
    setVenueData(data.data);
  };

  const getStaff = async () => {
    const { data } = await apiCall("GET", headers, {}, "staff");
    setStaffData(data.data);
  };

  const getDisciplines = async () => {
    const { data } = await apiCall("GET", headers, {}, "disciplines");
    setDisciplineData(data.data);
  };

  const getCFS = async () => {
    const { data } = await apiCall("GET", headers, {}, "clash-free-sets");
    setCfsData(data.data);
  };
  const getSession = async () => {
    const { data } = await apiCall("GET", {}, {}, "session");
    setSessionData(data.data);
  };

  const handleChangeTab = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <div>
      <NavbarAuth />
      <Tabs value={tabValue} onChange={handleChangeTab} centered>
        <Tab label="Units" />
        <Tab label="Venues" />
        <Tab label="Staff" />
        <Tab label="Disciplines" />
        <Tab label="Clash Free Sets" />
        <Tab label="Unit Sessions" />
        <Tab label="Session" />
      </Tabs>
      <div className={styles.contentContainer}>
        {tabValue === 0 && (
          <UnitsTab
            unitData={unitData}
            setUnitData={setUnitData}
            disciplineData={disciplineData}
            staffData={staffData}
          />
        )}
        {tabValue === 1 && (
          <VenuesTab venueData={venueData} setVenueData={setVenueData} />
        )}
        {tabValue === 2 && (
          <StaffTab
            staffData={staffData}
            disciplineData={disciplineData}
            setStaffData={setStaffData}
          />
        )}
        {tabValue === 3 && (
          <DisciplinesTab
            disciplineData={disciplineData}
            setDisciplineData={setDisciplineData}
          />
        )}
        {tabValue === 4 && (
          <CfsTab
            cfsData={cfsData}
            unitData={unitData}
            setCfsData={setCfsData}
            staffData={staffData}
            cohortData={cohortData}
          />
        )}
        {tabValue === 5 && (
          <UnitSessionTab
            unitSessionData={unitSessionData}
            setUnitSessionData={setUnitSessionData}
            unitData={unitData}
          />
        )}
        {tabValue === 6 && (
          <SessionTab
            sessionData={sessionData}
            unitData={unitData}
            venueData={venueData}
            staffData={staffData}
            unitSessionData={unitSessionData}
            setSessionData={setSessionData}
          />
        )}
      </div>

      <Footer />
    </div>
  );
}
