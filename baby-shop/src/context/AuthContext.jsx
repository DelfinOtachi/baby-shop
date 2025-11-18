import React, { createContext, useEffect, useState } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loadingUser, setLoadingUser] = useState(true);

  // Load user on mount or when token changes
  useEffect(() => {
    const fetchUser = async () => {
      const storedToken = localStorage.getItem("token");
      if (!storedToken) {
        setLoadingUser(false);
        setUser(null);
        return;
      }

      try {
        const res = await axios.get("http://localhost:5000/api/auth/me", {
          headers: { Authorization: `Bearer ${storedToken}` },
        });
        setUser(res.data);
        setToken(storedToken);
      } catch (err) {
        console.error("AuthContext fetchUser error:", err);
        if (err.response?.status === 401) {
          setUser(null);
          setToken(null);
          localStorage.removeItem("token");
        }
      } finally {
        setLoadingUser(false);
      }
    };

    fetchUser();
  }, []);

  // Login function
  const login = async (email, password) => {
    const res = await axios.post("http://localhost:5000/api/auth/login", { email, password });

    // Save token & user
    localStorage.setItem("token", res.data.token);
    setToken(res.data.token);
    setUser(res.data.user);

    return res.data.user;
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loadingUser }}>
      {children}
    </AuthContext.Provider>
  );
};
