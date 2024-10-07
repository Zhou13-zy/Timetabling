import { styled } from "@mui/system";
import TextField from "@mui/material/TextField";

const AuthTextInput = styled(TextField)({
  marginTop: 10,
  marginBottom: 5,
  border: "1px ridge #eefcff",
  borderRadius: 10,
  backgroundColor: "whitesmoke",
  ":hover": {
    borderColor: "black",
  },
  "& > label": {
    top: 13,
    left: 0,
    '&[data-shrink="false"]': {
      top: 5,
    },
  },
  "& > div > input": {
    padding: "30.5px 14px 11.5px !important",
  },
  "& .MuiOutlinedInput-notchedOutline": {
    border: "none",
  },
  "&.Mui-focused": {
    "& .MuiOutlinedInput-notchedOutline": {
      border: "none",
    },
  },
});

export default AuthTextInput;
