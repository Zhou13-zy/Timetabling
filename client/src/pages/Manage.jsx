import React, { useState, useEffect } from "react";
import { Button, Typography, Container, Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import NavbarAuth from "../components/NavbarAuth";
import Checkbox from "@mui/material/Checkbox";
import { apiCall } from "../utils/ApiCall";
import { UnAuthRedirect } from "../utils/UnAuthRedirect";
import Footer from "../components/Footer";

export default function Manage() {
  UnAuthRedirect();

  const [staffCheckItems, setStaffCheckItems] = useState({});
  const [cohortCheckItems, setCohortCheckItems] = useState({});
  const [timetableData, setTimetableData] = useState({});

  const headers = {
    Accept: "application/json",
    Origin: "http://localhost:3000",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  const getTimetables = async () => {
    try {
      const response = await apiCall("GET", headers, {}, `generate-brute-force`);
      if (response) {
        setTimetableData(response);
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };

  useEffect(() => {
    getTimetables();
  }, []);

  //for showing data to each staff and cohort tables.
  const startTime = "13:47";
  const createData = (name, generated_time) => ({
    name,
    generated_time,
  });
  const staffrow = Object.keys(timetableData).reduce((acc, key) => {
    if (key.startsWith("staff")) {
      acc.push(createData(key, startTime));
    }
    return acc;
  }, []);

  const cohortrow = Object.keys(timetableData).reduce((acc, key) => {
    if (key.startsWith("cohort")) {
      acc.push(createData(key, startTime));
    }
    return acc;
  }, []);

  //for checkbox
  useEffect(() => {}, [staffCheckItems]);
  useEffect(() => {}, [cohortCheckItems]);

  const staffCheckItemHandler = (id, isChecked) => {
    setStaffCheckItems((prevState) => ({
      ...prevState,
      [id]: isChecked,
    }));
  };

  const cohortCheckItemHandler = (id, isChecked) => {
    setCohortCheckItems((prevState) => ({
      ...prevState,
      [id]: isChecked,
    }));
  };

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 11,
    },
  }));

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    "&:last-child td, &:last-child th": {
      border: 0,
    },
  }));

  const renderTable = (data, checkItems, checkItemHandler) => (
    <TableContainer
      component={Paper}
      sx={{ width: "100%", maxHeight: "300px", overflowY: "auto" }}
    >
      <Table aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell align="center">Download</StyledTableCell>
            <StyledTableCell align="center">Name</StyledTableCell>
            <StyledTableCell align="center">Generated Time</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((item) => (
            <StyledTableRow key={item.name}>
              <StyledTableCell component="th" scope="row" align="center">
                <Checkbox
                  key={item.name}
                  id={item.name}
                  checked={checkItems[item.name] || false}
                  onChange={(e) =>
                    checkItemHandler(item.name, e.target.checked)
                  }
                />
              </StyledTableCell>
              <StyledTableCell align="center">{item.name}</StyledTableCell>
              <StyledTableCell align="center">
                {item.generated_time}
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  //For downloading
  const downloadSelectedStaffJSON = () => {
    const selectedStaff = Object.keys(staffCheckItems).filter(
      (key) => staffCheckItems[key]
    );
    const selectedStaffData = selectedStaff.reduce((acc, key) => {
      acc[key] = timetableData[key];
      return acc;
    }, {});
    downloadJSON(selectedStaffData, "selected_staff.json");
  };
  const downloadSelectedCohortJSON = () => {
    const selectedCohort = Object.keys(cohortCheckItems).filter(
      (key) => cohortCheckItems[key]
    );
    const selectedCohortData = selectedCohort.reduce((acc, key) => {
      acc[key] = timetableData[key];
      return acc;
    }, {});
    downloadJSON(selectedCohortData, "selected_cohort.json");
  };
  const downloadJSON = (data, filename) => {
    const json = JSON.stringify(data);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <NavbarAuth />
      <Container component="main" maxWidth="lg">
        <Typography component="h1" variant="h3" align="center" sx={{ mt: 10 }}>
          Manage timetables
        </Typography>
        <Container maxWidth="lg">
          <Container
            sx={{
              display: "flex",
              alignItems: "center",
              backgroundColor: "#000342",
              justifyContent: "space-between",
              height: "40px",
              mt: "50px",
            }}
          >
            <Typography
              component="p"
              variant="h5"
              align="center"
              sx={{ color: "white" }}
            >
              Staff
            </Typography>
            <Button
              variant="contained"
              component="label"
              sx={{
                backgroundColor: "#E9D524",
                "&:hover": {
                  backgroundColor: "#F4EA8E",
                },
                color: "black",
                height: "30px",
              }}
              onClick={downloadSelectedStaffJSON}
            >
              Download
            </Button>
          </Container>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              backgroundColor: "rgba(217, 217, 217, 0.3)",
              p: 3,
            }}
          >
            {renderTable(staffrow, staffCheckItems, staffCheckItemHandler)}
          </Box>
        </Container>
        <Container maxWidth="lg">
          <Container
            sx={{
              display: "flex",
              alignItems: "center",
              backgroundColor: "#000342",
              justifyContent: "space-between",
              height: "40px",
              mt: "50px",
            }}
          >
            <Typography
              component="p"
              variant="h5"
              align="center"
              sx={{ color: "white" }}
            >
              Cohort
            </Typography>
            <Button
              variant="contained"
              component="label"
              sx={{
                backgroundColor: "#E9D524",
                "&:hover": {
                  backgroundColor: "#F4EA8E",
                },
                color: "black",
                height: "30px",
              }}
              onClick={downloadSelectedCohortJSON}
            >
              Download
            </Button>
          </Container>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              backgroundColor: "rgba(217, 217, 217, 0.3)",
              p: 3,
            }}
          >
            {renderTable(cohortrow, cohortCheckItems, cohortCheckItemHandler)}
          </Box>
        </Container>
      </Container>
      <Footer />
    </div>
  );
}
