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
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useTimetable } from "../../utils/TimetableContext";
import styles from "../../App.module.css";
import { apiCall } from "../../utils/ApiCall";
export default function SessionTab({
  sessionData,
  unitData,
  venueData,
  staffData,
  unitSessionData,
  setSessionData,
}) {
  const navigate = useNavigate();
  const { invalidSession, setInvalidSession } = useTimetable();
  const [invalidopen, setInvalidOpen] = useState(false);
  const [validOpen, setValidOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [currentSession, setCurrentSession] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState({
    unitId: "",
    venueId: "",
    dayOfTheWeek: "",
    type: "",
    unitsessionId: "",
    startTime: "",
    endTime: "",
    capacity: "",
    staffId: "",
  });
  const isFormValid = () => {
    return (
      formData.unitId &&
      formData.venueId &&
      formData.staffId &&
      formData.dayOfTheWeek &&
      formData.type &&
      formData.unitsessionId &&
      formData.startTime &&
      formData.endTime
    );
  };
  const filteredSessions = sessionData.filter(
    (session) =>
      (session.unitName ? session.unitName.toLowerCase() : "").includes(
        searchQuery.toLowerCase()
      ) ||
      (session.venueName ? session.venueName.toLowerCase() : "").includes(
        searchQuery.toLowerCase()
      ) ||
      (session.staffName ? session.staffName.toLowerCase() : "").includes(
        searchQuery.toLowerCase()
      ) ||
      (session.unitsessionId
        ? session.unitsessionId.toLowerCase()
        : ""
      ).includes(searchQuery.toLowerCase()) ||
      (session.startTime ? session.startTime.toLowerCase() : "").includes(
        searchQuery.toLowerCase()
      ) ||
      (session.endTime ? session.endTime.toLowerCase() : "").includes(
        searchQuery.toLowerCase()
      ) ||
      (session.equipment ? session.equipment.toLowerCase() : "").includes(
        searchQuery.toLowerCase()
      ) ||
      (session.dayOfTheWeek ? session.dayOfTheWeek.toLowerCase() : "").includes(
        searchQuery.toLowerCase()
      ) ||
      (session.unitId ? session.unitId.toLowerCase() : "").includes(
        searchQuery.toLowerCase()
      ) ||
      (session.capacity
        ? session.capacity.toString().toLowerCase()
        : ""
      ).includes(searchQuery.toLowerCase())
  );
  const handleAddOpen = () => {
    setCurrentSession(null);
    setFormData({
      unitId: "",
      venueId: "",
      dayOfTheWeek: "",
      type: "",
      unitsessionId: "",
      startTime: "",
      endTime: "",
      capacity: "",
      staffId: "",
    });
    setAddOpen(true);
  };
  const handleInvalidOpen = (session) => {
    setCurrentSession(session);
    setFormData({
      unitId: session.session.unitId,
      venueId: session.session.venueId,
      dayOfTheWeek: session.session.dayofWeek,
      type: session.session.sessionType,
      unitsessionId: session.session.unitsessionId,
      startTime: session.session.startTime,
      endTime: session.session.endTime,
      capacity: session.session.capacity,
      staffId: session.session.staffId,
    });
    setInvalidOpen(true);
  };
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const handleValidOpen = (session) => {
    setCurrentSession(session);
    setFormData({
      unitId: session.unitId,
      venueId: session.venueId,
      dayOfTheWeek: session.dayOfTheWeek,
      type: session.type,
      unitsessionId: session.unitsessionId,
      startTime: session.startTime,
      endTime: session.endTime,
      capacity: session.capacity,
      staffId: session.staffId,
    });
    setValidOpen(true);
  };
  const handleClose = () => {
    setInvalidOpen(false);
    setCurrentSession(null);
  };
  const handleValidClose = () => {
    setValidOpen(false);
    setCurrentSession(null);
  };
  const handleAddClose = () => {
    setAddOpen(false);
    setCurrentSession(null);
  };
  const handleValidEdit = async () => {
    try {
      const response = await apiCall(
        "PUT",
        {},
        formData,
        `edit_session/${currentSession.id}`
      );
      if (response.statusCode === 200) {
        setSessionData((prevData) =>
          prevData.map((session) =>
            session.id === response.data.data.id ? response.data.data : session
          )
        );
        alert("Session Edited.");
        handleValidClose();
      } else {
        alert("Failed to update session.");
      }
    } catch (error) {
      alert("An error occurred while updating session.");
    }
  };
  const handleInvalidSave = async (invalidid) => {
    try {
      const response = await apiCall(
        "POST",
        {},
        formData,
        `single_session_import`
      );
      if (response.statusCode === 200) {
        setSessionData((prevData) => [...prevData, response.data.data]);
        handleDelete(invalidid);
        alert("Session updated successfully and invalid session removed.");
        handleClose();
      } else {
        alert("Failed to update session.");
      }
    } catch (error) {
      alert("An error occurred while updating session.");
    }
  };
  const handleSessionAdd = async () => {
    try {
      const response = await apiCall(
        "POST",
        {},
        formData,
        `single_session_import`
      );
      if (response.statusCode === 200) {
        setSessionData((prevData) => [...prevData, response.data.data]);
        alert("Session added successfully.");
        handleAddClose();
      } else {
        alert("Failed to update session.");
      }
    } catch (error) {
      alert("An error occurred while updating session.");
    }
  };
  const handleValidDelete = async (id) => {
    try {
      const response = await apiCall(
        "DELETE",
        {},
        formData,
        `delete_session/${id}`
      );
      if (response.statusCode === 200) {
        setSessionData((prevData) =>
          prevData.filter((session) => session.id !== response.data.sessionId)
        );
        alert("Session deleted successfully.");
      } else {
        alert("Failed to delete session.");
      }
    } catch (error) {
      alert("An error occurred while deleting session.");
    }
  };
  const handleDelete = (sessionId) => {
    const savedInvalidSession = JSON.parse(
      localStorage.getItem("invalidSession")
    );
    // delete
    const updatedInvalidSessions = savedInvalidSession.filter(
      (session) => session.id !== sessionId
    );
    localStorage.setItem(
      "invalidSession",
      JSON.stringify(updatedInvalidSessions)
    );
    setInvalidSession(updatedInvalidSessions);
    alert("Session deleted successfully.");
  };

  if (!sessionData || sessionData.length === 0) {
    return <div>No Session available</div>;
  }
  return (
    <div className={styles.cardSection}>
      <div className={styles.managepagefirstRowContainer}>
        <h2>
          Total Session: {sessionData?.length + (invalidSession?.length || 0)}
        </h2>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleAddOpen()}
        >
          Add Session
        </Button>
        <br />
        <TextField
          label="Search Session"
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ marginBottom: "20px", width: "300px" }}
        />
      </div>
      <Typography
        variant="h6"
        style={{ color: "red", marginTop: "20px", textAlign: "center" }}
      >
        Invalid Sessions: {invalidSession.length}
      </Typography>
      {/* Invalid sessions */}
      {invalidSession?.length > 0 && (
        <>
          <div
            className={styles.managepageContainer}
            style={{ marginTop: "10px" }}
          >
            {invalidSession.map((session, index) => (
              <div
                key={index}
                className={styles.managepageBox}
                style={{
                  border: "1px solid red",
                  color: "red", // Red text color
                  marginTop: "0",
                }}
              >
                <h2>Reason: {session.reason}</h2>
                <h3>{session.session.unitCode} (Invalid)</h3>
                <h3>{session.session.sessionType}</h3>
                <p>Venue: {session.session.venueName}</p>
                <p>Unit ID: {session.session.unitId}</p>
                <p>Day: {session.session.dayOfWeek}</p>
                <p>Capacity: {session.session.capacity}</p>
                <p>Staff: {session.session.staffName || "No staff assigned"}</p>
                <p>Unit Session ID: {session.session.unitsessionId}</p>
                <p>Start Time: {session.session.startTime}</p>
                <p>End Time: {session.session.endTime}</p>
                <Divider style={{ margin: "10px 0" }} />
                <Button
                  className={styles.editButton}
                  onClick={() => handleInvalidOpen(session)}
                >
                  Edit Invalid Session
                </Button>
                <Divider style={{ margin: "20px 0" }} />
                <Button
                  className={styles.editButton}
                  onClick={() => handleDelete(session.id)}
                >
                  Delete
                </Button>
              </div>
            ))}
          </div>
        </>
      )}
      <Typography variant="h6" style={{ textAlign: "center" }}>
        Valid Sessions : {filteredSessions.length}
      </Typography>
      <div className={styles.managepageContainer} style={{ marginTop: "10px" }}>
        {/* Valid sessions */}
        {filteredSessions.map((session) => (
          <div key={session.id} className={styles.managepageBox}>
            <h3>{session.unitName}</h3>
            <h3>{session.type}</h3>
            <p>Unit ID: {session.unitId}</p>
            <p>Venue: {session.venueName}</p>
            <p>Equipment: {session.equipment}</p>
            <p>Day: {session.dayOfTheWeek}</p>
            <p>Capacity: {session.capacity}</p>
            <p>Staff: {session.staffName}</p>
            <p>Unit Session ID: {session.unitsessionId}</p>
            <p>Start Time: {session.startTime}</p>
            <p>End Time: {session.endTime}</p>
            <Divider style={{ margin: "10px 0" }} />
            <Button
              className={styles.editButton}
              onClick={() => handleValidOpen(session)}
            >
              Edit
            </Button>
            <Button
              className={styles.editButton}
              onClick={() => handleValidDelete(session.id)}
            >
              Delete
            </Button>
          </div>
        ))}
      </div>
      {/* invalid edit */}
      <Modal open={invalidopen} onClose={handleClose}>
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
            Edit Session
          </Typography>
          {currentSession && (
            <div>
              {/* Form fields to edit session */}
              <FormControl fullWidth style={{ marginBottom: "10px" }}>
                <Select
                  label="unitId"
                  name="unitId"
                  value={formData.unitId} // Use optional chaining
                  onChange={handleInputChange}
                >
                  {unitData.map((unit) => (
                    <MenuItem key={unit.id} value={unit.id}>
                      {unit.code}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth style={{ marginBottom: "10px" }}>
                <InputLabel>Venue</InputLabel>
                <Select
                  label="venueId"
                  name="venueId"
                  value={formData.venueId}
                  onChange={handleInputChange}
                >
                  {venueData.map((venue) => (
                    <MenuItem key={venue.id} value={venue.id}>
                      {venue.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth style={{ marginBottom: "10px" }}>
                <InputLabel>Staff</InputLabel>
                <Select
                  label="staffId"
                  name="staffId"
                  value={formData.staffId}
                  onChange={handleInputChange}
                >
                  {staffData.map((staff) => (
                    <MenuItem key={staff.id} value={staff.id}>
                      {staff.firstname} {staff.lastname}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth style={{ marginBottom: "10px" }}>
                <InputLabel>Day</InputLabel>
                <Select
                  label="Day"
                  name="dayOfTheWeek"
                  value={formData.dayOfTheWeek}
                  onChange={handleInputChange}
                >
                  {["monday", "tuesday", "wednesday", "thursday", "friday"].map(
                    (day) => (
                      <MenuItem key={day} value={day}>
                        {day}
                      </MenuItem>
                    )
                  )}
                </Select>
              </FormControl>
              <FormControl fullWidth style={{ marginBottom: "10px" }}>
                <InputLabel>Type</InputLabel>
                <Select
                  label="type"
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                >
                  {["lecture", "tutorial", "lab", "workshop"].map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth style={{ marginBottom: "10px" }}>
                <InputLabel>Unit Session</InputLabel>
                <Select
                  label="unitsessionId"
                  name="unitsessionId"
                  value={formData.unitsessionId}
                  onChange={handleInputChange}
                >
                  {unitSessionData.map((unitSession) => (
                    <MenuItem key={unitSession.id} value={unitSession.id}>
                      {unitSession.id}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth style={{ marginBottom: "10px" }}>
                <InputLabel>Start Time</InputLabel>
                <Select
                  label="startTime"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleInputChange}
                >
                  {[
                    "08:00",
                    "09:00",
                    "10:00",
                    "11:00",
                    "12:00",
                    "13:00",
                    "14:00",
                    "15:00",
                    "16:00",
                    "17:00",
                    "18:00",
                    "19:00",
                    "20:00",
                  ].map((time) => (
                    <MenuItem key={time} value={time}>
                      {time}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth style={{ marginBottom: "10px" }}>
                <InputLabel>End Time</InputLabel>
                <Select
                  label="endTime"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleInputChange}
                >
                  {[
                    "10:00",
                    "11:00",
                    "12:00",
                    "13:00",
                    "14:00",
                    "15:00",
                    "16:00",
                    "17:00",
                    "18:00",
                    "19:00",
                    "20:00",
                    "21:00",
                  ].map((time) => (
                    <MenuItem key={time} value={time}>
                      {time}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                label="Capacity"
                name="capacity"
                value={formData.capacity}
                onChange={handleInputChange}
                fullWidth
                type="number"
                style={{ marginBottom: "10px" }}
              />
              {/* Save button */}
              <Box mt={3} display="flex" justifyContent="flex-end">
                <Button
                  onClick={() => handleInvalidSave(currentSession.id)}
                  variant="contained"
                  color="primary"
                  disabled={
                    !formData.unitId ||
                    !formData.venueId ||
                    !formData.staffId ||
                    !formData.dayOfTheWeek ||
                    !formData.type ||
                    !formData.unitsessionId ||
                    !formData.startTime ||
                    !formData.capacity
                  }
                >
                  Save
                </Button>
                <Button
                  onClick={handleClose}
                  variant="outlined"
                  style={{ marginLeft: "10px" }}
                >
                  Cancel
                </Button>
              </Box>
            </div>
          )}
        </Box>
      </Modal>
      {/* valid edit */}
      <Modal open={validOpen} onClose={handleValidClose}>
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
            Edit Session
          </Typography>
          {currentSession && (
            <div>
              {/* Form fields to edit session */}
              <FormControl fullWidth style={{ marginBottom: "10px" }}>
                <Select
                  label="unitId"
                  name="unitId"
                  value={formData.unitId} // Use optional chaining
                  onChange={handleInputChange}
                >
                  {unitData.map((unit) => (
                    <MenuItem key={unit.id} value={unit.id}>
                      {unit.code}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth style={{ marginBottom: "10px" }}>
                <InputLabel>Venue</InputLabel>
                <Select
                  label="venueId"
                  name="venueId"
                  value={formData.venueId}
                  onChange={handleInputChange}
                >
                  {venueData.map((venue) => (
                    <MenuItem key={venue.id} value={venue.id}>
                      {venue.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth style={{ marginBottom: "10px" }}>
                <InputLabel>Staff</InputLabel>
                <Select
                  label="staffId"
                  name="staffId"
                  value={formData.staffId}
                  onChange={handleInputChange}
                >
                  {staffData.map((staff) => (
                    <MenuItem key={staff.id} value={staff.id}>
                      {staff.firstname} {staff.lastname}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth style={{ marginBottom: "10px" }}>
                <InputLabel>Day</InputLabel>
                <Select
                  label="Day"
                  name="dayOfTheWeek"
                  value={formData.dayOfTheWeek}
                  onChange={handleInputChange}
                >
                  {["monday", "tuesday", "wednesday", "thursday", "friday"].map(
                    (day) => (
                      <MenuItem key={day} value={day}>
                        {day}
                      </MenuItem>
                    )
                  )}
                </Select>
              </FormControl>
              <FormControl fullWidth style={{ marginBottom: "10px" }}>
                <InputLabel>Type</InputLabel>
                <Select
                  label="type"
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                >
                  {["lecture", "tutorial", "lab", "workshop"].map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth style={{ marginBottom: "10px" }}>
                <InputLabel>Unit Session</InputLabel>
                <Select
                  label="unitsessionId"
                  name="unitsessionId"
                  value={formData.unitsessionId}
                  onChange={handleInputChange}
                >
                  {unitSessionData.map((unitSession) => (
                    <MenuItem key={unitSession.id} value={unitSession.id}>
                      {unitSession.id}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth style={{ marginBottom: "10px" }}>
                <InputLabel>Start Time</InputLabel>
                <Select
                  label="startTime"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleInputChange}
                >
                  {[
                    "09:00:00",
                    "10:00:00",
                    "11:00:00",
                    "12:00:00",
                    "13:00:00",
                    "14:00:00",
                    "15:00:00",
                    "16:00:00",
                    "17:00:00",
                    "18:00:00",
                    "19:00:00",
                    "20:00:00",
                  ].map((time) => (
                    <MenuItem key={time} value={time}>
                      {time}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth style={{ marginBottom: "10px" }}>
                <InputLabel>End Time</InputLabel>
                <Select
                  label="endTime"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleInputChange}
                >
                  {[
                    "10:00:00",
                    "11:00:00",
                    "12:00:00",
                    "13:00:00",
                    "14:00:00",
                    "15:00:00",
                    "16:00:00",
                    "17:00:00",
                    "18:00:00",
                    "19:00:00",
                    "20:00:00",
                    "21:00:00",
                  ].map((time) => (
                    <MenuItem key={time} value={time}>
                      {time}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                label="Capacity"
                name="capacity"
                type="number"
                value={formData.capacity}
                onChange={handleInputChange}
                fullWidth
                style={{ marginBottom: "10px" }}
              />
              {/* Save button */}
              <Box mt={3} display="flex" justifyContent="flex-end">
                <Button
                  onClick={() => handleValidEdit(currentSession)}
                  disabled={!isFormValid()}
                  variant="contained"
                  color="primary"
                  disabled={
                    !formData.unitId ||
                    !formData.venueId ||
                    !formData.staffId ||
                    !formData.dayOfTheWeek ||
                    !formData.type ||
                    !formData.unitsessionId ||
                    !formData.startTime ||
                    !formData.capacity
                  }
                >
                  Save
                </Button>
                <Button
                  onClick={handleValidClose}
                  variant="outlined"
                  style={{ marginLeft: "10px" }}
                >
                  Cancel
                </Button>
              </Box>
            </div>
          )}
        </Box>
      </Modal>
      {/*Add Modal*/}
      <Modal open={addOpen} onClose={handleAddClose}>
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
            Add Session
          </Typography>
          {
            <div>
              {/* Form fields to edit session */}
              <FormControl fullWidth style={{ marginBottom: "10px" }}>
                <InputLabel>Unit</InputLabel>
                <Select
                  label="unitId"
                  name="unitId"
                  value={formData.unitId} // Use optional chaining
                  onChange={handleInputChange}
                >
                  {unitData.map((unit) => (
                    <MenuItem key={unit.id} value={unit.id}>
                      {unit.code}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth style={{ marginBottom: "10px" }}>
                <InputLabel>Venue</InputLabel>
                <Select
                  label="venueId"
                  name="venueId"
                  value={formData.venueId}
                  onChange={handleInputChange}
                >
                  {venueData.map((venue) => (
                    <MenuItem key={venue.id} value={venue.id}>
                      {venue.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth style={{ marginBottom: "10px" }}>
                <InputLabel>Staff</InputLabel>
                <Select
                  label="staffId"
                  name="staffId"
                  value={formData.staffId}
                  onChange={handleInputChange}
                >
                  {staffData.map((staff) => (
                    <MenuItem key={staff.id} value={staff.id}>
                      {staff.firstname} {staff.lastname}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth style={{ marginBottom: "10px" }}>
                <InputLabel>Day</InputLabel>
                <Select
                  label="Day"
                  name="dayOfTheWeek"
                  value={formData.dayOfTheWeek}
                  onChange={handleInputChange}
                >
                  {["monday", "tuesday", "wednesday", "thursday", "friday"].map(
                    (day) => (
                      <MenuItem key={day} value={day}>
                        {day}
                      </MenuItem>
                    )
                  )}
                </Select>
              </FormControl>
              <FormControl fullWidth style={{ marginBottom: "10px" }}>
                <InputLabel>Type</InputLabel>
                <Select
                  label="type"
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                >
                  {["lecture", "tutorial", "lab", "workshop"].map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth style={{ marginBottom: "10px" }}>
                <InputLabel>Unit Session</InputLabel>
                <Select
                  label="unitsessionId"
                  name="unitsessionId"
                  value={formData.unitsessionId}
                  onChange={handleInputChange}
                >
                  {unitSessionData.map((unitSession) => (
                    <MenuItem key={unitSession.id} value={unitSession.id}>
                      {unitSession.id}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth style={{ marginBottom: "10px" }}>
                <InputLabel>Start Time</InputLabel>
                <Select
                  label="startTime"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleInputChange}
                >
                  {[
                    "09:00",
                    "10:00",
                    "11:00",
                    "12:00",
                    "13:00",
                    "14:00",
                    "15:00",
                    "16:00",
                    "17:00",
                    "18:00",
                    "19:00",
                    "20:00",
                  ].map((time) => (
                    <MenuItem key={time} value={time}>
                      {time}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth style={{ marginBottom: "10px" }}>
                <InputLabel>End Time</InputLabel>
                <Select
                  label="endTime"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleInputChange}
                >
                  {[
                    "10:00",
                    "11:00",
                    "12:00",
                    "13:00",
                    "14:00",
                    "15:00",
                    "16:00",
                    "17:00",
                    "18:00",
                    "19:00",
                    "20:00",
                    "21:00",
                  ].map((time) => (
                    <MenuItem key={time} value={time}>
                      {time}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                label="Capacity"
                name="capacity"
                type="number"
                value={formData.capacity}
                onChange={handleInputChange}
                fullWidth
                style={{ marginBottom: "10px" }}
              />
              <Box mt={3} display="flex" justifyContent="flex-end">
                <Button
                  onClick={() => handleSessionAdd()}
                  variant="contained"
                  color="primary"
                  disabled={
                    !formData.unitId ||
                    !formData.venueId ||
                    !formData.staffId ||
                    !formData.dayOfTheWeek ||
                    !formData.type ||
                    !formData.unitsessionId ||
                    !formData.startTime ||
                    !formData.capacity
                  }
                >
                  Add
                </Button>
                <Button
                  onClick={handleAddClose}
                  variant="outlined"
                  style={{ marginLeft: "10px" }}
                >
                  Cancel
                </Button>
              </Box>
            </div>
          }
        </Box>
      </Modal>
    </div>
  );
}
