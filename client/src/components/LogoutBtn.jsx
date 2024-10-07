import React from "react";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import { apiCall } from "../utils/ApiCall";

export default function LogoutBtn() {
  const navigate = useNavigate();
  const headers = {
    Accept: "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  };
  const logout = async () => {
    await apiCall("POST", headers, {}, `logout`);
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    navigate("/logout-buffer-page");
  };
  return (
    <Button
      onClick={logout}
      color="inherit"
      size="large"
      style={{ paddingLeft: "5vw", paddingRight: "2vw" }}
    >
      Logout
    </Button>
  );
}