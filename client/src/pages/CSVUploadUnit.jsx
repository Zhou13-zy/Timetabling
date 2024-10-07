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

export default function CSVUploadUnit() {
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
    // Append the file with the key as expected by the Flask endpoint ('csv_file')
    formData.append("unit_csv", file);
    const {
      statusCode,
      data: { message = "", error = "" },
    } = await apiCall("POST", headers, formData, "upload-unit-csv");
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

  const createData = (unitcode, name, credit, uc, discipline, unotquota) => ({
    unitcode,
    name,
    credit,
    uc,
    discipline,
    unotquota,
  });

  const rows = [
    createData(
      "COMP6011",
      "Advanced Artificial Intelligence Research Topics",
      25,
      "Albert Einstein",
      "Discipline of Biology",
      100
    ),
    createData(
      "COMP4002",
      "Extended Distributed Computing",
      25,
      "Isaac Newton",
      "Discipline of Mechanical Engineering",
      200
    ),
    createData(
      "ISAD3000",
      "Capstone Computing Project 1",
      25,
      "Nikola Tesla",
      "Discipline of Finance",
      100
    ),
    createData(
      "ISEC3007",
      "Cyber Security Project 2",
      25,
      "Hannes Herrmann",
      "Discipline of Computing",
      150
    ),
    createData(
      "CNCO2000",
      "Computer Communications",
      25,
      "Ling Li",
      "Discipline of Finance",
      100
    ),
  ];

  return (
    <div>
      <NavbarAuth />
      <Container component="main" maxWidth="lg">
        <Typography component="h1" variant="h3" align="center" sx={{ mt: 10 }}>
          Upload Unit CSV file
        </Typography>
        <Typography
          component="h6"
          variant="h6"
          align="center"
          sx={{ mt: 3, fontSize: "17px" }}
        >
          Please upload your Unit CSV file
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
                Please ensure that the disciplineId and staffId required for the
                Unit exist
                <br />
                in the Disciplines and Staff tables respectively before
                uploading.
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
                File Name needs to be: unit_csv.csv <br />
                The Unit CSV file must have 6 Columns <br />
                that are UnitCode, Name, Credit, UC, Discipline and Unit_Quota.
              </Typography>
              <TableContainer component={Paper} sx={{ width: "70%" }}>
                <Table aria-label="customized table">
                  <TableHead>
                    <TableRow>
                      <StyledTableCell align="center">UnitCode</StyledTableCell>
                      <StyledTableCell align="center">Name</StyledTableCell>
                      <StyledTableCell align="center">Credit</StyledTableCell>
                      <StyledTableCell align="center">UC</StyledTableCell>
                      <StyledTableCell align="center">
                        Discipline
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        Unit_Quota
                      </StyledTableCell>
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
                        <StyledTableCell align="right">
                          {row.name}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          {row.credit}
                        </StyledTableCell>
                        <StyledTableCell align="left">{row.uc}</StyledTableCell>
                        <StyledTableCell align="left">
                          {row.discipline}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {row.unotquota}
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
