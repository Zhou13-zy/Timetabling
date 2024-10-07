import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiCall } from "./ApiCall";

export function AuthRedirect() {
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
          const response = await apiCall(
            "POST",
            headers,
            { email, token },
            "validate-token"
          );
          const { statusCode } = response;

          if (statusCode === 200) {
            navigate("/dashboard");
          } else {
            localStorage.removeItem("token");
            localStorage.removeItem("email");
          }
        } catch (error) {
          localStorage.removeItem("token");
          localStorage.removeItem("email");
        }
      }
    }

    checkToken();
  }, [navigate]);
}
