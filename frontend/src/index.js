import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
      <Toaster position="top-right" toastOptions={{
        style: { background: "#1e3a5f", color: "#fff", border: "1px solid #f0a500" },
        duration: 4000
      }} />
    </AuthProvider>
  </React.StrictMode>
);
