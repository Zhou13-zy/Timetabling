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

export default function CSVUploadCFS() {
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
    formData.append("cfs_csv", file);
    const {
      statusCode,
      data: { message = "", error = "" },
    } = await apiCall("POST", headers, formData, "upload-cfs-csv");
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
    // hide last border
    "&:last-child td, &:last-child th": {
      border: 0,
    },
  }));

  const createData = (set, reftype, cohortname, staffname) => ({
    set,
    reftype,
    cohortname,
    staffname,
  });

  const rows = [
    createData("COMP1111,COMP2222,COMP3333", "cohort", "Cohort2021", " "),
    createData("COMP4444,COMP5555,COMP6666", "cohort", "Cohort2024", " "),
    createData("COMP7777,COMP8888,COMP9999", "cohort", "Cohort2022", " "),
    createData("COMP0000,COMP1212,COMP1313", "cohort", "Cohort2026", " "),
    createData("ISAD3000,COMP7777", "staff", " ", "Nikola Tesla"),
    createData("COMP6006,COMP1234", "staff", " ", "Isac Newton"),
  ];

  return (
    <div>
      <NavbarAuth />
      <Container component="main" maxWidth="lg">
        <Typography component="h1" variant="h3" align="center" sx={{ mt: 10 }}>
          Upload Clash_Free_Set CSV file
        </Typography>
        <Typography
          component="h6"
          variant="h6"
          align="center"
          sx={{ mt: 3, fontSize: "17px" }}
        >
          Please upload your Clash_Free_Set CSV file
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
                Please ensure that the cohortId and staffId required for the
                clash-free set exist <br />
                in the Cohorts and Staff tables respectively before uploading.
                <br />
              </Typography>
              <Typography
                component="h6"
                variant="h6"
                align="center"
                color="#970000"
                sx={{ fontSize: "17px" }}
                gutterBottom
              >
                File Name needs to be: cfs_csv.csv <br />
                The CFS CSV file must have 4 Columns that are <br />
                set, ref_type, cohortName, and staffName
              </Typography>
              <TableContainer component={Paper} sx={{ width: "70%" }}>
                <Table aria-label="customized table">
                  <TableHead>
                    <TableRow>
                      <StyledTableCell>set</StyledTableCell>
                      <StyledTableCell align="center">ref_type</StyledTableCell>
                      <StyledTableCell align="center">
                        cohortName
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        staffName
                      </StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows.map((row) => (
                      <StyledTableRow key={row.set}>
                        <StyledTableCell component="th" scope="row">
                          {row.set}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {row.reftype}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {row.cohortname}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {row.staffname}
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
