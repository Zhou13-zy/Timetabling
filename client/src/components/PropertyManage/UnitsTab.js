import React, { useState } from "react";
import {
  Button,
  Typography,
  Modal,
  Box,
  FormControl,
  TextField,
  Divider,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import styles from "../../App.module.css";
import { apiCall } from "../../utils/ApiCall";
import { useNavigate } from "react-router-dom";

export default function UnitsTab({
  unitData,
  setUnitData,
  disciplineData,
  staffData,
}) {
  const [openModal, setOpenModal] = useState(false);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [currentItem, setCurrentItem] = useState({});
  const [unitName, setUnitName] = useState("");
  const [unitCode, setUnitCode] = useState("");
  const [quota, setQuota] = useState("");
  const [credit, setCredit] = useState("");
  const [disciplineId, setDisciplineId] = useState("");
  const [staffId, setStaffId] = useState("");
  const navigate = useNavigate();

  // Edit Modal
  const handleOpenModal = (unit) => {
    setCurrentItem(unit);
    setUnitName(unit.title);
    setQuota(unit.quota);
    setCredit(unit.credit);
    setUnitCode(unit.code);
    setOpenModal(true);
  };
  const handleCloseModal = () => {
    setOpenModal(false);
  };
  const handleOpenAddModal = () => {
    setUnitName("");
    setUnitCode("");
    setQuota("");
    setCredit("");
    setDisciplineId("");
    setStaffId("");
    setOpenAddModal(true);
  };
  const handleCloseAddModal = () => {
    setOpenAddModal(false);
  };
  const handleSaveChanges = async () => {
    try {
      let updatedData = {
        name: unitName,
        code: unitCode,
        quota: quota,
        credit: credit,
      };
      console.log(updatedData);
      const response = await apiCall(
        "PUT",
        {},
        updatedData,
        `unit/${currentItem.id}`
      );
      if (response.statusCode === 200) {
        alert("Unit updated successfully");
        setUnitData((prevData) =>
          prevData.map((unit) =>
            unit.id === currentItem.id ? { ...unit, ...updatedData } : unit
          )
        );
        handleCloseModal();
      } else {
        alert("Failed to update unit: " + response.error);
      }
    } catch (error) {
      console.error("Error updating unit:", error);
      alert("An error occurred while updating unit.");
    }
  };
  // Add new unit
  const handleAddUnit = async () => {
    try {
      let newUnitData = {
        name: unitName,
        unitCode: unitCode,
        quota: quota,
        credit: credit,
        disciplineId: disciplineId,
        staffId: staffId,
      };
      console.log(newUnitData);
      const response = await apiCall("POST", {}, newUnitData, "add_unit");
      if (response.statusCode === 201) {
        alert("Unit added successfully");
        const addedUnit = {
          ...response.data.unit,
          title: unitName,
          code: unitCode,
        };
        setUnitData((prevData) => [...prevData, addedUnit]);
        handleCloseAddModal();
      } else {
        alert("Failed to add unit: " + response.error);
      }
    } catch (error) {
      console.error("Error adding unit:", error);
      alert("An error occurred while adding unit.");
    }
  }; //console.log(groupedByUnitId);
  if (!unitData || unitData.length === 0) {
    return <div>No Unit available</div>;
  }
  return (
    <div className={styles.cardSection}>
      <div className={styles.managepagefirstRowContainer}>
        <Typography variant="h6">Total Units: {unitData?.length}</Typography>
        <Button
          className={styles.scheduleButton}
          variant="contained"
          color="primary"
          onClick={handleOpenAddModal}
          style={{ marginBottom: "20px", marginLeft: "10px" }}
        >
          Add Unit
        </Button>
        <Button
          className={styles.scheduleButton}
          variant="contained"
          color="primary"
          onClick={() => navigate("/schedule-by-unit")}
          style={{ marginBottom: "20px" }}
        >
          Scheduled Sessions
        </Button>
      </div>
      <div className={styles.managepageContainer}>
        {unitData.map((unit) => (
          <div key={unit.id} className={styles.managepageBox}>
            <h3>
              {unit.code} - {unit.title}
            </h3>
            <p>Credit: {unit.credit}</p>
            <p>Quota: {unit.quota}</p>
            <Divider style={{ margin: "10px 0" }} />
            {unit.sessions && unit.sessions.length > 0 ? (
              unit.sessions.map((session, index) => (
                <div key={index} className={styles.sessionDetails}>
                  <span className={styles.sessionType}>
                    {session.type.toUpperCase()}
                  </span>
                  <div className={styles.sessionInfo}>
                    <span>Duration: {session.duration_hours} hr(s)</span>
                    <span>Cap: {session.capacity}</span>
                  </div>
                </div>
              ))
            ) : (
              <p>Unit session is not assigned yet</p>
            )}
            <Divider style={{ margin: "10px 0" }} />
            <Button
              className={styles.editButton}
              onClick={() => handleOpenModal(unit)} // Edit Modal
            >
              Edit
            </Button>
          </div>
        ))}
      </div>
      {/* Edit Modal */}
      <Modal open={openModal} onClose={handleCloseModal}>
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
            Edit Unit
          </Typography>
          <TextField
            label="Code"
            value={unitCode}
            onChange={(e) => setUnitCode(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Name"
            value={unitName}
            onChange={(e) => setUnitName(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Quota"
            type="number"
            value={quota}
            onChange={(e) => setQuota(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Credit"
            type="number"
            value={credit}
            onChange={(e) => setCredit(e.target.value)}
            fullWidth
            margin="normal"
          />
          <Button
            variant="contained"
            onClick={handleSaveChanges}
            fullWidth
            disabled={!unitCode || !unitName || !quota || !credit}
          >
            Save
          </Button>
          <Button
            onClick={handleCloseModal}
            variant="outlined"
            color="secondary"
            fullWidth
            style={{ marginTop: "10px" }}
          >
            Cancel
          </Button>
        </Box>
      </Modal>
      {/* Add Modal */}
      <Modal open={openAddModal} onClose={handleCloseAddModal}>
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
            Add Unit
          </Typography>
          <TextField
            label="Code"
            value={unitCode}
            onChange={(e) => setUnitCode(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Name"
            value={unitName}
            onChange={(e) => setUnitName(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Quota"
            type="number"
            value={quota}
            onChange={(e) => setQuota(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Credit"
            type="number"
            value={credit}
            onChange={(e) => setCredit(e.target.value)}
            fullWidth
            margin="normal"
          />
          {/* Discipline*/}
          <FormControl fullWidth margin="normal">
            <InputLabel id="select-discipline-label">Discipline</InputLabel>
            <Select
              labelId="select-discipline-label"
              value={disciplineId}
              onChange={(e) => setDisciplineId(e.target.value)}
            >
              {disciplineData.map((discipline) => (
                <MenuItem key={discipline.id} value={discipline.id}>
                  {discipline.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {/* Staff  */}
          <FormControl fullWidth margin="normal">
            <InputLabel id="select-staff-label">Staff</InputLabel>
            <Select
              labelId="select-staff-label"
              value={staffId}
              onChange={(e) => setStaffId(e.target.value)}
            >
              {staffData.map((staff) => (
                <MenuItem key={staff.id} value={staff.id}>
                  {staff.firstname} {staff.lastname}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            onClick={handleAddUnit}
            variant="contained"
            fullWidth
            disabled={
              !unitCode ||
              !unitName ||
              !quota ||
              !credit ||
              !disciplineId ||
              !staffId
            }
          >
            Add
          </Button>
          <Button
            onClick={handleCloseAddModal}
            variant="outlined"
            color="secondary"
            fullWidth
            style={{ marginTop: "10px" }}
          >
            Cancel
          </Button>
        </Box>
      </Modal>
    </div>
  );
}
