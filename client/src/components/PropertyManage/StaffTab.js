import React, { useState } from "react";
import {
  Typography,
  Button,
  MenuItem,
  TextField,
  FormControl,
  InputLabel,
  Modal,
  Box,
  Select,
} from "@mui/material";
import { apiCall } from "../../utils/ApiCall";
import styles from "../../App.module.css";

export default function StaffTab({ staffData, disciplineData, setStaffData }) {
  const [open, setOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  //const [newStaff, setNewStaff] = useState("");
  const [selectedDiscipline, setSelectedDiscipline] = useState("");
  const [newStaffFirstName, setNewStaffFirstName] = useState("");
  const [newStaffLastName, setNewStaffLastName] = useState("");
  const [newStaffEmail, setNewStaffEmail] = useState("");
  const [editOpen, setEditOpen] = useState(false);
  const [editStaff, setEditStaff] = useState({
    id: "",
    firstname: "",
    lastname: "",
    email: "",
    disciplineId: "",
  });

  const isValidEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setErrorMessage("");
    setNewStaffFirstName("");
    setNewStaffLastName("");
    setNewStaffEmail("");
    setSelectedDiscipline("");
  };
  const handleEditOpen = (staff) => {
    setEditStaff({
      id: staff.id,
      firstname: staff.firstname,
      lastname: staff.lastname,
      email: staff.email,
      disciplineId: staff.disciplineId,
    });
    setEditOpen(true);
  };

  const handleEditClose = () => {
    setEditOpen(false);
    setErrorMessage("");
  };

  const handleEditStaff = async () => {
    const updatedStaffData = {
      firstname: editStaff.firstname,
      lastname: editStaff.lastname,
      email: editStaff.email,
      disciplineId: editStaff.disciplineId,
    };

    try {
      const response = await apiCall(
        "PUT",
        {},
        updatedStaffData,
        `update_staff/${editStaff.id}`
      );
      if (response.statusCode === 200) {
        setStaffData((prevData) =>
          prevData.map((staff) =>
            staff.id === editStaff.id ? response.data.data : staff
          )
        );
        handleEditClose();
      } else {
        setErrorMessage(response.message || "Failed to update staff.");
      }
    } catch (error) {
      setErrorMessage("An error occurred while updating staff. ");
    }
  };

  const handleAddStaff = async () => {
    const newStaffData = {
      firstname: newStaffFirstName,
      lastname: newStaffLastName,
      email: newStaffEmail,
      disciplineId: selectedDiscipline,
    };
    try {
      const response = await apiCall("POST", {}, newStaffData, "add_staff");
      if (response.statusCode === 201) {
        setStaffData((prevData) => [...prevData, response.data.data]);
        handleClose();
      } else {
        setErrorMessage(response.message || "Failed to add staff.");
      }
    } catch (error) {
      setErrorMessage("An error occurred while adding staff.");
    }
  };

  if (!staffData || staffData.length === 0) {
    return <div>No Staff available</div>;
  }
  return (
    <div className={styles.cardSection}>
      <div className={styles.managepagefirstRowContainer}>
        <Typography variant="h6">Total Staff: {staffData.length}</Typography>
        <Button variant="contained" color="primary" onClick={handleOpen}>
          Add Staff
        </Button>
      </div>
      <div className={styles.managepageContainer}>
        {staffData.map((staff) => (
          <div key={staff.id} className={styles.homepageBox}>
            <h3>{`${staff.firstname} ${staff.lastname}`}</h3>
            <h5>Discipline: {staff.discipline}</h5>
            <p>Email: {staff.email}</p>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => handleEditOpen(staff)}
            >
              Edit
            </Button>
          </div>
        ))}
      </div>
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
            Add New Staff
          </Typography>
          <TextField
            label="Staff First Name"
            value={newStaffFirstName}
            onChange={(e) => setNewStaffFirstName(e.target.value)}
            fullWidth
            style={{ marginBottom: "10px" }}
          />
          <TextField
            label="Staff Second Name"
            value={newStaffLastName}
            onChange={(e) => setNewStaffLastName(e.target.value)}
            fullWidth
            style={{ marginBottom: "10px" }}
          />
          <TextField
            label="Staff Email"
            type="email"
            value={newStaffEmail}
            onChange={(e) => setNewStaffEmail(e.target.value)}
            fullWidth
            error={!isValidEmail(newStaffEmail)}
            helperText={
              !isValidEmail(newStaffEmail) &&
              "Email must be in the correct format"
            }
            style={{ marginBottom: "10px" }}
          />
          <FormControl fullWidth style={{ marginBottom: "10px" }}>
            <InputLabel>Disciplines</InputLabel>
            <Select
              value={selectedDiscipline}
              onChange={(e) => setSelectedDiscipline(e.target.value)}
            >
              {disciplineData.map((discipline) => (
                <MenuItem key={discipline.id} value={discipline.id}>
                  {discipline.name}
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
              onClick={handleAddStaff}
              variant="contained"
              color="primary"
              disabled={
                !newStaffFirstName ||
                !newStaffLastName ||
                !newStaffEmail ||
                !selectedDiscipline
              }
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
            Edit Staff
          </Typography>
          <TextField
            label="Staff First Name"
            value={editStaff.firstname}
            onChange={(e) =>
              setEditStaff({ ...editStaff, firstname: e.target.value })
            }
            fullWidth
            style={{ marginBottom: "10px" }}
          />
          <TextField
            label="Staff Last Name"
            value={editStaff.lastname}
            onChange={(e) =>
              setEditStaff({ ...editStaff, lastname: e.target.value })
            }
            fullWidth
            style={{ marginBottom: "10px" }}
          />
          <TextField
            label="Staff Email"
            type="email"
            value={editStaff.email}
            onChange={(e) =>
              setEditStaff({ ...editStaff, email: e.target.value })
            }
            fullWidth
            error={!isValidEmail(editStaff.email)}
            helperText={
              !isValidEmail(editStaff.email) &&
              "Email must be in the correct format"
            }
            style={{ marginBottom: "10px" }}
          />
          <FormControl fullWidth style={{ marginBottom: "10px" }}>
            <InputLabel>Disciplines</InputLabel>
            <Select
              value={editStaff.disciplineId}
              onChange={(e) =>
                setEditStaff({ ...editStaff, disciplineId: e.target.value })
              }
            >
              {disciplineData.map((discipline) => (
                <MenuItem key={discipline.id} value={discipline.id}>
                  {discipline.name}
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
              onClick={handleEditStaff}
              variant="contained"
              color="primary"
              disabled={
                !editStaff.firstname ||
                !editStaff.lastname ||
                !editStaff.email ||
                !editStaff.disciplineId
              }
            >
              Save
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
    </div>
  );
}
