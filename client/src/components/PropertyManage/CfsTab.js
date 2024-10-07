import React, { useState } from "react";
import {
  Button,
  Typography,
  Modal,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  OutlinedInput,
  TextField,
} from "@mui/material";
import styles from "../../App.module.css";
import { apiCall } from "../../utils/ApiCall";

export default function CfsTab({
  cfsData,
  unitData,
  setCfsData,
  staffData,
  cohortData,
}) {
  const [openModal, setOpenModal] = useState(false);
  const [selectedUnits, setSelectedUnits] = useState([]);
  const [currentItem, setCurrentItem] = useState({});
  const [openAddModal, setOpenAddModal] = useState(false);
  const [refType, setRefType] = useState("");
  const [staffId, setStaffId] = useState("");
  const [cohortId, setCohortId] = useState("");
  const isAddDisabled = selectedUnits.length === 0 || refType === "";

  const handleOpenAddModal = () => {
    setCurrentItem({
      set: "",
      ref_type: "",
      staffId: "",
      cohortId: "",
    });
    setSelectedUnits([]);
    setRefType("");
    setStaffId("");
    setCohortId("");
    setOpenAddModal(true);
  };

  const handleCloseAddModal = () => {
    setOpenAddModal(false);
  };

  const handleAddCfs = async () => {
    try {
      const newCfsData = {
        set: selectedUnits.join(", "),
        ref_type: refType,
        staffId: refType === "staff" ? staffId : null,
        cohortId: refType === "cohort" ? cohortId : null,
      };
      const response = await apiCall("POST", {}, newCfsData, "add_cfs");

      if (response.statusCode === 201) {
        alert("Clash Free Set added successfully");
        const addedCfs = response.data.cfs;
        setCfsData((prevData) => [...prevData, addedCfs]);
        handleCloseAddModal();
      } else {
        alert("Failed to add Clash Free Set: " + response.error);
      }
    } catch (error) {
      //console.error("Error adding Clash Free Set:", error);
      alert("An error occurred while adding Clash Free Set.");
    }
  };

  const handleOpenModal = (cfs) => {
    setCurrentItem(cfs);
    setSelectedUnits(cfs.set.split(", "));
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleSaveChanges = async () => {
    try {
      const updatedCfsData = {
        ...currentItem,
        set: selectedUnits.join(", "),
      };

      const response = await apiCall(
        "PUT",
        {},
        updatedCfsData,
        `cfs/${currentItem.id}`
      );

      if (response.statusCode === 200) {
        alert("Clash Free Set updated successfully");
        setCfsData((prevData) =>
          prevData.map((cfs) =>
            cfs.id === currentItem.id ? { ...cfs, ...updatedCfsData } : cfs
          )
        );
        handleCloseModal();
      } else {
        alert("Failed to update Clash Free Set: " + response.error);
      }
    } catch (error) {
      //console.error("Error updating Clash Free Set:", error);
      alert("An error occurred while updating Clash Free Set.");
    }
  };

  if (!cfsData || cfsData.length === 0) {
    return <div>No Clash Free Set available</div>;
  }
  return (
    <div className={styles.cardSection}>
      <div className={styles.managepagefirstRowContainer}>
        <Typography variant="h6">
          Total Clash Free Sets: {cfsData.length}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleOpenAddModal}
        >
          Add Clash Free Set
        </Button>
      </div>
      <div className={styles.managepageContainer}>
        {cfsData.map((cfs) => (
          <div key={cfs.id} className={styles.homepageBox}>
            <div className={styles.chipContainer}>
              {(cfs.set ? cfs.set.split(", ") : []).map((code, index) => (
                <span key={index} className={styles.chip}>
                  {code}
                </span>
              ))}
            </div>

            <Button
              className={styles.editButton}
              onClick={() => handleOpenModal(cfs)}
            >
              Edit
            </Button>
          </div>
        ))}
      </div>
      {/* add modal;*/}
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
            Add Clash Free Set
          </Typography>

          <FormControl fullWidth margin="normal">
            <InputLabel id="select-unit-label">Units</InputLabel>
            <Select
              labelId="select-unit-label"
              multiple
              value={selectedUnits}
              onChange={(e) => setSelectedUnits(e.target.value)}
              input={<OutlinedInput label="Select Units" />}
              renderValue={(selected) => selected.join(", ")}
            >
              {unitData.map((unit) => (
                <MenuItem key={unit.id} value={unit.code}>
                  <Checkbox checked={selectedUnits.includes(unit.code)} />
                  <ListItemText primary={`${unit.code} - ${unit.title}`} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {/* ref_type 설정 */}
          <FormControl fullWidth margin="normal">
            <InputLabel id="select-ref-type-label">Reference Type</InputLabel>
            <Select
              labelId="select-ref-type-label"
              value={refType}
              onChange={(e) => setRefType(e.target.value)}
            >
              <MenuItem value="cohort">Cohort</MenuItem>
              <MenuItem value="staff">Staff</MenuItem>
            </Select>
          </FormControl>

          {/* ref_type에 따라 cohortId 또는 staffId 선택 */}
          {refType === "cohort" && (
            <FormControl fullWidth margin="normal">
              <InputLabel id="select-cohort-label">Cohort</InputLabel>
              <Select
                labelId="select-cohort-label"
                value={cohortId}
                onChange={(e) => setCohortId(e.target.value)}
              >
                {cohortData.map((cohort) => (
                  <MenuItem key={cohort.id} value={cohort.id}>
                    {cohort.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          {refType === "staff" && (
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
          )}
          <Box mt={3} display="flex" justifyContent="flex-end">
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddCfs}
              disabled={isAddDisabled}
            >
              Add
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

      {/* edit modal */}
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
            Edit Clash Free Set
          </Typography>
          <FormControl fullWidth margin="normal">
            <InputLabel id="select-unit-label">Units</InputLabel>
            <Select
              labelId="select-unit-label"
              multiple
              value={selectedUnits}
              onChange={(e) => setSelectedUnits(e.target.value)}
              input={<OutlinedInput label="Select Units" />}
              renderValue={(selected) => selected.join(", ")}
            >
              {unitData.map((unit) => (
                <MenuItem key={unit.id} value={unit.code}>
                  <Checkbox checked={selectedUnits.includes(unit.code)} />
                  <ListItemText primary={`${unit.code} - ${unit.title}`} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Box mt={3} display="flex" justifyContent="flex-end">
            <Button
              variant="contained"
              color="primary"
              onClick={handleSaveChanges}
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
