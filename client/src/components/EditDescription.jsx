// EditDescription.jsx
import React, { useState } from "react";
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { apiCall } from "../utils/ApiCall";

export default function EditDescription({ description, setDescription }) {
  const [open, setOpen] = useState(false);
  const [newDescription, setNewDescription] = useState(description);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleUpdateDescription = async () => {
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      Origin: "http://localhost:3000",
    };
    const body = {
      description: newDescription,
    };

    try {
      const {
        statusCode,
        data: { message },
      } = await apiCall("PUT", headers, body, "update-description");
      if (statusCode === 200) {
        setDescription(newDescription);
        handleClose();
      } else {
        console.error("Failed to update description:", message);
      }
    } catch (error) {
      console.error("Error updating description:", error);
    }
  };

  return (
    <>
      <Button
        onClick={handleClickOpen}
        variant="contained"
        sx={{
          mt: 2,
          backgroundColor: "#F4EA8E",
          color: "black",
          width: "500px",
          "&:hover": { backgroundColor: "#F4EA8E" },
        }}
      >
        Change Description
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        sx={{ "& .MuiDialog-paper": { width: "80%", maxWidth: "600px" } }}
      >
        <DialogTitle>Update Description</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="description"
            label="Description"
            type="text"
            fullWidth
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            multiline
            rows={6}
            sx={{ height: "auto", minHeight: "100px" }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleUpdateDescription}>Update</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
