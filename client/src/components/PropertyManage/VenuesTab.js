import React, { useState } from "react";
import {
  Button,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  Checkbox,
  ListItemText,
  Modal,
  Box,
} from "@mui/material";
import { apiCall } from "../../utils/ApiCall";
import styles from "../../App.module.css";

export default function VenuesTab({ venueData, setVenueData }) {
  const [openModal, setOpenModal] = useState(false);
  const [addOpenModal, setAddOpenModal] = useState(false);
  const [selectedTimeslots, setSelectedTimeslots] = useState([]);
  const [currentItem, setCurrentItem] = useState({});
  const [newVenue, setNewVenue] = useState({
    name: "",
    location: "",
    capacity: 100,
    equipment: "",
    blocked_timeslots: [],
    active: true,
  });
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const timeSlots = days.flatMap((day) =>
    Array.from({ length: 14 }, (_, i) => ({
      label: `${day} ${8 + i > 12 ? `${8 + i - 12} PM` : `${8 + i} AM`}`,
      value: `${day.toLowerCase()}-${8 + i}`,
    }))
  );

  const handleOpenModal = (venue) => {
    if (!venue) return;
    setCurrentItem({
      ...venue,
      active: venue.active !== undefined ? venue.active : true,
      equipment: venue.equipment || "",
    });
    const timeslots = venue.blocked_timeslots
      ? venue.blocked_timeslots.split(", ")
      : [];
    setSelectedTimeslots(timeslots);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };
  const handleOpenAddModal = () => {
    setAddOpenModal(true);
  };
  const handleCloseAddModal = () => {
    setAddOpenModal(false);
    setNewVenue({
      name: "",
      location: "",
      capacity: 100,
      equipment: "",
      blocked_timeslots: [],
      active: true,
    });
  };
  const handleAddVenue = async () => {
    try {
      let newVenueData = {
        ...newVenue,
        blocked_timeslots: newVenue.blocked_timeslots.join(", "),
      };
      const response = await apiCall("POST", {}, newVenueData, `add_venue`);
      if (response.statusCode === 201) {
        alert("Venue added successfully");
        setVenueData((prevData) => [...prevData, response.data.venue]);
        handleCloseAddModal();
      } else {
        alert("Failed to add venue: " + response.error);
      }
    } catch (error) {
      alert("An error occurred while adding venue.");
    }
  };
  // Save changes to the edited venue
  const handleSaveChanges = async () => {
    try {
      let updatedData = {
        ...currentItem,
        blocked_timeslots: selectedTimeslots.join(", "),
        equipment_type: currentItem.equipment,
      };
      const response = await apiCall(
        "PUT",
        {},
        updatedData,
        `venue/${currentItem.id}`
      );

      if (response.statusCode === 200) {
        alert("Venue updated successfully");
        setVenueData((prevData) =>
          prevData.map((venue) =>
            venue.id === currentItem.id ? { ...venue, ...updatedData } : venue
          )
        );
        handleCloseModal();
      } else {
        alert("Failed to update venue: " + response.error);
      }
    } catch (error) {
      //console.error("Error updating venue:", error);
      alert("An error occurred while updating venue.");
    }
  };
  if (!venueData || venueData.length === 0) {
    return <div>No Venue available</div>;
  }
  return (
    <div className={styles.cardSection}>
      <div className={styles.managepagefirstRowContainer}>
        <Typography variant="h6">Total Venues: {venueData.length}</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleOpenAddModal}
        >
          Add Venue
        </Button>{" "}
      </div>
      <div className={styles.managepageContainer}>
        {venueData.map((venue) => (
          <div
            key={venue.id}
            className={`${styles.homepageBox} ${
              !venue.active ? styles.inactiveVenue : ""
            }`}
          >
            <h3>{venue.name}</h3>
            <p>Location: {venue.location}</p>
            <p>Capacity: {venue.capacity}</p>
            <p>Equipment: {venue.equipment ? venue.equipment : "None"}</p>
            <p>Blocked Timeslots :{venue.blocked_timeslots}</p>
            <p>{venue.active ? "Active" : "Inactive"}</p>
            <Button
              className={styles.editButton}
              onClick={() => handleOpenModal(venue)}
            >
              Edit
            </Button>
          </div>
        ))}
      </div>
      <Modal open={addOpenModal} onClose={handleCloseAddModal}>
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
            Add New Venue
          </Typography>
          <TextField
            label="Name"
            value={newVenue.name}
            onChange={(e) => setNewVenue({ ...newVenue, name: e.target.value })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Location"
            value={newVenue.location}
            onChange={(e) =>
              setNewVenue({ ...newVenue, location: e.target.value })
            }
            fullWidth
            margin="normal"
          />
          <TextField
            label="Capacity"
            type="number"
            value={newVenue.capacity}
            onChange={(e) =>
              setNewVenue({
                ...newVenue,
                capacity: parseInt(e.target.value, 10),
              })
            }
            fullWidth
            margin="normal"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Equipment Type</InputLabel>
            <Select
              value={newVenue.equipment || ""}
              onChange={(e) =>
                setNewVenue({ ...newVenue, equipment: e.target.value })
              }
            >
              <MenuItem value="">None</MenuItem>
              <MenuItem value="computer">Computer</MenuItem>
              <MenuItem value="projector">Projector</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel id="blocked-timeslots-label">
              Blocked Timeslots
            </InputLabel>
            <Select
              labelId="blocked-timeslots-label"
              multiple
              value={newVenue.blocked_timeslots}
              onChange={(e) =>
                setNewVenue({ ...newVenue, blocked_timeslots: e.target.value })
              }
              input={<OutlinedInput label="Blocked Timeslots" />}
              renderValue={(selected) => selected.join(", ")}
            >
              {timeSlots.map((timeSlot) => (
                <MenuItem key={timeSlot.value} value={timeSlot.value}>
                  <Checkbox
                    checked={newVenue.blocked_timeslots.includes(
                      timeSlot.value
                    )}
                  />
                  <ListItemText primary={timeSlot.label} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <div className={styles.checkboxContainer}>
            <input
              type="checkbox"
              id="Active"
              checked={newVenue.active}
              className={styles.customCheckbox}
              onChange={(e) =>
                setNewVenue({ ...newVenue, active: e.target.checked })
              }
            />
            <label className={styles.checkboxLabel} htmlFor="Active">
              Active
            </label>
          </div>
          <Box mt={3} display="flex" justifyContent="flex-end">
            <Button
              variant="contained"
              color="primary"
              disabled={
                !newVenue.name ||
                !newVenue.location ||
                !newVenue.capacity ||
                !newVenue.equipment ||
                !newVenue.blocked_timeslots.length ||
                !newVenue.active
              } // Add new venue only if all fields are filled and active is true
              onClick={handleAddVenue} // Add new venue
            >
              Add Venue
            </Button>
            <Button
              onClick={handleCloseAddModal}
              variant="outlined"
              style={{ marginLeft: "10px" }}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>
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
            Edit Venue
          </Typography>
          <TextField
            label="Name"
            defaultValue={currentItem.name}
            onChange={(e) =>
              setCurrentItem({ ...currentItem, name: e.target.value })
            }
            fullWidth
            margin="normal"
          />
          <TextField
            label="Location"
            defaultValue={currentItem.location}
            onChange={(e) =>
              setCurrentItem({ ...currentItem, location: e.target.value })
            }
            fullWidth
            margin="normal"
          />
          <TextField
            label="Capacity"
            type="number"
            defaultValue={currentItem.capacity}
            onChange={(e) =>
              setCurrentItem({
                ...currentItem,
                capacity: parseInt(e.target.value, 10),
              })
            }
            fullWidth
            margin="normal"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Equipment Type</InputLabel>
            <Select
              value={currentItem.equipment || ""}
              onChange={(e) =>
                setCurrentItem({ ...currentItem, equipment: e.target.value })
              }
            >
              <MenuItem value="">None</MenuItem>
              <MenuItem value="computer">Computer</MenuItem>
              <MenuItem value="projector">Projector</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel id="blocked-timeslots-label">
              Blocked Timeslots
            </InputLabel>
            <Select
              labelId="blocked-timeslots-label"
              multiple
              value={selectedTimeslots}
              onChange={(e) => setSelectedTimeslots(e.target.value)}
              input={<OutlinedInput label="Blocked Timeslots" />}
              renderValue={(selected) => selected.join(", ")}
            >
              {timeSlots.map((timeSlot) => (
                <MenuItem key={timeSlot.value} value={timeSlot.value}>
                  <Checkbox
                    checked={selectedTimeslots.includes(timeSlot.value)}
                  />
                  <ListItemText primary={timeSlot.label} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <div className={styles.checkboxContainer}>
            <input
              type="checkbox"
              id="Active"
              checked={currentItem.active}
              className={styles.customCheckbox}
              onChange={(e) =>
                setCurrentItem({
                  ...currentItem,
                  active: e.target.checked,
                })
              }
            />
            <label className={styles.checkboxLabel} htmlFor="Active">
              Active
            </label>
          </div>
          <Box mt={3} display="flex" justifyContent="flex-end">
            <Button
              variant="contained"
              color="primary"
              onClick={handleSaveChanges}
              disabled={
                !currentItem.name ||
                !currentItem.location ||
                !currentItem.capacity ||
                !selectedTimeslots.length ||
                !currentItem.active
              } // Save button is disabled until all fields are filled and active is true
            >
              Save
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
    </div>
  );
}
