import React from "react";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";

export default function ChangePwdBtn() {
  const navigate = useNavigate();

  const onClick = () => {
    navigate("/change-pwd");
  };

  return (
    <Button
      onClick={onClick}
      variant="contained"
      sx={{
        mt: 2,
        backgroundColor: "#F4EA8E",
        color: "black",
        width: "500px",
        "&:hover": { backgroundColor: "#F4EA8E" },
      }}
    >
      Change Password
    </Button>
  );
}
