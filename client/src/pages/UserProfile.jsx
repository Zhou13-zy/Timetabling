import React, { useEffect, useState } from "react";
import { TextField, Avatar, Box, Container } from "@mui/material";
import { apiCall } from "../utils/ApiCall";
import NavbarAuth from "../components/NavbarAuth";
import ChangePwdBtn from "../components/ChangePwdBtn";
import { deepOrange } from "@mui/material/colors";
import EditDescription from "../components/EditDescription";
import { UnAuthRedirect } from "../utils/UnAuthRedirect";
import Footer from "../components/Footer";




const allowedFileTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif'];


const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};

export default function UserProfile() {
  UnAuthRedirect();

  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");
  const [avatarPath, setAvatarPath] = useState(null); 

  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  const getUser = async () => {
    try {
      const { statusCode, data } = await apiCall(
        "GET",
        headers,
        null,
        "user-info"
      );
      if (statusCode === 200) {
        const { data: userData = {} } = data;
        const {
          firstname = "",
          lastname = "",
          email = "",
          description = "",
          avatar_url = null, 
        } = userData;
  
        setFirstname(firstname);
        setLastname(lastname);
        setEmail(email);
        setDescription(description);
        setAvatarPath(avatar_url);
      } else {
        console.error("Failed to fetch user data:", data.message);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };
  

  useEffect(() => {
    getUser();
  }, []);

  
  const getInitials = () => {
    return `${firstname[0] || ""}${lastname[0] || ""}`.toUpperCase();
  };

  
  const handleAvatarClick = () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    
    fileInput.onchange = async () => {
      const file = fileInput.files[0];
      
      if (file) {
        // Check if the file type is allowed
        if (!allowedFileTypes.includes(file.type)) {
          alert("Invalid file format. Please upload an image (png, jpg, jpeg, gif).");
          return; // Stop further execution if the file format is not allowed
        }
  
        const formData = new FormData();
        formData.append('avatar', file);  // Keep the backend field name as 'avatar'
  
        try {
          const { statusCode, data } = await apiCall(
            "POST",
            {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            formData,
            "upload-avatar"
          );
          if (statusCode === 200) {
            setAvatarPath(data.avatar_path); // Update avatarPath after successful upload
          } else {
            console.error("Failed to upload avatar:", data.message);
          }
        } catch (error) {
          console.error("Error uploading avatar:", error);
        }
      }
    };
    
    fileInput.click(); // Simulate a file input click
  };

  return (
    <div>
      <NavbarAuth />
      <Container component="main" maxWidth="s">
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <table>
            <tbody>
              <tr>
                <td></td>
                <td>
                  <Avatar
                  src={avatarPath || undefined}
                   sx={{
                    bgcolor: deepOrange[500],
                    width: "120px",
                    height: "120px",
                    m: "auto",
                    mb: 4,
                  }}
                    onClick={handleAvatarClick} 
                  >
                  {avatarPath ? null : getInitials()}
                </Avatar>
                </td>
              </tr>
              <tr>
                <td style={{ width: "100px" }}>First Name</td>
                <td>
                  <TextField
                    margin="dense"
                    fullWidth
                    id="firstname"
                    name="firstname"
                    value={capitalizeFirstLetter(firstname)}
                    size="small"
                    InputProps={{
                      readOnly: true,
                      sx: {
                        borderRadius: "10px",
                        backgroundColor: "#E6E6E6",
                        color: "black",
                      },
                    }}
                  />
                </td>
              </tr>
              <tr>
                <td>Last Name</td>
                <td>
                  <TextField
                    margin="dense"
                    fullWidth
                    id="lastname"
                    name="lastname"
                    value={capitalizeFirstLetter(lastname)}
                    size="small"
                    InputProps={{
                      readOnly: true,
                      sx: {
                        borderRadius: "10px",
                        backgroundColor: "#E6E6E6",
                        color: "black",
                      },
                    }}
                  />
                </td>
              </tr>
              <tr>
                <td>Email</td>
                <td>
                  <TextField
                    margin="dense"
                    fullWidth
                    id="email"
                    name="email"
                    value={email}
                    size="small"
                    InputProps={{
                      readOnly: true,
                      sx: {
                        borderRadius: "10px",
                        backgroundColor: "#E6E6E6",
                        color: "black",
                      },
                    }}
                  />
                </td>
              </tr>
              <tr>
                <td>Description</td>
                <td>
                  <TextField
                    margin="dense"
                    fullWidth
                    name="description"
                    id="description"
                    multiline
                    rows={4}
                    value={description}
                    size="small"
                    InputProps={{
                      readOnly: true,
                      sx: {
                        borderRadius: "10px",
                        backgroundColor: "#E6E6E6",
                        color: "black",
                      },
                    }}
                  />
                </td>
              </tr>
              <tr>
                <td></td>
                <td>
                  <EditDescription
                    description={description}
                    setDescription={setDescription}
                    variant="contained"
                  />
                </td>
              </tr>
              <tr>
                <td></td>
                <td>
                  <ChangePwdBtn variant="contained" />
                </td>
              </tr>
            </tbody>
          </table>
        </Box>
      </Container>
      <Footer />
    </div>
  );
}
