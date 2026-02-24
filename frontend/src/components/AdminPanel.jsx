import React, { useState, useEffect, useCallback, useRef } from "react"; 

function AdminPanel({ theme = "dark" }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [hospitals, setHospitals] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [newHospital, setNewHospital] = useState({
    name: "", latitude: "", longitude: "", address: ""
  });
  const [editHospital, setEditHospital] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const hospitalsListRef = useRef(null);
  const passwordRef = useRef(null);

  const ADMIN_PASSWORD = "admin123";

  // ✅ Detect mobile/resize
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const themeConfig = {
    dark: {
      bg: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f0f23 100%)',
      cardBg: 'rgba(26,26,46,0.95)', 
      cardBorder: 'rgba(255,255,255,0.15)',
      text: '#e0e0e0', 
      textSecondary: '#a0a0a0', 
      neon: '#00d4ff',
      buttonBg: 'linear-gradient(135deg, #00d4ff, #0099cc)', 
      dangerBg: 'linear-gradient(135deg, #ff4757, #ff3838)',
      inputBg: 'rgba(255,255,255,0.1)', 
      shadow: 'rgba(0,0,0,0.7)'
    },
    light: {
      bg: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      cardBg: 'rgba(255,255,255,0.95)', 
      cardBorder: 'rgba(0,0,0,0.15)',
      text: '#1e293b', 
      textSecondary: '#64748b', 
      neon: '#3b82f6',
      buttonBg: 'linear-gradient(135deg, #3b82f6, #2563eb)', 
      dangerBg: 'linear-gradient(135deg, #ef4444, #dc2626)',
      inputBg: 'rgba(255,255,255,0.8)', 
      shadow: 'rgba(0,0,0,0.15)'
    }
  };

  const colors = themeConfig[theme] || themeConfig.dark;
  const API_BASE = "https://backend-pulsepoint.onrender.com/api";

  const verifyPassword = useCallback(() => {
    if (passwordInput === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setPasswordError("");
      setPasswordInput("");
    } else {
      setPasswordError("❌ Incorrect password!");
      setPasswordInput("");
      if (passwordRef.current) passwordRef.current.focus();
    }
  }, [passwordInput]);

  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter') verifyPassword();
  }, [verifyPassword]);

  const fetchHospitals = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${API_BASE}/hospitals`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setHospitals(Array.isArray(data) ? data : []);
    } catch (err) {
      setError("⚠️ Server offline - Check backend on port 5000");
      setHospitals([]);
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [API_BASE]);

  const filteredHospitals = hospitals.filter(hospital =>
    hospital.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    if (isAuthenticated && hospitalsListRef.current) {
      hospitalsListRef.current.scrollTop = 0;
    }
  }, [isAuthenticated, hospitals.length]);

  useEffect(() => {
    if (isAuthenticated) fetchHospitals();
  }, [isAuthenticated, fetchHospitals]);

  const addHospital = async () => {
    if (!newHospital.name.trim() || !newHospital.latitude || !newHospital.longitude) {
      setError("Please fill name, latitude, and longitude");
      return;
    }
    try {
      setError(null);
      setLoading(true);
      const res = await fetch(`${API_BASE}/hospitals`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newHospital.name.trim(),
          latitude: parseFloat(newHospital.latitude),
          longitude: parseFloat(newHospital.longitude),
          address: newHospital.address.trim()
        })
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Failed to add');
      }
      setNewHospital({ name: "", latitude: "", longitude: "", address: "" });
      await fetchHospitals();
    } catch (err) {
      setError(`Add failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (hospital) => {
    setEditHospital({
      _id: hospital._id,
      name: hospital.name || "",
      latitude: hospital.latitude?.toString() || "",
      longitude: hospital.longitude?.toString() || "",
      address: hospital.address || ""
    });
    setError(null);
  };

  const cancelEdit = () => {
    setEditHospital(null);
    setError(null);
  };

  const updateHospital = async () => {
    if (!editHospital?._id || !editHospital.name.trim() || !editHospital.latitude || !editHospital.longitude) {
      setError("Please fill all required fields");
      return;
    }
    try {
      setError(null);
      setLoading(true);
      const res = await fetch(`${API_BASE}/hospitals/${editHospital._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editHospital.name.trim(),
          latitude: parseFloat(editHospital.latitude),
          longitude: parseFloat(editHospital.longitude),
          address: editHospital.address?.trim() || ""
        })
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Failed to update');
      }
      setEditHospital(null);
      await fetchHospitals();
    } catch (err) {
      setError(`Update failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const deleteHospital = async (id) => {
    if (!window.confirm("Delete this hospital?")) return;
    try {
      setError(null);
      setLoading(true);
      const res = await fetch(`${API_BASE}/hospitals/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Failed to delete');
      }
      await fetchHospitals();
    } catch (err) {
      setError(`Delete failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const getInputStyle = () => ({
    padding: isMobile ? '12px 16px' : '15px 20px',
    background: colors.inputBg,
    border: `2px solid ${colors.cardBorder}`,
    borderRadius: '12px',
    color: colors.text,
    fontSize: isMobile ? '14px' : '16px',
    outline: 'none',
    backdropFilter: 'blur(10px)',
    width: '100%',
    boxSizing: 'border-box',
    transition: 'all 0.3s ease',
    fontFamily: 'inherit'
  });

  const getButtonStyle = () => ({
    padding: isMobile ? '14px' : '18px',
    background: colors.buttonBg,
    color: 'white',
    border: 'none',
    borderRadius: '15px',
    fontSize: isMobile ? '14px' : '16px',
    fontWeight: '700',
    cursor: 'pointer',
    boxShadow: `0 10px 30px ${colors.neon}50`,
    transition: 'all 0.3s ease',
    width: '100%',
    fontFamily: 'inherit'
  });

  if (!isAuthenticated) {
    return (
      <div style={{ 
        height: "100vh", width: "100vw", background: colors.bg, 
        display: 'flex', alignItems: 'center', justifyContent: 'center', 
        color: colors.text, padding: '20px', position: 'fixed', top: 0, left: 0, zIndex: 9999,
        boxSizing: 'border-box'
      }}>
        <div style={{
          background: colors.cardBg, padding: isMobile ? '28px 20px' : '40px', borderRadius: '24px',
          border: `2px solid ${colors.neon}`, boxShadow: `0 25px 50px ${colors.shadow}`,
          backdropFilter: 'blur(20px)', width: '100%', maxWidth: '460px', textAlign: 'center'
        }}>
          <div style={{ fontSize: isMobile ? '48px' : '64px', marginBottom: '16px' }}>🔐</div>
          <h1 style={{ fontSize: isMobile ? '22px' : '28px', fontWeight: '900', marginBottom: '10px', color: colors.neon, textShadow: `0 0 20px ${colors.neon}40` }}>
            ADMIN PANEL
          </h1>
          <p style={{ fontSize: isMobile ? '14px' : '16px', color: colors.textSecondary, marginBottom: '24px' }}>
            Enter admin password to access hospital management
          </p>
          <input
            ref={passwordRef}
            type="password"
            style={{ ...getInputStyle(), textAlign: 'center', letterSpacing: '4px', fontFamily: 'monospace', marginBottom: '16px' }}
            placeholder="Enter password"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            onKeyDown={handleKeyPress}
            autoFocus
          />
          {passwordError && (
            <div style={{
              color: '#ff4757', background: 'rgba(255,71,87,0.2)', padding: '12px 16px',
              borderRadius: '12px', marginBottom: '16px', border: '1px solid #ff4757',
              fontSize: isMobile ? '13px' : '15px'
            }}>
              {passwordError}
            </div>
          )}
          <button onClick={verifyPassword} style={getButtonStyle()}>
            🔓 UNLOCK ADMIN PANEL
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "100vh",
      width: "100%",
      background: colors.bg,
      padding: isMobile ? "12px" : "20px",
      fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
      color: colors.text,
      overflowY: "auto",
      boxSizing: 'border-box'
    }}>
      {/* Header */}
      <div style={{
        textAlign: 'center', marginBottom: '16px', padding: isMobile ? '16px' : '20px',
        background: colors.cardBg, borderRadius: '24px', border: `1px solid ${colors.cardBorder}`,
        boxShadow: `0 25px 50px ${colors.shadow}`, backdropFilter: 'blur(20px)'
      }}>
        <h5 style={{ fontSize: isMobile ? '22px' : '30px', fontWeight: '900', margin: 0, color: colors.neon, textShadow: `0 0 20px ${colors.neon}40` }}>
          🏥 Pulse Point
        </h5>
      </div>

      {loading && (
        <div style={{ 
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center',
          justifyContent: 'center', zIndex: 1000 
        }}>
          <div style={{ textAlign: 'center', color: colors.neon, padding: '40px', background: colors.cardBg, borderRadius: '20px', backdropFilter: 'blur(20px)' }}>
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>⏳</div>
            <h2>Loading hospitals...</h2>
          </div>
        </div>
      )}

      {/* ✅ Responsive Grid: 1 col on mobile, 2 col on desktop */}
      <div style={{ 
        display: 'grid',
        gap: isMobile ? '16px' : '30px',
        gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        {/* Add Hospital Form */}
        <div style={{
          background: colors.cardBg, padding: isMobile ? '20px' : '30px', borderRadius: '24px',
          border: `1px solid ${colors.cardBorder}`, boxShadow: `0 25px 50px ${colors.shadow}`,
          backdropFilter: 'blur(20px)'
        }}>
          <h2 style={{ fontSize: isMobile ? '18px' : '24px', fontWeight: '700', marginBottom: '20px', color: colors.neon }}>
            ➕ Add New Hospital
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <input style={getInputStyle()} placeholder="Hospital Name *" value={newHospital.name} onChange={(e) => setNewHospital({ ...newHospital, name: e.target.value })} />
            {/* ✅ Lat/Lng: side by side on desktop, stacked on very small mobile */}
            <div style={{ display: 'grid', gridTemplateColumns: isMobile && window.innerWidth < 400 ? '1fr' : '1fr 1fr', gap: '12px' }}>
              <input style={getInputStyle()} placeholder="Latitude *" value={newHospital.latitude} onChange={(e) => setNewHospital({ ...newHospital, latitude: e.target.value })} />
              <input style={getInputStyle()} placeholder="Longitude *" value={newHospital.longitude} onChange={(e) => setNewHospital({ ...newHospital, longitude: e.target.value })} />
            </div>
            <input style={getInputStyle()} placeholder="Full Address (optional)" value={newHospital.address} onChange={(e) => setNewHospital({ ...newHospital, address: e.target.value })} />
            <button
              onClick={addHospital}
              disabled={loading || !newHospital.name.trim() || !newHospital.latitude || !newHospital.longitude}
              style={{
                ...getButtonStyle(),
                cursor: loading || !newHospital.name.trim() || !newHospital.latitude || !newHospital.longitude ? 'not-allowed' : 'pointer',
                opacity: loading || !newHospital.name.trim() || !newHospital.latitude || !newHospital.longitude ? 0.6 : 1
              }}
            >
              {loading ? '⏳ Adding...' : '➕ ADD HOSPITAL'}
            </button>
          </div>
        </div>

        {/* Hospitals List */}
        <div style={{
          background: colors.cardBg, padding: isMobile ? '20px' : '30px', borderRadius: '24px',
          border: `1px solid ${colors.cardBorder}`, boxShadow: `0 25px 50px ${colors.shadow}`,
          backdropFilter: 'blur(20px)'
        }}>
          <h2 style={{ fontSize: isMobile ? '18px' : '24px', fontWeight: '700', marginBottom: '14px', color: colors.neon }}>
            📋 Hospitals ({filteredHospitals.length})
          </h2>

          {/* Search */}
          <div style={{ marginBottom: '18px' }}>
            <input
              style={getInputStyle()}
              placeholder="🔍 Search hospitals by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {error && (
            <div style={{
              textAlign: 'center', padding: '16px', color: '#ff4757',
              background: 'rgba(255,71,87,0.15)', borderRadius: '16px',
              border: '1px solid #ff4757', marginBottom: '18px',
              fontSize: isMobile ? '13px' : '15px'
            }}>
              ⚠️ {error}
            </div>
          )}
          
          {/* ✅ List height: auto on mobile (scrolls with page), fixed on desktop */}
          <div
            ref={hospitalsListRef}
            style={{ 
              height: isMobile ? 'auto' : '500px',
              maxHeight: isMobile ? '600px' : '500px',
              overflowY: 'auto',
              display: 'flex', 
              flexDirection: 'column',
              gap: '14px',
              paddingRight: isMobile ? '0' : '10px'
            }}
          >
            {filteredHospitals.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: colors.textSecondary }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>🏥</div>
                <p style={{ fontSize: isMobile ? '15px' : '18px' }}>
                  {searchTerm ? `No hospitals found for "${searchTerm}"` : 'Add your first hospital above!'}
                </p>
              </div>
            ) : (
              filteredHospitals.map((hospital) => (
                <div key={hospital._id || Math.random()} style={{
                  padding: isMobile ? '16px' : '24px',
                  background: editHospital?._id === hospital._id ? `${colors.neon}15` : colors.inputBg,
                  borderRadius: '16px',
                  border: `2px solid ${editHospital?._id === hospital._id ? colors.neon : colors.cardBorder}`,
                  transition: 'all 0.3s ease',
                  flexShrink: 0
                }}>
                  {editHospital?._id === hospital._id ? (
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
                        <h3 style={{ margin: 0, fontSize: isMobile ? '15px' : '20px', fontWeight: '700', color: colors.neon }}>
                          ✏️ Editing: {hospital.name}
                        </h3>
                        <button onClick={cancelEdit} disabled={loading} style={{
                          ...getButtonStyle(),
                          background: colors.dangerBg,
                          padding: '8px 14px',
                          fontSize: '13px',
                          width: 'auto'
                        }}>
                          ❌ Cancel
                        </button>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <input value={editHospital.name} onChange={(e) => setEditHospital({ ...editHospital, name: e.target.value })} style={{
                          ...getInputStyle(), border: `2px solid ${colors.neon}`
                        }} placeholder="Hospital Name *" />
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                          <input value={editHospital.latitude} onChange={(e) => setEditHospital({ ...editHospital, latitude: e.target.value })} style={{
                            ...getInputStyle(), border: `2px solid ${colors.neon}`
                          }} placeholder="Latitude *" />
                          <input value={editHospital.longitude} onChange={(e) => setEditHospital({ ...editHospital, longitude: e.target.value })} style={{
                            ...getInputStyle(), border: `2px solid ${colors.neon}`
                          }} placeholder="Longitude *" />
                        </div>
                        <input value={editHospital.address || ''} onChange={(e) => setEditHospital({ ...editHospital, address: e.target.value })} style={{
                          ...getInputStyle(), border: `2px solid ${colors.neon}`
                        }} placeholder="Address (optional)" />
                        <button onClick={updateHospital} disabled={loading} style={{
                          ...getButtonStyle(),
                          background: 'linear-gradient(135deg, #00b894, #00a085)'
                        }}>
                          {loading ? '⏳ Updating...' : '✅ UPDATE HOSPITAL'}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px', gap: '10px' }}>
                        <h3 style={{ margin: 0, fontSize: isMobile ? '15px' : '20px', fontWeight: '700', color: colors.neon, flex: 1, wordBreak: 'break-word' }}>
                          {hospital.name}
                        </h3>
                        {/* ✅ Buttons: stacked on mobile, side by side on desktop */}
                        <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '8px', flexShrink: 0 }}>
                          <button onClick={() => startEdit(hospital)} disabled={loading} style={{
                            padding: isMobile ? '8px 12px' : '12px 20px',
                            background: colors.buttonBg, color: 'white',
                            border: 'none', borderRadius: '10px',
                            fontSize: isMobile ? '12px' : '14px',
                            cursor: loading ? 'not-allowed' : 'pointer', fontWeight: '600',
                            opacity: loading ? 0.6 : 1, whiteSpace: 'nowrap'
                          }}>
                            ✏️ Edit
                          </button>
                          <button onClick={() => deleteHospital(hospital._id)} disabled={loading} style={{
                            padding: isMobile ? '8px 12px' : '12px 20px',
                            background: colors.dangerBg, color: 'white',
                            border: 'none', borderRadius: '10px',
                            fontSize: isMobile ? '12px' : '14px',
                            cursor: loading ? 'not-allowed' : 'pointer', fontWeight: '600',
                            opacity: loading ? 0.6 : 1, whiteSpace: 'nowrap'
                          }}>
                            🗑️ Delete
                          </button>
                        </div>
                      </div>
                      <div style={{ 
                        fontSize: isMobile ? '13px' : '15px', color: colors.textSecondary, padding: '10px 14px',
                        background: `${colors.inputBg}cc`, borderRadius: '12px', border: `1px solid ${colors.cardBorder}`
                      }}>
                        <div>📍 {Number(hospital.latitude)?.toFixed(6)}°, {Number(hospital.longitude)?.toFixed(6)}°</div>
                        {hospital.address && (
                          <div style={{ marginTop: '6px', fontSize: isMobile ? '12px' : '14px', wordBreak: 'break-word' }}>
                            📋 {hospital.address}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminPanel;
