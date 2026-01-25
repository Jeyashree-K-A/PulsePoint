const express = require("express");
const router = express.Router();
const Hospital = require("../models/Hospital");

/* ===============================
   📋 GET ALL HOSPITALS (Admin/User)
================================ */
router.get("/", async (req, res) => {
  try {
    const hospitals = await Hospital.find();
    res.json(hospitals);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ===============================
   ➕ CREATE HOSPITAL (Admin)
================================ */
router.post("/", async (req, res) => {
  try {
    const { name, latitude, longitude, address } = req.body;

    if (!name || !latitude || !longitude) {
      return res.status(400).json({ message: "Name, latitude, longitude required" });
    }

    const hospital = new Hospital({
      name,
      latitude: Number(latitude),
      longitude: Number(longitude),
      address: address || ""
    });

    await hospital.save();
    res.json({ 
      success: true, 
      message: "✅ Hospital added successfully",
      hospital 
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ===============================
   ✏️ UPDATE HOSPITAL (Admin)
================================ */
router.put("/:id", async (req, res) => {
  try {
    const hospital = await Hospital.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true }
    );
    
    if (!hospital) {
      return res.status(404).json({ message: "Hospital not found" });
    }
    
    res.json({ 
      success: true, 
      message: "✅ Hospital updated successfully",
      hospital 
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ===============================
   ❌ DELETE HOSPITAL (Admin)
================================ */
router.delete("/:id", async (req, res) => {
  try {
    const hospital = await Hospital.findByIdAndDelete(req.params.id);
    
    if (!hospital) {
      return res.status(404).json({ message: "Hospital not found" });
    }
    
    res.json({ success: true, message: "✅ Hospital deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ===============================
   📍 NEARBY HOSPITALS (User)
================================ */
router.get("/nearby", async (req, res) => {
  try {
    const { latitude, longitude, radius = 10 } = req.query;
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    const r = parseFloat(radius);

    if (isNaN(lat) || isNaN(lng) || isNaN(r)) {
      return res.status(400).json({ message: "Invalid coordinates" });
    }

    const hospitals = await Hospital.find();
    const R = 6371; // Earth radius in KM

    const nearbyHospitals = hospitals
      .map(h => {
        const dLat = (h.latitude - lat) * Math.PI / 180;
        const dLng = (h.longitude - lng) * Math.PI / 180;
        const a = 
          Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.cos(lat * Math.PI / 180) * Math.cos(h.latitude * Math.PI / 180) * 
          Math.sin(dLng/2) * Math.sin(dLng/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        const distance = R * c;

        return { ...h._doc, distance: Number(distance.toFixed(2)) };
      })
      .filter(h => h.distance <= r)
      .sort((a, b) => a.distance - b.distance);

    res.json(nearbyHospitals);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
