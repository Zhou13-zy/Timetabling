import React from "react";
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
import { apiCall } from "../utils/ApiCall";
import { useNavigate } from "react-router-dom";
import { UnAuthRedirect } from "../utils/UnAuthRedirect";
import Footer from "../components/Footer";

export default function CSVUploadUnitSession() {
  UnAuthRedirect();
  const navigate = useNavigate();
  const handleFileChange = (event) => {
    const newFile = event.target.files[0];
    if (newFile) {
      handleUpload(newFile);
    }
  };

  const headers = {
    Accept: "application/json",
    Origin: "http://localhost:3000",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  const handleUpload = async (file) => {
    const formData = new FormData();
    formData.append("unit_session_csv", file);
    const {
      statusCode,
      data: { message = "", error = "" },
    } = await apiCall("POST", headers, formData, "upload-unit-session-csv");
    if (statusCode === 200) {
      alert(message);
      navigate("/generate");
    } else {
      alert(error);
    }
  };

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
    "&:last-child td, &:last-child th": {
      border: 0,
    },
  }));

  const createData = (unitcode, sessionType, duration, capacity) => ({
    unitcode,
    sessionType,
    duration,
    capacity,
  });

  const rows = [
    createData("CNCO3002", "lab", 2, 40),
    createData("COMP6011", "lecture", 3, 100),
    createData("ISEC3007", "tutorial", 1.5, 30),
    createData("ISAD3000", "workshop", 2, 20),
    createData("COMP4002", "lab", 2, 50),
  ];

  return (
    <div>
      <NavbarAuth />
      <Container component="main" maxWidth="lg">
        <Typography component="h1" variant="h3" align="center" sx={{ mt: 10 }}>
          Upload Unit Session CSV file
        </Typography>
        <Typography
          component="h6"
          variant="h6"
          align="center"
          sx={{ mt: 3, fontSize: "17px" }}
        >
          Please upload your Unit Session CSV file
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            "& > *": { m: 2 },
          }}
        >
          <Button
            variant="contained"
            component="label"
            sx={{
              mt: 4,
              mb: 4,
              backgroundColor: "#E9D524",
              "&:hover": {
                backgroundColor: "#E9D524",
              },
              color: "black",
            }}
          >
            Upload File
            <input
              type="file"
              hidden
              accept=".csv"
              onChange={handleFileChange}
            />
          </Button>
          <Container maxWidth="lg">
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                backgroundColor: "rgba(217, 217, 217, 0.3)",
                p: 3,
              }}
            >
              <Typography
                component="h6"
                variant="h6"
                align="center"
                color="#3C39E3"
                sx={{ fontSize: "17px" }}
                gutterBottom
              >
                Ensure the UnitCode exists before uploading.
              </Typography>
              <Typography
                component="h6"
                variant="h6"
                align="center"
                color="#970000"
                sx={{ fontSize: "17px" }}
                gutterBottom
              >
                File Name needs to be: unit_session_csv.csv <br />
                The CSV file must have 4 Columns <br />
                that are UnitCode, Session_Type, Duration(hours), Capacity.
              </Typography>
              <TableContainer component={Paper} sx={{ width: "70%" }}>
                <Table aria-label="customized table">
                  <TableHead>
                    <TableRow>
                      <StyledTableCell align="center">UnitCode</StyledTableCell>
                      <StyledTableCell align="center">
                        Session Type
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        Duration (hours)
                      </StyledTableCell>
                      <StyledTableCell align="center">Capacity</StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows.map((row) => (
                      <StyledTableRow key={row.unitcode}>
                        <StyledTableCell
                          component="th"
                          scope="row"
                          align="center"
                        >
                          {row.unitcode}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          {row.sessionType}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          {row.duration}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          {row.capacity}
                        </StyledTableCell>
                      </StyledTableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Container>
        </Box>
      </Container>
      <Footer />
    </div>
  );
}
