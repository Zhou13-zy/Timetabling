import React, { useState } from "react";
import {
  Button,
  Typography,
  Divider,
  Modal,
  Box,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import styles from "../../App.module.css";
import { apiCall } from "../../utils/ApiCall";

export default function UnitSessionTab({
  unitSessionData,
  setUnitSessionData,
  unitData,
}) {
  const [openEdit, setOpenEdit] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [selectedSession, setSelectedSession] = useState(null);
  const [formData, setFormData] = useState({
    duration_hours: "",
    capacity: "",
    equipment_type: "",
    session_type: "",
    unit_id: "",
  });

  const equipmentOptions = [null, "computer", "projector"];

  const handleOpenModal = (session) => {
    setSelectedSession(session);

    setFormData({
      duration_hours: session.duration_hours,
      capacity: session.capacity,
      equipment_type: session.equipment_type[0] || null, // Use the first item or null
      session_type: session.session_type || null,
    });
    setOpenEdit(true);
  };

  const handleCloseModal = () => {
    setOpenEdit(false);
    setSelectedSession(null);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleOpenAddModal = () => {
    setFormData({
      duration_hours: "",
      capacity: "",
      equipment_type: "",
      session_type: "",
      unit_id: "",
    });
    setOpenAdd(true);
  };

  const handleCloseAddModal = () => {
    setOpenAdd(false);
    setErrorMessage("");
    setSuccessMessage("");
  };
  const handleAddUnitSession = async () => {
    try {
      const response = await apiCall(
        "POST",
        {},
        formData,
        "create_unit_session"
      );

      if (response.statusCode === 201) {
        setUnitSessionData((prevData) => [...prevData, response.data.data]);
        //setSuccessMessage("Unit session added successfully!");
        handleCloseAddModal();
      } else {
        setErrorMessage(response.message || "Failed to add unit session.");
      }
    } catch (error) {
      setErrorMessage("An error occurred while adding unit session.");
    }
  };

  const handleEditUnitSession = async () => {
    try {
      const response = await apiCall(
        "PUT",
        {},
        formData,
        `unit_session/${selectedSession.id}`
      );

      if (response.statusCode === 200) {
        setUnitSessionData((prevData) =>
          prevData.map((unitSession) =>
            unitSession.id === selectedSession.id
              ? response.data.data
              : unitSession
          )
        );
        handleCloseModal(); // Close the modal after successful update
      } else {
        setErrorMessage(response.message || "Failed to update unit session.");
      }
    } catch (error) {
      setErrorMessage("An error occurred while updating unit session.");
    }
  };

  const handleEquipmentChange = (e) => {
    setFormData({
      ...formData,
      equipment_type: e.target.value, // Update the equipment type
    });
  };

  if (!unitSessionData || unitSessionData.length === 0) {
    return <div>No Unit Sessions available</div>;
  }

  const groupedByUnitId = unitSessionData.reduce((acc, session) => {
    if (!acc[session.unit_id]) {
      acc[session.unit_id] = [];
    }
    acc[session.unit_id].push(session);
    return acc;
  }, {});

  return (
    <div className={styles.cardSection}>
      <div className={styles.managepagefirstRowContainer}>
        <Typography variant="h6">
          Total Unit Sessions: {unitSessionData.length}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleOpenAddModal}
        >
          Add Unit Session
        </Button>
      </div>
      <Grid container spacing={3} className={styles.managepageContainer}>
        {Object.keys(groupedByUnitId).map((unitId) => (
          <Grid item xs={12} md={6} lg={4} key={unitId}>
            <Card className={styles.managepageBox}>
              <CardContent>
                <Typography variant="h6">
                  Unit Code: {groupedByUnitId[unitId][0].unit_code}
                </Typography>
                <Divider style={{ margin: "10px 0" }} />
                {groupedByUnitId[unitId].map((session, index) => (
                  <div key={index} className={styles.sessionDetails}>
                    <Typography
                      variant="subtitle1"
                      className={styles.sessionType}
                    >
                      {session.session_type}
                    </Typography>
                    <div className={styles.sessionInfo}>
                      <Typography variant="body2">
                        <strong>Duration:</strong> {session.duration_hours}{" "}
                        hr(s)
                      </Typography>
                      <Typography variant="body2">
                        <strong>Capacity:</strong> {session.capacity}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Equipment:</strong>{" "}
                        {Array.isArray(session.equipment_type) &&
                        session.equipment_type.length === 0
                          ? "none"
                          : Array.isArray(session.equipment_type)
                          ? session.equipment_type.join(", ")
                          : session.equipment_type}
                      </Typography>
                      <Button
                        onClick={() => handleOpenModal(session)}
                        size="small"
                        color="primary"
                      >
                        Edit
                      </Button>
                    </div>
                    <Divider style={{ margin: "10px 0" }} />
                  </div>
                ))}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Modal for editing UnitSession */}
      <Modal open={openEdit} onClose={handleCloseModal}>
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
          <Typography variant="h6">Edit Unit Session</Typography>
          <TextField
            label="Duration (hours)"
            name="duration_hours"
            type="number"
            value={formData.duration_hours}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Capacity"
            name="capacity"
            type="number"
            value={formData.capacity}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Equipment Type"
            name="equipment_type"
            value={formData.equipment_type}
            onChange={handleEquipmentChange}
            select
            fullWidth
            margin="normal"
          >
            {equipmentOptions.map((option, index) => (
              <MenuItem key={index} value={option}>
                {option === null
                  ? "None"
                  : option.charAt(0).toUpperCase() + option.slice(1)}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Session Type"
            name="session_type"
            value={formData.session_type}
            onChange={handleInputChange}
            select
            fullWidth
            margin="normal"
          >
            <MenuItem value="lecture">Lecture</MenuItem>
            <MenuItem value="tutorial">Tutorial</MenuItem>
            <MenuItem value="lab">Lab</MenuItem>
            <MenuItem value="workshop">Workshop</MenuItem>
          </TextField>
          <Box mt={3} display="flex" justifyContent="flex-end">
            <Button
              onClick={handleEditUnitSession}
              variant="contained"
              color="primary"
              disabled={
                !formData.duration_hours ||
                !formData.capacity ||
                !formData.session_type
              }
            >
              Save Changes
            </Button>
            <Button
              onClick={handleCloseModal}
              variant="outlined"
              style={{ marginLeft: "10px" }}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>
      {/* Add Unit Session Modal */}
      <Modal open={openAdd} onClose={handleCloseAddModal}>
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
          <Typography variant="h6">Add Unit Session</Typography>
          <TextField
            label="Duration (hours)"
            name="duration_hours"
            value={formData.duration_hours}
            onChange={handleInputChange}
            fullWidth
            type="number"
            margin="normal"
          />
          <TextField
            label="Capacity"
            name="capacity"
            value={formData.capacity}
            onChange={handleInputChange}
            fullWidth
            type="number"
            margin="normal"
          />
          <TextField
            label="Equipment Type"
            name="equipment_type"
            value={formData.equipment_type}
            onChange={handleInputChange}
            select
            fullWidth
            margin="normal"
          >
            {equipmentOptions.map((option, index) => (
              <MenuItem key={index} value={option}>
                {option === null
                  ? "None"
                  : option.charAt(0).toUpperCase() + option.slice(1)}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Session Type"
            name="session_type"
            value={formData.session_type}
            onChange={handleInputChange}
            select
            fullWidth
            margin="normal"
          >
            <MenuItem value="lecture">Lecture</MenuItem>
            <MenuItem value="tutorial">Tutorial</MenuItem>
            <MenuItem value="lab">Lab</MenuItem>
            <MenuItem value="workshop">Workshop</MenuItem>
          </TextField>
          <TextField
            label="Unit"
            name="unit_id"
            value={formData.unit_id}
            onChange={handleInputChange}
            required
            select
            fullWidth
            margin="normal"
          >
            {unitData.map((unit) => (
              <MenuItem key={unit.id} value={unit.id}>
                {unit.id}{" "}
                {/* Adjust according to the property name for unit display */}
              </MenuItem>
            ))}
          </TextField>
          <Box mt={3} display="flex" justifyContent="flex-end">
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddUnitSession}
              disabled={
                !formData.duration_hours ||
                !formData.capacity ||
                !formData.session_type ||
                !formData.unit_id
              }
            >
              Add Session
            </Button>
            <Button
              onClick={handleCloseAddModal}
              variant="outlined"
              style={{ marginLeft: "10px" }}
            >
              Cancel
            </Button>
          </Box>
          {errorMessage && (
            <Typography color="error">{errorMessage}</Typography>
          )}
          {successMessage && (
            <Typography color="success">{successMessage}</Typography>
          )}
        </Box>
      </Modal>
    </div>
  );
}
