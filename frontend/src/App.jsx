import { useState } from "react";
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import AdminPanel from "./components/AdminPanel.jsx";
import UserPage from "./UserPage.jsx";


function App() {
  const [mode, setMode] = useState("user");
  const [theme, setTheme] = useState("dark");
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div style={{ 
      height: "100vh", 
      width: "100vw", 
      transition: 'all 0.3s ease',
      background: theme === "dark" 
        ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)' 
        : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)'
    }}>
      {/* ✅ TOP BAR - ALL ORIGINAL STYLING */}
      <div
        style={{
          height: 60,
          background: theme === "dark" 
            ? 'rgba(26,26,46,0.95)' 
            : 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(20px)',
          color: theme === "dark" ? "#e0e0e0" : "#1e293b",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 20px",
          boxShadow: theme === "dark" 
            ? '0 4px 20px rgba(0,0,0,0.5)' 
            : '0 2px 10px rgba(0,0,0,0.1)',
          borderBottom: theme === "dark" 
            ? '1px solid rgba(255,255,255,0.1)' 
            : '1px solid #e2e8f0',
          position: 'relative',
          zIndex: 1000
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 45, height: 45,
            background: theme === "dark" 
              ? 'linear-gradient(135deg, #00d4ff, #0099cc)' 
              : 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
            borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 22, 
            color: 'white', 
            fontWeight: 'bold',
            boxShadow: '0 6px 25px rgba(0,0,0,0.4)'
          }}>
            {mode === "user" ? "🚨" : "🛠"}
          </div>
          <div style={{ 
            fontSize: 22, 
            fontWeight: 900,
            color: theme === "dark" ? '#ffffff' : '#111827',
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
              if (newMode === "admin") {
                navigate("/admin/hospitals");  // ✅ GOES DIRECTLY TO ADMINPANEL
              } else {
                navigate("/");
              }
            }}
            style={{
              padding: '12px 24px',
              background: theme === "dark" ? 'rgba(255,255,255,0.15)' : 'rgba(59,130,246,0.1)',
              color: theme === "dark" ? '#ffffff' : '#1e293b',
              border: `1px solid ${theme === "dark" ? 'rgba(255,255,255,0.3)' : '#3b82f6'}`,
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
              background: theme === "dark" ? 'linear-gradient(135deg, #00d4ff, #0099cc)' : 'linear-gradient(135deg, #f8fafc, #e2e8f0)',
              color: theme === "dark" ? '#ffffff' : '#1e293b',
              border: theme === "dark" ? '1px solid rgba(255,255,255,0.3)' : '1px solid #cbd5e1',
              borderRadius: '50%',
              cursor: 'pointer',
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              fontSize: 22,
              boxShadow: theme === "dark" ? '0 10px 30px rgba(0,212,255,0.5)' : '0 4px 20px rgba(0,0,0,0.1)',
              transition: 'all 0.3s ease'
            }}
          >
            {theme === "dark" ? "☀️" : "🌙"}
          </button>
        </div>
      </div>

      {/* ✅ SIMPLIFIED ROUTING - Works immediately */}
      <div style={{ 
        height: "calc(100vh - 60px)", 
        transition: 'all 0.3s ease',
        overflow: 'hidden'
      }}>
        {mode === "user" ? (
          <UserPage theme={theme} />
        ) : location.pathname === "/admin/hospitals" ? (
          <AdminPanel theme={theme} />
        ) : (
          <div style={{ 
            height: '100%', 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center', 
            padding: '40px',
            gap: '20px',
            background: theme === 'dark' ? 'rgba(26,26,46,0.3)' : 'rgba(255,255,255,0.3)',
            backdropFilter: 'blur(10px)',
            color: theme === 'dark' ? '#e0e0e0' : '#1e293b',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '64px' }}>🛠️</div>
            <h2>ADMIN PANEL</h2>
            <p style={{ fontSize: '18px', maxWidth: '500px' }}>
              Welcome to the administration dashboard!<br/>
              <strong>Click "👮 ADMIN" button above</strong> to access Hospital Management.
            </p>
            <div style={{ 
              padding: '12px 24px',
              background: theme === 'dark' ? colors.buttonBg : 'rgba(59,130,246,0.1)',
              color: 'white',
              border: 'none',
              borderRadius: '25px',
              cursor: 'pointer',
              fontWeight: '700',
              fontSize: '16px'
            }} onClick={() => navigate("/admin/hospitals")}>
              🚀 GO TO HOSPITALS
            </div>
          </div>
        )}
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
