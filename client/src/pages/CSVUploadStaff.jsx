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

export default function CSVUploadStaff() {
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
    formData.append("staff_csv", file);
    const {
      statusCode,
      data: { message = "", error = "" },
    } = await apiCall("POST", headers, formData, "upload-staff-csv");
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

  const createData = (firstname, lastname, email, discipline) => ({
    firstname,
    lastname,
    email,
    discipline,
  });

  const rows = [
    createData("Leon", "Kenndy", "testlast@gmail.com", "Discipline of Biology"),
    createData(
      "Chris",
      "Redfield",
      "test2last2@gmail.com",
      "Discipline of Science"
    ),
    createData(
      "Mark",
      "Menro",
      "test3last3@gmail.com",
      "Discipline of Philosophy"
    ),
  ];

  return (
    <div>
      <NavbarAuth />
      <Container component="main" maxWidth="lg">
        <Typography component="h1" variant="h3" align="center" sx={{ mt: 10 }}>
          Upload Staff CSV file
        </Typography>
        <Typography
          component="h6"
          variant="h6"
          align="center"
          sx={{ mt: 3, fontSize: "17px" }}
        >
          Please upload your Staff CSV file
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
                Please ensure that the disciplineId required for the Staff exist
                <br />
                in the Disciplines table before uploading.
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
                File Name needs to be: staff_csv.csv <br />
                The CFS CSV file must have 4 Columns that are <br />
                FirstName, LastName, email, and Discipline
              </Typography>
              <TableContainer component={Paper} sx={{ width: "70%" }}>
                <Table aria-label="customized table">
                  <TableHead>
                    <TableRow>
                      <StyledTableCell>FirstName</StyledTableCell>
                      <StyledTableCell align="center">LastName</StyledTableCell>
                      <StyledTableCell align="center">email</StyledTableCell>
                      <StyledTableCell align="center">
                        Discipline
                      </StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows.map((row) => (
                      <StyledTableRow key={row.firstname}>
                        <StyledTableCell component="th" scope="row">
                          {row.firstname}
                        </StyledTableCell>
                        <StyledTableCell align="right">
                          {row.lastname}
                        </StyledTableCell>
                        <StyledTableCell align="right">
                          {row.email}
                        </StyledTableCell>
                        <StyledTableCell align="right">
                          {row.discipline}
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
