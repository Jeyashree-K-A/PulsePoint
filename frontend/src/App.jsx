import React, { useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate
} from "react-router-dom";

import AdminPanel from "./components/AdminPanel.jsx";
import UserPage from "./UserPage.jsx";

const THEME = {
  bg: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
  topBar: "rgba(255,255,255,0.95)",
  text: "#111827",
  btnBg: "rgba(59,130,246,0.1)",
  btnBorder: "#3b82f6",
  shadow: "0 2px 10px rgba(0,0,0,0.1)",
  border: "1px solid #e2e8f0"
};

function App() {
  const navigate = useNavigate();

 const [mode, setMode] = useState(
  window.location.pathname === "/admin" ? "admin" : "user"
);

  const c = THEME;

  const toggleMode = () => {
    const newMode = mode === "user" ? "admin" : "user";

    setMode(newMode);
    navigate(newMode === "admin" ? "/admin" : "/");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        background: c.bg,
        display: "flex",
        flexDirection: "column"
      }}
    >
      {/* TOP BAR */}
      <div
        style={{
          height: 60,
          flexShrink: 0,
          background: c.topBar,
          backdropFilter: "blur(20px)",
          color: c.text,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 20px",
          boxShadow: c.shadow,
          borderBottom: c.border,
          position: "sticky",
          top: 0,
          zIndex: 1000
        }}
      >
        {/* LOGO AND TITLE */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12
          }}
        >
          <div
            style={{
              width: 45,
              height: 45,
              background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 22,
              color: "white",
              fontWeight: "bold",
              boxShadow: "0 6px 25px rgba(0,0,0,0.15)"
            }}
          >
            {mode === "user" ? "🚨" : "🛠"}
          </div>

          <div
            style={{
              fontSize: 22,
              fontWeight: 900,
              color: c.text,
              letterSpacing: "1px"
            }}
          >
            {mode === "user" ? "PULSE POINT" : "ADMIN PANEL"}
          </div>
        </div>

        {/* USER / ADMIN BUTTON */}
        <button
          onClick={toggleMode}
          style={{
            padding: "12px 24px",
            background: c.btnBg,
            color: c.text,
            border: `1px solid ${c.btnBorder}`,
            borderRadius: 30,
            cursor: "pointer",
            fontWeight: 700,
            fontSize: 15,
            transition: "all 0.3s ease",
            boxShadow: "0 2px 10px rgba(59,130,246,0.2)"
          }}
        >
          {mode === "user" ? "👮 ADMIN" : "👤 USER"}
        </button>
      </div>

      {/* MAIN CONTENT */}
      <div
        style={{
          flex: 1,
          minHeight: 0,
          overflowY: "auto",
          overflowX: "hidden"
        }}
      >
        <Routes>
          <Route
            path="/"
            element={<UserPage theme="light" />}
          />

          <Route
            path="/admin"
            element={<AdminPanel theme="light" />}
          />

          <Route
            path="*"
            element={<UserPage theme="light" />}
          />
        </Routes>
      </div>
    </div>
  );
}

export default function Root() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}
