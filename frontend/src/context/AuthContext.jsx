import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const API = process.env.REACT_APP_API_URL || "/api";
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("dvc_token");
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      axios.get(`${API}/auth/me`)
        .then((res) => setUser(res.data))
        .catch(() => {
          localStorage.removeItem("dvc_token");
          delete axios.defaults.headers.common["Authorization"];
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (employee_id, password) => {
    const res = await axios.post(`${API}/auth/login`, { employee_id, password });
    const { token } = res.data;
    localStorage.setItem("dvc_token", token);
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    const meRes = await axios.get(`${API}/auth/me`);
    setUser(meRes.data);
    return meRes.data;
  };

  const adminLogin = async (username, password) => {
    const res = await axios.post(`${API}/auth/admin/login`, { username, password });
    const { token, ...userData } = res.data;

  // 👉 ADD THIS LINE
    console.log("TOKEN:", token);

    localStorage.setItem("dvc_token", token);
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    setUser({ ...userData, role: "admin" });

    return userData;
  };

  const register = async (formData) => {
    const res = await axios.post(`${API}/auth/register`, formData);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem("dvc_token");
    delete axios.defaults.headers.common["Authorization"];
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, adminLogin, register, logout, API }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
