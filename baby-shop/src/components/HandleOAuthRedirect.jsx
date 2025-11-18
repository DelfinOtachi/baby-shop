import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function HandleOAuthRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const name = params.get("name");

    if (token) {
      localStorage.setItem("userInfo", JSON.stringify({ token, name }));
      window.dispatchEvent(new Event("userUpdated"));
      navigate("/"); // Redirect to home page after login
    } else {
      navigate("/login"); // fallback if no token
    }
  }, [navigate]);

  return <p>Logging in...</p>;
}
