import React, { useState, useEffect } from "react";
import {
  Typography,
  Button,
  Modal,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import styles from "../../App.module.css";
import { apiCall } from "../../utils/ApiCall";
export default function DisciplinesTab({ disciplineData, setDisciplineData }) {
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [newDiscipline, setNewDiscipline] = useState("");
  const [facultyData, setFacultyData] = useState([]);
  const [editDiscipline, setEditDiscipline] = useState(null);
  const [selectedFacultyId, setSelectedFacultyId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  useEffect(() => {
    getFaculty();
  }, []);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setNewDiscipline("");
    setSelectedFacultyId("");
    setErrorMessage("");
  };
  const handleEditOpen = (discipline) => {
    setEditDiscipline(discipline);
    setSelectedFacultyId(discipline.facultyId);
    setNewDiscipline(discipline.name);
    setEditOpen(true);
  };
  const handleEditClose = () => {
    setEditOpen(false);
    setEditDiscipline(null);
    setNewDiscipline("");
    setSelectedFacultyId("");
    setErrorMessage("");
  };
  const handleAddDiscipline = async () => {
    const newDisciplineData = {
      name: "Discipline of " + newDiscipline,
      facultyId: selectedFacultyId,
    };
    try {
      const response = await apiCall(
        "POST",
        {},
        newDisciplineData,
        "add_discipline"
      );
      if (response.statusCode === 201) {
        setDisciplineData((prevData) => [...prevData, response.data.data]);
        handleClose();
      } else {
        setErrorMessage(response.message || "Failed to add discipline.");
      }
    } catch (error) {
      setErrorMessage("An error occurred while adding discipline.");
    }
  };
  const getFaculty = async () => {
    try {
      const { data } = await apiCall("GET", {}, {}, "faculties");
      setFacultyData(data.data);
    } catch (error) {
      //console.error("Failed to fetch faculty data");
    }
  };
  const handleFacultyChange = (e) => {
    setSelectedFacultyId(e.target.value);
  };
  const handleEditDiscipline = async () => {
    const updatedDiscipline = {
      id: editDiscipline.id,
      name: newDiscipline,
      facultyId: selectedFacultyId,
    };
    try {
      const response = await apiCall(
        "PUT",
        {},
        updatedDiscipline,
        `edit_discipline/${editDiscipline.id}`
      );
      if (response.statusCode === 200) {
        setDisciplineData((prevData) =>
          prevData.map((disc) =>
            disc.id === editDiscipline.id ? response.data.data : disc
          )
        );
        handleEditClose();
      } else {
        setErrorMessage(response.message || "Failed to edit discipline.");
      }
    } catch (error) {
      setErrorMessage("An error occurred while editing discipline.");
    }
  };

  if (!disciplineData || disciplineData.length === 0) {
    return <div>No Discipline available</div>;
  }
  return (
    <div className={styles.cardSection}>
      <div className={styles.managepagefirstRowContainer}>
        <Typography variant="h6">
          Total Disciplines: {disciplineData.length}
        </Typography>
        {/* Add btn */}
        <Button variant="contained" color="primary" onClick={handleOpen}>
          Add Discipline
        </Button>
      </div>
      <div className={styles.facultyContainer}>
        {facultyData.map((faculty) => (
          <div key={faculty.id} className={styles.facultyBox}>
            <Typography variant="h6" className={styles.facultyTitle}>
              {faculty.name}
            </Typography>
            <div className={styles.disciplineContainer}>
              {disciplineData
                .filter((discipline) => discipline.facultyId === faculty.id)
                .map((discipline) => (
                  <div key={discipline.id} className={styles.homepageBox}>
                    <p>{discipline.name}</p>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => handleEditOpen(discipline)}
                    >
                      Edit
                    </Button>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
      {/* Edit Modal */}
      <Modal open={editOpen} onClose={handleEditClose}>
        <Box
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "white",
            padding: "20px",
            boxShadow: 24,
            borderRadius: "8px",
            minWidth: "300px",
          }}
        >
          <Typography variant="h6" component="h2">
            Edit Discipline
          </Typography>
          <TextField
            label="Discipline Name"
            value={newDiscipline}
            onChange={(e) => setNewDiscipline(e.target.value)}
            fullWidth
            style={{ marginBottom: "10px" }}
          />
          <FormControl fullWidth style={{ marginBottom: "10px" }}>
            <InputLabel>Faculty</InputLabel>
            <Select
              value={selectedFacultyId}
              onChange={handleFacultyChange}
              label="Faculty"
            >
              {facultyData.map((faculty) => (
                <MenuItem key={faculty.id} value={faculty.id}>
                  {faculty.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {errorMessage && (
            <Typography
              variant="body2"
              color="error"
              style={{ marginBottom: "10px" }}
            >
              {errorMessage}
            </Typography>
          )}
          <Box mt={3} display="flex" justifyContent="flex-end">
            <Button
              onClick={handleEditDiscipline}
              variant="contained"
              color="primary"
              disabled={!newDiscipline || !selectedFacultyId}
            >
              Save Changes
            </Button>
            <Button
              onClick={handleEditClose}
              variant="outlined"
              style={{ marginLeft: "10px" }}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>
      {/* Modal for adding discipline */}
      <Modal open={open} onClose={handleClose}>
        <Box
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "white",
            padding: "20px",
            boxShadow: 24,
            borderRadius: "8px",
            minWidth: "300px",
          }}
        >
          <Typography variant="h6" component="h2">
            Add New Discipline
          </Typography>
          <TextField
            label="Discipline Name"
            value={newDiscipline}
            onChange={(e) => setNewDiscipline(e.target.value)}
            fullWidth
            style={{ marginBottom: "10px" }}
          />
          <FormControl fullWidth style={{ marginBottom: "10px" }}>
            <InputLabel>Faculty</InputLabel>
            <Select
              value={selectedFacultyId}
              onChange={handleFacultyChange}
              label="Faculty"
            >
              {facultyData.map((faculty) => (
                <MenuItem key={faculty.id} value={faculty.id}>
                  {faculty.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {errorMessage && (
            <Typography
              variant="body2"
              color="error"
              style={{ marginBottom: "10px" }}
            >
              {errorMessage}
            </Typography>
          )}
          <Box mt={3} display="flex" justifyContent="flex-end">
            <Button
              onClick={handleAddDiscipline}
              variant="contained"
              color="primary"
              disabled={!newDiscipline || !selectedFacultyId}
            >
              Add
            </Button>
            <Button
              onClick={handleClose}
              variant="outlined"
              style={{ marginLeft: "10px" }}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}
