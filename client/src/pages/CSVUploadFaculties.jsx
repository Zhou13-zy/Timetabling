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

export default function CSVUploadFaculties() {
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
    formData.append("faculty_csv", file);
    const {
      statusCode,
      data: { message = "", error = "" },
    } = await apiCall("POST", headers, formData, "upload-faculty-csv");
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

  const createData = (name) => ({
    name,
  });

  const rows = [
    createData("Faculty of Science"),
    createData("Faculty of Business"),
    createData("Faculty of Hum"),
    createData("Faculty of Engineering"),
    createData("Faculty of Art"),
  ];

  return (
    <div>
      <NavbarAuth />
      <Container component="main" maxWidth="lg">
        <Typography component="h1" variant="h3" align="center" sx={{ mt: 10 }}>
          Upload Faculties CSV file
        </Typography>
        <Typography
          component="h6"
          variant="h6"
          align="center"
          sx={{ mt: 3, fontSize: "17px" }}
        >
          Please upload your Faculties CSV file
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
                color="#970000"
                sx={{ fontSize: "17px" }}
                gutterBottom
              >
                File Name needs to be: faculty_csv.csv <br />
                The CFS CSV file must have 1 Column that is <br />
                Name
              </Typography>
              <TableContainer component={Paper} sx={{ width: "70%" }}>
                <Table aria-label="customized table">
                  <TableHead>
                    <TableRow>
                      <StyledTableCell>Name</StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows.map((row) => (
                      <StyledTableRow key={row.name}>
                        <StyledTableCell component="th" scope="row">
                          {row.name}
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
      <Footer/>
    </div>
  );
}
