import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiCall } from "./ApiCall";

export function UnAuthRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    async function checkToken() {
      const token = localStorage.getItem("token");
      const email = localStorage.getItem("email");
      if (token && email) {
        const headers = {
          Accept: "application/json",
          "Content-Type": "application/json",
          Origin: "http://localhost:3000",
        };

        try {
          const { statusCode } = await apiCall(
            "POST",
            headers,
            { email, token },
            "validate-token"
          );

          if (statusCode !== 200) {
            alert("Invalid token, you are logged out");
            localStorage.removeItem("token");
            localStorage.removeItem("email");
            navigate("/login");
          }
        } catch (error) {
          alert("Error validating token, you are logged out");
          localStorage.removeItem("token");
          localStorage.removeItem("email");
          navigate("/login");
        }
      } else {
        navigate("/login");
      }
    }

    checkToken();
  }, []);
}
