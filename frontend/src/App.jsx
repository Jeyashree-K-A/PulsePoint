import { useState } from "react";
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import AdminPanel from "./components/AdminPanel.jsx";
import UserPage from "./UserPage.jsx";

const THEME = {
  dark: {
    bg: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
    topBar: 'rgba(26,26,46,0.95)',
    text: '#ffffff',
    textSub: '#1e293b',
    btnBg: 'rgba(255,255,255,0.15)',
    btnBorder: 'rgba(255,255,255,0.3)',
    btnBg2: 'linear-gradient(135deg, #00d4ff, #0099cc)',
    shadow: '0 4px 20px rgba(0,0,0,0.5)',
    border: '1px solid rgba(255,255,255,0.1)',
    contentBg: 'rgba(26,26,46,0.3)',
    buttonBg: 'linear-gradient(135deg, #00d4ff, #0099cc)'
  },
  light: {
    bg: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
    topBar: 'rgba(255,255,255,0.95)',
    text: '#111827',
    textSub: '#1e293b',
    btnBg: 'rgba(59,130,246,0.1)',
    btnBorder: '#3b82f6',
    btnBg2: 'linear-gradient(135deg, #f8fafc, #e2e8f0)',
    shadow: '0 2px 10px rgba(0,0,0,0.1)',
    border: '1px solid #e2e8f0',
    contentBg: 'rgba(255,255,255,0.3)',
    buttonBg: 'linear-gradient(135deg, #3b82f6, #2563eb)'
  }
};

function App() {
  const [mode, setMode] = useState("user");
  const [theme, setTheme] = useState("dark");
  const location = useLocation();
  const navigate = useNavigate();
  const c = THEME[theme];

  return (
    <div style={{
      minHeight: "100vh",
      width: "100%",
      background: c.bg,
      transition: 'all 0.3s ease',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* TOP BAR */}
      <div style={{
        height: 60,
        flexShrink: 0,
        background: c.topBar,
        backdropFilter: 'blur(20px)',
        color: c.text,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 20px",
        boxShadow: c.shadow,
        borderBottom: c.border,
        position: 'sticky',
        top: 0,
        zIndex: 1000
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 45, height: 45,
            background: theme === "dark"
              ? 'linear-gradient(135deg, #00d4ff, #0099cc)'
              : 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
            borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 22, color: 'white', fontWeight: 'bold',
            boxShadow: '0 6px 25px rgba(0,0,0,0.4)'
          }}>
            {mode === "user" ? "🚨" : "🛠"}
          </div>
          <div style={{
            fontSize: 22, fontWeight: 900, color: c.text,
            textShadow: theme === "dark"
              ? '0 0 15px rgba(255,255,255,0.8), 0 2px 4px rgba(0,0,0,0.5)'
              : '0 2px 4px rgba(0,0,0,0.1)',
            letterSpacing: '1px'
          }}>
            {mode === "user" ? "PULSE POINT" : "ADMIN PANEL"}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            onClick={() => {
              const newMode = mode === "user" ? "admin" : "user";
              setMode(newMode);
              navigate(newMode === "admin" ? "/admin" : "/");
            }}
            style={{
              padding: '12px 24px',
              background: c.btnBg,
              color: c.text,
              border: `1px solid ${c.btnBorder}`,
              borderRadius: 30,
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: 15,
              transition: 'all 0.3s ease',
              backdropFilter: 'blur(15px)',
              boxShadow: theme === "dark" ? '0 4px 20px rgba(0,212,255,0.2)' : '0 2px 10px rgba(59,130,246,0.2)'
            }}
          >
            {mode === "user" ? "👮 ADMIN" : "👤 USER"}
          </button>

          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            style={{
              width: 55, height: 55,
              background: c.btnBg2,
              color: c.text,
              border: theme === "dark" ? '1px solid rgba(255,255,255,0.3)' : '1px solid #cbd5e1',
              borderRadius: '50%',
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 22,
              boxShadow: theme === "dark" ? '0 10px 30px rgba(0,212,255,0.5)' : '0 4px 20px rgba(0,0,0,0.1)',
              transition: 'all 0.3s ease'
            }}
          >
            {theme === "dark" ? "☀️" : "🌙"}
          </button>
        </div>
      </div>

      {/* ✅ CONTENT - flex grow, overflow auto so it scrolls */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        overflowX: 'hidden'
      }}>
        <Routes>
          <Route path="/" element={<UserPage theme={theme} />} />
          <Route path="/admin" element={<AdminPanel theme={theme} />} />
          <Route path="*" element={<UserPage theme={theme} />} />
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
