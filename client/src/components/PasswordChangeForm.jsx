import React, { useState } from "react";
import AuthTextInput from "./styled/AuthTextInput";
import { Box, Button, Typography } from "@mui/material";

export default function PasswordChangeForm({ submit }) {
  const [old_password, setOld_Password] = useState("");
  const [new_password, setNew_Password] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const isValidPassword = (password) => {
    const uppercaseRegExp = /(?=.*?[A-Z])/;
    const lowercaseRegExp = /(?=.*?[a-z])/;
    const digitsRegExp = /(?=.*?[0-9])/;
    const specialCharRegExp = /(?=.*?[#?!@$%^&*-])/;
    const minLengthRegExp = /.{10,}/;

    return (
      (uppercaseRegExp.test(password) &&
        lowercaseRegExp.test(password) &&
        (digitsRegExp.test(password) || specialCharRegExp.test(password)) &&
        minLengthRegExp.test(password)) ||
      password.length === 0
    );
  };

  const onSubmit = (e) => {
    e.preventDefault();
    submit(old_password, new_password);
  };

  return (
    <form onSubmit={onSubmit}>
      <Typography color="grey" gutterBottom variant="h4">
        Change Password
      </Typography>
      <AuthTextInput
        type="password"
        label="Old Password"
        size="small"
        margin="normal"
        required
        fullWidth
        value={old_password}
        onChange={(e) => setOld_Password(e.target.value)}
      />
      <AuthTextInput
        type="password"
        label="New Password"
        size="small"
        margin="normal"
        required
        fullWidth
        value={new_password}
        onChange={(e) => setNew_Password(e.target.value)}
        error={!isValidPassword(new_password)}
        helperText={
          !isValidPassword(new_password)
            ? "password must be at least 10 characters, one uppercase, one lowercase, one digit or special character"
            : null
        }
      />
      <AuthTextInput
        type="password"
        label="Confirm Password"
        size="small"
        margin="normal"
        required
        fullWidth
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        error={new_password !== confirmPassword}
        helperText={
          new_password !== confirmPassword ? "Passwords must match" : null
        }
      />
      <Box sx={{ mt: 5 }}>
        <Button
          type="submit"
          variant="contained"
          fullWidth
          size="large"
          color="primary"
          className="mb-5"
        >
          Change Password
        </Button>
      </Box>
      <br />
    </form>
  );
}
